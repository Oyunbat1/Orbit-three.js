'use client';

import { Canvas, useLoader } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';
import { XR, XROrigin } from '@react-three/xr';
import { TextureLoader, BackSide } from 'three';
import SolarSystem from './SolarSystem';
import { store } from '../xr-store';

interface SceneProps {
    currentView: 'overview' | 'earth' | 'moon';
    onViewChange: (view: 'overview' | 'earth' | 'moon') => void;
}

function GalaxyBackground() {
    const texture = useLoader(TextureLoader, '/galaxy.jpg');
    return (
        <mesh>
            <sphereGeometry args={[500, 60, 40]} />
            <meshBasicMaterial map={texture} side={BackSide} />
        </mesh>
    );
}

export default function Scene({ currentView, onViewChange }: SceneProps) {
    return (
        <div className="w-full h-screen bg-blue-900/90">
            <Canvas shadows camera={{ fov: 45, position: [0, 20, 25] }}>
                <XR store={store}>
                    <XROrigin position={[0, 20, 25]} />
                    <Suspense fallback={null}>
                        <ambientLight intensity={0.5} />
                        <hemisphereLight intensity={0.5} groundColor="#000000" />
                        <pointLight position={[0, 0, 0]} intensity={3} decay={0} distance={100} castShadow />

                        <GalaxyBackground />
                        <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                        <SolarSystem currentView={currentView} onViewChange={onViewChange} />

                        <OrbitControls makeDefault enablePan={true} enableZoom={true} />
                    </Suspense>
                </XR>
            </Canvas>
        </div>
    );
}
