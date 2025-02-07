import React from "react";

interface BadgeStatusProps {
  status: "active" | "disable" | "waiting" | "default";
}

const BadgeStatus: React.FC<BadgeStatusProps> = ({ status }) => {
  const badge =
    status === "active"
      ? { label: "Aceptada", color: "bg-meta-3" }
      : status === "disable"
      ? { label: "Inactiva", color: "bg-meta-1" }
      : status === "waiting"
      ? { label: "En espera", color: "bg-meta-5" }
      : { label: "No disponible", color: "hidden" };
  return (
    <div className="relative">
      <div className="font-medium">{badge.label}</div>
      <span className={`absolute -right-4 top-2 z-1 h-2 w-2 bg-meta rounded-full inline ${badge.color}`}>
        <span
          className={`absolute -z-1 inline-flex h-full w-full animate-ping rounded-full opacity-75 ${badge.color}`}
        ></span>
      </span>
    </div>
  );
};

export default BadgeStatus;
