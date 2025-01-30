import { useEffect } from "react";
import { ToastPosition } from "react-hot-toast";
import { notification } from "~~/utils/scaffold-eth";

interface ShowUiNotificationsProps {
  success?: string | null;
  setSuccess?: (newMessage: string) => void;
  error?: string | null;
  setError?: (newMessage: string) => void;
  duration?: number;
  position?: ToastPosition;
}

export const useShowUiNotifications = ({
  success,
  setSuccess,
  error,
  setError,
  duration,
  position,
}: ShowUiNotificationsProps) => {
  // Mensajes a ui
  useEffect(() => {
    if (error) {
      notification.error(error, {
        position: position ?? "bottom-right",
        duration: duration ?? 5000,
      });
      if (typeof setError === "function") setError("");
    }

    if (success) {
      notification.success(success, {
        position: position ?? "bottom-right",
        duration: duration ?? 5000,
      });
      if (typeof setSuccess === "function") setSuccess("");
    }
  }, [duration, error, position, setError, setSuccess, success]);
};
