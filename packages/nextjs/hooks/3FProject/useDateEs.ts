import { useEffect, useState } from "react";

export const useDateEs = (date?: string): string => {
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const months = [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ];

    const today = date ? new Date(date) : new Date();
    const day = today.getDate();
    const month = months[today.getMonth()];
    const year = today.getFullYear();

    const formattedDate = `${day} ${month} del ${year}`;
    setCurrentDate(formattedDate);
  }, [date]);

  return currentDate;
};
