"use client";

import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import ReactFlow, { Background, Controls, Edge, Node } from "reactflow";
import "reactflow/dist/style.css";

interface Referral {
  wallet: string;
  name: string;
  email: string;
  parentWallet: string; // Relación con el nivel anterior
}

interface ReferersCommissions {
  level: number;
  referrals: Referral[];
}

const ReferralNetwork: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReferersCommissions = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No se encontró un token de sesión.");
        setIsLoading(false);
        return;
      }

      try {
        const decodedToken: any = jwtDecode(token);
        const userWallet = decodedToken.wallet;

        if (!userWallet) {
          setError("No se encontró la wallet del usuario en el token.");
          setIsLoading(false);
          return;
        }

        const url = `${process.env.NEXT_PUBLIC_API_BACKEND}/f3api/users/referers/${userWallet}`;
        const response = await fetch(url, { method: "GET" });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error al obtener los referidos.");
        }

        const data = await response.json();

        if (Array.isArray(data.ReferersCommissions)) {
          buildGraph(data.ReferersCommissions, userWallet);
        } else {
          setError("Los datos de comisiones no son válidos.");
        }
      } catch (error: any) {
        setError("Ocurrió un error al obtener los referidos. Intenta de nuevo más tarde.");
      } finally {
        setIsLoading(false);
      }
    };

    const buildGraph = (referersCommissions: ReferersCommissions[], rootWallet: string) => {
      const tempNodes: Node[] = [];
      const tempEdges: Edge[] = [];

      // Nodo raíz (Usuario principal)
      tempNodes.push({
        id: rootWallet,
        data: {
          label: (
            <div>
              <p>
                <strong>Tu Wallet:</strong> {rootWallet}
              </p>
            </div>
          ),
        },
        position: { x: 500, y: 0 },
        style: { background: "#f5f5f5", border: "1px solid #ccc", borderRadius: "8px", width: 350 },
      });

      let yOffset = 125;

      referersCommissions.forEach(level => {
        const levelYOffset = yOffset; // Offset inicial por nivel
        let xOffset = 0;

        level.referrals.forEach(referral => {
          tempNodes.push({
            id: referral.wallet,
            data: {
              label: (
                <div style={{ textAlign: "center" }}>
                  <p>
                    <strong>Wallet:</strong> {referral.wallet}
                  </p>
                  <p>
                    <strong>Nombre:</strong> {referral.name}
                  </p>
                  <p>
                    <strong>Correo:</strong> {referral.email}
                  </p>
                </div>
              ),
            },
            position: { x: xOffset, y: yOffset },
            style: { background: "#e3f2fd", border: "1px solid #64b5f6", borderRadius: "8px", width: 350 },
          });

          // Conectar al "padre"
          tempEdges.push({
            id: `e-${referral.parentWallet}-${referral.wallet}`,
            source: referral.parentWallet,
            target: referral.wallet,
            animated: true,
          });

          xOffset += 375; // Espaciado horizontal entre nodos
        });

        yOffset = levelYOffset + 125; // Incrementar el espacio vertical
      });

      setNodes(tempNodes);
      setEdges(tempEdges);
    };

    fetchReferersCommissions();
  }, []);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      {isLoading ? (
        <p>Cargando datos...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <ReactFlow nodes={nodes} edges={edges}>
          <Background />
          <Controls />
        </ReactFlow>
      )}
    </div>
  );
};

export default ReferralNetwork;
