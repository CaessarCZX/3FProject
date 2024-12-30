"use client";

import { ComponentType, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const withAccessControl = <P extends object>(WrappedComponent: ComponentType<P>): ComponentType<P> => {
  const AccessControlComponent = (props: P) => {
    const router = useRouter();
    const pathname = usePathname();
    const [isAllowed, setIsAllowed] = useState<boolean | null>(null);

    useEffect(() => {
      const allowedAccess = sessionStorage.getItem("allowAccess");

      // Bloquea el acceso si no hay permiso
      if (!allowedAccess && (pathname === "/register" || pathname === "/login" || pathname === "/resetPassword")) {
        router.push("/");
      } else {
        setIsAllowed(true); // Permitir acceso
      }
    }, [router, pathname]);

    // Mantener el estado de permiso durante la sesión, eliminar al iniciar sesion
    useEffect(() => {
      if (isAllowed && (pathname === "/register" || pathname === "/login" || pathname === "/resetPassword")) {
        sessionStorage.removeItem("allowAccess");
      }
    }, [pathname, isAllowed]);

    // Evitar renderizar el componente hasta que la validación esté completa
    if (isAllowed === null) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  AccessControlComponent.displayName = `withAccessControl(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return AccessControlComponent;
};

export default withAccessControl;
