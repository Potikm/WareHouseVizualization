import React, { useState, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
import { useEffect } from "react";

const BOX_WIDTH = 1;
const BOX_HEIGHT = 1;
const BOX_DEPTH = 1.2;
const GAP = 0.2;


useEffect(() => {
  
}, []);

const Box = ({ x, y, z, hasGoods, label, isTarget }) => (
  <mesh position={[x, y, z]}>
    <boxGeometry args={[BOX_WIDTH, BOX_HEIGHT, BOX_DEPTH]} />
    <meshStandardMaterial color={isTarget ? "red" : hasGoods ? "#4ade80" : "#4ade80"} />
  </mesh>
);

export default function WarehouseZones() {
  const [warehouseData, setWarehouseData] = useState(null);
  const [searchLabel, setSearchLabel] = useState("");
  const [searchGoods, setSearchGoods] = useState("");
  const [searchBatch, setSearchBatch] = useState("");
  const [targetPosition, setTargetPosition] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        setWarehouseData(json);
        setTargetPosition(null);
      } catch (err) {
        alert("Chybný JSON soubor.");
      }
    };
    reader.readAsText(file);
  };

  const findGoodsPosition = () => {
    setTargetPosition(null); // reset před novým hledáním

    if (!warehouseData) return;

    for (const zone of warehouseData.zones) {
      const floorPos = zone.floor.position || [0, -0.5, 0];
      const maxX = Math.max(...zone.racks.map((r) => r.x));
      const maxZ = Math.max(...zone.racks.map((r) => r.z));
      const zoneWidth = (maxX + 1) * BOX_WIDTH + maxX;
      const zoneDepth = (maxZ + 1) * BOX_DEPTH + maxZ * 1.5;

      const rack = zone.racks.find((r) => r.label.toLowerCase() === searchLabel.toLowerCase());
      if (rack) {
        const x = floorPos[0] - zoneWidth / 2 + rack.x * (BOX_WIDTH + GAP) + BOX_WIDTH / 2;
        const y = rack.y * (BOX_HEIGHT + GAP) + BOX_HEIGHT / 2;
        const z = floorPos[2] - zoneDepth / 2 + rack.z * (BOX_DEPTH + GAP + 1.5) + BOX_DEPTH / 2;

        // ⚠️ Důležité: nastav novou instanci pole (aby se useMemo aktualizovalo)
        setTargetPosition([x, y, z]);
        return;
      }
    }

    alert("Zboží nebylo nalezeno.");
    setTargetPosition(null);
  };



  const findGoodsPositionBatch = () => {
    setTargetPosition(null); // reset před novým hledáním

    if (!warehouseData) return;

    for (const zone of warehouseData.zones) {
      const floorPos = zone.floor.position || [0, -0.5, 0];
      const maxX = Math.max(...zone.racks.map((r) => r.x));
      const maxZ = Math.max(...zone.racks.map((r) => r.z));
      const zoneWidth = (maxX + 1) * BOX_WIDTH + maxX;
      const zoneDepth = (maxZ + 1) * BOX_DEPTH + maxZ * 1.5;

      const rack = zone.racks.find((r) => r.label.toLowerCase() === searchLabel.toLowerCase());
      if (rack) {
        const x = floorPos[0] - zoneWidth / 2 + rack.x * (BOX_WIDTH + GAP) + BOX_WIDTH / 2;
        const y = rack.y * (BOX_HEIGHT + GAP) + BOX_HEIGHT / 2;
        const z = floorPos[2] - zoneDepth / 2 + rack.z * (BOX_DEPTH + GAP + 1.5) + BOX_DEPTH / 2;

        // ⚠️ Důležité: nastav novou instanci pole (aby se useMemo aktualizovalo)
        setTargetPosition([x, y, z]);
        return;
      }
    }

    alert("Zboží nebylo nalezeno.");
    setTargetPosition(null);
  };

  const fetchWareHouse = async () => {
  const response = await fetch(`https://api.example.com/pallet/`);
  const data = await response.json();
  return data;
  };

  const fetchPositionByPallet = async (palletCode) => {
  const response = await fetch(`https://api.example.com/pallet/${palletCode}`);
  const data = await response.json();
  return data.position;  // např. "R123"
  };

  const fetchPositionByGoodsAndBatch = async (goods, batch) => {
    const response = await fetch(`https://api.example.com/goods?item=${goods}&batch=${batch}`);
    const data = await response.json();
    return data.position;  // např. "R123"
  };


  const highlightPositionByLabel = (positionLabel) => {
  if (!warehouseData) return;

  for (const zone of warehouseData.zones) {
    const floorPos = zone.floor.position || [0, -0.5, 0];
    const maxX = Math.max(...zone.racks.map((r) => r.x));
    const maxZ = Math.max(...zone.racks.map((r) => r.z));
    const zoneWidth = (maxX + 1) * BOX_WIDTH + maxX;
    const zoneDepth = (maxZ + 1) * BOX_DEPTH + maxZ * 1.5;

    const rack = zone.racks.find((r) => r.label.toLowerCase() === positionLabel.toLowerCase());
    if (rack) {
      const x = floorPos[0] - zoneWidth / 2 + rack.x * (BOX_WIDTH + GAP) + BOX_WIDTH / 2;
      const y = rack.y * (BOX_HEIGHT + GAP) + BOX_HEIGHT / 2;
      const z = floorPos[2] - zoneDepth / 2 + rack.z * (BOX_DEPTH + GAP + 1.5) + BOX_DEPTH / 2;
      setTargetPosition([x, y, z]);
      return;
    }
  }

  alert("Pozice v aktuálním skladu nenalezena.");
  setTargetPosition(null);
};


  const handlePalletSearch = async () => {
    try {
      const positionLabel = await fetchPositionByPallet(searchLabel);
      highlightPositionByLabel(positionLabel);
    } catch (error) {
      alert("Chyba při hledání palety.");
    }
  };

  const handleGoodsBatchSearch = async () => {
    try {
      const positionLabel = await fetchPositionByGoodsAndBatch(searchGoods, searchBatch);
      highlightPositionByLabel(positionLabel);
    } catch (error) {
      alert("Chyba při hledání zboží.");
    }
  };

  const handleWareHouseSearch = async () => {
  try {
    const positionLabel = await fetchWareHouse();
    
  } catch (error) {
    alert("Chyba při hledání palety.");
  }
};


  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {!warehouseData ? (
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        <h2>Nahraj sklad rozdělený na zóny (JSON)</h2>
        <input type="file" accept=".json" onChange={handleFileUpload} style={{ marginTop: "1rem" }} />
      </div>


      ) : (
        <>
          <div style={{ position: "absolute", top: 20, left: 20, zIndex: 1 }}>
            <input
              type="text"
              placeholder="Paleta"
              value={searchLabel}
              onChange={(e) => setSearchLabel(e.target.value)}
              style={{ padding: "0.5rem", fontSize: "1rem", marginRight: "0.5rem" }}
            />
            <button onClick={handlePalletSearch} style={{ padding: "0.5rem 1rem", fontSize: "1rem" }}>
              Najít paletu
            </button>
            <input
              type="text"
              placeholder="Zboží"
              value={searchGoods}
              onChange={(e) => setSearchGoods(e.target.value)}
              style={{ padding: "0.5rem", fontSize: "1rem", marginRight: "0.5rem" }}
            />
            <input
              type="text"
              placeholder="Šarže"
              value={searchBatch}
              onChange={(e) => setSearchBatch(e.target.value)}
              style={{ padding: "0.5rem", fontSize: "1rem", marginRight: "0.5rem" }}
            />
            <button onClick={handleGoodsBatchSearch} style={{ padding: "0.5rem 1rem", fontSize: "1rem" }}>
              Najít zboží
            </button>
          </div>

          <Canvas camera={{ position: [40, 25, 50], fov: 10 }}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[50, 50, 30]} />
            <OrbitControls maxPolarAngle={Math.PI / 2.2} minPolarAngle={Math.PI / 6} />

            {warehouseData.zones.map((zone, zoneIdx) => {
              const floorPos = zone.floor.position || [0, -0.5, 0];
              const racks = zone.racks;

              const maxX = Math.max(...racks.map((r) => r.x));
              const maxZ = Math.max(...racks.map((r) => r.z));

              const zoneWidth = (maxX + 1) * BOX_WIDTH + maxX;
              const zoneDepth = (maxZ + 1) * BOX_DEPTH + maxZ * 1.5;

              const uniqueZ = [...new Set(racks.map((r) => r.z))];

              return (
                <group key={zoneIdx}>
                  {racks.map((rack, i) => {
                    const x = floorPos[0] - zoneWidth / 2 + rack.x * (BOX_WIDTH + GAP) + BOX_WIDTH / 2;
                    const y = rack.y * (BOX_HEIGHT + GAP) + BOX_HEIGHT / 2;
                    const z = floorPos[2] - zoneDepth / 2 + rack.z * (BOX_DEPTH + GAP + 1.5) + BOX_DEPTH / 2;

                    const isTarget = rack.label === searchLabel;

                    return (
                      <Box
                        key={i}
                        x={x}
                        y={y}
                        z={z}
                        hasGoods={rack.hasGoods}
                        label={rack.label}
                        isTarget={isTarget}
                      />
                    );
                  })}

                  {uniqueZ.map((z, idx) => {
                    const label = `R${z + 1}`;
                    const textX = floorPos[0] - zoneWidth / 2 - 1.5;
                    const textY = BOX_HEIGHT / 2;
                    const textZ =
                      floorPos[2] - zoneDepth / 2 + z * (BOX_DEPTH + GAP + 1.5) + BOX_DEPTH / 2;

                    return (
                      <Text
                        key={`label-${idx}`}
                        position={[textX, textY, textZ]}
                        fontSize={1}
                        color="#FF1493"
                        rotation={[-Math.PI / 2, 0, 0]}
                      >
                        {label}
                      </Text>
                    );
                  })}
                </group>
              );
            })}

            {targetPosition && (
            <line key={targetPosition.join("-")}>
              <bufferGeometry attach="geometry">
                <bufferAttribute
                  attach="attributes-position"
                  count={2}
                  array={new Float32Array([
                    -30, 0.5, -30,
                    ...targetPosition,
                  ])}
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial attach="material" color="yellow" />
            </line>
          )}


          </Canvas>
        </>
      )}
    </div>
  );
}
