import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export interface SlideColorData {
  id: number;
  bgColor: string;
}

interface ThreeHeroCanvasProps {
  currentSlide: number;
  slideDirection: 'next' | 'prev';
  slides: SlideColorData[];
  mousePos: { x: number; y: number };
  onFallback: () => void;
}

// C1: Capability check before loading / running Three.js
export function checkThreeCapability(): boolean {
  if (typeof window === 'undefined') return false;
  // Reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  // Hardware concurrency: undefined or > 4
  if (navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 4) return false;
  // Device memory: undefined or > 4
  if ((navigator as any).deviceMemory !== undefined && (navigator as any).deviceMemory <= 4) return false;
  // WebGL test context
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return false;
  } catch {
    return false;
  }
  return true;
}

// Helper to convert hex string to THREE.Color
function hexToThreeColor(hex: string): THREE.Color {
  return new THREE.Color(hex);
}

// Offscreen circular soft particle texture
function createParticleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.3, 'rgba(233, 197, 105, 0.8)');
    gradient.addColorStop(0.7, 'rgba(250, 246, 236, 0.25)');
    gradient.addColorStop(1, 'rgba(250, 246, 236, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform vec3 uPrevColor;
  uniform vec3 uCurrColor;
  uniform float uProgress;
  uniform float uDirection;
  uniform vec2 uMouse;
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    // Subtle ambient shimmer in the background field
    float wave = sin(vUv.x * 3.5 + uTime * 0.7) * cos(vUv.y * 2.5 + uTime * 0.5) * 0.012;
    vec2 uv = vUv + vec2(wave) + uMouse * 0.015;

    // Directional colour wipe:
    // When next (uDirection > 0): sweeps in from right (1.0 down to 0.0)
    // When prev (uDirection < 0): sweeps in from left (0.0 up to 1.0)
    float sweep = uDirection > 0.0 ? (1.0 - uv.x) : uv.x;

    float feather = 0.20;
    float threshold = uProgress * (1.0 + feather);
    float mask = smoothstep(threshold - feather, threshold, sweep);

    vec3 color = mix(uPrevColor, uCurrColor, mask);
    gl_FragColor = vec4(color, 1.0);
  }
`;

export const ThreeHeroCanvas: React.FC<ThreeHeroCanvasProps> = ({
  currentSlide,
  slideDirection,
  slides,
  mousePos,
  onFallback,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Uniform and transition refs
  const prevSlideIndexRef = useRef(currentSlide);
  const transitionStartRef = useRef<number>(0);
  const transitionDuration = 700; // ms wipe duration
  const wipeProgressRef = useRef(1.0);
  const directionRef = useRef(slideDirection === 'next' ? 1.0 : -1.0);

  const prevColorRef = useRef(hexToThreeColor(slides[currentSlide]?.bgColor || '#F2B90D'));
  const currColorRef = useRef(hexToThreeColor(slides[currentSlide]?.bgColor || '#F2B90D'));

  // Performance degradation tracking (C3)
  const consecutiveSlowFramesRef = useRef(0);
  const hasHalvedParticlesRef = useRef(false);
  const isVisibleRef = useRef(true);
  const isTabActiveRef = useRef(true);

  // Trigger wipe animation on slide change
  useEffect(() => {
    if (currentSlide !== prevSlideIndexRef.current) {
      const prevColor = hexToThreeColor(slides[prevSlideIndexRef.current]?.bgColor || '#F2B90D');
      const currColor = hexToThreeColor(slides[currentSlide]?.bgColor || '#FAF6EC');

      prevColorRef.current = prevColor;
      currColorRef.current = currColor;

      directionRef.current = slideDirection === 'next' ? 1.0 : -1.0;
      transitionStartRef.current = performance.now();
      wipeProgressRef.current = 0.0;

      prevSlideIndexRef.current = currentSlide;
    }
  }, [currentSlide, slideDirection, slides]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Strict capability check (C1)
    if (!checkThreeCapability()) {
      onFallback();
      return;
    }

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || 580;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: false,
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(width, height);
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      renderer.domElement.style.display = 'block';
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;
    } catch {
      onFallback();
      return;
    }

    // 2. Background wipe quad
    const quadGeometry = new THREE.PlaneGeometry(2, 2);
    const quadUniforms = {
      uPrevColor: { value: prevColorRef.current },
      uCurrColor: { value: currColorRef.current },
      uProgress: { value: 1.0 },
      uDirection: { value: 1.0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uTime: { value: 0.0 },
    };

    const quadMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: quadUniforms,
      depthTest: false,
      depthWrite: false,
    });
    const quadMesh = new THREE.Mesh(quadGeometry, quadMaterial);
    scene.add(quadMesh);

    // 3. Particle system (72 gentle drifting golden & ivory embers)
    let particleCount = 72;
    let particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities = new Float32Array(particleCount * 3);
    const particlePhases = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 2.2;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 2.2;
      particlePositions[i * 3 + 2] = 0;

      particleVelocities[i * 3] = (Math.random() - 0.5) * 0.0008;
      particleVelocities[i * 3 + 1] = 0.0004 + Math.random() * 0.0008; // gentle rise
      particleVelocities[i * 3 + 2] = 0;

      particlePhases[i] = Math.random() * Math.PI * 2;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleTexture = createParticleTexture();
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.05,
      map: particleTexture,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // 4. C2: Visibility & Tab change listeners
    const handleVisibilityChange = () => {
      isTabActiveRef.current = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisibleRef.current = entry?.isIntersecting ?? true;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // 5. Resize handler
    const handleResize = () => {
      if (!container || !renderer) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || 580;
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // 6. Animation loop with C3 adaptive degradation
    let lastFrameTime = performance.now();
    let startTime = performance.now();

    const animate = (now: number) => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      // C2: Pause loop if tab is hidden or hero is out of view
      if (!isTabActiveRef.current || !isVisibleRef.current) {
        lastFrameTime = now;
        return;
      }

      // C3: Measure frame delta for adaptive degradation
      const delta = now - lastFrameTime;
      lastFrameTime = now;

      if (delta > 34) {
        consecutiveSlowFramesRef.current++;
        if (consecutiveSlowFramesRef.current >= 3) {
          if (!hasHalvedParticlesRef.current) {
            // First degradation: halve particles
            hasHalvedParticlesRef.current = true;
            consecutiveSlowFramesRef.current = 0;
            particleCount = Math.floor(particleCount / 2);
            particleGeometry.setDrawRange(0, particleCount);
          } else {
            // Second degradation: fall back to CSS hero
            if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
            onFallback();
            return;
          }
        }
      } else {
        consecutiveSlowFramesRef.current = 0;
      }

      const elapsed = (now - startTime) * 0.001;

      // Update wipe progress
      if (transitionStartRef.current > 0) {
        const transElapsed = now - transitionStartRef.current;
        const p = Math.min(1.0, transElapsed / transitionDuration);
        // Easing: cubic-bezier(0.25, 1, 0.5, 1) approx
        const easedP = 1.0 - Math.pow(1.0 - p, 3);
        wipeProgressRef.current = easedP;
      } else {
        wipeProgressRef.current = 1.0;
      }

      // Update shader uniforms
      quadUniforms.uPrevColor.value = prevColorRef.current;
      quadUniforms.uCurrColor.value = currColorRef.current;
      quadUniforms.uProgress.value = wipeProgressRef.current;
      quadUniforms.uDirection.value = directionRef.current;
      quadUniforms.uMouse.value.set(mousePos.x, mousePos.y);
      quadUniforms.uTime.value = elapsed;

      // Update particles
      const positions = particleGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        // Float upwards
        positions[i3 + 1] += particleVelocities[i3 + 1];
        // Sine wave lateral sway
        positions[i3] += Math.sin(elapsed * 1.5 + particlePhases[i]) * 0.0006 + particleVelocities[i3];

        // Wrap boundaries
        if (positions[i3 + 1] > 1.2) positions[i3 + 1] = -1.2;
        if (positions[i3] > 1.2) positions[i3] = -1.2;
        if (positions[i3] < -1.2) positions[i3] = 1.2;
      }
      particleGeometry.attributes.position.needsUpdate = true;

      // Subtle particle parallax with mouse
      particles.position.x = mousePos.x * 0.04;
      particles.position.y = mousePos.y * 0.04;

      renderer.render(scene, camera);
    };

    animFrameIdRef.current = requestAnimationFrame(animate);

    // C4: Cleanup function
    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();

      quadGeometry.dispose();
      quadMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      particleTexture.dispose();

      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      }
      rendererRef.current = null;
    };
  }, [onFallback]); // Initial setup on mount

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="three-hero-canvas-container absolute inset-0 pointer-events-none z-0 overflow-hidden"
    />
  );
};
