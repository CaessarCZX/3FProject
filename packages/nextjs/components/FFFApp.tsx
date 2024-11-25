// import { Toaster } from "react-hot-toast";
// import { Footer } from "~~/components/Layouts/Footer";
// import { Header } from "~~/components/Layouts/Header";
import InternalLayout from "./Layouts/InternalLayout";
import { useInitializeMemberTransactions } from "~~/hooks/3FProject/useInitializeMemberTransactions";
import { useInitializeMexicanPesoPrice } from "~~/hooks/3FProject/useInitializeMexicanPesoPrice";
import { useInitializeNativeCurrencyPrice } from "~~/hooks/scaffold-eth";

export const FFFApp = ({ children }: { children: React.ReactNode }) => {
  useInitializeNativeCurrencyPrice();
  useInitializeMexicanPesoPrice();
  useInitializeMemberTransactions();

  return (
    <>
      <InternalLayout>{children}</InternalLayout>
      {/* <div className="flex flex-col min-h-screen">
        <Header />
        <main className="relative flex flex-col flex-1">{children}</main>
        <Footer />
      </div>
      <Toaster /> */}
    </>
  );
};
