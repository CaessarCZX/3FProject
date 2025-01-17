"use client";

// import { useEffect, useState } from "react";
import { useEffect, useState } from "react";
import { TransactionsTable } from "./TransactionsTable";
import { PaginationButton } from "~~/components/UI/PaginationBtn";
import { useGetMemberSavings } from "~~/hooks/user/useGetMemberSavings";
import { useGlobalState } from "~~/services/store/store";
import { notification } from "~~/utils/scaffold-eth";

// import { PaginationButton } from "./PaginationButton";

const BlockExplorer = () => {
  const memberTransactions = useGlobalState(state => state.memberSavings.transactions);
  const isLoading = useGlobalState(state => state.memberSavings.isFetching);
  const withMembership = useGlobalState(state => state.memberStatus.withMembership);
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [totalPages, setTotalPages] = useState(1); // Total de páginas
  const { page, pages, fetchSavings, error } = useGetMemberSavings();

  // Obtener las transacciones de los miembros del state global
  useEffect(() => {
    try {
      // Si el miembro esta activo pero surgio un error con la peticion, suelta un error
      if (withMembership && error) {
        throw new Error();
      }

      // Si esta activo, sus transacciones son 0 pero no tiene error, hace peticion
      if (withMembership && !error && memberTransactions.length === 0) {
        fetchSavings(currentPage);
        setCurrentPage(page || 1);
        setTotalPages(pages || 1);
      }
    } catch (e) {
      console.error("Error al intentar traer transacciones");
      notification.error("Cargando data");
    }
  }, [fetchSavings, withMembership, error, memberTransactions, currentPage, page, pages]);

  return (
    <div className="container mx-auto rounded-xl overflow-hidden">
      {isLoading ? (
        <p className="my-12 font-bold text-xl">Cargando los datos ...</p>
      ) : (
        <TransactionsTable transactions={memberTransactions} />
      )}
      <PaginationButton currentPage={currentPage} totalItems={Number(totalPages)} setCurrentPage={setCurrentPage} />
    </div>
  );
};

export default BlockExplorer;
