'use client';

import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3, Group, Mesh } from 'three';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface SolarSystemProps {
    currentView: 'overview' | 'earth' | 'moon';
}

export default function SolarSystem({ currentView }: SolarSystemProps) {
    const { camera } = useThree();

    // Refs for animation
    const earthGroupRef = useRef<Group>(null);
    const earthMeshRef = useRef<Mesh>(null);
    const moonGroupRef = useRef<Group>(null); // This group will orbit Earth
    const moonMeshRef = useRef<Mesh>(null);

    // Constants for orbital mechanics (scaled for visual approximation)
    const EARTH_ORBIT_RADIUS = 15;
    const MOON_ORBIT_RADIUS = 3;
    const EARTH_ROTATION_SPEED = 0.5;
    const MOON_ORBIT_SPEED = 2;
    const EARTH_ORBIT_SPEED = 0.2;

    useFrame((state, delta) => {
        const t = state.clock.getElapsedTime();

        // 1. Animate Earth Orbit around Sun (0,0,0)
        if (earthGroupRef.current) {
            earthGroupRef.current.position.x = Math.sin(t * EARTH_ORBIT_SPEED) * EARTH_ORBIT_RADIUS;
            earthGroupRef.current.position.z = Math.cos(t * EARTH_ORBIT_SPEED) * EARTH_ORBIT_RADIUS;

            // Earth axial rotation
            if (earthMeshRef.current) {
                earthMeshRef.current.rotation.y += delta * EARTH_ROTATION_SPEED;
            }
        }

        // 2. Animate Moon Orbit around Earth
        // Moon is a child of EarthGroup effectively in logic, but here we can parent it or calculate pos.
        // Let's keep Moon as child of EarthGroup to make local orbit easier?
        // Actually, if we put Moon inside EarthGroup, it moves with Earth automatically.
        if (moonGroupRef.current) {
            moonGroupRef.current.rotation.y += delta * MOON_ORBIT_SPEED;
        }


        // 3. Camera Transition Logic
        let targetPos = new Vector3();
        let targetLookAt = new Vector3();

        if (currentView === 'overview') {
            // High above, looking at system center
            targetPos.set(0, 30, 40);
            targetLookAt.set(0, 0, 0);
        } else if (currentView === 'earth') {
            // Close to Earth, looking at it (or slightly past it to see background)
            if (earthGroupRef.current) {
                const earthPos = earthGroupRef.current.position;
                // Offset camera slightly relative to Earth
                targetPos.copy(earthPos).add(new Vector3(0, 2, 5));
                targetLookAt.copy(earthPos);
            }
        } else if (currentView === 'moon') {
            // Close to Moon, looking at Earth
            if (earthGroupRef.current && moonGroupRef.current && moonMeshRef.current) {
                // Calculate Moon's world position
                // Since MoonGroup is child of EarthGroup (in JSX below), we need world coords.
                const moonWorldPos = new Vector3();
                moonMeshRef.current.getWorldPosition(moonWorldPos);

                const earthWorldPos = new Vector3();
                earthGroupRef.current.getWorldPosition(earthWorldPos);

                // Position on surface of Moon facing Earth
                // Direction from Moon to Earth
                const dir = new Vector3().subVectors(earthWorldPos, moonWorldPos).normalize();

                // Camera position: MoonPos - (Radius * dir) ? No, we want to be ON the moon looking AT earth.
                // So we are at MoonPos + slight offset, looking at Earth.
                targetPos.copy(moonWorldPos).add(new Vector3(0, 0.5, 0)); // Slightly above moon center
                targetLookAt.copy(earthWorldPos);
            }
        }

        // Smooth camera movement
        camera.position.lerp(targetPos, 0.05);
        // For lookAt, we need to manually update quaternion or use controls. 
        // OrbitControls fights with this. We usually disable OrbitControls or use manual lookAt.
        // For this MVP, let's use manual lookAt interpolation or just snap for simplicity, 
        // but smooth is better.
        const currentLookAt = new Vector3(0, 0, -1).applyQuaternion(camera.quaternion).add(camera.position);
        const smoothedLookAt = currentLookAt.lerp(targetLookAt, 0.05);
        camera.lookAt(smoothedLookAt);
    });

    return (
        <>
            {/* SUN */}
            <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[2.5, 32, 32]} />
                <meshStandardMaterial emissive="orange" emissiveIntensity={2} color="yellow" />
            </mesh>

            {/* EARTH SYSTEM GROUP */}
            <group ref={earthGroupRef}>
                {/* EARTH */}
                <mesh ref={earthMeshRef}>
                    <sphereGeometry args={[1, 32, 32]} />
                    <meshStandardMaterial color="blue" roughness={0.7} metalness={0.2} />
                </mesh>

                {/* MOON SYSTEM GROUP (Relative to Earth) */}
                <group ref={moonGroupRef} rotation={[0, 0, 0]}>
                    {/* MOON (Offset by orbit radius) */}
                    <mesh ref={moonMeshRef} position={[MOON_ORBIT_RADIUS, 0, 0]}>
                        <sphereGeometry args={[0.27, 32, 32]} />
                        <meshStandardMaterial color="gray" roughness={0.8} />
                    </mesh>
                </group>
            </group>
        </>
    );
}
