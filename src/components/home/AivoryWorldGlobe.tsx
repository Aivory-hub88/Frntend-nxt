'use client';

import { useEffect, useRef } from 'react';

const LAND_MASK_URL = '/images/world/land-mask-110m.png';
const ROTATION_SECONDS = 44;
const TARGET_FPS = 30;

const VERTEX_SHADER = `#version 300 es
precision highp float;

void main() {
  vec2 position;
  if (gl_VertexID == 0) {
    position = vec2(-1.0, -1.0);
  } else if (gl_VertexID == 1) {
    position = vec2(3.0, -1.0);
  } else {
    position = vec2(-1.0, 3.0);
  }
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;

uniform sampler2D uLand;
uniform vec2 uResolution;
uniform vec2 uViewport;
uniform vec2 uCanvasOrigin;
uniform vec2 uPointer;
uniform float uPointerStrength;
uniform float uDpr;
uniform float uTime;
uniform float uIntro;
uniform float uReducedMotion;

out vec4 fragColor;

const float PI = 3.141592653589793;
const float TAU = 6.283185307179586;

float hash21(vec2 value) {
  vec3 p3 = fract(vec3(value.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float valueNoise(vec2 point) {
  vec2 cell = floor(point);
  vec2 local = fract(point);
  local = local * local * (3.0 - 2.0 * local);

  float a = hash21(cell);
  float b = hash21(cell + vec2(1.0, 0.0));
  float c = hash21(cell + vec2(0.0, 1.0));
  float d = hash21(cell + vec2(1.0, 1.0));
  return mix(mix(a, b, local.x), mix(c, d, local.x), local.y);
}

float fbm(vec2 point) {
  float value = 0.0;
  float amplitude = 0.5;
  mat2 turn = mat2(0.80, -0.60, 0.60, 0.80);
  for (int octave = 0; octave < 4; octave++) {
    value += amplitude * valueNoise(point);
    point = turn * point * 2.03 + 17.17;
    amplitude *= 0.5;
  }
  return value;
}

vec3 rotateX(vec3 point, float angle) {
  float sine = sin(angle);
  float cosine = cos(angle);
  return vec3(
    point.x,
    point.y * cosine - point.z * sine,
    point.y * sine + point.z * cosine
  );
}

vec3 rotateY(vec3 point, float angle) {
  float sine = sin(angle);
  float cosine = cos(angle);
  return vec3(
    point.x * cosine + point.z * sine,
    point.y,
    -point.x * sine + point.z * cosine
  );
}

void main() {
  float cellSize = 8.0 * uDpr;
  float pixelSize = 5.35 * uDpr;
  vec2 withinCell = mod(gl_FragCoord.xy, cellSize);
  if (withinCell.x > pixelSize || withinCell.y > pixelSize) {
    discard;
  }

  vec2 cell = floor(gl_FragCoord.xy / cellSize);
  vec2 cellCenter = (cell + 0.5) * cellSize;
  vec2 cssCellCenter = vec2(
    cellCenter.x / uDpr,
    (uResolution.y - cellCenter.y) / uDpr
  );
  vec2 screenUv = (uCanvasOrigin + cssCellCenter) / uViewport;

  // Cloudflare-inspired persistent copy field. It does not paint a panel;
  // instead it softly disperses pixels near the centered copy and lowers their
  // density only inside a compact rounded zone. Mobile uses a slightly taller
  // field for stacked controls without suppressing the whole globe.
  float mobileMix = 1.0 - smoothstep(640.0, 860.0, uViewport.x);
  vec2 quietCenter = mix(vec2(0.50, 0.52), vec2(0.57, 0.54), mobileMix);
  vec2 quietHalfSize = mix(vec2(0.21, 0.17), vec2(0.34, 0.255), mobileMix);
  float quietRadius = mix(0.045, 0.065, mobileMix);
  vec2 quietShape = abs(screenUv - quietCenter) - quietHalfSize + quietRadius;
  float quietDistance = length(max(quietShape, 0.0))
    + min(max(quietShape.x, quietShape.y), 0.0)
    - quietRadius;
  float quietInfluence = 1.0 - smoothstep(-0.012, 0.075, quietDistance);
  vec2 quietDirection = normalize(
    (screenUv - quietCenter) / max(quietHalfSize, vec2(0.001)) + vec2(0.0001)
  );

  float radius = min(uResolution.x, uResolution.y) * 0.455;
  vec2 point = (cellCenter - uResolution * 0.5) / radius;
  point += vec2(quietDirection.x, -quietDirection.y)
    * quietInfluence * mix(0.028, 0.018, mobileMix);

  vec2 pointerPoint = (uPointer - uResolution * 0.5) / radius;
  vec2 pointerDelta = point - pointerPoint;
  float pointerDistance = length(pointerDelta);
  float pointerFalloff = exp(-15.0 * pointerDistance * pointerDistance);
  point += normalize(pointerDelta + vec2(0.0001))
    * pointerFalloff * 0.085 * uPointerStrength;

  float breathingTime = uReducedMotion > 0.5 ? 0.0 : uTime * 0.035;
  vec2 warp = vec2(
    fbm(point * 3.15 + vec2(breathingTime, 4.7)),
    fbm(point * 3.15 + vec2(8.3, -breathingTime))
  ) - 0.5;
  point += warp * 0.016;

  float radiusSquared = dot(point, point);
  if (radiusSquared >= 1.0) {
    discard;
  }

  vec3 spherePoint = vec3(point, sqrt(1.0 - radiusSquared));
  spherePoint = rotateX(spherePoint, radians(-12.0));

  float rotation = -0.16;
  if (uReducedMotion < 0.5) {
    rotation += uTime * (TAU / ${ROTATION_SECONDS.toFixed(1)});
  }
  spherePoint = rotateY(spherePoint, -rotation);

  float longitude = atan(spherePoint.x, spherePoint.z);
  float latitude = asin(clamp(spherePoint.y, -1.0, 1.0));
  vec2 mapUv = vec2(longitude / TAU + 0.5, 0.5 - latitude / PI);
  float land = texture(uLand, mapUv).r;

  float randomValue = hash21(cell + 19.37);
  float atmosphereNoise = fbm(cell * 0.075 + uTime * 0.018);
  float density = mix(
    0.045 + atmosphereNoise * 0.055,
    0.67 + atmosphereNoise * 0.18,
    smoothstep(0.16, 0.78, land)
  );
  if (randomValue > density) {
    discard;
  }

  float edgeFade = 1.0 - smoothstep(0.88, 1.0, sqrt(radiusSquared));
  float contentSafeFade = mix(0.24, 1.0, smoothstep(0.38, 0.82, screenUv.x));
  float quietFloor = mix(0.11, 0.05, mobileMix);
  float quietFade = mix(
    quietFloor,
    1.0,
    smoothstep(-0.012, 0.08, quietDistance)
  );
  float verticalFade = smoothstep(0.02, 0.12, screenUv.y)
    * (1.0 - smoothstep(0.90, 0.995, screenUv.y));

  float sparkle = hash21(cell * 1.91 + 7.7);
  vec3 oceanColor = vec3(0.447, 0.702, 0.682);
  vec3 landBase = vec3(0.722, 0.824, 0.784);
  vec3 landHighlight = vec3(0.902, 0.945, 0.925);
  vec3 landColor = mix(landBase, landHighlight, sparkle * 0.72);
  vec3 color = mix(oceanColor, landColor, smoothstep(0.12, 0.82, land));

  float alpha = mix(0.105, 0.43, smoothstep(0.12, 0.82, land));
  alpha *= edgeFade * contentSafeFade * quietFade * verticalFade * uIntro;
  fragColor = vec4(color * alpha, alpha);
}
`;

type GlobeUniforms = {
  land: WebGLUniformLocation | null;
  resolution: WebGLUniformLocation | null;
  viewport: WebGLUniformLocation | null;
  canvasOrigin: WebGLUniformLocation | null;
  pointer: WebGLUniformLocation | null;
  pointerStrength: WebGLUniformLocation | null;
  dpr: WebGLUniformLocation | null;
  time: WebGLUniformLocation | null;
  intro: WebGLUniformLocation | null;
  reducedMotion: WebGLUniformLocation | null;
};

function compileShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string,
): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error('Unable to create world-globe shader.');
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader) ?? 'Unknown shader compilation error.';
    gl.deleteShader(shader);
    throw new Error(message);
  }
  return shader;
}

function createProgram(gl: WebGL2RenderingContext): WebGLProgram {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  const program = gl.createProgram();
  if (!program) throw new Error('Unable to create world-globe program.');

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const message = gl.getProgramInfoLog(program) ?? 'Unknown shader link error.';
    gl.deleteProgram(program);
    throw new Error(message);
  }
  return program;
}

function deterministicRandom(x: number, y: number): number {
  const value = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function drawCanvasFallback(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  dpr: number,
): void {
  const context = canvas.getContext('2d');
  if (!context) return;

  const mapCanvas = document.createElement('canvas');
  mapCanvas.width = image.naturalWidth;
  mapCanvas.height = image.naturalHeight;
  const mapContext = mapCanvas.getContext('2d', { willReadFrequently: true });
  if (!mapContext) return;
  mapContext.drawImage(image, 0, 0);
  const map = mapContext.getImageData(0, 0, mapCanvas.width, mapCanvas.height).data;

  const width = canvas.width / dpr;
  const height = canvas.height / dpr;
  const radius = Math.min(width, height) * 0.455;
  const centerX = width * 0.5;
  const centerY = height * 0.5;
  const tilt = (-12 * Math.PI) / 180;
  const sine = Math.sin(tilt);
  const cosine = Math.cos(tilt);
  const rotation = -0.16;
  const rotationSine = Math.sin(-rotation);
  const rotationCosine = Math.cos(-rotation);
  const rect = canvas.getBoundingClientRect();

  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  context.clearRect(0, 0, width, height);

  for (let y = 4; y < height; y += 8) {
    for (let x = 4; x < width; x += 8) {
      const projectedX = (x - centerX) / radius;
      const projectedY = (centerY - y) / radius;
      const radiusSquared = projectedX * projectedX + projectedY * projectedY;
      if (radiusSquared >= 1) continue;

      const projectedZ = Math.sqrt(1 - radiusSquared);
      const tiltedY = projectedY * cosine - projectedZ * sine;
      const tiltedZ = projectedY * sine + projectedZ * cosine;
      const sphereX = projectedX * rotationCosine + tiltedZ * rotationSine;
      const sphereZ = -projectedX * rotationSine + tiltedZ * rotationCosine;
      const longitude = Math.atan2(sphereX, sphereZ);
      const latitude = Math.asin(Math.max(-1, Math.min(1, tiltedY)));
      const mapX = Math.max(
        0,
        Math.min(mapCanvas.width - 1, Math.floor((longitude / (Math.PI * 2) + 0.5) * mapCanvas.width)),
      );
      const mapY = Math.max(
        0,
        Math.min(mapCanvas.height - 1, Math.floor((0.5 - latitude / Math.PI) * mapCanvas.height)),
      );
      const land = map[(mapY * mapCanvas.width + mapX) * 4] / 255;
      const randomValue = deterministicRandom(Math.floor(x / 8), Math.floor(y / 8));
      const density = land > 0.3 ? 0.78 : 0.075;
      if (randomValue > density) continue;

      const edgeFade = Math.max(0, Math.min(1, (1 - Math.sqrt(radiusSquared)) / 0.12));
      const screenX = (rect.left + x) / window.innerWidth;
      const screenY = (rect.top + y) / window.innerHeight;
      const mobileMix = 1 - Math.max(0, Math.min(1, (window.innerWidth - 640) / 220));
      const quietCenterX = 0.5 + 0.07 * mobileMix;
      const quietCenterY = 0.52 + 0.02 * mobileMix;
      const quietHalfWidth = 0.21 + 0.13 * mobileMix;
      const quietHalfHeight = 0.17 + 0.085 * mobileMix;
      const quietRadius = 0.045 + 0.02 * mobileMix;
      const quietX = Math.abs(screenX - quietCenterX) - quietHalfWidth + quietRadius;
      const quietY = Math.abs(screenY - quietCenterY) - quietHalfHeight + quietRadius;
      const quietDistance = Math.hypot(Math.max(quietX, 0), Math.max(quietY, 0))
        + Math.min(Math.max(quietX, quietY), 0)
        - quietRadius;
      const quietProgress = Math.max(0, Math.min(1, (quietDistance + 0.012) / 0.092));
      const quietSmooth = quietProgress * quietProgress * (3 - 2 * quietProgress);
      const quietFloor = 0.11 - 0.06 * mobileMix;
      const quietFade = quietFloor + (1 - quietFloor) * quietSmooth;
      const contentFade = 0.24 + 0.76 * Math.max(0, Math.min(1, (screenX - 0.38) / 0.44));
      const alpha = (land > 0.3 ? 0.38 : 0.1) * edgeFade * contentFade * quietFade;
      context.fillStyle = land > 0.3
        ? `rgba(210, 231, 221, ${alpha})`
        : `rgba(114, 179, 174, ${alpha})`;
      context.fillRect(x - 3, y - 3, 5.35, 5.35);
    }
  }
  context.setTransform(1, 0, 0, 1, 0, 0);
}

/**
 * Transparent, original Aivory world-density renderer. The map mask is
 * Natural Earth public-domain data; all projection, dither and motion code is
 * Aivory-owned and intentionally independent from the ambient background.
 */
export function AivoryWorldGlobe() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    let reducedMotion = reducedMotionQuery.matches;
    let heroVisible = true;
    let pageVisible = !document.hidden;
    let disposed = false;
    let frameId = 0;
    let lastFrame = 0;
    let startTime = performance.now();
    let dpr = 1;
    let pointerStrength = 0;
    let pointerTarget = 0;
    let pointerX = -10_000;
    let pointerY = -10_000;
    let gl: WebGL2RenderingContext | null = null;
    let program: WebGLProgram | null = null;
    let texture: WebGLTexture | null = null;
    let vertexArray: WebGLVertexArrayObject | null = null;
    let uniforms: GlobeUniforms | null = null;

    const image = new Image();
    image.decoding = 'async';

    const resize = () => {
      const rect = wrapper.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      const width = Math.max(1, Math.round(rect.width * dpr));
      const height = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
    };

    const render = (now: number) => {
      if (!gl || !program || !uniforms) return;
      resize();
      const rect = wrapper.getBoundingClientRect();
      const elapsed = reducedMotion ? 0 : (now - startTime) / 1000;
      pointerStrength += (pointerTarget - pointerStrength) * 0.12;

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.uniform1i(uniforms.land, 0);
      gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
      gl.uniform2f(uniforms.viewport, window.innerWidth, window.innerHeight);
      gl.uniform2f(uniforms.canvasOrigin, rect.left, rect.top);
      gl.uniform2f(uniforms.pointer, pointerX, pointerY);
      gl.uniform1f(uniforms.pointerStrength, pointerStrength);
      gl.uniform1f(uniforms.dpr, dpr);
      gl.uniform1f(uniforms.time, elapsed);
      gl.uniform1f(uniforms.intro, reducedMotion ? 1 : Math.min(1, elapsed / 1.1));
      gl.uniform1f(uniforms.reducedMotion, reducedMotion ? 1 : 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const shouldAnimate = () => heroVisible && pageVisible && !reducedMotion && !disposed;

    const stopAnimation = () => {
      if (frameId) cancelAnimationFrame(frameId);
      frameId = 0;
    };

    const tick = (now: number) => {
      frameId = 0;
      if (!shouldAnimate()) return;
      if (now - lastFrame >= 1000 / TARGET_FPS) {
        render(now);
        lastFrame = now;
      }
      frameId = requestAnimationFrame(tick);
    };

    const syncAnimation = () => {
      stopAnimation();
      if (shouldAnimate()) {
        frameId = requestAnimationFrame(tick);
      } else if (gl) {
        render(performance.now());
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!finePointerQuery.matches) return;
      const rect = canvas.getBoundingClientRect();
      const inside = event.clientX >= rect.left
        && event.clientX <= rect.right
        && event.clientY >= rect.top
        && event.clientY <= rect.bottom;
      pointerTarget = inside ? 1 : 0;
      pointerX = (event.clientX - rect.left) * dpr;
      pointerY = (rect.bottom - event.clientY) * dpr;
    };

    const handleVisibility = () => {
      pageVisible = !document.hidden;
      syncAnimation();
    };

    const handleReducedMotion = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
      if (!reducedMotion) startTime = performance.now();
      syncAnimation();
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (gl) render(performance.now());
      else if (image.complete && image.naturalWidth) drawCanvasFallback(canvas, image, dpr);
    });
    resizeObserver.observe(wrapper);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        heroVisible = entry.isIntersecting;
        syncAnimation();
      },
      { rootMargin: '80px' },
    );
    intersectionObserver.observe(wrapper);

    document.addEventListener('visibilitychange', handleVisibility);
    reducedMotionQuery.addEventListener('change', handleReducedMotion);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    image.onload = () => {
      if (disposed) return;
      resize();
      gl = canvas.getContext('webgl2', {
        alpha: true,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: 'low-power',
        premultipliedAlpha: true,
        preserveDrawingBuffer: false,
      });

      if (!gl) {
        drawCanvasFallback(canvas, image, dpr);
        return;
      }

      try {
        program = createProgram(gl);
        vertexArray = gl.createVertexArray();
        gl.bindVertexArray(vertexArray);
        texture = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          image,
        );

        uniforms = {
          land: gl.getUniformLocation(program, 'uLand'),
          resolution: gl.getUniformLocation(program, 'uResolution'),
          viewport: gl.getUniformLocation(program, 'uViewport'),
          canvasOrigin: gl.getUniformLocation(program, 'uCanvasOrigin'),
          pointer: gl.getUniformLocation(program, 'uPointer'),
          pointerStrength: gl.getUniformLocation(program, 'uPointerStrength'),
          dpr: gl.getUniformLocation(program, 'uDpr'),
          time: gl.getUniformLocation(program, 'uTime'),
          intro: gl.getUniformLocation(program, 'uIntro'),
          reducedMotion: gl.getUniformLocation(program, 'uReducedMotion'),
        };
        render(performance.now());
        syncAnimation();
      } catch (error) {
        console.error('Aivory world globe could not initialize.', error);
        gl = null;
        drawCanvasFallback(canvas, image, dpr);
      }
    };
    image.src = LAND_MASK_URL;

    return () => {
      disposed = true;
      stopAnimation();
      image.onload = null;
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
      reducedMotionQuery.removeEventListener('change', handleReducedMotion);
      window.removeEventListener('pointermove', handlePointerMove);
      if (gl) {
        if (texture) gl.deleteTexture(texture);
        if (vertexArray) gl.deleteVertexArray(vertexArray);
        if (program) gl.deleteProgram(program);
      }
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      className="absolute z-[1] pointer-events-none aspect-square top-[clamp(72px,10vh,112px)] right-[-38vw] w-[min(138vw,620px)] sm:top-[8%] sm:right-[-18%] sm:w-[min(78vw,680px)] lg:top-[6%] lg:right-[-8%] lg:w-[min(54vw,780px)]"
    >
      <canvas
        ref={canvasRef}
        className="block h-full w-full"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
}
