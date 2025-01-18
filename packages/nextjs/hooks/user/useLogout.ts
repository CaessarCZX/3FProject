import { useEffect } from "react";
import { useDisconnect } from "wagmi";
import { useGlobalState } from "~~/services/store/store";

export const useLogout = () => {
  const { disconnect } = useDisconnect();

  useEffect(() => {
    const localToken = window.localStorage.getItem("token");
    const sessionToken = window.sessionStorage.getItem("sessionToken");

    if (localToken && !sessionToken) {
      window.localStorage.removeItem("token");
      useGlobalState.persist.clearStorage();
      return () => disconnect();
    }
  }, [disconnect]);
};
