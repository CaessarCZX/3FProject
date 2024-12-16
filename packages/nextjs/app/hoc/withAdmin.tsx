"use client";

import { ComponentType, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  isAdmin: boolean;
  exp: number;
  [key: string]: any;
}

const withAdmin = <P extends object>(WrappedComponent: ComponentType<P>): ComponentType<P> => {
  const AdminComponent = (props: P) => {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login"); // Redirige al login si no está autenticado
        return;
      }

      try {
        // Decodifica el JWT
        const decoded: DecodedToken = jwtDecode(token);

        // Verifica si el token es válido y si el usuario es administrador
        if (!decoded.isAdmin) {
          router.push("/403"); // Redirige si no es administrador
          return;
        }

        // Opcional: Verifica si el token ha expirado
        const now = Math.floor(Date.now() / 2000); // Tiempo actual en segundos
        if (decoded.exp && decoded.exp < now) {
          localStorage.removeItem("token"); // Limpia el token si ha expirado
          router.push("/login"); // Redirige al login
        }
      } catch (error) {
        console.error("Error al decodificar el token:", error);
        localStorage.removeItem("token"); // Limpia el token si es inválido
        router.push("/login");
      }
    }, [router]);

    // Si no hay token o el usuario no es admin, muestra nada
    const token = typeof window !== "undefined" && localStorage.getItem("token");
    if (!token) return null;

    try {
      const decoded: DecodedToken = jwtDecode(token);
      if (!decoded.isAdmin) return null;
    } catch {
      return null;
    }

    // Renderiza el componente protegido si el usuario es admin
    return <WrappedComponent {...props} />;
  };

  AdminComponent.displayName = `withAdmin(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

  return AdminComponent;
};

export default withAdmin;
