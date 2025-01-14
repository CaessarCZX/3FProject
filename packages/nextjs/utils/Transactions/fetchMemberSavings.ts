import { jwtDecode } from "jwt-decode";

export const fetchMemberSavings = async (currentPage: number) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return {
      page: currentPage,
      pages: 0,
      balance: 0,
      memberSavings: [],
      error: "No se encontró un token de sesión.",
    };
  }

  try {
    const decodedToken: any = jwtDecode(token);
    const userId = decodedToken.id;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BACKEND}/f3api/transaction/${userId}?page=${currentPage}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      },
    );

    if (!response.ok) {
      throw new Error("No se encontraron transacciones o ocurrió un error.");
    }

    const { page, pages, transactions, balance } = await response.json();
    return {
      page,
      pages,
      balance: balance,
      memberSavings: transactions,
      error: "",
    };
  } catch (error) {
    console.error("Error al obtener transacciones:", error);
    return {
      page: currentPage,
      pages: 0,
      balance: 0,
      memberSavings: [],
      error: "No se pudieron obtener las transacciones.",
    };
  }
};
