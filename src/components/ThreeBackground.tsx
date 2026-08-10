import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { usePortfolio, ThemeMode } from '../context/PortfolioContext';

interface ThemeColorPalette {
  fog: number;
  light1: number;
  light2: number;
  knotEmissive: number;
  particles: [number, number, number];
}

const THEME_PALETTES: Record<ThemeMode, ThemeColorPalette> = {
  cyber: {
    fog: 0x0a0d14,
    light1: 0x38bdf8,
    light2: 0xa855f7,
    knotEmissive: 0x0284c7,
    particles: [0x38bdf8, 0x818cf8, 0xc084fc]
  },
  emerald: {
    fog: 0x04120e,
    light1: 0x10b981,
    light2: 0x14b8a6,
    knotEmissive: 0x059669,
    particles: [0x34d399, 0x6ee7b7, 0x2dd4bf]
  },
  sunset: {
    fog: 0x12091c,
    light1: 0xec4899,
    light2: 0xf59e0b,
    knotEmissive: 0xc026d3,
    particles: [0xf472b6, 0xa855f7, 0xfbbf24]
  },
  light: {
    fog: 0xe2e8f0,
    light1: 0x0284c7,
    light2: 0x6366f1,
    knotEmissive: 0x0284c7,
    particles: [0x0284c7, 0x4f46e5, 0x0ea5e9]
  }
};

export const ThreeBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { themeMode } = usePortfolio();
  const themeModeRef = useRef<ThemeMode>(themeMode);

  // Keep ref up to date for animation loop
  useEffect(() => {
    themeModeRef.current = themeMode;
  }, [themeMode]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    const initialPalette = THEME_PALETTES[themeModeRef.current];
    const fogExp = new THREE.FogExp2(initialPalette.fog, 0.018);
    scene.fog = fogExp;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 25;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group for 3D world
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(initialPalette.light1, 4, 60);
    pointLight1.position.set(15, 15, 15);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(initialPalette.light2, 4, 60);
    pointLight2.position.set(-15, -15, -15);
    scene.add(pointLight2);

    // 1. Torus Knot Mesh
    const knotGeometry = new THREE.TorusKnotGeometry(5.5, 1.6, 120, 16);
    const knotMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.2,
      metalness: 0.8,
      wireframe: true,
      emissive: initialPalette.knotEmissive,
      emissiveIntensity: 0.35,
    });
    const knotMesh = new THREE.Mesh(knotGeometry, knotMaterial);
    knotMesh.position.set(10, 2, -5);
    mainGroup.add(knotMesh);

    // 2. Dynamic Moving Particle Field (600 Particles)
    const particleCount = 600;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const targetColors = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    const tempColor = new THREE.Color();

    for (let i = 0; i < particleCount; i++) {
      // Spread positions
      positions[i * 3] = (Math.random() - 0.5) * 90;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 90;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 90;

      // Moving velocity vector for continuous drifting particles
      velocities[i * 3] = (Math.random() - 0.5) * 0.04; // drift X
      velocities[i * 3 + 1] = Math.random() * 0.04 + 0.015; // upward drift Y
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.04; // drift Z

      // Initial theme colors
      const paletteHex = initialPalette.particles[i % initialPalette.particles.length];
      tempColor.setHex(paletteHex);
      colors[i * 3] = tempColor.r;
      colors[i * 3 + 1] = tempColor.g;
      colors[i * 3 + 2] = tempColor.b;

      targetColors[i * 3] = tempColor.r;
      targetColors[i * 3 + 1] = tempColor.g;
      targetColors[i * 3 + 2] = tempColor.b;

      scales[i] = Math.random() * 0.8 + 0.2;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.45,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    mainGroup.add(particleSystem);

    // 3. Floating Polyhedrons
    const floatGeosGroup = new THREE.Group();
    const icoGeo = new THREE.IcosahedronGeometry(1.8, 0);
    const icoMat = new THREE.MeshPhongMaterial({
      color: initialPalette.light1,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });

    for (let i = 0; i < 8; i++) {
      const mesh = new THREE.Mesh(icoGeo, icoMat);
      mesh.position.set(
        (Math.random() - 0.5) * 45,
        (Math.random() - 0.5) * 35,
        (Math.random() - 0.5) * 25
      );
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      floatGeosGroup.add(mesh);
    }
    mainGroup.add(floatGeosGroup);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize handling
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Helper Color Objects for Smooth Morph Lerping
    const curFogColor = new THREE.Color(initialPalette.fog);
    const curLight1 = new THREE.Color(initialPalette.light1);
    const curLight2 = new THREE.Color(initialPalette.light2);
    const curKnotEmissive = new THREE.Color(initialPalette.knotEmissive);

    const targetFogColor = new THREE.Color(initialPalette.fog);
    const targetLight1 = new THREE.Color(initialPalette.light1);
    const targetLight2 = new THREE.Color(initialPalette.light2);
    const targetKnotEmissive = new THREE.Color(initialPalette.knotEmissive);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // 1. Update theme targets based on themeModeRef
      const activePalette = THEME_PALETTES[themeModeRef.current];
      targetFogColor.setHex(activePalette.fog);
      targetLight1.setHex(activePalette.light1);
      targetLight2.setHex(activePalette.light2);
      targetKnotEmissive.setHex(activePalette.knotEmissive);

      // Smooth color lerping (0.04 speed)
      curFogColor.lerp(targetFogColor, 0.04);
      curLight1.lerp(targetLight1, 0.04);
      curLight2.lerp(targetLight2, 0.04);
      curKnotEmissive.lerp(targetKnotEmissive, 0.04);

      fogExp.color.copy(curFogColor);
      pointLight1.color.copy(curLight1);
      pointLight2.color.copy(curLight2);
      knotMaterial.emissive.copy(curKnotEmissive);
      icoMat.color.copy(curLight1);

      // 2. Particle Color Lerping & Position Physics
      const posAttr = particleGeometry.attributes.position as THREE.BufferAttribute;
      const colAttr = particleGeometry.attributes.color as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;
      const colArray = colAttr.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        // Target particle color from active theme palette
        const targetHex = activePalette.particles[i % activePalette.particles.length];
        tempColor.setHex(targetHex);

        // Lerp color channels
        colArray[i * 3] += (tempColor.r - colArray[i * 3]) * 0.04;
        colArray[i * 3 + 1] += (tempColor.g - colArray[i * 3 + 1]) * 0.04;
        colArray[i * 3 + 2] += (tempColor.b - colArray[i * 3 + 2]) * 0.04;

        // Continuous particle movement physics
        posArray[i * 3] += velocities[i * 3] + Math.sin(elapsedTime * 0.5 + i) * 0.01;
        posArray[i * 3 + 1] += velocities[i * 3 + 1];
        posArray[i * 3 + 2] += velocities[i * 3 + 2] + Math.cos(elapsedTime * 0.5 + i) * 0.01;

        // Boundary wrap around for upward drifting particles
        if (posArray[i * 3 + 1] > 45) {
          posArray[i * 3 + 1] = -45;
          posArray[i * 3] = (Math.random() - 0.5) * 90;
        }
        if (posArray[i * 3] > 45) posArray[i * 3] = -45;
        if (posArray[i * 3] < -45) posArray[i * 3] = 45;
      }

      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;

      // 3. Smooth Mouse Lerp and Scene Motion
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      mainGroup.rotation.y = elapsedTime * 0.06 + targetX * 0.25;
      mainGroup.rotation.x = Math.sin(elapsedTime * 0.04) * 0.08 - targetY * 0.25;

      knotMesh.rotation.x = elapsedTime * 0.15;
      knotMesh.rotation.y = elapsedTime * 0.25;

      floatGeosGroup.children.forEach((child, index) => {
        child.rotation.x += 0.004 * (index + 1);
        child.rotation.y += 0.006 * (index + 1);
        child.position.y += Math.sin(elapsedTime * 1.5 + index) * 0.012;
      });

      // Point lights circular orbit
      pointLight1.position.x = Math.sin(elapsedTime * 0.6) * 22;
      pointLight1.position.y = Math.cos(elapsedTime * 0.4) * 22;

      pointLight2.position.x = Math.cos(elapsedTime * 0.5) * 22;
      pointLight2.position.y = Math.sin(elapsedTime * 0.7) * 22;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      scene.clear();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-all duration-700">
      <div ref={containerRef} className="w-full h-full" />
      {/* Background Overlay Gradients with theme adaptability */}
      <div className="absolute inset-0 bg-radial-gradient opacity-80" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-950/20 via-slate-950/80 to-slate-950 pointer-events-none transition-all duration-700" />
    </div>
  );
};
