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
            // Apply scale, but multiply Y scale by 1.54 to compensate for cropping the empty vertical space
            vec2 uv = cell * vec2(scale, scale * 1.54) + offset;
            
            // Stagger every other row to create an interlocking batik pattern.
            // This prevents massive vertical empty gaps and breaks the grid alignment!
            float row = floor(uv.y);
            uv.x += mod(row, 2.0) * 0.5;
            
            // Move horizontally
            uv.x -= time * speed;
            
            // Subtle overarching wave to make the pattern undulate slightly
            uv.y += sin(uv.x * 4.0 + time * 0.5) * 0.03;
            
            // The original image has huge empty margins. Crop to the middle 65% (0.20 to 0.85) 
            // to reduce the density by 15% while keeping enough breathing room for depth.
            float croppedY = mix(0.20, 0.85, fract(uv.y));
            
            float texVal = texture2D(tex, vec2(fract(uv.x), croppedY)).r;
            return 1.0 - texVal;
        }

        void main() {
          // Cell coordinates for the macro grids (ASCII characters)
          vec2 cell = floor(gl_FragCoord.xy / uPixelSize);
          
          // Local coordinates within the cell [0, 1]
          vec2 local = fract(gl_FragCoord.xy / uPixelSize);

          // 1. MULTI-LAYERED PARALLAX CLOUD SKY
          float l1 = getCloudLayer(uTexture, cell, 0.052, 0.02, vec2(0.0, 0.0), uTime);
          float l2 = getCloudLayer(uTexture, cell, 0.035, 0.04, vec2(0.33, 0.7), uTime);
          float l3 = getCloudLayer(uTexture, cell, 0.021, 0.07, vec2(0.66, 0.2), uTime);
          float l4 = getCloudLayer(uTexture, cell, 0.012, 0.12, vec2(0.1, 0.5), uTime);
          
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
