import { useEffect } from "react";
import { useDisconnect } from "wagmi";
import { useGlobalState } from "~~/services/store/store";

export const useLogout = () => {
  const { disconnectAsync } = useDisconnect();

  useEffect(() => {
    const localToken = window.localStorage.getItem("token");
    const sessionToken = window.sessionStorage.getItem("sessionToken");

    const disconnect = async () => {
      try {
        await disconnectAsync();
      } catch (e) {
        console.error("Error al intentar desconectar");
      }
    };

    if (localToken && !sessionToken) {
      window.localStorage.removeItem("token");
      useGlobalState.persist.clearStorage();
      disconnect();
    }
  }, [disconnectAsync]);
};
