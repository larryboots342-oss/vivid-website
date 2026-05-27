"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Float,
  MeshDistortMaterial,
  ContactShadows,
} from "@react-three/drei";
import { useRef, useMemo, useEffect, Suspense } from "react";
import * as THREE from "three";
import { useMousePosition } from "@/hooks/use-mouse-position";

/* ------------------------------------------------------------------ */
/*  Performance helpers                                               */
/* ------------------------------------------------------------------ */
function usePerformanceDpr(): [number, number] {
  if (typeof window === "undefined") return [1, 1];
  const isMobile = window.innerWidth < 768;
  const isLowPower =
    (navigator as any).deviceMemory && (navigator as any).deviceMemory < 4;
  const maxDpr = isMobile || isLowPower ? 1 : 1.5;
  return [1, maxDpr];
}

/* ------------------------------------------------------------------ */
/*  Holographic card                                                  */
/* ------------------------------------------------------------------ */
function HolographicCard({
  position,
  rotation,
  scale = 1,
  children,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  children?: React.ReactNode;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
        <planeGeometry args={[2.2, 1.4]} />
        <meshStandardMaterial
          color="#0a0a0f"
          emissive="#00f5ff"
          emissiveIntensity={0.08}
          transparent
          opacity={0.85}
          side={THREE.DoubleSide}
        />
        {children}
      </mesh>
      {/* glow border */}
      <mesh position={position} rotation={rotation} scale={scale * 1.02}>
        <planeGeometry args={[2.2, 1.4]} />
        <meshBasicMaterial
          color="#00f5ff"
          transparent
          opacity={0.12}
          side={THREE.BackSide}
        />
      </mesh>
    </Float>
  );
}

/* ------------------------------------------------------------------ */
/*  Main 3D product showcase                                          */
/* ------------------------------------------------------------------ */
function ProductShowcase({
  scrollProgress,
}: {
  scrollProgress: React.MutableRefObject<number>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  const mouse = useMousePosition();

  useFrame((state) => {
    if (!groupRef.current) return;

    const t = state.clock.elapsedTime;
    const scroll = scrollProgress.current;

    // Continuous slow rotation + scroll-driven 360 spin
    groupRef.current.rotation.y = t * 0.15 + scroll * Math.PI * 2;
    groupRef.current.rotation.x =
      Math.sin(t * 0.2) * 0.05 + scroll * 0.2;

    // Mouse parallax with lerp
    const targetX = mouse.normalizedX * 0.3;
    const targetY = mouse.normalizedY * 0.2;
    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      targetX,
      0.05
    );
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      targetY,
      0.05
    );

    // Camera zoom on scroll
    const zoom = 5 - scroll * 2;
    state.camera.position.z = THREE.MathUtils.lerp(
      state.camera.position.z,
      zoom,
      0.03
    );
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Central core */}
      <Float speed={2} rotationIntensity={0.4} floatIntensity={0.8}>
        <mesh>
          <icosahedronGeometry args={[1.2, 3]} />
          <MeshDistortMaterial
            color="#00f5ff"
            distort={0.35}
            speed={2.5}
            roughness={0.15}
            metalness={0.95}
            emissive="#00c8cc"
            emissiveIntensity={0.25}
          />
        </mesh>
      </Float>

      {/* Inner ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.8, 0.015, 16, 100]} />
        <meshStandardMaterial
          color="#00f5ff"
          emissive="#00f5ff"
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Outer ring */}
      <mesh rotation={[0.4, 0.3, 0]}>
        <torusGeometry args={[2.6, 0.01, 16, 100]} />
        <meshStandardMaterial
          color="#00e5ff"
          emissive="#00e5ff"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Holographic UI panels */}
      <HolographicCard
        position={[2.8, 1.2, -0.5]}
        rotation={[0, -0.4, 0]}
        scale={0.7}
      >
        <mesh position={[0, 0.2, 0.01]}>
          <planeGeometry args={[1.6, 0.08]} />
          <meshBasicMaterial color="#00f5ff" transparent opacity={0.6} />
        </mesh>
        <mesh position={[0, -0.1, 0.01]}>
          <planeGeometry args={[1.2, 0.04]} />
          <meshBasicMaterial color="#00c8cc" transparent opacity={0.3} />
        </mesh>
        <mesh position={[0, -0.25, 0.01]}>
          <planeGeometry args={[1.0, 0.04]} />
          <meshBasicMaterial color="#00c8cc" transparent opacity={0.2} />
        </mesh>
      </HolographicCard>

      <HolographicCard
        position={[-2.8, -0.8, -0.3]}
        rotation={[0, 0.4, 0]}
        scale={0.6}
      >
        <mesh position={[0, 0.15, 0.01]}>
          <planeGeometry args={[1.4, 0.06]} />
          <meshBasicMaterial color="#00f5ff" transparent opacity={0.5} />
        </mesh>
        <mesh position={[0, -0.05, 0.01]}>
          <planeGeometry args={[1.0, 0.04]} />
          <meshBasicMaterial color="#00c8cc" transparent opacity={0.25} />
        </mesh>
        <mesh position={[0, -0.2, 0.01]}>
          <planeGeometry args={[0.8, 0.04]} />
          <meshBasicMaterial color="#00c8cc" transparent opacity={0.15} />
        </mesh>
      </HolographicCard>

      <HolographicCard
        position={[0, -2.2, 0.2]}
        rotation={[0.2, 0, 0]}
        scale={0.5}
      >
        <mesh position={[0, 0.1, 0.01]}>
          <planeGeometry args={[1.2, 0.06]} />
          <meshBasicMaterial color="#00f5ff" transparent opacity={0.5} />
        </mesh>
        <mesh position={[0, -0.05, 0.01]}>
          <planeGeometry args={[0.9, 0.04]} />
          <meshBasicMaterial color="#00c8cc" transparent opacity={0.2} />
        </mesh>
      </HolographicCard>

      {/* Floating data points — memoized */}
      <FloatingDataPoints />
    </group>
  );
}

function FloatingDataPoints() {
  const floatingPoints = useMemo(
    () =>
      Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 3.2;
        return (
          <Float key={i} speed={1 + Math.random()} floatIntensity={0.5}>
            <mesh
              position={[
                Math.cos(angle) * radius,
                Math.sin(angle) * radius * 0.6,
                0,
              ]}
            >
              <octahedronGeometry args={[0.08, 0]} />
              <meshStandardMaterial
                color="#00f5ff"
                emissive="#00f5ff"
                emissiveIntensity={1}
              />
            </mesh>
          </Float>
        );
      }),
    []
  );
  return <>{floatingPoints}</>;
}

/* ------------------------------------------------------------------ */
/*  Ambient particles                                                 */
/* ------------------------------------------------------------------ */
function AmbientParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  // Reduce count on mobile
  const count =
    typeof window !== "undefined" && window.innerWidth < 768 ? 150 : 400;

  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const siz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
      siz[i] = Math.random() * 2 + 0.5;
    }
    return [pos, siz];
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.015;
      pointsRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#00f5ff"
        transparent
        opacity={0.5}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/* ------------------------------------------------------------------ */
/*  Light trails                                                      */
/* ------------------------------------------------------------------ */
function LightTrails() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: 3 }).map((_, i) => (
        <mesh key={i} rotation={[0, 0, (i * Math.PI) / 3]}>
          <torusGeometry args={[4 + i * 0.8, 0.008, 8, 100]} />
          <meshBasicMaterial
            color="#00f5ff"
            transparent
            opacity={0.15 - i * 0.03}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Scene composition                                                 */
/* ------------------------------------------------------------------ */
function Scene({
  scrollProgress,
}: {
  scrollProgress: React.MutableRefObject<number>;
}) {
  return (
    <>
      <color attach="background" args={["#0a0a0f"]} />
      <fog attach="fog" args={["#0a0a0f", 8, 25]} />

      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} intensity={1.5} color="#00f5ff" />
      <pointLight position={[-5, -3, -5]} intensity={0.8} color="#00e5ff" />
      <pointLight position={[0, 0, 6]} intensity={0.5} color="#ffffff" />
      <spotLight
        position={[0, 8, 0]}
        angle={0.4}
        penumbra={1}
        intensity={1}
        color="#00c8cc"
        castShadow
      />

      <ProductShowcase scrollProgress={scrollProgress} />
      <AmbientParticles />
      <LightTrails />

      <ContactShadows
        position={[0, -3, 0]}
        opacity={0.4}
        scale={15}
        blur={2.5}
        far={4}
        color="#00f5ff"
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Canvas wrapper                                                    */
/* ------------------------------------------------------------------ */
export default function ThreeScene({
  scrollProgress,
}: {
  scrollProgress: React.MutableRefObject<number>;
}) {
  const dpr = usePerformanceDpr();

  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50, near: 0.1, far: 100 }}
        dpr={dpr}
        gl={{
          antialias: dpr[1] > 1,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
        frameloop="always"
      >
        <Suspense fallback={null}>
          <Scene scrollProgress={scrollProgress} />
        </Suspense>
      </Canvas>
    </div>
  );
}
