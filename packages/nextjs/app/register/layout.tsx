import "@rainbow-me/rainbowkit/styles.css";
import "~~/styles/globals.css";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Register",
  description: "Welcome to the family",
});

interface RegisterLayoutProps {
  children: React.ReactNode;
}

const RegisterLayaout: React.FC<RegisterLayoutProps> = ({ children }) => {
  return <>{children}</>;
};

export default RegisterLayaout;
