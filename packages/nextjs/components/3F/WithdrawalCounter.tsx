import React from "react";

//Retiro es cada dia 5 dentro de cada 3 meses

export const WithdrawalCounter = ({ date, time }: { date: string; time: string }) => {
  return (
    <>
      <p>{`${date} and ${time}`}</p>
    </>
  );
};
