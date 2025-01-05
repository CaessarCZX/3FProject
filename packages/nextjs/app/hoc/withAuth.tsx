"use client";

import { ComponentType, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  isActive: boolean;
}

const withAuth = <P extends object>(WrappedComponent: ComponentType<P>): ComponentType<P> => {
  const AuthComponent = (props: P) => {
    const router = useRouter();

    useEffect(() => {
      const localToken = localStorage.getItem("token");
      const sessionToken = sessionStorage.getItem("sessionToken");

      // Si alguno de los dos tokens falta, redirige al login
      if (!localToken || !sessionToken) {
        router.push("/login");
        return;
      }

      try {
        // Decodificar el token para validar isActive
        const decoded: DecodedToken = jwtDecode(localToken);

        if (!decoded.isActive) {
          // Si isActive es false, redirige a login
          router.push("/login");
        }
      } catch (error) {
        console.error("Error al decodificar el token:", error);
        // Limpiar almacenamiento si el token es inválido
        localStorage.removeItem("token");
        sessionStorage.removeItem("sessionToken");
        router.push("/login");
      }
    }, [router]);

    const localToken = typeof window !== "undefined" && localStorage.getItem("token");
    const sessionToken = typeof window !== "undefined" && sessionStorage.getItem("sessionToken");

    if (!localToken || !sessionToken) return null; // Renderiza nada mientras valida

    try {
      const decoded: DecodedToken = jwtDecode(localToken);
      if (!decoded.isActive) return null;
    } catch {
      return null; // Evita renderizar en caso de error
    }

    return <WrappedComponent {...props} />;
  };

  AuthComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

  return AuthComponent;
};

export default withAuth;
