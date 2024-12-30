interface TimestampDateAndTimeReturn {
  date: string;
  time: string;
}

export const getDateAndTimeFromTimestamp = (timestamp: string): TimestampDateAndTimeReturn => {
  const date = new Date(timestamp);
  return {
    date: date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
    time: date.toLocaleTimeString(),
  };
};
