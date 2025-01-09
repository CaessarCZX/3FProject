import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useGlobalState } from "~~/services/store/store";

interface DecodedToken {
  referrals: string[];
}

export const useGetMemberAffiliatesNumber = () => {
  const initialAffiliate = useGlobalState(state => state.setMemberAffiliatesCount);

  useEffect(() => {
    const storageToken = window.localStorage.getItem("token");

    if (!storageToken) {
      return;
    }

    try {
      const decoded: DecodedToken = jwtDecode(storageToken);

      if (!decoded.referrals) {
        throw new Error("No se pudieron obtener referidos");
      }

      initialAffiliate(decoded.referrals.length);
    } catch (e) {
      console.log("Un error ha ocurrido: ", e);
      initialAffiliate(0);
    }
  }, [initialAffiliate]);
};
