"use client";

import { ComponentType, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export default function ProtectedRoute(Outlet: ComponentType): ComponentType {
  return function ProtectedRoute(props: any) {
    const router = useRouter();
    const currentMember = useAccount();

    // Recupera el status del la wallet del usuario en el contrato
    const { data: isActiveMember } = useScaffoldReadContract({
      contractName: "FFFBusiness",
      functionName: "checkActiveMember",
      args: [currentMember?.address],
    });

    // Se activa una sola vez para por cada renderizacion de los componentes protegidos
    // Solo funciona con un solo componente (Dashboard por el momento)
    useEffect(() => {
      setTimeout(() => {
        if (isActiveMember == false || isActiveMember == undefined) {
          router.push("/");
          console.log(isActiveMember);
        }
      }, 500);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (isActiveMember == undefined) return null;

    return <Outlet {...props} />;
  };
}
