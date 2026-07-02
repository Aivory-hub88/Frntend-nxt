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

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setSize(width, height);
    
    const isMobile = window.innerWidth < 1024;
    renderer.setPixelRatio(isMobile ? 0.5 : Math.min(window.devicePixelRatio, 1));
    
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
          vec3 origEdge = vec3(0.04, 0.18, 0.32);
          vec3 origIndigo = vec3(0.16, 0.02, 0.32);
          
          // Hero Colors (Premium Elegance: Midnight Core / Deep Blue-Purple Edges)
          // Core stays deep/dark so centered hero text over it remains readable;
          // the richer saturation lives on the petal edges / rim (outer areas).
          vec3 heroCore = vec3(0.02, 0.03, 0.06); // Deep midnight core (kept dark for text contrast)
          vec3 heroEdge = vec3(0.26, 0.14, 0.95);  // Richer blue-violet edges
          vec3 heroIndigo = vec3(0.34, 0.17, 0.62);  // Brighter purple/indigo glow
          
          vec3 coreColor = mix(heroCore, origCore, scrollT);
          vec3 edgeColor = mix(heroEdge, origEdge, scrollT);
          vec3 indigoColor = mix(heroIndigo, origIndigo, scrollT);
          
          // Base mix between core and edge
          vec3 finalColor = mix(coreColor, edgeColor, normalizedDepth + rim * 0.5);
          
          // Apply Indigo as a subtle additive glow (edges/rim only — keeps the
          // dark center intact so text stays readable).
          float indigoGradient = smoothstep(0.2, 0.8, normalizedDepth + rim);
          finalColor += indigoColor * indigoGradient * 0.55;
          // Subtle living color nuance — a soft violet <-> teal shimmer that
          // harmonizes with the midnight / indigo palette. Kept low so it never
          // looks monotone, and a touch stronger while the flower moves (scroll).
          vec3 accentA = vec3(0.42, 0.22, 0.80); // richer violet
          vec3 accentB = vec3(0.12, 0.42, 0.60); // richer teal
          float shimmer = 0.5 + 0.5 * sin(uTime * 0.6 + vLocalPos.y * 3.0 + vLocalPos.x * 2.0);
          vec3 accent = mix(accentA, accentB, shimmer);
          // More noticeable now: ~2x amount, and applied across the whole
          // bloom (not just the rim) with edges still a touch stronger.
          float accentGate = mix(0.5, 1.0, indigoGradient);
          finalColor += accent * ((0.11 + uScroll * 0.12) * accentGate);
          
          // 4. SPECTACULAR ORCHID PATTERN (Removed per user request)
          // The flower is now purely a smooth, elegant geometric 3D shape
          // without any halftone dots or stripping overlay.
          
          gl_FragColor = vec4(finalColor, 1.0);
        }
    `;

    // ==========================================
    // 1. MAIN 6-LOBE FLOWER (Base)
    // ==========================================
    const geometry = new THREE.SphereGeometry(1, 96, 96);
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
            
            // Keep a touch of Sares fluid turbulence so it breathes organically.
            float noise = sin(p.x * 5.0 + timeVal) * sin(p.y * 6.0 - timeVal * 0.5) * sin(p.z * 4.0 + timeVal * 0.8);
            // Gentler amplitude, and it fades further as the flower spreads on
            // scroll — keeps the petal silhouette clean and pretty in motion.
            float turbulence = noise * 0.042 * (1.0 - uScroll * 0.78);
            
            return (petal * taper) + breathing + turbulence;
        }
        // -----------------------------------

        void main() {
          vec3 p = normalize(position);
          
          float petalDepth = getOrchidDepth(p, uTime);

          // Add an idle bloom so it pulses beautifully even before scrolling
          float idleBloom = (sin(uTime * 1.5) * 0.5 + 0.5) * 0.1;
          float spread = smoothstep(0.0, 1.0, uScroll) + (idleBloom * (1.0 - smoothstep(0.0, 1.0, uScroll)));
          
          float radius = 2.5 + (petalDepth * 2.0) + (petalDepth * spread * 1.5);
          float bend = spread * 0.8;
          
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
    // Start position: Shifted up slightly
    const startX = 0;
    const startY = isMobile ? -0.2 : -0.3; 
    const endX = isMobile ? 0 : 5;
    const endY = isMobile ? 3 : -0.2;

    // Initial positioning (Immersive, framing the text from below)
    group.position.set(startX, startY, 0);
    group.scale.set(1.6, 1.6, 1.6); 

    // Scroll mapping state
    let targetScroll = 0;
    let targetRotationX = 0.5; 
    let currentScrollRotationX = 0.5;
    let targetX = startX;
    let targetY = startY;
    let targetScale = 1.6;

    // ── Cached section anchors (layout read only on mount / resize) ──
    // Reading getBoundingClientRect() on every scroll event forced a
    // synchronous reflow of the whole zoomed+sticky+WebGL page — the cause of
    // the scroll stutter. We cache the anchor offsets instead.
    let centerAt = Infinity;
    let rightAt = Infinity;
    const computeAnchors = () => {
      const vh = window.innerHeight;
      const showcaseEl = document.getElementById('showcase');
      if (showcaseEl) {
        const scTop = showcaseEl.getBoundingClientRect().top + window.scrollY;
        centerAt = scTop - vh * 0.45; // Operational Framework becomes active → center
      }
      const langEl = document.getElementById('agent-language');
      if (langEl) {
        const lgTop = langEl.getBoundingClientRect().top + window.scrollY;
        rightAt = lgTop - vh * 0.45; // "speaks your customer's language" → right
      }
    };

    const handleScroll = () => {
      const scrollY = window.scrollY;
      
      // Calculate transition progress (0 to 1 over 800px scroll)
      const progress = Math.min(scrollY / 800, 1.0);
      
      targetY = startY + (endY - startY) * progress;
      targetScale = 1.6 - (0.6 * progress); // Shrink perfectly back from 1.6 to 1.0

      targetScroll = Math.min(scrollY / 1500, 1.0);
      targetRotationX = 0.5 + (scrollY * 0.001);

      // ── Section-aware horizontal choreography ──────────────────────────
      // Hero exit → flower drifts right. At the "Operational Framework"
      // section (#showcase) it returns to CENTER, then eases back to the RIGHT
      // as the "speaks your customer's language" section (#agent-language)
      // becomes active.
      if (endX === 0) {
        targetX = startX; // Mobile: keep centered throughout
        return;
      }
      const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
      const smooth = (e0: number, e1: number, v: number) => {
        if (e1 <= e0) return v >= e1 ? 1 : 0;
        const t = Math.min(Math.max((v - e0) / (e1 - e0), 0), 1);
        return t * t * (3 - 2 * t);
      };
      const heroX = startX + (endX - startX) * progress; // hero → right
      let x = heroX;
      if (centerAt !== Infinity) {
        if (rightAt !== Infinity && scrollY >= rightAt) {
          x = endX; // "speaks your customer's language" section → right
        } else if (scrollY >= centerAt) {
          if (rightAt !== Infinity) {
            // Stay centered through the middle, then ease center → right over
            // the last stretch (max 600px) before the language section.
            const band = Math.min(600, Math.max(1, rightAt - centerAt));
            x = lerp(0, endX, smooth(rightAt - band, rightAt, scrollY));
          } else {
            x = 0; // Operational Framework → center (no right anchor found)
          }
        } else {
          const band = Math.min(600, Math.max(1, centerAt));
          x = lerp(heroX, 0, smooth(centerAt - band, centerAt, scrollY)); // right → center
        }
      }
      targetX = x;
    };

    let scrollTicking = false;
    const onScroll = () => {
      if (!scrollTicking) {
        scrollTicking = true;
        requestAnimationFrame(() => { scrollTicking = false; handleScroll(); });
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    computeAnchors();
    handleScroll();
    // Recompute once more after layout settles (fonts / lazy 3D canvases / images).
    const anchorTimer = window.setTimeout(computeAnchors, 1200);

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
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;
      
      targetDragRotationY += deltaX * 0.003; // Base rotation speed (reduced for subtlety)
      targetDragRotationX += deltaY * 0.003;
      
      previousMousePosition = { x: e.clientX, y: e.clientY };
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
        dragRotationX += (targetDragRotationX - dragRotationX) * 0.08;
        dragRotationY += (targetDragRotationY - dragRotationY) * 0.08;
        if (!isDragging) {
          targetDragRotationX *= 0.95; // Graceful auto-center
          targetDragRotationY *= 0.95;
        }

        // Lock the Y-axis facing direction, add mouse drag offset, spin on Z-axis (pinwheel)
        group.rotation.y = (Math.PI / 1.5) + (floatRot * 0.5) + dragRotationY;
        group.rotation.z = time * 0.15; // Counter-clockwise pinwheel spin
        
        uniforms.uScroll.value += (targetScroll - uniforms.uScroll.value) * 0.05;
        
        // Smoothly interpolate scroll rotation separately, then add drag as a positional offset
        currentScrollRotationX += (targetRotationX - currentScrollRotationX) * 0.05;
        group.rotation.x = currentScrollRotationX + dragRotationX;
        
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
      computeAnchors();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(anchorTimer);
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
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
      className="absolute inset-0 z-0"
      style={{ overflow: 'hidden' }}
    />
  );
}
