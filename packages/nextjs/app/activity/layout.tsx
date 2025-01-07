import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Actividad de la cuenta",
  description: "Mira la actividad que ha tenido tu cuenta",
});

const ActivityLayout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default ActivityLayout;
