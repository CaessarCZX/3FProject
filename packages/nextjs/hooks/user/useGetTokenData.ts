import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  id: string;
  email: string;
  name: string;
  wallet: string;
  isAdmin: boolean;
  isActive: boolean;
  ReferersCommissions: string[];
  email_beneficiary: string;
  name_beneficiary: string;
  balance: number;
  referrals: string[];
  membership: number;
}

export const useGetTokenData = () => {
  const [tokenInfo, setTokenInfo] = useState<DecodedToken>();

  useEffect(() => {
    const storedToken = window.localStorage.getItem("token");

    if (!storedToken) return;

    try {
      const decoded: DecodedToken = jwtDecode(storedToken);

      if (!decoded) throw new Error("Decode token error");

      setTokenInfo({
        id: decoded.id,
        email: decoded.email,
        name: decoded.name,
        wallet: decoded.wallet,
        isAdmin: decoded.isAdmin,
        isActive: decoded.isActive,
        ReferersCommissions: decoded.ReferersCommissions,
        email_beneficiary: decoded.email_beneficiary,
        name_beneficiary: decoded.name_beneficiary,
        balance: decoded.balance,
        referrals: decoded.referrals,
        membership: decoded.membership,
      });
    } catch (e) {
      console.error("Error obtaining token information: ", e);
    }
  }, []);

  return { tokenInfo };
};
