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

    const uniforms = {
      uTime: { value: 0.0 },
      uColor: { value: new THREE.Color('#444444') },
      uResolution: { value: new THREE.Vector2(width, height) },
      uPixelSize: { value: 10.0 } // 10px cells for clear ASCII characters
    };

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

        // Simplex 2D noise
        vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
        float snoise(vec2 v){
          const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                   -0.577350269189626, 0.024390243902439);
          vec2 i  = floor(v + dot(v, C.yy) );
          vec2 x0 = v -   i + dot(i, C.xx);
          vec2 i1;
          i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod(i, 289.0);
          vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
          + i.x + vec3(0.0, i1.x, 1.0 ));
          vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
            dot(x12.zw,x12.zw)), 0.0);
          m = m*m ;
          m = m*m ;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
          vec3 g;
          g.x  = a0.x  * x0.x  + h.x  * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }

        // 3-octave Fractal Brownian Motion (for macro)
        float fbm3(vec2 p) {
            float f = 0.0;
            float w = 0.5;
            for (int i = 0; i < 3; i++) {
                f += w * snoise(p);
                p *= 2.0;
                w *= 0.5;
            }
            return f;
        }

        // 2-octave Fractal Brownian Motion (for micro)
        float fbm2(vec2 p) {
            float f = 0.0;
            float w = 0.5;
            for (int i = 0; i < 2; i++) {
                f += w * snoise(p);
                p *= 2.0;
                w *= 0.5;
            }
            return f;
        }

        void main() {
          // Cell coordinates for the macro grids (ASCII characters)
          vec2 cell = floor(gl_FragCoord.xy / uPixelSize);
          
          // Local coordinates within the cell [0, 1]
          vec2 local = fract(gl_FragCoord.xy / uPixelSize);

          // 1. MEGAMENDUNG EXPLICIT SDF (No noise melting, 100% crisp geometry)
          // We define a perfect mathematical Megamendung cloud using distance fields
          vec2 p = cell * 0.012;
          p.x -= uTime * 0.015; // scroll left
          
          // Gentle overarching wave to make the whole pattern undulate like a sky
          p.y += sin(p.x * 2.0 + uTime * 0.3) * 0.05;
          
          // Grid spacing
          float spacingX = 1.1;
          float spacingY = 0.7;
          
          vec2 gridId = floor(vec2(p.x / spacingX, p.y / spacingY));
          
          // Stagger every other row to interlock the clouds (typical in batik)
          float stagger = mod(gridId.y, 2.0) * 0.5 * spacingX;
          
          vec2 localP = vec2(
              mod(p.x - stagger, spacingX) - spacingX * 0.5,
              mod(p.y, spacingY) - spacingY * 0.5
          );
          
          // 2. BUILD THE CLOUD SHAPE (Using 5 overlapping circles for the bumps)
          // Main center head (highest point)
          float d1 = length(localP - vec2(-0.15, 0.10)) - 0.18;
          // Second bump (cascading down to the right)
          float d2 = length(localP - vec2(0.05, 0.02)) - 0.16;
          // Third bump (tail end)
          float d3 = length(localP - vec2(0.22, -0.05)) - 0.13;
          // Fourth bump (far tail tip)
          float d4 = length(localP - vec2(0.38, -0.12)) - 0.09;
          // Front hook (curling inwards on the left)
          float d5 = length(localP - vec2(-0.35, -0.02)) - 0.13;
          
          // Union of the top bumps (takes the minimum distance)
          float d = min(d1, min(d2, min(d3, min(d4, d5))));
          
          // 3. SWEEPING BOTTOM CURVE
          // Megamendung has a distinct continuous curved bottom line.
          float bottomCurve = -0.12 + localP.x * -0.1 + (localP.x * localP.x) * 0.4;
          float dBottom = bottomCurve - localP.y;
          
          // Intersect the top bumps with the bottom boundary
          d = max(d, dBottom);
          
          // 4. MEGAMENDUNG BANDS & ASCII SHADING
          // d is negative inside the cloud, 0 at the boundary.
          // Multiply by a factor to get the number of bands (22.0 gives ~3-4 bands in the center)
          float bands = d * -22.0; 
          
          // Calculate the gradation inside the band
          float gradation = fract(bands);
          
          // Create the smooth ASCII gradient (spanning 0.0 to 1.0) 
          // and a sharp nested outline at the edge of each band
          float layerDensity = smoothstep(0.0, 0.85, gradation);
          layerDensity *= smoothstep(1.0, 0.85, gradation);
          
          // Mask: Only show the cloud where d < 0 (inside the SDF)
          // To make the outermost edge perfectly sharp, we use a step function.
          float mask = step(d, 0.0);
          
          float density = layerDensity * mask;

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
