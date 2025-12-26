'use client';

import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { Suspense } from 'react';
import SolarSystem from './SolarSystem';

interface SceneProps {
    currentView: 'overview' | 'earth' | 'moon';
}

export default function Scene({ currentView }: SceneProps) {
    return (
        <div className="w-full h-screen bg-black">
            <Canvas shadows camera={{ fov: 45, position: [0, 20, 25] }}>
                <Suspense fallback={null}>
                    <ambientLight intensity={0.1} />
                    <pointLight position={[0, 0, 0]} intensity={2} decay={0} distance={100} castShadow />
                    <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                    <SolarSystem currentView={currentView} />
                </Suspense>
            </Canvas>
        </div>
    );
}
