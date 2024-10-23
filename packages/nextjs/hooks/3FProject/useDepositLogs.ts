import { useState } from "react";

export const useDepositLogs = (address: string | null) => {
  const [error, setError] = useState(false);
  console.log(address, error);
  setError(true);
};
