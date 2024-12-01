"use client";

import { ComponentType, useEffect } from "react";
import { useRouter } from "next/navigation";

const withAuth = <P extends object>(WrappedComponent: ComponentType<P>): ComponentType<P> => {
  const AuthComponent = (props: P) => {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.replace("/login");
      }
    }, [router]); // Incluido router como dependencia

    const token = typeof window !== "undefined" && localStorage.getItem("token");
    if (!token) return null;

    return <WrappedComponent {...props} />;
  };

  AuthComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

  return AuthComponent;
};

export default withAuth;
