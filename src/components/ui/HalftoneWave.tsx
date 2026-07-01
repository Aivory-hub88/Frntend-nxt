'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export function HalftoneWave() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const rect = mountRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const scene = new THREE.Scene();
    
    // True 3D perspective
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 15;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    
    const isMobile = window.innerWidth < 1024;
    renderer.setPixelRatio(isMobile ? 0.75 : Math.min(window.devicePixelRatio, 1.5));
    
    mountRef.current.appendChild(renderer.domElement);

    const uniforms = {
      uTime: { value: 0.0 },
      uResolution: { value: new THREE.Vector2(width, height) },
      uPixelSize: { value: isMobile ? 5.0 : 6.0 }, 
      uScroll: { value: 0.0 } // Used to trigger the spreading petals effect
    };

    // ==========================================
    // SHARED ASCII FRAGMENT SHADER
    // ==========================================
    const asciiFragShader = `
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        varying float vDepth;
        varying vec3 vLocalPos;

        uniform float uPixelSize;
        uniform vec2 uResolution;
        uniform float uScroll;
        uniform float uTime;

        void main() {
          // 1. LIGHTING & DENSITY
          vec3 normal = normalize(vNormal);
          vec3 viewDir = normalize(vViewPosition);
          
          float normalizedDepth = smoothstep(2.0, 6.0, vDepth);
          
          // Elegant Rim Lighting for 3D depth
          float rim = 1.0 - max(0.0, dot(viewDir, normal));
          rim = smoothstep(0.5, 1.0, rim);
          
          float density = 1.0 - normalizedDepth + (rim * 0.3);
          density -= uScroll * 0.3; // Fade out slightly as it spreads
          density = clamp(density, 0.0, 1.0);
          
          // 2. ASCII SCREEN-SPACE GRID
          vec2 local = fract(gl_FragCoord.xy / uPixelSize);
          vec2 p5 = floor(local * 5.0); 
          
          int charIndex = int(floor(density * 5.99));
          float shape = 0.0;
          
          if (charIndex == 1) {
              if (p5.x == 2.0 && p5.y == 2.0) shape = 1.0;
          } else if (charIndex == 2) {
              if (p5.x == 2.0 && p5.y > 0.0 && p5.y < 4.0) shape = 1.0;
              if (p5.y == 2.0 && p5.x > 0.0 && p5.x < 4.0) shape = 1.0;
          } else if (charIndex == 3) {
              if (p5.x == p5.y && p5.x > 0.0 && p5.x < 4.0) shape = 1.0;
              if (p5.x == (4.0 - p5.y) && p5.x > 0.0 && p5.x < 4.0) shape = 1.0;
          } else if (charIndex == 4) {
              if ((p5.x == 1.0 || p5.x == 3.0) && p5.y >= 1.0 && p5.y <= 3.0) shape = 1.0;
              if ((p5.y == 1.0 || p5.y == 3.0) && p5.x >= 1.0 && p5.x <= 3.0) shape = 1.0;
          } else if (charIndex >= 5) {
              if (p5.x >= 1.0 && p5.x <= 3.0 && p5.y >= 1.0 && p5.y <= 3.0) shape = 1.0;
          }
          
          if (shape == 0.0) discard;
          
          // 3. ELEGANT COLOR MAPPING (Transition based on scroll)
          float scrollT = smoothstep(0.0, 0.4, uScroll);
          
          // Original Colors (Dimmed amber / Cyan / Purple)
          vec3 origCore = vec3(0.5, 0.25, 0.05);
          vec3 origEdge = vec3(0.02, 0.12, 0.22);
          vec3 origIndigo = vec3(0.12, 0.0, 0.25);
          
          // Hero Colors (Premium Elegance: Midnight Core / Deep Blue-Purple Edges)
          vec3 heroCore = vec3(0.01, 0.015, 0.03); // Deep midnight core
          vec3 heroEdge = vec3(0.10, 0.02, 0.45);  // Deep blue-purple edges (less red, more indigo)
          vec3 heroIndigo = vec3(0.1, 0.05, 0.2);  // Subtle purple/indigo glow
          
          vec3 coreColor = mix(heroCore, origCore, scrollT);
          vec3 edgeColor = mix(heroEdge, origEdge, scrollT);
          vec3 indigoColor = mix(heroIndigo, origIndigo, scrollT);
          
          // Base mix between core and edge
          vec3 finalColor = mix(coreColor, edgeColor, normalizedDepth + rim * 0.5);
          
          // Apply Indigo as a subtle additive glow
          float indigoGradient = smoothstep(0.2, 0.8, normalizedDepth + rim);
          finalColor += indigoColor * indigoGradient * 0.4;
          
          // 4. SPECTACULAR ORCHID PATTERN (Animated & Scroll-Reactive)
          float r = length(vLocalPos.xy);
          float angle = atan(vLocalPos.y, vLocalPos.x);
          
          // Animate outwards: subtract uTime from radius
          float outwardFlow = r - (uTime * 1.5); 
          
          // Scroll changes the pattern frequency/style
          float freqMix = mix(45.0, 20.0, scrollT); // Pattern becomes larger on scroll
          
          // Striations (stripes radiating from center)
          float striations = sin(angle * 25.0 + outwardFlow * 10.0);
          
          // Spots (cellular high-frequency noise)
          float spots = sin(vLocalPos.x * freqMix) * sin(vLocalPos.y * freqMix) * sin(vLocalPos.z * freqMix);
          
          // Low-frequency noise to create organic non-uniform clusters (Petal Blight / Botrytis look)
          float clump = sin(vLocalPos.x * 4.0) * sin(vLocalPos.y * 4.0) * sin(vLocalPos.z * 4.0);
          
          // Alternate noise variation for scroll transition
          float spots2 = cos(vLocalPos.x * 20.0 + uTime) * cos(vLocalPos.y * 20.0 + uTime);
          float currentSpots = mix(spots, spots2, scrollT);
          
          // Combine spots and striations, modulating threshold with clump to make irregular sizes
          float orchidPattern = smoothstep(0.7 - clump * 0.4, 1.0, currentSpots + striations * 0.15);
          
          // Premium Pattern Color: Elegant Deep Copper/Amber
          vec3 heroPatternColor = vec3(0.4, 0.15, 0.05); // Rich, subtle copper
          
          // Fade pattern near the edges/rim for depth, AND fade out completely on scroll
          float patternIntensity = orchidPattern * (1.0 - rim) * smoothstep(0.9, 0.1, normalizedDepth);
          patternIntensity *= (1.0 - scrollT); // Disappears entirely when scrolling down
          
          // Mix the elegant pattern into the flower
          finalColor = mix(finalColor, heroPatternColor, patternIntensity * 0.85);

          gl_FragColor = vec4(finalColor, 1.0);
        }
    `;

    // ==========================================
    // 1. MAIN 6-LOBE FLOWER (Base)
    // ==========================================
    const geometry = new THREE.SphereGeometry(1, 256, 256);
    const material = new THREE.ShaderMaterial({
      uniforms,
      side: THREE.FrontSide, 
      transparent: true,
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        varying float vDepth; 
        varying vec3 vLocalPos;
        uniform float uTime;
        uniform float uScroll;

        // --- SANTIAGO SARES ORCHID MATH ---
        float getOrchidDepth(vec3 p, float timeVal) {
            float theta = atan(p.z, p.x);
            float phi = acos(p.y);
            
            // Reverting to the elegant 6-lobe mathematical flower
            float numPetals = 6.0;
            float petal = abs(sin(theta * (numPetals / 2.0)));
            float taper = sin(phi);
            float breathing = sin(timeVal * 0.5 + phi * 2.0) * 0.1;
            
            // Keep a touch of Sares fluid turbulence so it breathes organically
            float noise = sin(p.x * 5.0 + timeVal) * sin(p.y * 6.0 - timeVal * 0.5) * sin(p.z * 4.0 + timeVal * 0.8);
            float turbulence = noise * 0.08; // Tamed down for a more subtle organic feel
            
            return (petal * taper) + breathing + turbulence;
        }
        // -----------------------------------

        void main() {
          vec3 p = normalize(position);
          
          float petalDepth = getOrchidDepth(p, uTime);

          // Add an idle bloom so it pulses beautifully even before scrolling
          float idleBloom = (sin(uTime * 1.5) * 0.5 + 0.5) * 0.1;
          float spread = smoothstep(0.0, 1.0, uScroll) + (idleBloom * (1.0 - smoothstep(0.0, 1.0, uScroll)));
          
          float radius = 2.5 + (petalDepth * 2.0) + (petalDepth * spread * 3.0);
          float bend = spread * 1.5;
          
          vec3 displacedPos = p * radius;
          displacedPos.y -= bend * petalDepth;

          vDepth = radius; 
          
          vec4 mvPosition = modelViewMatrix * vec4(displacedPos, 1.0);
          vViewPosition = -mvPosition.xyz;
          
          vNormal = normalMatrix * normalize(displacedPos);
          vLocalPos = position;
          
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: asciiFragShader
    });
    const mesh = new THREE.Mesh(geometry, material);

    // ==========================================
    // (Flying petals have been completely removed per user request)
    // ==========================================

    const group = new THREE.Group();
    group.add(mesh);
    scene.add(group);

    // Scroll Transition Setup
    // Start position: Shifted down gently
    const startX = 0;
    const startY = isMobile ? -0.5 : -1.0; 
    const endX = isMobile ? 0 : 5;
    const endY = isMobile ? 3 : -1;

    // Initial positioning (Immersive, framing the text from below)
    group.position.set(startX, startY, 0);
    group.scale.set(1.6, 1.6, 1.6); 

    // Scroll mapping state
    let targetScroll = 0;
    let targetRotationX = 0.5; 
    let targetX = startX;
    let targetY = startY;
    let targetScale = 1.6;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      
      // Calculate transition progress (0 to 1 over 800px scroll)
      const progress = Math.min(scrollY / 800, 1.0);
      
      targetX = startX + (endX - startX) * progress;
      targetY = startY + (endY - startY) * progress;
      targetScale = 1.6 - (0.6 * progress); // Shrink perfectly back from 1.6 to 1.0

      targetScroll = Math.min(scrollY / 1500, 1.0);
      targetRotationX = 0.5 + (scrollY * 0.001);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const clock = new THREE.Clock();
    let animationFrameId: number;
    let isVisible = true;

    // --- Interactive Mouse Drag Setup ---
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let dragRotationX = 0;
    let dragRotationY = 0;
    let targetDragRotationX = 0;
    let targetDragRotationY = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
      if (mountRef.current) mountRef.current.style.cursor = 'grabbing';
    };

    const onPointerMove = (e: PointerEvent) => {
      if (isDragging) {
        const deltaMove = {
          x: e.clientX - previousMousePosition.x,
          y: e.clientY - previousMousePosition.y
        };
        // Mouse direction translation to rotation
        targetDragRotationY += deltaMove.x * 0.005;
        targetDragRotationX += deltaMove.y * 0.005;
        previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    };

    const onPointerUp = () => {
      isDragging = false;
      if (mountRef.current) mountRef.current.style.cursor = 'grab';
    };

    const canvas = renderer.domElement;
    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    if (mountRef.current) mountRef.current.style.cursor = 'grab';
    // -------------------------------------

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.0 });
    observer.observe(renderer.domElement);

    const renderLoop = (timestamp: number) => {
      animationFrameId = requestAnimationFrame(renderLoop);
      if (isVisible) {
        const time = clock.getElapsedTime();
        uniforms.uTime.value = time;
        
        // Immersive gentle floating motion when in Hero (progress = 0)
        // We use (1.0 - Math.min(targetScroll * 5.0, 1.0)) to fade out the float as user scrolls
        const floatIntensity = Math.max(0, 1.0 - (window.scrollY / 400));
        const floatY = Math.sin(time * 1.5) * 0.2 * floatIntensity; 
        const floatRot = Math.cos(time * 0.8) * 0.08 * floatIntensity;

        // --- Smooth Drag Interpolation & Auto-Return ---
        dragRotationX += (targetDragRotationX - dragRotationX) * 0.1;
        dragRotationY += (targetDragRotationY - dragRotationY) * 0.1;
        if (!isDragging) {
          targetDragRotationX *= 0.92; // Spring back gracefully to origin
          targetDragRotationY *= 0.92;
        }

        // Lock the Y-axis facing direction, add mouse drag offset, spin on Z-axis (pinwheel)
        group.rotation.y = (Math.PI / 1.5) + (floatRot * 0.5) + dragRotationY;
        group.rotation.z = time * 0.15; // Counter-clockwise pinwheel spin
        
        uniforms.uScroll.value += (targetScroll - uniforms.uScroll.value) * 0.05;
        group.rotation.x += (targetRotationX - group.rotation.x) * 0.05 + dragRotationX; // Smooth X tilt on scroll + mouse drag
        
        // Smoothly interpolate position and scale
        group.position.x += (targetX - group.position.x) * 0.05;
        group.position.y += (targetY + floatY - group.position.y) * 0.05;
        const currentScale = group.scale.x + (targetScale - group.scale.x) * 0.05;
        group.scale.set(currentScale, currentScale, currentScale);

        renderer.render(scene, camera);
      }
    };
    renderLoop(0);

    const handleResize = () => {
      if (!mountRef.current) return;
      const rect = mountRef.current.getBoundingClientRect();
      renderer.setSize(rect.width, rect.height);
      camera.aspect = rect.width / rect.height;
      camera.updateProjectionMatrix();
      uniforms.uResolution.value.set(rect.width, rect.height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      petalGeo.dispose();
      petalMat.dispose();
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
