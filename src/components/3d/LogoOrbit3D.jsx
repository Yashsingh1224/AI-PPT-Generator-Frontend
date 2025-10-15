import React, { useRef } from "react";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";

function BillboardLogo({ texture }) {
    const meshRef = useRef();
    useFrame(({ camera }) => {
        if (meshRef.current) {
            // Make the logo always face the camera
            meshRef.current.quaternion.copy(camera.quaternion);
        }
    });
    return (
        <mesh ref={meshRef} position={[0, 0, 0]}>
            <planeGeometry args={[1.2, 1.2]} />
            <meshBasicMaterial map={texture} transparent />
        </mesh>
    );
}

export default function LogoOrbit3D({ logoUrl, size = 300 }) {
    const texture = useLoader(THREE.TextureLoader, logoUrl);
    return (
        <div style={{ width: size, height: size, margin: "0 auto" }}>
            <Canvas camera={{ position: [0, 0, 8], fov: 35 }}>
                <ambientLight intensity={0.6} />
                <pointLight position={[10, 10, 10]} intensity={1.2} />
                {/* Floating objects */}
                <Float speed={1}>
                    <mesh position={[1.6, 0, 0]}>
                        <sphereGeometry args={[0.5, 32, 32]} />
                        <meshStandardMaterial color="#2563eb" emissive="#3b82f6" emissiveIntensity={0.8} />
                    </mesh>
                </Float>
                <Float speed={1.2} rotationIntensity={2}>
                    <mesh position={[-1.6, 0, 0]}>
                        <sphereGeometry args={[0.4, 32, 32]} />
                        <meshStandardMaterial color="#a78bfa" emissive="#818cf8" emissiveIntensity={0.7} />
                    </mesh>
                </Float>
                <Float speed={1.5}>
                    <mesh position={[0, 1.6, 0]}>
                        <boxGeometry args={[0.45, 0.45, 0.45]} />
                        <meshStandardMaterial color="#60a5fa" emissive="#38bdf8" emissiveIntensity={0.7} />
                    </mesh>
                </Float>
                <Sparkles count={30} scale={3} size={2} color="#fcd34d" />
                {/* Logo that always faces the camera */}
                <BillboardLogo texture={texture} />
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
            </Canvas>
        </div>
    );
}
