import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Expansion",
  description: "Tu organizacion",
});

const ExpansionLayout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default ExpansionLayout;
