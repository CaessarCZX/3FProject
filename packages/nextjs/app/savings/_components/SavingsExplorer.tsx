"use client";

import React, { useEffect } from "react";
import SavingsTable from "./SavingsTable";
import { useSavings } from "~~/hooks/user/useSavings";

const SavingsExplorer: React.FC = () => {
  const savings = useSavings();

  useEffect(() => {
    if (savings === null) {
      console.log("nule transactions");
    }
  }, [savings]);
  return (
    <div className="mx-auto rounded-xl overflow-hidden">
      {savings.length === 0 ? <p> No hay datos disponibles para mostrar </p> : <SavingsTable transactions={savings} />}
      {/* <PaginationButton currentPage={currentPage} totalItems={Number(totalBlocks)} setCurrentPage={setCurrentPage} /> */}
    </div>
  );
};

export default SavingsExplorer;
