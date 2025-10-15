import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text3D, MeshDistortMaterial, Sphere, OrbitControls } from '@react-three/drei';

function AnimatedSphere({ position, color, scale = 1 }) {
    const meshRef = useRef(null);
    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
            meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
        }
    });
    return (
        <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.6}>
            <mesh ref={meshRef} position={position} scale={scale}>
                <Sphere args={[1, 64, 64]}>
                    <MeshDistortMaterial
                        color={color}
                        metalness={0.8}
                        roughness={0.2}
                        distort={0.3}
                        speed={2}
                        transparent
                        opacity={0.7}
                    />
                </Sphere>
            </mesh>
        </Float>
    );
}

function MainLogo() {
    const groupRef = useRef(null);
    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
        }
    });
    return (
        <group ref={groupRef}>
            <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
                <Text3D
                    font="/fonts/helvetiker_regular.typeface.json"
                    size={1.2}
                    height={0.3}
                    curveSegments={12}
                    position={[-3, 0, 0]}
                    color="#4f39f6"
                >
                    Syndicate AI
                    <MeshDistortMaterial
                        color="#4F46E5"
                        metalness={0.9}
                        roughness={0.1}
                        distort={0.1}
                        speed={1}
                    />
                </Text3D>

            </Float>
            {/* Orbiting elements around the text */}
            <group>
                {[...Array(8)].map((_, i) => {
                    const angle = (i * Math.PI * 2) / 8;
                    const radius = 5;
                    return (
                        <mesh
                            key={i}
                            position={[
                                Math.cos(angle) * radius,
                                Math.sin(angle * 2) * 0.5,
                                Math.sin(angle) * radius
                            ]}
                        >
                            <octahedronGeometry args={[0.2]} />
                            <meshStandardMaterial
                                color={i % 2 === 0 ? "#06B6D4" : "#8B5CF6"}
                                metalness={0.8}
                                roughness={0.2}
                                emissive={i % 2 === 0 ? "#06B6D4" : "#8B5CF6"}
                                emissiveIntensity={0.2}
                            />
                        </mesh>
                    );
                })}
            </group>
        </group>
    );
}

function ParticleSystem() {
    const particlesRef = useRef(null);
    useFrame((state) => {
        if (particlesRef.current) {
            particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
            particlesRef.current.children.forEach((child, i) => {
                if (child && child.position) {
                    child.position.y = Math.sin(state.clock.elapsedTime + i) * 0.5;
                }
            });
        }
    });
    return (
        <group ref={particlesRef}>
            {[...Array(30)].map((_, i) => (
                <Float key={i} speed={0.5 + Math.random()} rotationIntensity={0.3}>
                    <mesh
                        position={[
                            (Math.random() - 0.5) * 25,
                            (Math.random() - 0.5) * 15,
                            (Math.random() - 0.5) * 25
                        ]}
                    >
                        <boxGeometry args={[0.1, 0.1, 0.1]} />
                        <meshStandardMaterial
                            color={['#4F46E5', '#06B6D4', '#8B5CF6', '#EF4444'][Math.floor(Math.random() * 4)]}
                            metalness={0.7}
                            roughness={0.3}
                        />
                    </mesh>
                </Float>
            ))}
        </group>
    );
}

export default function InteractiveHero3D() {
    const [hovered, setHovered] = useState(false);
    return (
        <div
            className="w-full h-[500px] cursor-pointer"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <Canvas
                camera={{ position: [0, 0, 15], fov: 50 }}
                style={{ width: '100%', height: '100%' }}
            >
                <ambientLight intensity={0.3} />
                <pointLight position={[10, 10, 10]} intensity={1.5} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4F46E5" />
                <spotLight
                    position={[0, 15, 0]}
                    angle={0.3}
                    penumbra={1}
                    intensity={1}
                    castShadow
                />
                <ParticleSystem />
                <MainLogo />
                {/* Floating decorative spheres */}
                <AnimatedSphere position={[-6, 3, -3]} color="#06B6D4" scale={0.8} />
                <AnimatedSphere position={[6, -2, -2]} color="#8B5CF6" scale={0.6} />
                <AnimatedSphere position={[0, 4, -4]} color="#EF4444" scale={0.5} />
                <AnimatedSphere position={[-3, -3, 2]} color="#10B981" scale={0.7} />
                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    autoRotate={hovered}
                    autoRotateSpeed={0.5}
                />
            </Canvas>
        </div>
    );
}
