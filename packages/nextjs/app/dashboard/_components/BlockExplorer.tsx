"use client";

// import { useEffect, useState } from "react";
import { useEffect, useState } from "react";
import { TransactionsTable } from "./TransactionsTable";
import { jwtDecode } from "jwt-decode";
import { useGetMemberSavings } from "~~/hooks/user/useGetMemberSavings";
import { useGlobalState } from "~~/services/store/store";
import { notification } from "~~/utils/scaffold-eth";

// import { PaginationButton } from "./PaginationButton";

interface DecodedToken {
  wallet: string;
}

const BlockExplorer = () => {
  const [wallet, setWallet] = useState<string | null>(null);

  const memberTransactions = useGlobalState(state => state.memberSavings.transactions);
  const isLoading = useGlobalState(state => state.memberSavings.isFetching);
  const isActiveMember = useGlobalState(state => state.memberStatus.active);
  const { fetchSavings, error } = useGetMemberSavings();

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
        fetchSavings();
      }
    } catch (e) {
      console.error("Error al intentar traer transacciones");
      notification.error(error);
    }
  }, [fetchSavings, isActiveMember, error, memberTransactions]);

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
