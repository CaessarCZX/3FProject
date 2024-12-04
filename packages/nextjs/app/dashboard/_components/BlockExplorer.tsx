"use client";

// import { useEffect, useState } from "react";
import { useEffect, useState } from "react";
import { TransactionsTable } from "./TransactionsTable";
import { jwtDecode } from "jwt-decode";
// import { PaginationButton } from "./PaginationButton";
import { useGlobalState } from "~~/services/store/store";

// import { notification } from "~~/utils/scaffold-eth";

interface DecodedToken {
  wallet: string;
}

const BlockExplorer = () => {
  // const { filteredTransactions, transactionReceipts, currentPage, totalBlocks, setCurrentPage, error } =
  //   useFetchFilteredBlocks(address);

  const [wallet, setWallet] = useState<string | null>(null);

  const memberTransactions = useGlobalState(state => state.memberTransactions.transactions);
  const isLoading = useGlobalState(state => state.memberTransactions.isFetching);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      try {
        // Decodifica el JWT para obtener el contenido del payload
        const decoded: DecodedToken = jwtDecode(storedToken);
        setWallet(decoded.wallet || null); // Extrae la propiedad wallet
      } catch (error) {
        console.error("Error al decodificar el token:", error);
      }
    }
  }, []);

  // const { targetNetwork } = useTargetNetwork();
  // const [hasError, setHasError] = useState(false);

  // useEffect(() => {
  //   if (hasError) {
  //     notification.error(
  //       <>
  //         <p className="font-bold mt-0 mb-1">Cannot connect to network provider</p>
  //         <p className="m-0">
  //           - Please <code className="italic bg-base-300 text-base font-bold">Reload Page</code>
  //         </p>
  //         <p className="mt-1 break-normal">
  //           - Or <code className="italic bg-base-300 text-base font-bold">Try again later</code> in{" "}
  //         </p>
  //       </>,
  //     );
  //   }
  // }, [hasError]);

  return (
    <div className="container mx-auto rounded-xl overflow-hidden">
      {isLoading ? (
        <p>Cargando los datos</p>
      ) : memberTransactions.length === 0 ? (
        <p> No hay datos disponibles para mostrar </p>
      ) : (
        <TransactionsTable transactions={memberTransactions} />
      )}

      <div>
        <p>{wallet ? `Wallet: ${wallet}` : "Wallet no asignado."}</p>
      </div>

      {/* <PaginationButton currentPage={currentPage} totalItems={Number(totalBlocks)} setCurrentPage={setCurrentPage} /> */}
    </div>
  );
};

export default BlockExplorer;
