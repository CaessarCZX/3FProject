import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Ahorros",
  description: "Inspección de ahorros",
});

const SavingsLayout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default SavingsLayout;
