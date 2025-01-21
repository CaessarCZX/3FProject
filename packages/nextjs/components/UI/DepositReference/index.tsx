import React from "react";

const DepositReference: React.FC<{ isNormalDeposit: boolean | null }> = ({ isNormalDeposit }) => (
  <p className="my-0 pt-1 text-xs">
    {!isNormalDeposit
      ? "El deposito minimo es de 2500 USDT (500 membresia + 2000 ahorro)"
      : "El deposito minimo es de 2000 USDT"}
  </p>
);

export default DepositReference;
