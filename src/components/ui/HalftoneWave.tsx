'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export function HalftoneWave() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Use getBoundingClientRect to ensure we get the right dimensions
    const rect = mountRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const scene = new THREE.Scene();
    
    // Orthographic camera for full screen 2D shader
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1; // Pull camera back so plane at z=0 is visible

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setSize(width, height);
    
    // EXTREME OPTIMIZATION: Reduce render resolution by 50% universally.
    // For Geometric Pixel shaders, lower resolution is fine and it cuts GPU load by 75%!
    renderer.setPixelRatio(isMobile ? 0.4 : 0.5);
    
    mountRef.current.appendChild(renderer.domElement);

    // Full screen quad
    const geometry = new THREE.PlaneGeometry(2, 2);

    // Provide a grey default texture [128, 128, 128, 255] instead of white [255].
    // This creates an instant fallback density of 0.5, rendering shifting 'x' ASCII characters
    // immediately as a "loading state" while the 171KB image downloads over slow networks!
    const defaultTexture = new THREE.DataTexture(new Uint8Array([128, 128, 128, 255]), 1, 1, THREE.RGBAFormat);
    defaultTexture.needsUpdate = true;

    const uniforms = {
      uTime: { value: 0.0 },
      uColor: { value: new THREE.Color('#444444') },
      uResolution: { value: new THREE.Vector2(width, height) },
      uPixelSize: { value: 14.0 }, // Sweet spot: not too small to clutter, not too big
      uTexture: { value: defaultTexture },
      // ── depth / density tuning knobs (tweak freely & redeploy) ──
      uDensityFloor: { value: 0.70 }, // Massively increased to severely thin out the clouds (less visual clutter)
      uFarDim: { value: 0.01 },       // background brightness
      uNearBright: { value: 0.2 }     // foreground cloud "pop" reduced
    };

    // Load the authentic Megamendung texture mask
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('/megamendung_mask.png', (texture) => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      // Linear filtering creates smooth grayscale edges on the B/W mask, which maps perfectly to the ASCII density layers!
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      uniforms.uTexture.value = texture;
    });

    const material = new THREE.ShaderMaterial({
      uniforms,
      defines: {
        IS_MOBILE: isMobile ? 1 : 0
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform float uTime;
        uniform vec3 uColor;
        uniform vec2 uResolution;
        uniform float uPixelSize;
        uniform sampler2D uTexture;
        uniform float uDensityFloor;
        uniform float uFarDim;
        uniform float uNearBright;

        vec3 getCloudLayer(sampler2D tex, vec2 cell, float scale, float speed, vec2 offset, float time) {
            // Base continuous coordinates
            float baseMovingX = cell.x * scale + offset.x - time * speed;
            float baseY = cell.y * (scale * 1.21) + offset.y;
            
            // 1. ORGANIC SCATTERING (NO VERTICAL BOBBING)
            // To completely break the "linear/neat" rows without adding time-based bobbing,
            // we give each individual cloud (tile) a static random X and Y offset!
            
            // First, get the row to apply a random X stagger
            float row = floor(baseY);
            float randomXOffset = (fract(sin(row * 12.9898 + scale * 78.233) * 43758.5453) - 0.5) * 20.0; // HUGE random X scatter
            
            float finalX = baseMovingX + randomXOffset;
            float col = floor(finalX);
            
            // Now, use the column and row to generate a unique random Y offset for this specific cloud.
            // This permanently shifts the cloud up or down within its tile, breaking the straight line!
            float randomYOffset = (fract(sin(col * 43.123 + row * 12.312 + scale) * 12345.0) - 0.5) * 0.7; // -0.35 to +0.35
            
            float finalY = baseY + randomYOffset;
            
            // Get local coordinates within the tile
            float localX = fract(finalX);
            float localY = fract(finalY);
            

            // Soften the edges significantly so clouds fading at the tile boundaries don't form hard geometric shapes
            // CRITICAL FIX: The row jumps at baseY boundaries, so we MUST mask Y using fract(baseY). 
            // The column jumps at finalX boundaries, so we mask X using localX (fract(finalX)).
            float physicalLocalY = fract(baseY);
            float edgeMask = smoothstep(0.0, 0.25, localX) * smoothstep(1.0, 0.75, localX);
            edgeMask *= smoothstep(0.0, 0.3, physicalLocalY) * smoothstep(1.0, 0.7, physicalLocalY);
            
            // 1. Stable: Idle and moving
            // 2. Shatter: Dissolves into noise and drifts upwards (Dandelion erosion)
            
            // Unique phase for this cloud
            float phase = fract(sin(col * 12.33 + row * 45.67) * 78.91);
            // Slower cycle: 20 seconds
            float cycleTime = time * 0.05; 
            float cycle = fract(cycleTime + phase);
            
            // Stages
            float shatterProgress = smoothstep(0.70, 1.0, cycle);     // 30% of cycle
            
            // 2. Dandelion Shatter / Dissolve Effect
            // High frequency noise for organic disintegration
            float dissolveNoise = fract(sin(dot(vec2(localX, localY) * 8.0 + vec2(time * 0.1), vec2(12.9898, 78.233))) * 43758.5453);
            // Shatter mask drops to 0 organically based on noise
            float shatterMask = smoothstep(shatterProgress - 0.15, shatterProgress + 0.15, 1.0 - dissolveNoise);
            
            // Subtle upward and rightward drift during shatter
            float windX = shatterProgress * 0.15;
            float windY = shatterProgress * -0.3; // Negative Y = texture moves UP
            
            float sampleX = localX - windX;
            float sampleY = localY - windY;
            
            // Mask out anything that blows outside the [0,1] logical texture space
            float uvBoundsMask = step(0.0, sampleX) * step(sampleX, 1.0) * step(0.0, sampleY) * step(sampleY, 1.0);
            
            float croppedY = mix(0.0875, 0.9125, sampleY);
            float texVal = texture2D(tex, vec2(sampleX, croppedY)).r;
            
            // Combine all masks (Removed bloom to improve performance and visuals)
            float lifeAlpha = shatterMask;
            float density = (1.0 - texVal) * edgeMask * lifeAlpha * uvBoundsMask;
            return vec3(density, localX, localY);
        }

        void main() {
          // Cell coordinates for the macro grids (ASCII characters)
          vec2 cell = floor(gl_FragCoord.xy / uPixelSize);

          // Local coordinates within the cell [0, 1]
          vec2 local = fract(gl_FragCoord.xy / uPixelSize);

          // Raw per-layer cloud densities, far -> near. We composite them
          // BACK-TO-FRONT (alpha-over) so nearer clouds actually OCCLUDE farther
          // ones, and carry a depth value (0 = far, 1 = near) so shading can
          // apply atmospheric perspective. uDensityFloor controls how much faint
          // cloud survives -> higher = more open sky (less "padat").
          float density = 0.0;
          float depth = 0.0;
          vec2 cloudLocal = vec2(0.5);

#if IS_MOBILE == 1
          vec3 r1 = getCloudLayer(uTexture, cell, 0.071, 0.015, vec2(0.0, 0.0), uTime);
          vec3 r4 = getCloudLayer(uTexture, cell, 0.016, 0.08, vec2(0.1, 0.5), uTime);
          float a1 = smoothstep(uDensityFloor, uDensityFloor + 0.2, r1.x); density = mix(density, r1.x, a1); depth = mix(depth, 0.0, a1); cloudLocal = mix(cloudLocal, r1.yz, a1);
          float a4 = smoothstep(uDensityFloor, uDensityFloor + 0.2, r4.x); density = mix(density, r4.x, a4); depth = mix(depth, 1.0, a4); cloudLocal = mix(cloudLocal, r4.yz, a4);
#else
          vec3 r1 = getCloudLayer(uTexture, cell, 0.071, 0.015, vec2(0.0, 0.0), uTime);  // far
          vec3 r2 = getCloudLayer(uTexture, cell, 0.048, 0.03, vec2(0.33, 0.7), uTime);
          vec3 r3 = getCloudLayer(uTexture, cell, 0.028, 0.05, vec2(0.66, 0.2), uTime);
          vec3 r4 = getCloudLayer(uTexture, cell, 0.016, 0.08, vec2(0.1, 0.5), uTime);   // near

          float a1 = smoothstep(uDensityFloor, uDensityFloor + 0.2, r1.x); density = mix(density, r1.x, a1); depth = mix(depth, 0.00, a1); cloudLocal = mix(cloudLocal, r1.yz, a1);
          float a2 = smoothstep(uDensityFloor, uDensityFloor + 0.2, r2.x); density = mix(density, r2.x, a2); depth = mix(depth, 0.40, a2); cloudLocal = mix(cloudLocal, r2.yz, a2);
          float a3 = smoothstep(uDensityFloor, uDensityFloor + 0.2, r3.x); density = mix(density, r3.x, a3); depth = mix(depth, 0.70, a3); cloudLocal = mix(cloudLocal, r3.yz, a3);
          float a4 = smoothstep(uDensityFloor, uDensityFloor + 0.2, r4.x); density = mix(density, r4.x, a4); depth = mix(depth, 1.00, a4); cloudLocal = mix(cloudLocal, r4.yz, a4);
#endif

          // Map the surviving density into the ASCII character ramp.
          density = smoothstep(0.0, 0.85, density);

          // 3. GEOMETRIC PIXEL / SDF RENDERER
          if (density < 0.01) discard;

          // Shift local to [-0.5, 0.5] for SDF math
          vec2 uv = local - 0.5;
          
          // --- PROCEDURAL ANIMATION ---
          // Unique phase per cell
          float rotPhase = fract(sin(dot(cell, vec2(12.9898, 78.233))) * 43758.5453);
          
          // Rotation angle: slowly spins, alternating direction based on phase
          float angle = uTime * (rotPhase - 0.5) * 4.0 + rotPhase * 6.2831;
          
          // 2D Rotation Matrix
          float c = cos(angle);
          float s = sin(angle);
          mat2 rot = mat2(c, -s, s, c);
          
          // Apply rotation and breathing scale
          vec2 rotUV = rot * uv;
          float scalePulse = 1.0 + 0.15 * sin(uTime * 3.0 + rotPhase * 10.0);
          rotUV *= scalePulse;

          // --- ULTRA-FAST SDF MORPHING LOGIC ---
          // Interpolate between a Rhombus (Manhattan distance) and a Square (Chebyshev distance)
          // No branches, no square roots (length()), highly optimized for Macbook Ultras
          float rhombusDist = (abs(rotUV.x) + abs(rotUV.y)) * 0.85;
          float squareDist = max(abs(rotUV.x), abs(rotUV.y));
          
          float d = mix(rhombusDist, squareDist, density);
          float threshold = density * 0.35; // Size scales linearly based on density
          
          // Anti-aliased shape
          float shape = smoothstep(threshold + 0.05, threshold - 0.05, d);
          
          if (shape < 0.01) discard;

          // SDF Edge for 3D Volumetric Rim Lighting (0.0 at center, 1.0 at edge)
          float innerEdge = smoothstep(threshold - 0.15, threshold, d);

          // 3D shading via ATMOSPHERIC PERSPECTIVE & MULTI-TONE GREY PALETTE
          // Stealthy, ultra-dark palette to ensure text remains highly legible and background isn't blinding
          vec3 darkGunmetal = vec3(0.005, 0.005, 0.005); // Pure stealth
          vec3 charcoal     = vec3(0.015, 0.020, 0.025); // Very dark
          vec3 ashGrey      = vec3(0.035, 0.040, 0.045); // Dim grey
          vec3 silver       = vec3(0.080, 0.090, 0.100); // Muted highlights
          
          // Interpolate based on depth (layer) and density (thickness of cloud)
          float paletteMix = depth * 0.6 + density * 0.4;
          
          vec3 base;
          if (paletteMix < 0.33) {
              base = mix(darkGunmetal, charcoal, paletteMix / 0.33);
          } else if (paletteMix < 0.66) {
              base = mix(charcoal, ashGrey, (paletteMix - 0.33) / 0.33);
          } else {
              base = mix(ashGrey, silver, (paletteMix - 0.66) / 0.34);
          }
          
          // Introduce macro-gradient variations based on screen position (cloudLocal)
          float macroGrad = smoothstep(0.0, 1.0, cloudLocal.x + cloudLocal.y * 0.5);
          vec3 gradTint = mix(vec3(0.85, 0.9, 1.05), vec3(1.05, 0.95, 0.85), macroGrad); // subtle cool/warm shift
          
          // Add micro-variation per cell to break monotony
          float cellTone = mix(0.9, 1.1, rotPhase); 
          
          base = base * gradTint * cellTone;

          // 4. ANALOG 3D GRADIENT (VOLUMETRIC SHADING)
          float gradientY = smoothstep(0.1, 0.9, cloudLocal.y);
          float gradientX = smoothstep(0.2, 0.8, cloudLocal.x);
          
          // Volumetric Shadow limits excessive brightness
          float volumetricShadow = mix(0.5, 1.3, gradientY * 0.7 + gradientX * 0.3);

          vec3 finalColor = base * volumetricShadow;

          // 3D Bevel/Rim Light using the SDF Inner Edge!
          float rim = smoothstep(0.3, 0.9, density) * (depth * 0.8 + 0.2);
          float bevelLight = innerEdge * smoothstep(0.2, 1.0, gradientY) * rim;
          
          // Highlight is extremely muted to prevent glare
          vec3 highlightColor = vec3(0.15, 0.16, 0.18);
          finalColor += highlightColor * bevelLight * 0.15;
          
          // Apply shape anti-aliasing alpha
          gl_FragColor = vec4(finalColor, shape);
        }
      `,
      transparent: true,
      depthWrite: false
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const clock = new THREE.Clock();
    let animationFrameId: number;
    let isVisible = true;

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.0 });
    observer.observe(renderer.domElement);

    let lastRenderTime = 0;
    // The clouds drift slowly, so 20 FPS on mobile is visually indistinguishable from
    // 30 but meaningfully lighter on battery/GPU for a full-screen fragment shader.
    const fpsInterval = 1000 / (isMobile ? 20 : 30); // FPS throttle

    const renderLoop = (timestamp: number) => {
      animationFrameId = requestAnimationFrame(renderLoop);
      if (isVisible) {
        const elapsed = timestamp - lastRenderTime;
        if (elapsed > fpsInterval) {
          lastRenderTime = timestamp - (elapsed % fpsInterval);
          uniforms.uTime.value = clock.getElapsedTime();
          renderer.render(scene, camera);
        }
      }
    };
    renderLoop(0);

    const handleResize = () => {
      if (!mountRef.current) return;
      const rect = mountRef.current.getBoundingClientRect();
      renderer.setSize(rect.width, rect.height);
      uniforms.uResolution.value.set(rect.width, rect.height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="absolute inset-0 z-0 pointer-events-none"
      style={{ overflow: 'hidden' }}
    />
  );
}
