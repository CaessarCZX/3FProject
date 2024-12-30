import { jwtDecode } from "jwt-decode";

export const fetchMemberSavings = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return {
      memberSavings: [],
      error: "No se encontró un token de sesión.",
    };
  }

  try {
    const decodedToken: any = jwtDecode(token);
    const userId = decodedToken.id;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/f3api/transaction/${userId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("No se encontraron transacciones o ocurrió un error.");
    }

    const { transactions } = await response.json();
    return {
      memberSavings: transactions,
      error: "",
    };
  } catch (error) {
    console.error("Error al obtener transacciones:", error);
    return {
      memberSavings: [],
      error: "No se pudieron obtener las transacciones.",
    };
  }
};
