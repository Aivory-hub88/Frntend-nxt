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
    
    // EXTREME MOBILE OPTIMIZATION: Reduce render resolution by 50% on mobile (saves 75% fragments!)
    const isMobile = window.innerWidth < 1024;
    renderer.setPixelRatio(isMobile ? 0.5 : 1);
    
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
      uPixelSize: { value: 10.0 }, // 10px cells for clear ASCII characters
      uTexture: { value: defaultTexture },
      // ── depth / density tuning knobs (tweak freely & redeploy) ──
      uDensityFloor: { value: 0.25 }, // higher = more open sky (less dense)
      uFarDim: { value: 0.02 },       // background brightness — keep low for text legibility
      uNearBright: { value: 0.5 }     // foreground cloud "pop"
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
            
            // The original image has huge empty margins. Crop to the middle 82.5% (0.0875 to 0.9125)
            float croppedY = mix(0.0875, 0.9125, localY);
            
            // Soften the edges significantly so clouds fading at the tile boundaries don't form hard geometric shapes
            // CRITICAL FIX: The row jumps at baseY boundaries, so we MUST mask Y using fract(baseY). 
            // The column jumps at finalX boundaries, so we mask X using localX (fract(finalX)).
            float physicalLocalY = fract(baseY);
            float edgeMask = smoothstep(0.0, 0.25, localX) * smoothstep(1.0, 0.75, localX);
            edgeMask *= smoothstep(0.0, 0.3, physicalLocalY) * smoothstep(1.0, 0.7, physicalLocalY);
            
            float texVal = texture2D(tex, vec2(localX, croppedY)).r;
            
            // --- DISSIPATING / MIST EFFECT ---
            // Instead of warping the UVs (which destroys the Megamendung pattern),
            // we apply an organic, slowly moving noise mask to the *density*.
            // This makes the clouds organically fade in and out as if passing through mist.
            float mistTime = time * 0.2;
            float mist = sin(finalX * 1.8 + mistTime) * cos(finalY * 2.2 - mistTime * 0.8);
            float mist2 = cos(finalX * 2.5 - mistTime * 1.1) * sin(finalY * 1.5 + mistTime * 0.7);
            float organicFade = 0.75 + 0.25 * (mist + mist2);
            
            float density = (1.0 - texVal) * edgeMask * organicFade;
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

          // 3. ASCII / BITMAP RENDERER
          // Map density to 6 distinct levels (0 = empty, 5 = solid)
          int charIndex = int(floor(density * 5.99));

          // Create a 5x5 pixel-art grid inside this cell
          vec2 p5 = floor(local * 5.0); 
          float shape = 0.0;

          if (charIndex == 1) {
              // Level 1: '.' (center dot)
              if (p5.x == 2.0 && p5.y == 2.0) shape = 1.0;
          } else if (charIndex == 2) {
              // Level 2: '+' (plus)
              if (p5.x == 2.0 && p5.y > 0.0 && p5.y < 4.0) shape = 1.0;
              if (p5.y == 2.0 && p5.x > 0.0 && p5.x < 4.0) shape = 1.0;
          } else if (charIndex == 3) {
              // Level 3: 'x' (cross)
              if (p5.x == p5.y && p5.x > 0.0 && p5.x < 4.0) shape = 1.0;
              if (p5.x == (4.0 - p5.y) && p5.x > 0.0 && p5.x < 4.0) shape = 1.0;
          } else if (charIndex == 4) {
              // Level 4: '[]' (square outline / 'o')
              if ((p5.x == 1.0 || p5.x == 3.0) && p5.y >= 1.0 && p5.y <= 3.0) shape = 1.0;
              if ((p5.y == 1.0 || p5.y == 3.0) && p5.x >= 1.0 && p5.x <= 3.0) shape = 1.0;
          } else if (charIndex >= 5) {
              // Level 5: '■' (solid block)
              if (p5.x >= 1.0 && p5.x <= 3.0 && p5.y >= 1.0 && p5.y <= 3.0) shape = 1.0;
          }

          if (shape == 0.0) {
            discard;
          }

          // 3D shading via ATMOSPHERIC PERSPECTIVE.
          // Brightness is driven primarily by DEPTH (which layer won this pixel),
          // not just density: far clouds stay dim (and readable behind text),
          // near clouds pop. Density then adds a secondary highlight on the peaks,
          // so a near cloud clearly reads as "in front of" a far one.
          vec3 farColor  = uColor * uFarDim;      // background: dim
          vec3 nearColor = uColor * uNearBright;  // foreground: bright
          vec3 base = mix(farColor, nearColor, depth);

          // 4. ANALOG 3D GRADIENT (VOLUMETRIC SHADING)
          // local.y is ~1.0 at the top (brighter), ~0.0 at the bottom (darker)
          // local.x is ~1.0 at the right, ~0.0 at the left
          // This creates a smooth gradient across the ASCII characters!
          float gradientY = smoothstep(0.1, 0.9, cloudLocal.y);
          float gradientX = smoothstep(0.2, 0.8, cloudLocal.x);
          
          // Combine for a volumetric light effect (e.g. light from Top-Right)
          float volumetricShadow = mix(0.35, 1.45, gradientY * 0.7 + gradientX * 0.3);

          float pop = pow(density, 1.5);
          vec3 finalColor = base * (0.65 + 0.55 * pop);
          
          // Apply the 3D analog gradient
          finalColor *= volumetricShadow;

          // Rim light: Make it respect the directional light so it only shines on the lit edges!
          float rim = smoothstep(0.45, 0.75, density) * depth;
          float directionalRim = rim * smoothstep(0.4, 0.9, gradientY);
          finalColor += uColor * directionalRim * 0.6;

          gl_FragColor = vec4(finalColor, 1.0);
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
