"use client";

import React, { useEffect, useState } from "react";
import NotificationsTable from "./NotificationsTable";
import { PaginationButton } from "~~/components/UI/PaginationBtn";
import { useGetTokenData } from "~~/hooks/user/useGetTokenData";
import { MemberActivity } from "~~/types/activity/activity";

const NotificationExplorer: React.FC = () => {
  const { tokenInfo } = useGetTokenData();
  const [userActivity, setUserActivity] = useState<MemberActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [totalPages, setTotalPages] = useState(1); // Total de páginas

  const fetchActivities = async (page: number, email: string | undefined) => {
    setLoading(true);
    setError(null);

    if (!email) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND}/f3api/users/notifications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, page, limit: 10 }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Error al obtener los usuarios");
      }
      const data = await response.json();
      setUserActivity(data.notifications || []);
      setCurrentPage(data.page || 1);
      setTotalPages(data.pages || 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities(currentPage, tokenInfo?.email);
  }, [currentPage, tokenInfo?.email]);

  return (
    <div className="mx-auto rounded-xl overflow-hidden">
      {loading ? <p>Cargando datos</p> : <NotificationsTable activities={userActivity} />}
      {error && <p>No hay datos disponibles para mostrar</p>}
      <PaginationButton currentPage={currentPage} totalItems={Number(totalPages)} setCurrentPage={setCurrentPage} />
    </div>
  );
};

export default NotificationExplorer;
