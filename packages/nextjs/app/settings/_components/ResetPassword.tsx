import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { RiEyeCloseLine, RiEyeLine } from "react-icons/ri";
import { notification } from "~~/utils/scaffold-eth/notification";

interface DecodedToken {
  id: string;
  name: string;
  email: string;
  wallet: string;
}

const ResetPassword: React.FC = () => {
  const [userInfo, setUserInfo] = useState<{
    email: string;
    wallet: string;
  } | null>(null);
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken: DecodedToken = jwtDecode(token);
        setUserInfo({
          email: decodedToken.email,
          wallet: decodedToken.wallet,
        });
      } catch (error) {
        console.error("Error al decodificar el token:", error);
      }
    }
  }, []);

  const handlePasswordChange = async () => {
    if (!password || !repeatPassword) {
      notification.error("Por favor, completa ambos campos.", {
        position: "bottom-right",
        duration: 5000,
      });
      return;
    }
    if (password !== repeatPassword) {
      notification.error("Las contraseñas no coinciden.", {
        position: "bottom-right",
        duration: 5000,
      });
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/f3api/users/resetPassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userInfo?.email,
          wallet: userInfo?.wallet,
          newPassword: password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        notification.success(result.message || "¡Contraseña cambiada exitosamente!", {
          position: "bottom-right",
          duration: 5000,
        });
        setPassword("");
        setRepeatPassword("");

        // Redirigir al usuario a la página de inicio
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        notification.error(result.message || "Error al cambiar la contraseña.", {
          position: "bottom-right",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Error al llamar a la API:", error);
      notification.error("Hubo un error al cambiar la contraseña. Inténtalo de nuevo.", {
        position: "bottom-right",
        duration: 5000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-3xl font-light text-gray-500">Cambiar Contraseña</h2>

        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-700">Nueva Contraseña</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Nueva contraseña"
                  className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <div
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <RiEyeLine className="text-gray-600" />
                  ) : (
                    <RiEyeCloseLine className="text-gray-600" />
                  )}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Repetir Contraseña</label>
              <div className="relative">
                <input
                  type={showRepeatPassword ? "text" : "password"}
                  value={repeatPassword}
                  onChange={e => setRepeatPassword(e.target.value)}
                  placeholder="Repite la nueva contraseña"
                  className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <div
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                  onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                >
                  {showRepeatPassword ? (
                    <RiEyeLine className="text-gray-600" />
                  ) : (
                    <RiEyeCloseLine className="text-gray-600" />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={handlePasswordChange}
              disabled={isSaving}
              className={`px-6 py-2 ${
                isSaving ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
              } text-white rounded-md shadow focus:outline-none`}
            >
              {isSaving ? "Guardando..." : "Cambiar Contraseña"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
