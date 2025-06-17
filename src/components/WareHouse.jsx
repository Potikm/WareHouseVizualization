import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

const ROWS = 21;
const LEVELS = 4;
const BOX_WIDTH = 1;
const BOX_HEIGHT = 1;
const BOX_DEPTH = 1.2;
const GAP = 0.2;

const Box = ({ x, y, z }) => {
  return (
    <mesh position={[x, y, z]}>
      <boxGeometry args={[BOX_WIDTH, BOX_HEIGHT, BOX_DEPTH]} />
      <meshStandardMaterial color="#4ade80" />
    </mesh>
  );
};

export default function Warehouse3D() {
  return (
    <div style={{ width: "100vw", height: "100vh", margin: 0, padding: 0 }}>
      <Canvas camera={{ position: [10, 10, 20], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} />
        <OrbitControls />

        {/* Podlaha */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 12]}>
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial color="#f0f0f0" />
        </mesh>

        {/* Regály */}
        {Array.from({ length: ROWS }).map((_, rowIdx) =>
          Array.from({ length: LEVELS }).map((_, levelIdx) => {
            const x = 0;
            const y = levelIdx * (BOX_HEIGHT + GAP);
            const z = rowIdx * (BOX_DEPTH + GAP);

            return (
              <Box key={`r${rowIdx}-l${levelIdx}`} x={x} y={y} z={z} />
            );
          })
        )}
      </Canvas>
    </div>
  );
}
