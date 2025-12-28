'use client';

import { useRef, useEffect } from 'react';
import { useFrame, useThree, useLoader } from '@react-three/fiber';
import { Vector3, Group, Mesh, TextureLoader } from 'three';

interface SolarSystemProps {
    currentView: 'overview' | 'earth' | 'moon';
    onViewChange: (view: 'overview' | 'earth' | 'moon') => void;
}

export default function SolarSystem({ currentView, onViewChange }: SolarSystemProps) {
    const { camera, gl } = useThree();

    const [sunTexture, earthTexture, moonTexture] = useLoader(TextureLoader, [
        '/textures/sun_texture.png',
        '/textures/earth_daymap.png',
        '/textures/moon_texture.png'
    ]);

    const earthGroupRef = useRef<Group>(null);
    const earthMeshRef = useRef<Mesh>(null);
    const moonGroupRef = useRef<Group>(null);
    const moonMeshRef = useRef<Mesh>(null);
    const sunMeshRef = useRef<Mesh>(null);

    const EARTH_ORBIT_RADIUS = 15;
    const MOON_ORBIT_RADIUS = 3;
    const EARTH_ROTATION_SPEED = 2;
    const MOON_ORBIT_SPEED = 4;
    const EARTH_ORBIT_SPEED = 0.05;
    const SUN_ROTATION_SPEED = 0.05;


    useFrame((state, delta) => {
        const t = state.clock.getElapsedTime();

        if (sunMeshRef.current) {
            sunMeshRef.current.rotation.y += delta * SUN_ROTATION_SPEED;
        }

        let earthWorldPos = new Vector3();
        if (earthGroupRef.current) {
            earthGroupRef.current.position.x = Math.sin(t * EARTH_ORBIT_SPEED) * EARTH_ORBIT_RADIUS;
            earthGroupRef.current.position.z = Math.cos(t * EARTH_ORBIT_SPEED) * EARTH_ORBIT_RADIUS;
            earthGroupRef.current.getWorldPosition(earthWorldPos);

            if (earthMeshRef.current) {
                earthMeshRef.current.rotation.y += delta * EARTH_ROTATION_SPEED;
            }
        }

        let moonWorldPos = new Vector3();
        if (moonGroupRef.current && moonMeshRef.current) {
            moonGroupRef.current.rotation.y += delta * MOON_ORBIT_SPEED;
            moonMeshRef.current.getWorldPosition(moonWorldPos);
        }



        let targetLookAt = new Vector3(0, 0, 0);

        if (currentView === 'overview') {
            targetLookAt.set(0, 0, 0);
        } else if (currentView === 'earth') {
            targetLookAt.copy(earthWorldPos);
        } else if (currentView === 'moon') {
            targetLookAt.copy(moonWorldPos);
        }


        const controls = (state.gl.domElement.parentNode as any)?.__r3f?.controls;
        const orbitControls = state.controls as any;
        if (orbitControls) {
            orbitControls.target.lerp(targetLookAt, 0.1);
            orbitControls.update();
        }
    });

    const handleEarthClick = (e: any) => {
        e.stopPropagation();
        onViewChange('earth');
    };

    const handleMoonClick = (e: any) => {
        e.stopPropagation();
        onViewChange('moon');
    };

    return (
        <>

            <mesh ref={sunMeshRef} position={[0, 0, 0]} onClick={() => onViewChange('overview')}>
                <sphereGeometry args={[2.5, 64, 64]} />
                <meshStandardMaterial
                    map={sunTexture}
                    emissiveMap={sunTexture}
                    emissive="orange"
                    emissiveIntensity={4}
                    color="orange"
                />
                <pointLight intensity={2} distance={100} decay={2} color="#ffaa00" />
            </mesh>


            <group ref={earthGroupRef}>
                <mesh
                    ref={earthMeshRef}
                    onClick={handleEarthClick}
                    onPointerOver={() => document.body.style.cursor = 'pointer'}
                    onPointerOut={() => document.body.style.cursor = 'auto'}
                >
                    <sphereGeometry args={[1, 64, 64]} />
                    <meshStandardMaterial
                        map={earthTexture}
                        roughness={0.5}
                        metalness={0.1}
                    />
                </mesh>


                <group ref={moonGroupRef} rotation={[0, 0, 0]}>
                    <mesh
                        ref={moonMeshRef}
                        position={[MOON_ORBIT_RADIUS, 0, 0]}
                        onClick={handleMoonClick}
                        onPointerOver={() => document.body.style.cursor = 'pointer'}
                        onPointerOut={() => document.body.style.cursor = 'auto'}
                    >
                        <sphereGeometry args={[0.27, 64, 64]} />
                        <meshStandardMaterial
                            map={moonTexture}
                            roughness={0.9}
                            color="#ffffff"
                        />
                    </mesh>
                </group>
            </group>
        </>
    );
}
