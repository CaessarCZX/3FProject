import { useEffect, useState } from "react";
import Loader from "./UI/Loader";
import { Toaster } from "react-hot-toast";
// import { useInitializeMemberTransactions } from "~~/hooks/3FProject/useInitializeMemberTransactions";
import { useInitializeMexicanPesoPrice } from "~~/hooks/3FProject/useInitializeMexicanPesoPrice";
import { useInitializeNativeCurrencyPrice } from "~~/hooks/scaffold-eth";
import { useGetMemberCommissions } from "~~/hooks/user/useGetMemberCommissions";

export const FFFApp = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState<boolean>(true);
  useInitializeNativeCurrencyPrice();
  useInitializeMexicanPesoPrice();
  useGetMemberCommissions();
  // useInitializeMemberTransactions();

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
