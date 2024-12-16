"use client";

import { ComponentType, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { useGlobalState } from "~~/services/store/store";

interface DecodedToken {
  isActive: boolean;
}

const withAuth = <P extends object>(WrappedComponent: ComponentType<P>): ComponentType<P> => {
  const AuthComponent = (props: P) => {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem("token");

      if (!token) {
        // Si no hay token, redirige al login
        router.push("/login");
        return;
      }

      try {
        // Decodificar el token para validar isActive
        const decoded: DecodedToken = jwtDecode(token);

        if (!decoded.isActive) {
          // Si isActive es false, redirige a la pagina login
          router.push("/login");
        }
      } catch (error) {
        console.error("Error al decodificar el token:", error);
        useGlobalState.persist.clearStorage(); // Borra el state local si es que el token es invalido
        router.push("/login"); // Redirige al login si el token es inválido
      }
    }, [router]);

    const token = typeof window !== "undefined" && localStorage.getItem("token");

    if (!token) return null; // Renderizar algo mientras redirige

    try {
      const decoded: DecodedToken = jwtDecode(token);
      if (!decoded.isActive) return null; // No renderiza el componente si el usuario no está activo
    } catch {
      return null; // En caso de error al decodificar, evita renderizar
    }

    return <WrappedComponent {...props} />;
  };

  AuthComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

  return AuthComponent;
};

export default withAuth;
