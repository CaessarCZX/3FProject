import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Panel de Control",
  description: "Tu tienes el control",
});

const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default SettingsLayout;
