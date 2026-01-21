'use client';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Float, Stars } from '@react-three/drei';

const BIRTHDAY_NAME = "NAME HERE"; // <--- EDIT THIS

function Candle({ position, isBlown, chargeLevel }) {
  const flameRef = useRef();
  useFrame(() => {
    if (flameRef.current) {
      if (!isBlown) {
        const flicker = 1 + Math.random() * 0.2; 
        const chargeEffect = 1 + (chargeLevel * 0.02); 
        flameRef.current.scale.setScalar(flicker * chargeEffect);
        flameRef.current.material.emissiveIntensity = 2 + (chargeLevel * 0.1);
      } else {
        flameRef.current.scale.setScalar(0);
      }
    }
  });
  return (
    <group position={position}>
      <mesh position={[0, 0.5, 0]}><cylinderGeometry args={[0.05, 0.05, 1, 32]} /><meshStandardMaterial color="#fef3c7" /></mesh>
      <mesh ref={flameRef} position={[0, 1.1, 0]}><sphereGeometry args={[0.1, 32, 32]} /><meshStandardMaterial color="orange" emissive="#ff5500" emissiveIntensity={2} /></mesh>
    </group>
  );
}

function CakeModel({ isBlown, chargeLevel }) {
  const cakeRef = useRef();
  useFrame(() => {
    if (cakeRef.current) {
      const shake = isBlown ? 0 : (Math.random() - 0.5) * (chargeLevel * 0.005);
      cakeRef.current.rotation.y += 0.005;
      cakeRef.current.rotation.x = shake;
      cakeRef.current.rotation.z = shake;
    }
  });
  return (
    <group ref={cakeRef} position={[0, -1, 0]}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Text position={[0, 3.5, 0]} fontSize={0.8} color="#be185d" anchorX="center" anchorY="middle" font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff">{BIRTHDAY_NAME}</Text>
      </Float>
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow><cylinderGeometry args={[1.5, 1.5, 1, 64]} /><meshStandardMaterial color="#f472b6" roughness={0.3} /></mesh>
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow><cylinderGeometry args={[1, 1, 1, 64]} /><meshStandardMaterial color="#fbcfe8" roughness={0.3} /></mesh>
      {[...Array(8)].map((_, i) => (
        <mesh key={i} position={[Math.sin(i) * 1.6, 0.1, Math.cos(i) * 1.6]}><sphereGeometry args={[0.1, 16, 16]} /><meshStandardMaterial color={i % 2 === 0 ? "cyan" : "yellow"} /></mesh>
      ))}
      <Candle position={[0, 2, 0]} isBlown={isBlown} chargeLevel={chargeLevel} />
      <Candle position={[0.5, 2, 0.5]} isBlown={isBlown} chargeLevel={chargeLevel} />
      <Candle position={[-0.5, 2, 0.5]} isBlown={isBlown} chargeLevel={chargeLevel} />
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
      interval = setInterval(() => { setCharge((prev) => (prev >= 100 ? 100 : prev + 1)); if(charge>=100) setIsBlown(true); }, 20);
    } 
    return () => clearInterval(interval);
  }, [isHolding, isBlown, charge]);

  const startHolding = useCallback(() => { if (!isBlown) setIsHolding(true); }, [isBlown]);
  const stopHolding = useCallback(() => { setIsHolding(false); setCharge(prev => (prev < 100 ? 0 : 100)); }, []);

  useEffect(() => {
    const handleKeyDown = (e) => { if (e.code === 'Space') startHolding(); };
    const handleKeyUp = (e) => { if (e.code === 'Space') stopHolding(); };
    window.addEventListener('keydown', handleKeyDown); window.addEventListener('keyup', handleKeyUp);
    return () => { window.removeEventListener('keydown', handleKeyDown); window.removeEventListener('keyup', handleKeyUp); };
  }, [startHolding, stopHolding]);

  return (
    <div className="w-full h-full relative touch-none select-none" onPointerDown={startHolding} onPointerUp={stopHolding} onPointerLeave={stopHolding} onContextMenu={(e) => e.preventDefault()}>
      <Canvas camera={{ position: [0, 3, 6], fov: 50 }} shadows>
        <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
        <ambientLight intensity={0.7} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <CakeModel isBlown={isBlown} chargeLevel={charge} />
        <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 2} />
      </Canvas>
      <div className="absolute bottom-10 left-0 w-full text-center pointer-events-none">
        {!isBlown ? (
          <div className="flex flex-col items-center gap-2">
            <p className="text-gray-600 font-bold animate-bounce tracking-widest bg-white/80 px-4 py-1 rounded-full backdrop-blur-sm">{charge > 0 ? "KEEP HOLDING..." : "HOLD SPACEBAR / TOUCH TO WISH"}</p>
            <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden border border-gray-300"><div className="h-full bg-pink-500 transition-all duration-75" style={{ width: `${charge}%` }}></div></div>
          </div>
        ) : (
          <div className="pointer-events-auto">
             <h2 className="text-2xl font-bold text-pink-600 mb-4 animate-pulse drop-shadow-md">WISH GRANTED!</h2>
             <button className="bg-linear-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition hover:scale-110" onClick={onOpenGift}>OPEN GIFT 🎁</button>
          </div>
        )}
      </div>
    </div>
  );
}