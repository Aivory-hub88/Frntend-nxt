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
    renderer.setPixelRatio(1);
    mountRef.current.appendChild(renderer.domElement);

    // Full screen quad
    const geometry = new THREE.PlaneGeometry(2, 2);

    const defaultTexture = new THREE.DataTexture(new Uint8Array([255, 255, 255, 255]), 1, 1, THREE.RGBAFormat);
    defaultTexture.needsUpdate = true;

    const uniforms = {
      uTime: { value: 0.0 },
      uColor: { value: new THREE.Color('#444444') },
      uResolution: { value: new THREE.Vector2(width, height) },
      uPixelSize: { value: 10.0 }, // 10px cells for clear ASCII characters
      uTexture: { value: defaultTexture }
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

        float getCloudLayer(sampler2D tex, vec2 cell, float scale, float speed, vec2 offset, float time) {
            // Base continuous coordinates
            float baseMovingX = cell.x * scale + offset.x - time * speed;
            float baseY = cell.y * (scale * 1.21) + offset.y;
            
            // 1. ORGANIC SCATTERING (NO VERTICAL BOBBING)
            // To completely break the "linear/neat" rows without adding time-based bobbing,
            // we give each individual cloud (tile) a static random X and Y offset!
            
            // First, get the row to apply a random X stagger
            float row = floor(baseY);
            float randomXOffset = fract(sin(row * 12.9898 + scale * 78.233) * 43758.5453) * 5.0; // wider X scatter
            
            float finalX = baseMovingX + randomXOffset;
            float col = floor(finalX);
            
            // Now, use the column and row to generate a unique random Y offset for this specific cloud.
            // This permanently shifts the cloud up or down within its tile, breaking the straight line!
            float randomYOffset = (fract(sin(col * 43.123 + row * 12.312 + scale) * 12345.0) - 0.5) * 0.5; // -0.25 to +0.25
            
            float finalY = baseY + randomYOffset;
            
            // Get local coordinates within the tile
            float localX = fract(finalX);
            float localY = fract(finalY);
            
            // 2. WIND RIPPLE (DYNAMIC SHAPE DEFORMATION)
            // Gently warp the internal coordinates so the clouds look gaseous and evolving,
            // like real clouds constantly shifting shape in the wind.
            float warpedX = localX + sin(localY * 12.0 - time * 1.5) * 0.025;
            float warpedY = localY + cos(localX * 12.0 + time * 1.2) * 0.025;
            
            // The original image has huge empty margins. Crop to the middle 82.5% (0.0875 to 0.9125)
            float croppedY = mix(0.0875, 0.9125, warpedY);
            
            // Soften the edges to prevent any hard seams if the cloud touches the tile boundary
            // Use the unwarped local coordinates for the mask so the boundary stays rigid and safe!
            float edgeMask = smoothstep(0.0, 0.05, localX) * smoothstep(1.0, 0.95, localX);
            edgeMask *= smoothstep(0.0, 0.1, localY) * smoothstep(1.0, 0.9, localY);
            
            float texVal = texture2D(tex, vec2(warpedX, croppedY)).r;
            return (1.0 - texVal) * edgeMask;
        }

        void main() {
          // Cell coordinates for the macro grids (ASCII characters)
          vec2 cell = floor(gl_FragCoord.xy / uPixelSize);
          
          // Local coordinates within the cell [0, 1]
          vec2 local = fract(gl_FragCoord.xy / uPixelSize);

          // 1. MULTI-LAYERED PARALLAX CLOUD SKY (Exaggerated Parallax for intense 3D depth)
          float l1 = getCloudLayer(uTexture, cell, 0.071, 0.01, vec2(0.0, 0.0), uTime);   // Background: Very Slow
          float l2 = getCloudLayer(uTexture, cell, 0.048, 0.03, vec2(0.33, 0.7), uTime);  // Mid-BG: Slow
          float l3 = getCloudLayer(uTexture, cell, 0.028, 0.08, vec2(0.66, 0.2), uTime);  // Mid-FG: Fast
          float l4 = getCloudLayer(uTexture, cell, 0.016, 0.20, vec2(0.1, 0.5), uTime);   // Foreground: Very Fast
          
          // 2. ATMOSPHERIC PERSPECTIVE COMPOSITING
          // We multiply each layer by a carefully chosen weight so they map to different ASCII characters!
          // l1 (0.30) -> maps to '.' (Far background dust)
          // l2 (0.45) -> maps to 'x' (Background clouds)
          // l3 (0.60) -> maps to '[]' (Midground clouds, hollow outlines)
          // l4 (1.00) -> maps to '■' (Foreground clouds, solid blocks)
          // Because they map to different characters, they will NEVER merge into a flat blob when they overlap!
          // This creates a stunning 3D spatial perspective with distinct depth layers.
          float density = max(max(max(l1 * 0.30, l2 * 0.45), l3 * 0.60), l4 * 1.00);
          
          // Smooth out slightly to generate a gradient that maps to the ASCII characters (+, x, [])
          density = smoothstep(0.05, 0.8, density);

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

          gl_FragColor = vec4(uColor, 1.0);
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
    const fpsInterval = 1000 / 30; // 30 FPS throttle

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
