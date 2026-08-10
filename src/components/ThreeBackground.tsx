import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Props {
  mode?: 'knot' | 'particles' | 'grid';
}

export const ThreeBackground: React.FC<Props> = ({ mode = 'knot' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentMode, setCurrentMode] = useState<'knot' | 'particles' | 'grid'>(mode);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0d14, 0.02);

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

    // Group for objects
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x38bdf8, 4, 50);
    pointLight1.position.set(15, 15, 15);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xa855f7, 4, 50);
    pointLight2.position.set(-15, -15, -15);
    scene.add(pointLight2);

    // 1. Torus Knot Mesh
    const knotGeometry = new THREE.TorusKnotGeometry(6, 1.8, 120, 16);
    const knotMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.2,
      metalness: 0.8,
      wireframe: true,
      emissive: 0x0284c7,
      emissiveIntensity: 0.25,
    });
    const knotMesh = new THREE.Mesh(knotGeometry, knotMaterial);
    knotMesh.position.set(10, 2, -5);
    mainGroup.add(knotMesh);

    // 2. Particle Field
    const particleCount = 400;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorCyan = new THREE.Color(0x38bdf8);
    const colorPurple = new THREE.Color(0xa855f7);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 80;

      const mixedColor = colorCyan.clone().lerp(colorPurple, Math.random());
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.35,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    mainGroup.add(particleSystem);

    // 3. Floating Geometric Polyhedrons
    const floatGeosGroup = new THREE.Group();
    const icoGeo = new THREE.IcosahedronGeometry(2, 0);
    const icoMat = new THREE.MeshPhongMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });

    for (let i = 0; i < 6; i++) {
      const mesh = new THREE.Mesh(icoGeo, icoMat);
      mesh.position.set(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20
      );
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      floatGeosGroup.add(mesh);
    }
    mainGroup.add(floatGeosGroup);

    // Mouse movement interaction
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

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerp
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      // Group rotation
      mainGroup.rotation.y = elapsedTime * 0.08 + targetX * 0.3;
      mainGroup.rotation.x = Math.sin(elapsedTime * 0.05) * 0.1 - targetY * 0.3;

      // Individual mesh rotations
      knotMesh.rotation.x = elapsedTime * 0.2;
      knotMesh.rotation.y = elapsedTime * 0.3;

      // Floating geometries update
      floatGeosGroup.children.forEach((child, index) => {
        child.rotation.x += 0.005 * (index + 1);
        child.rotation.y += 0.008 * (index + 1);
        child.position.y += Math.sin(elapsedTime + index) * 0.01;
      });

      // Lights motion
      pointLight1.position.x = Math.sin(elapsedTime * 0.7) * 20;
      pointLight1.position.y = Math.cos(elapsedTime * 0.5) * 20;

      pointLight2.position.x = Math.cos(elapsedTime * 0.6) * 20;
      pointLight2.position.y = Math.sin(elapsedTime * 0.8) * 20;

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
  }, [currentMode]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div ref={containerRef} className="w-full h-full" />
      {/* Subtle overlay vignette for high contrast text readability */}
      <div className="absolute inset-0 bg-radial-gradient opacity-80" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-950/20 via-slate-950/80 to-slate-950 pointer-events-none" />
      
      {/* Mode Control Floating Badge */}
      <div className="absolute bottom-4 left-4 z-10 pointer-events-auto hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs text-slate-400 backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>WebGL 3D Canvas Active</span>
      </div>
    </div>
  );
};
