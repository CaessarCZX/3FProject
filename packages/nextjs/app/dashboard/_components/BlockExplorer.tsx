"use client";

// import { useEffect, useState } from "react";
import { useEffect } from "react";
import { TransactionsTable } from "./TransactionsTable";
import { useGetMemberSavings } from "~~/hooks/user/useGetMemberSavings";
import { useGlobalState } from "~~/services/store/store";
import { notification } from "~~/utils/scaffold-eth";

// import { PaginationButton } from "./PaginationButton";

const BlockExplorer = () => {
  const memberTransactions = useGlobalState(state => state.memberSavings.transactions);
  const isLoading = useGlobalState(state => state.memberSavings.isFetching);
  const withMembership = useGlobalState(state => state.memberStatus.withMembership);
  const { fetchSavings, error } = useGetMemberSavings();

  // Obtener las transacciones de los miembros del state global
  useEffect(() => {
    try {
      // Si el miembro esta activo pero surgio un error con la peticion, suelta un error
      if (withMembership && error) {
        throw new Error();
      }

      // Si esta activo, sus transacciones son 0 pero no tiene error, hace peticion
      if (withMembership && !error && memberTransactions.length === 0) {
        fetchSavings();
      }
    } catch (e) {
      console.error("Error al intentar traer transacciones");
      notification.error(error);
    }
  }, [fetchSavings, withMembership, error, memberTransactions]);

  return (
    <div className="container mx-auto rounded-xl overflow-hidden">
      {isLoading ? (
        <p>Cargando los datos</p>
      ) : memberTransactions.length === 0 ? (
        <p> No hay datos disponibles para mostrar </p>
      ) : (
        <TransactionsTable transactions={memberTransactions} />
      )}
      {/* <PaginationButton currentPage={currentPage} totalItems={Number(totalBlocks)} setCurrentPage={setCurrentPage} /> */}
    </div>
  );
};

export default BlockExplorer;
