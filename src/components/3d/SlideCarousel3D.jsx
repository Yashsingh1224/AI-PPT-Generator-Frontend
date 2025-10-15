import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text, RoundedBox } from '@react-three/drei';

const slideData = [
    { title: "AI-Powered", subtitle: "Smart Generation", color: "#4F46E5" },
    { title: "Professional", subtitle: "Quality Design", color: "#06B6D4" },
    { title: "Lightning", subtitle: "Fast Results", color: "#8B5CF6" },
    { title: "Custom", subtitle: "Your Brand", color: "#EF4444" },
    { title: "Download", subtitle: "Instant Access", color: "#10B981" }
];

function SlideCard({ position, title, subtitle, color, index }) {
    const meshRef = useRef(null);
    const groupRef = useRef(null);
    useFrame((state) => {
        if (meshRef.current && groupRef.current) {
            const time = state.clock.elapsedTime;
            groupRef.current.rotation.y = time * 0.2 + (index * Math.PI * 2) / 5;
            meshRef.current.position.y = Math.sin(time + index) * 0.3;
        }
    });
    return (
        <group ref={groupRef}>
            <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.2}>
                <mesh ref={meshRef} position={position}>
                    <RoundedBox args={[2.5, 3.5, 0.2]} radius={0.1} smoothness={4}>
                        <meshStandardMaterial
                            color={color}
                            metalness={0.4}
                            roughness={0.6}
                            emissive={color}
                            emissiveIntensity={0.1}
                        />
                    </RoundedBox>
                    <Text
                        position={[0, 0.8, 0.11]}
                        fontSize={0.4}
                        color="white"
                        anchorX="center"
                        anchorY="middle"
                    >
                        {title}
                    </Text>
                    <Text
                        position={[0, 0.2, 0.11]}
                        fontSize={0.25}
                        color="#cee"
                        anchorX="center"
                        anchorY="middle"
                    >
                        {subtitle}
                    </Text>
                    {/* Mini slide preview */}
                    <mesh position={[0, -0.7, 0.11]}>
                        <planeGeometry args={[1.8, 1]} />
                        <meshBasicMaterial color="#fff" transparent opacity={0.9} />
                    </mesh>
                    {/* Slide content lines */}
                    {[...Array(3)].map((_, i) => (
                        <mesh key={i} position={[0, -0.5 - i * 0.2, 0.12]}>
                            <planeGeometry args={[1.5 - i * 0.2, 0.05]} />
                            <meshBasicMaterial color="#222" transparent opacity={0.6} />
                        </mesh>
                    ))}
                </mesh>
            </Float>
        </group>
    );
}

function CarouselScene() {
    const groupRef = useRef(null);
    return (
        <group ref={groupRef}>
            {slideData.map((slide, index) => {
                const angle = (index * Math.PI * 2) / slideData.length;
                const radius = 5;
                const x = Math.cos(angle) * radius;
                const z = Math.sin(angle) * radius;
                return (
                    <SlideCard
                        key={index}
                        position={[x, 0, z]}
                        title={slide.title}
                        subtitle={slide.subtitle}
                        color={slide.color}
                        index={index}
                    />
                );
            })}
        </group>
    );
}

export default function SlideCarousel3D() {
    return (
        <div style={{ width: "100%", height: "24rem", marginTop: "2rem", marginBottom: "2rem" }}>
            <Canvas
                camera={{ position: [0, 2, 12], fov: 50 }}
                style={{ width: '100%', height: '100%' }}
            >
                <ambientLight intensity={0.3} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <pointLight position={[-10, 5, -10]} intensity={0.5} color="#4F46E5" />
                <spotLight
                    position={[0, 10, 0]}
                    angle={0.3}
                    penumbra={1}
                    intensity={0.8}
                    castShadow
                />
                <CarouselScene />
            </Canvas>
        </div>
    );
}
