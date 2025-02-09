import { useEffect, useState } from "react";
import { ToastPosition } from "react-hot-toast";
import { notification } from "~~/utils/scaffold-eth";

interface ShowUiNotificationsProps {
  duration?: number;
  position?: ToastPosition;
}

const useDisplayNotifications = ({ duration = 5000, position = "bottom-right" }: ShowUiNotificationsProps) => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Mensajes a ui
  useEffect(() => {
    if (error) {
      notification.error(error, {
        position: position,
        duration: duration,
      });
      setError("");
    }

    if (success) {
      notification.success(success, {
        position: position,
        duration: duration,
      });
      setSuccess("");
    }
  }, [duration, error, position, setError, setSuccess, success]);

  return { setError, setSuccess };
};

export default useDisplayNotifications;
