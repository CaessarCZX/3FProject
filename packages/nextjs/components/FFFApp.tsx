import { useEffect, useState } from "react";
import Loader from "./UI/Loader";
import { Toaster } from "react-hot-toast";
import { useInitializeMexicanPesoPrice } from "~~/hooks/3FProject/useInitializeMexicanPesoPrice";
import { useInitializeNativeCurrencyPrice } from "~~/hooks/scaffold-eth";

export const FFFApp = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState<boolean>(true);
  useInitializeNativeCurrencyPrice();
  useInitializeMexicanPesoPrice();

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <main className="relative flex flex-col flex-1">{loading ? <Loader /> : children}</main>
      </div>
      <Toaster />
    </>
  );
};
