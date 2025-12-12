// components/Hero3DBackground.tsx
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { TorusKnot, Environment, Float } from '@react-three/drei';
import * as THREE from 'three';

// This is the actual 3D object
const AnimatedKnot = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  // This hook runs on every frame (like a game loop) to create animation
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Rotate the object slowly
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.6} floatIntensity={1}>
      <TorusKnot ref={meshRef} args={[9, 3, 256, 32]} position={[0, 0, 0]}>
        {/* A "tech" looking material: shiny blue wireframe over a solid core */}
        <meshStandardMaterial
          color="#2069E0" // Your brand's Tech Blue
          emissive="#0A1A2F" // A slight inner glow
          roughness={0.1}
          metalness={0.8}
          wireframe={true} // Try setting this to 'false' for a solid look!
        />
      </TorusKnot>
    </Float>
  );
};

const Hero3DBackground = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-techBlue/5">
      <Canvas camera={{ position: [0, 0, 30], fov: 50 }}>
        {/* Lights are essential for 3D objects to be visible */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#4AB3FF" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#2069E0" />

        {/* Add the animated 3D object */}
        <AnimatedKnot />

        {/* Adds realistic environment reflections */}
        <Environment preset="city" />
      </Canvas>
      
      {/* A gradient overlay to ensure text remains readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white/80 to-white/40 pointer-events-none"></div>
    </div>
  );
};

export default Hero3DBackground;