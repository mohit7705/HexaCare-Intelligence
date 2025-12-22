import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { TorusKnot, Environment, Float } from '@react-three/drei';
import * as THREE from 'three';

const AnimatedKnot = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.15;
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <TorusKnot ref={meshRef} args={[10, 3, 256, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#2069E0"
          emissive="#0A1A2F"
          roughness={0.1}
          metalness={0.9}
          wireframe={true}
        />
      </TorusKnot>
    </Float>
  );
};

const Hero3DBackground = () => {
  return (
    /* Changed to fixed and h-screen to stay in background everywhere */
    <div className="fixed inset-0 -z-10 h-screen w-full overflow-hidden bg-white">
      <Canvas camera={{ position: [0, 0, 35], fov: 45 }} gl={{ alpha: true }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={2} color="#4AB3FF" />
        <pointLight position={[-10, -10, -10]} intensity={1.5} color="#2069E0" />
        <AnimatedKnot />
        <Environment preset="city" />
      </Canvas>
      
      {/* Subtle overlay for better readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/90 pointer-events-none"></div>
    </div>
  );
};

export default Hero3DBackground;