"use client";

// import { useEffect, useState } from "react";
import { useEffect, useState } from "react";
import { TransactionsTable } from "./TransactionsTable";
import { jwtDecode } from "jwt-decode";
import { useGetMemberTransactions } from "~~/hooks/user/useGetMemberTransactions";
import { useGlobalState } from "~~/services/store/store";
import { notification } from "~~/utils/scaffold-eth";

// import { PaginationButton } from "./PaginationButton";

interface DecodedToken {
  wallet: string;
}

// const { filteredTransactions, transactionReceipts, currentPage, totalBlocks, setCurrentPage, error } =
//   useFetchFilteredBlocks(address);

const BlockExplorer = () => {
  const [wallet, setWallet] = useState<string | null>(null);

  const memberTransactions = useGlobalState(state => state.memberTransactions.transactions);
  const isLoading = useGlobalState(state => state.memberTransactions.isFetching);
  const isActiveMember = useGlobalState(state => state.memberStatus.active);
  const { fetchTransactions, error } = useGetMemberTransactions();

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

  // Obtener las transacciones de los miembros del state global
  useEffect(() => {
    try {
      // Si el miembro esta activo pero surgio un error con la peticion, suelta un error
      if (isActiveMember && error) {
        throw new Error();
      }

      // Si esta activo, sus transacciones son 0 pero no tiene error, hace peticion
      if (isActiveMember && !error && memberTransactions.length === 0) {
        fetchTransactions();
      }
    } catch (e) {
      console.error("Error al intentar traer transacciones");
      notification.error(error);
    }
  }, [fetchTransactions, isActiveMember, error, memberTransactions]);

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
        <p>{wallet ? `Wallet: conectada` : "Wallet no asignado."}</p>
      </div>

      {/* <PaginationButton currentPage={currentPage} totalItems={Number(totalBlocks)} setCurrentPage={setCurrentPage} /> */}
    </div>
  );
};

export default BlockExplorer;
