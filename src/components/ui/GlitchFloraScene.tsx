'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  createAsciiOverlayState,
  FLORA_PALETTES,
  FLORA_TEX_H,
  FLORA_TEX_W,
  type FloraPalette,
  generateGlitchFloraCanvas,
} from '@/lib/glitchFloraGenerator';

interface GlitchFloraSceneProps {
  paletteKey?: string;
  imageSrc?: string;
  seedOffset?: number;
  className?: string;
  interactive?: boolean;
  showAscii?: boolean;
  asciiOpacity?: number;
}

const VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  uniform sampler2D uFloraTex;
  uniform sampler2D uAsciiTex;
  uniform vec2 uResolution;
  uniform vec2 uFloraSize;
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uHover;
  uniform float uShowAscii;
  uniform float uAsciiOpacity;
  varying vec2 vUv;

  float hash11(float p) {
    p = fract(p * 0.1031);
    p *= p + 33.33;
    p *= p + p;
    return fract(p);
  }

  float hash21(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  vec2 getCoverUv(vec2 uv, vec2 resolution, vec2 texSize) {
    float screenAspect = resolution.x / max(resolution.y, 1.0);
    float texAspect = texSize.x / max(texSize.y, 1.0);
    vec2 scale = vec2(1.0);
    if (screenAspect > texAspect) {
      scale.y = texAspect / screenAspect;
    } else {
      scale.x = screenAspect / texAspect;
    }
    return (uv - 0.5) * scale + 0.5;
  }

  void main() {
    vec2 uv = vUv;
    vec2 coverUv = getCoverUv(uv, uResolution, uFloraSize);

    // Smooth, continuous optical prism glitch bands on the clean floral artwork
    float rowId = floor((uv.y * uResolution.y) / 28.0);
    float bandSeed = hash11(rowId * 1.73 + 0.19);
    float bandMask = step(0.62, bandSeed);

    float smoothWave = sin(uTime * (0.55 + bandSeed * 0.65) + bandSeed * 6.2831);
    float distToPointerY = abs(uv.y - uPointer.y);
    float pointerLens = smoothstep(0.24, 0.0, distToPointerY) * uHover;

    float xShift = smoothWave * (0.014 + pointerLens * 0.024) * bandMask;

    vec2 floraUv = clamp(
      coverUv + vec2(xShift + sin(coverUv.y * 3.5 + uTime * 0.4) * 0.004, 0.0),
      0.002,
      0.998
    );
    vec3 floraCol = texture2D(uFloraTex, floraUv).rgb;

    // Keep ASCII UVs 100% untorn so characters never shear or look like broken VRAM
    vec4 asciiSample = texture2D(uAsciiTex, uv);

    vec3 composed = mix(floraCol, vec3(1.0), asciiSample.a * uAsciiOpacity * uShowAscii);
    gl_FragColor = vec4(composed, 1.0);
  }
`;

export function GlitchFloraScene({
  paletteKey = 'porcelain',
  imageSrc,
  seedOffset = 0,
  className = '',
  interactive = true,
  showAscii = true,
  asciiOpacity = 0.92,
}: GlitchFloraSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const palette: FloraPalette = FLORA_PALETTES[paletteKey] ?? FLORA_PALETTES.porcelain;
    const effectiveSeed = palette.seed + seedOffset;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let currentW = Math.max(280, Math.round(container.clientWidth));
    let currentH = Math.max(200, Math.round(container.clientHeight));

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(currentW, currentH, false);
    renderer.domElement.className = 'block h-full w-full';
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    let floraTexture: THREE.Texture;
    if (imageSrc) {
      floraTexture = new THREE.TextureLoader().load(imageSrc, (tex) => {
        const img = tex.image as HTMLImageElement | undefined;
        if (img?.naturalWidth && img?.naturalHeight) {
          uniforms.uFloraSize.value.set(img.naturalWidth, img.naturalHeight);
        }
        renderer.render(scene, camera);
      });
    } else {
      const floraCanvas = generateGlitchFloraCanvas(
        palette,
        effectiveSeed,
        FLORA_TEX_W,
        FLORA_TEX_H
      );
      floraTexture = new THREE.CanvasTexture(floraCanvas);
    }
    floraTexture.minFilter = THREE.LinearFilter;
    floraTexture.magFilter = THREE.LinearFilter;

    let asciiState = createAsciiOverlayState(effectiveSeed, currentW, currentH);
    let asciiTexture = new THREE.CanvasTexture(asciiState.canvas);
    asciiTexture.minFilter = THREE.LinearFilter;
    asciiTexture.magFilter = THREE.LinearFilter;

    const uniforms = {
      uFloraTex: { value: floraTexture },
      uAsciiTex: { value: asciiTexture },
      uResolution: { value: new THREE.Vector2(currentW, currentH) },
      uFloraSize: { value: new THREE.Vector2(FLORA_TEX_W, FLORA_TEX_H) },
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      uHover: { value: 0 },
      uShowAscii: { value: showAscii ? 1 : 0 },
      uAsciiOpacity: { value: asciiOpacity },
    };

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const targetPointer = new THREE.Vector2(0.5, 0.5);
    let targetHover = 0;

    const onPointerMove = (e: PointerEvent) => {
      if (!interactive || reducedMotion) return;
      const rect = container.getBoundingClientRect();
      targetPointer.set(
        (e.clientX - rect.left) / Math.max(1, rect.width),
        1.0 - (e.clientY - rect.top) / Math.max(1, rect.height)
      );
      targetHover = 1;
    };

    const onPointerLeave = () => {
      targetHover = 0;
    };

    if (interactive) {
      container.addEventListener('pointermove', onPointerMove);
      container.addEventListener('pointerleave', onPointerLeave);
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const nextW = Math.max(240, Math.round(entry.contentRect.width));
        const nextH = Math.max(180, Math.round(entry.contentRect.height));
        if (Math.abs(nextW - currentW) < 4 && Math.abs(nextH - currentH) < 4) continue;

        currentW = nextW;
        currentH = nextH;
        renderer.setSize(nextW, nextH, false);
        uniforms.uResolution.value.set(nextW, nextH);

        const prevTex = asciiTexture;
        asciiState = createAsciiOverlayState(effectiveSeed, nextW, nextH);
        asciiTexture = new THREE.CanvasTexture(asciiState.canvas);
        asciiTexture.minFilter = THREE.LinearFilter;
        asciiTexture.magFilter = THREE.LinearFilter;
        uniforms.uAsciiTex.value = asciiTexture;
        prevTex.dispose();

        if (reducedMotion) {
          renderer.render(scene, camera);
        }
      }
    });
    resizeObserver.observe(container);

    let rafId = 0;
    let lastAsciiFrame = 0;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = (now - startTime) * 0.001;
      uniforms.uTime.value = reducedMotion ? 0 : elapsed;

      // Silky damped spring-like tracking
      uniforms.uPointer.value.lerp(targetPointer, 0.045);
      uniforms.uHover.value += (targetHover - uniforms.uHover.value) * 0.045;

      // Update smooth per-character fade envelope (~30fps canvas upload, silky opacity curve)
      if (!reducedMotion && now - lastAsciiFrame > 32) {
        asciiState.updateSmooth(elapsed);
        asciiTexture.needsUpdate = true;
        lastAsciiFrame = now;
      }

      renderer.render(scene, camera);
      if (!reducedMotion) {
        rafId = requestAnimationFrame(animate);
      }
    };

    renderer.render(scene, camera);
    if (!reducedMotion) {
      rafId = requestAnimationFrame(animate);
    }

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      if (interactive) {
        container.removeEventListener('pointermove', onPointerMove);
        container.removeEventListener('pointerleave', onPointerLeave);
      }
      geometry.dispose();
      material.dispose();
      floraTexture.dispose();
      asciiTexture.dispose();
      renderer.dispose();
    };
  }, [paletteKey, imageSrc, seedOffset, interactive, showAscii, asciiOpacity]);

  const positionClass =
    className.includes('absolute') || className.includes('fixed') ? '' : 'relative';

  return (
    <div
      ref={containerRef}
      className={`${positionClass} overflow-hidden ${className}`}
      aria-hidden="true"
    />
  );
}
