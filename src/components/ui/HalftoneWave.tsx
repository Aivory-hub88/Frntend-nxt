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
    
    // Performance: 0.5 pixelRatio universally — halves resolution, cuts GPU load 75%
    const isMobile = window.innerWidth < 1024;
    renderer.setPixelRatio(0.5);
    
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
      uPixelSize: { value: 8.0 },
      uTexture: { value: defaultTexture },
      uDensityFloor: { value: 0.60 },
      uFarDim: { value: 0.01 },
      uNearBright: { value: 0.2 }
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
          // REDUCED FROM 4 LAYERS TO 2 LAYERS TO STOP MACBOOK GLITCHING & LAG!
          vec3 r1 = getCloudLayer(uTexture, cell, 0.06, 0.02, vec2(0.0, 0.0), uTime);  // far
          vec3 r4 = getCloudLayer(uTexture, cell, 0.02, 0.06, vec2(0.3, 0.5), uTime);  // near

          float a1 = smoothstep(uDensityFloor, uDensityFloor + 0.2, r1.x); density = mix(density, r1.x, a1); depth = mix(depth, 0.00, a1); cloudLocal = mix(cloudLocal, r1.yz, a1);
          float a4 = smoothstep(uDensityFloor, uDensityFloor + 0.2, r4.x); density = mix(density, r4.x, a4); depth = mix(depth, 1.00, a4); cloudLocal = mix(cloudLocal, r4.yz, a4);
#endif

          // Map the surviving density into the ASCII character ramp.
          density = smoothstep(0.0, 0.85, density);

          // 3. STATIC GEOMETRIC PIXEL RENDERER — NO ROTATION, NO PULSE, NO MORPHING
          if (density < 0.01) discard;

          vec2 uv = local - 0.5;

          // Simple static square SDF — NO cos/sin/rotation/scale (kills GPU)
          float d = max(abs(uv.x), abs(uv.y));
          float threshold = density * 0.32;
          float shape = smoothstep(threshold + 0.04, threshold - 0.04, d);
          if (shape < 0.01) discard;

          // Unique phase per cell (cheap — computed once per cell, no trig per pixel)
          float cellPhase = fract(sin(dot(cell, vec2(12.9898, 78.233))) * 43758.5453);

          // ULTRA-DARK 4-TONE PALETTE — barely visible, like a watermark
          vec3 tone1 = vec3(0.01, 0.012, 0.015);
          vec3 tone2 = vec3(0.025, 0.03, 0.04);
          vec3 tone3 = vec3(0.04, 0.05, 0.06);
          vec3 tone4 = vec3(0.06, 0.07, 0.085);

          float paletteMix = depth * 0.6 + density * 0.4;
          vec3 base;
          if (paletteMix < 0.33) {
              base = mix(tone1, tone2, paletteMix / 0.33);
          } else if (paletteMix < 0.66) {
              base = mix(tone2, tone3, (paletteMix - 0.33) / 0.33);
          } else {
              base = mix(tone3, tone4, (paletteMix - 0.66) / 0.34);
          }

          // Tiny cool/warm micro-shift per cell
          base *= mix(vec3(0.95, 0.97, 1.0), vec3(1.0, 0.97, 0.95), cellPhase);

          // Minimal edge highlight for 3D hint — almost invisible
          float innerEdge = smoothstep(threshold - 0.1, threshold, d);
          base += vec3(0.03) * innerEdge * density * 0.3;

          gl_FragColor = vec4(base, shape);
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
    const fpsInterval = 1000 / 15; // 15 FPS universal — clouds drift slowly, no need for more

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
