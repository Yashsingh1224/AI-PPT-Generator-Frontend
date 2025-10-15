import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';

function AnimatedShape({ position, geometry, color, speed = 1 }) {
    const meshRef = useRef(null);
    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.3;
            meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.2;
            meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.5;
        }
    });
    const getGeometry = () => {
        switch (geometry) {
            case 'sphere':
                return <sphereGeometry args={[1, 32, 32]} />;
            case 'box':
                return <boxGeometry args={[1.5, 1.5, 1.5]} />;
            case 'octahedron':
                return <octahedronGeometry args={[1.2]} />;
            case 'torus':
                return <torusGeometry args={[1, 0.4, 16, 100]} />;
            default:
                return <sphereGeometry args={[1, 32, 32]} />;
        }
    };
    return (
        <Float speed={speed} rotationIntensity={0.3} floatIntensity={0.4}>
            <mesh ref={meshRef} position={position}>
                {getGeometry()}
                <MeshDistortMaterial
                    color={color}
                    metalness={0.6}
                    roughness={0.4}
                    distort={0.2}
                    speed={speed}
                    transparent
                    opacity={0.3}
                />
            </mesh>
        </Float>
    );
}

function GridParticles() {
    const groupRef = useRef(null);
    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
        }
    });
    return (
        <group ref={groupRef}>
            {Array.from({ length: 50 }, (_, i) => {
                const x = (Math.random() - 0.5) * 40;
                const y = (Math.random() - 0.5) * 20;
                const z = (Math.random() - 0.5) * 40;
                const colorIdx = Math.floor(Math.random() * 5);
                const colors = ['#4F46E5', '#06B6D4', '#8B5CF6', '#EF4444', '#10B981'];
                return (
                    <Float key={i} speed={0.5 + Math.random()} rotationIntensity={0.2}>
                        <mesh position={[x, y, z]}>
                            <sphereGeometry args={[0.05, 8, 8]} />
                            <meshStandardMaterial
                                color={colors[colorIdx]}
                                emissive={colors[colorIdx]}
                                emissiveIntensity={0.2}
                            />
                        </mesh>
                    </Float>
                );
            })}
        </group>
    );
}

function WaveField() {
    const groupRef = useRef(null);
    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.children.forEach((child, i) => {
                if (child && child.position && child.rotation) {
                    child.position.y = Math.sin(state.clock.elapsedTime + i * 0.5) * 0.3;
                    child.rotation.y = state.clock.elapsedTime * 0.5 + i;
                }
            });
        }
    });
    return (
        <group ref={groupRef}>
            {Array.from({ length: 15 }, (_, i) => (
                <mesh key={i} position={[(i - 7) * 2, -8, -5]}>
                    <cylinderGeometry args={[0.1, 0.1, 2]} />
                    <meshStandardMaterial
                        color="#4F46E5"
                        emissive="#4F46E5"
                        emissiveIntensity={0.1}
                        transparent
                        opacity={0.6}
                    />
                </mesh>
            ))}
        </group>
    );
}

export default function Background3D() {
    return (
        <div className="fixed inset-0 -z-30">
            <Canvas
                camera={{ position: [0, 0, 20], fov: 60 }}
                style={{ width: '100%', height: '100%' }}
            >
                <ambientLight intensity={0.2} />
                <pointLight position={[10, 10, 10]} intensity={0.5} />
                <pointLight position={[-10, -10, -10]} intensity={0.3} color="#4F46E5" />
                <GridParticles />
                <WaveField />
                {/* Large floating shapes */}
                <AnimatedShape
                    position={[-15, 5, -10]}
                    geometry="sphere"
                    color="#4F46E5"
                    speed={0.5}
                />
                <AnimatedShape
                    position={[15, -3, -8]}
                    geometry="octahedron"
                    color="#06B6D4"
                    speed={0.7}
                />
                <AnimatedShape
                    position={[0, 8, -15]}
                    geometry="torus"
                    color="#8B5CF6"
                    speed={0.3}
                />
                <AnimatedShape
                    position={[-10, -8, -12]}
                    geometry="box"
                    color="#EF4444"
                    speed={0.6}
                />
                <AnimatedShape
                    position={[12, 0, -20]}
                    geometry="sphere"
                    color="#10B981"
                    speed={0.4}
                />
            </Canvas>
        </div>
    );
}
