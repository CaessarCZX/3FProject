import React from "react";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Login",
  description: "¿Ovidaste tu contraseña",
});

interface LoginLayoutProps {
  children: React.ReactNode;
}

const LoginLayout: React.FC<LoginLayoutProps> = ({ children }) => {
  return <>{children}</>;
};

export default LoginLayout;
