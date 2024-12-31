import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Terminos y condiciones",
  description: "Tu tienes el control",
});

const TermsLayout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default TermsLayout;
