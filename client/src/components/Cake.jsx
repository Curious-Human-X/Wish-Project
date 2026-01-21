'use client';
import React, { useRef, useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Float, Stars, Environment, Html } from '@react-three/drei';
import * as THREE from 'three';
import confetti from 'canvas-confetti';

const BIRTHDAY_NAME = "NAME HERE"; // <--- EDIT THIS

// --- Asset Components ---

const StaticDecor = () => (
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      backgroundImage: 'url(/bg.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      opacity: 0.9
    }}
  />
);

function Candle({ position, isBlown, chargeLevel }) {
  const flameRef = useRef();
  const wickRef = useRef();

  useFrame((state) => {
    if (flameRef.current) {
      if (!isBlown) {
        // Dynamic flickering
        const time = state.clock.elapsedTime;
        const flicker = 1 + Math.sin(time * 10) * 0.1 + (Math.random() - 0.5) * 0.1;
        const windStrength = chargeLevel * 0.015; // Increased wind effect

        flameRef.current.scale.setScalar(flicker * (1 + windStrength * 0.5));
        flameRef.current.position.y = 1.1 + Math.sin(time * 20) * 0.02;

        // Wind tilt
        flameRef.current.rotation.x = Math.sin(time * 15) * windStrength + (Math.random() - 0.5) * windStrength;
        flameRef.current.rotation.z = Math.cos(time * 12) * windStrength;

        flameRef.current.material.emissiveIntensity = 2 + (chargeLevel * 0.1) + Math.sin(time * 5) * 0.5;
        flameRef.current.material.color.setHSL(0.08 + Math.sin(time) * 0.02, 1, 0.6);
      } else {
        flameRef.current.scale.lerp(new THREE.Vector3(0, 0, 0), 0.1);
      }
    }
  });

  return (
    <group position={position}>
      {/* Spiral Candle Body */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.04, 0.04, 1, 32]} />
        <meshStandardMaterial
          color="#ffcc00"
          roughness={0.2}
          metalness={0.1}
          emissive="#ffaa00"
          emissiveIntensity={0.2}
        />
      </mesh>
      {/* Spiral Stripe */}
      {/* Creating a spiral using multiple toruses or just a texture trick? 
          Let's use a simple helical stripe geometry by stacking rotated thin cylinders or toruses. 
          Actually simpler: Just use a helix tube. */}
      {[...Array(10)].map((_, i) => (
        <mesh key={i} position={[0, i * 0.1 + 0.05, 0]} rotation={[0.2, i * 0.5, 0]}>
          <torusGeometry args={[0.042, 0.005, 16, 32]} />
          <meshStandardMaterial color="#ff4500" />
        </mesh>
      ))}

      {/* Wick */}
      <mesh ref={wickRef} position={[0, 1.02, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 0.1, 8]} />
        <meshStandardMaterial color="black" />
      </mesh>

      {/* Flame */}
      <mesh ref={flameRef} position={[0, 1.1, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color={[1.5, 0.5, 0]}
          emissive={[3, 1, 0]}
          emissiveIntensity={2}
          toneMapped={false}
          transparent
          opacity={0.9}
        />
      </mesh>
      {/* Inner Blue Flame */}
      {!isBlown && (
        <mesh position={[0, 1.05, 0]} scale={0.5}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color="#0055ff" transparent opacity={0.4} />
        </mesh>
      )}
    </group>
  );
}

function Cherry({ position }) {
  return (
    <group position={position} rotation={[Math.random(), Math.random(), Math.random()]}>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.15, 24, 24]} />
        <meshPhysicalMaterial
          color="#D10000"
          roughness={0.2}
          clearcoat={0.8}
          clearcoatRoughness={0.2}
        />
      </mesh>
      {/* Stem */}
      <mesh position={[0, 0.15, 0]} rotation={[0, 0, 0.5]}>
        <cylinderGeometry args={[0.01, 0.01, 0.2, 8]} />
        <meshStandardMaterial color="#4a3b2a" />
      </mesh>
    </group>
  )
}

function Piping({ radius, y, count }) {
  const pipe_meshes = useMemo(() => {
    const items = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;
      items.push(
        <mesh key={i} position={[x, y, z]} castShadow receiveShadow>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#fffff0" roughness={0.4} />
        </mesh>
      )
    }
    return items;
  }, [radius, y, count]);

  return <group>{pipe_meshes}</group>
}

function Sprinkles({ count, radius, yBase }) {
  const sprinkles = useMemo(() => {
    const items = [];
    const colors = ['#5d4037', '#795548', '#8d6e63', '#3e2723'];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * radius; // Random radius within bounds
      const x = Math.sin(angle) * r;
      const z = Math.cos(angle) * r;
      const color = colors[Math.floor(Math.random() * colors.length)];

      items.push(
        <mesh key={i} position={[x, yBase + 0.01, z]} rotation={[Math.PI / 2, 0, Math.random()]} receiveShadow>
          <capsuleGeometry args={[0.015, 0.06, 4, 8]} />
          <meshStandardMaterial color={color} roughness={0.3} />
        </mesh>
      )
    }
    return items;
  }, [count, radius, yBase]);

  return <group>{sprinkles}</group>
}

function CakeModel({ isBlown, chargeLevel }) {
  const cakeRef = useRef();

  useFrame(() => {
    if (cakeRef.current) {
      cakeRef.current.rotation.y += 0.005;
      // Shake removed as per user request
    }
  });

  return (
    <group ref={cakeRef} position={[0, -1.5, 0]}>
      {/* Floating Text */}
      {/* Floating Text removed */}

      {/* Plate */}
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <cylinderGeometry args={[2.2, 2.2, 0.2, 64]} />
        <meshStandardMaterial color="#e0e0e0" metalness={0.5} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0, 0]} receiveShadow>
        <cylinderGeometry args={[1, 2, 0.5, 64]} />
        <meshStandardMaterial color="#daa520" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Bottom Tier */}
      <group position={[0, 0.7, 0]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[1.8, 1.8, 1, 64]} />
          <meshStandardMaterial
            color="#3e2723"
            roughness={0.6}
          />
        </mesh>
        <Piping radius={1.75} y={-0.45} count={32} />
        <Piping radius={1.75} y={0.45} count={32} />
        <Sprinkles count={50} radius={1.7} yBase={0.5} />
      </group>

      {/* Top Tier */}
      <group position={[0, 1.7, 0]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[1.2, 1.2, 1, 64]} />
          <meshStandardMaterial
            color="#3e2723"
            roughness={0.6}
          />
        </mesh>
        <Piping radius={1.15} y={-0.45} count={24} />
        <Piping radius={1.15} y={0.45} count={24} />
        <Sprinkles count={30} radius={1.1} yBase={0.5} />
      </group>

      {/* Decorations */}
      <group position={[0, 2.25, 0]}>
        {/* Ring of Cherries */}
        {[...Array(8)].map((_, i) => (
          <Cherry key={i} position={[Math.sin(i * Math.PI / 4) * 0.9, 0, Math.cos(i * Math.PI / 4) * 0.9]} />
        ))}
      </group>

      {/* Candles */}
      <Candle position={[0, 2.2, 0]} isBlown={isBlown} chargeLevel={chargeLevel} />
      <Candle position={[0.5, 2.2, 0.5]} isBlown={isBlown} chargeLevel={chargeLevel} />
      <Candle position={[-0.5, 2.2, 0.5]} isBlown={isBlown} chargeLevel={chargeLevel} />
      <Candle position={[0.5, 2.2, -0.5]} isBlown={isBlown} chargeLevel={chargeLevel} />
      <Candle position={[-0.5, 2.2, -0.5]} isBlown={isBlown} chargeLevel={chargeLevel} />

    </group>
  );
}

export default function CakeScene({ onOpenGift }) {
  const [charge, setCharge] = useState(0);
  const [isBlown, setIsBlown] = useState(false);
  const [isHolding, setIsHolding] = useState(false);

  useEffect(() => {
    let interval;
    if (isHolding && !isBlown) {
      interval = setInterval(() => { setCharge((prev) => (prev >= 100 ? 100 : prev + 1)); if (charge >= 100) setIsBlown(true); }, 20);
    }
    return () => clearInterval(interval);
  }, [isHolding, isBlown, charge]);

  useEffect(() => {
    if (isBlown) {
      // Left side pop
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { x: 0.2, y: 0.6 },
        angle: 60,
        colors: ['#ff69b4', '#ffd700', '#ffffff', '#00cec9', '#6c5ce7']
      });
      // Right side pop
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { x: 0.8, y: 0.6 },
        angle: 120,
        colors: ['#ff69b4', '#ffd700', '#ffffff', '#00cec9', '#6c5ce7']
      });
    }
  }, [isBlown]);

  const startHolding = useCallback(() => { if (!isBlown) setIsHolding(true); }, [isBlown]);
  const stopHolding = useCallback(() => { setIsHolding(false); setCharge(prev => (prev < 100 ? 0 : 100)); }, []);

  useEffect(() => {
    const handleKeyDown = (e) => { if (e.code === 'Space') startHolding(); };
    const handleKeyUp = (e) => { if (e.code === 'Space') stopHolding(); };
    window.addEventListener('keydown', handleKeyDown); window.addEventListener('keyup', handleKeyUp);
    return () => { window.removeEventListener('keydown', handleKeyDown); window.removeEventListener('keyup', handleKeyUp); };
  }, [startHolding, stopHolding]);

  return (
    <div className="w-full h-full relative touch-none select-none bg-linear-to-b from-purple-50 to-pink-50"
      onPointerDown={startHolding} onPointerUp={stopHolding} onPointerLeave={stopHolding} onContextMenu={(e) => e.preventDefault()}>
      <StaticDecor />

      <Canvas camera={{ position: [0, 4, 8], fov: 45 }} shadows dpr={[1, 2]}>
        <Suspense fallback={<Html center><div className="text-pink-500 font-bold animate-pulse">LOADING CAKE...</div></Html>}>
          {/* Environment & Lighting */}
          {/* 3D Confetti removed */}

          <ambientLight intensity={0.8} />
          <spotLight
            position={[5, 10, 5]}
            angle={0.5}
            penumbra={1}
            intensity={2}
            castShadow
            shadow-bias={-0.0001}
          />
          <pointLight position={[-5, 5, -5]} intensity={0.5} color="#ffd1dc" />

          <CakeModel isBlown={isBlown} chargeLevel={charge} />

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2.2}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute bottom-10 left-0 w-full text-center pointer-events-none z-10">
        {!isBlown ? (
          <div className="flex flex-col items-center gap-4 transition-opacity duration-500">
            <p className="text-pink-600 font-bold tracking-widest bg-white/60 px-6 py-2 rounded-full backdrop-blur-md shadow-sm border border-white/50 animate-pulse">
              {charge > 0 ? "KEEP HOLDING TO BLOW!" : "HOLD SPACEBAR OR TOUCH"}
            </p>
            <div className="w-64 h-3 bg-gray-200/50 rounded-full overflow-hidden border border-white/50 shadow-inner backdrop-blur-sm">
              <div className="h-full bg-gradient-to-r from-pink-400 to-purple-500 transition-all duration-75 ease-out" style={{ width: `${charge}%` }}></div>
            </div>
          </div>
        ) : (
          <div className="pointer-events-auto animate-in fade-in slide-in-from-bottom-4 duration-700">

            <button
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-4 px-10 rounded-full shadow-xl transform transition-all duration-300 hover:scale-110 hover:shadow-2xl active:scale-95 ring-4 ring-pink-200"
              onClick={onOpenGift}
            >
              OPEN GIFT 🎁
            </button>
          </div>
        )}
      </div>
    </div>
  );
}