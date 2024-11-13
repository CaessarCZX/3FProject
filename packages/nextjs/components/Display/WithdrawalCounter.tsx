import React, { useCallback, useEffect, useState } from "react";

//Retiro es cada dia 5 dentro de cada 3 meses
type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export const WithdrawalCounter = ({ date, time }: { date: string; time: string }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [isExpired, setIsExpired] = useState(false);

  const parseTimestamp = (timestamp: string): Date | null => {
    const match = timestamp.match(/(\d{1,2})\/(\d{1,2})\/(\d{4}) (\d{1,2}):(\d{2}):(\d{2}) (AM|PM)/);

    if (!match) {
      console.error("Timestamp no coincide con el formato esperado.");
      return null;
    }
    const [, month, day, year, hourStr, minuteStr, secondStr, period] = match;
    let hours = parseInt(hourStr, 10);
    const minutes = parseInt(minuteStr, 10);
    const seconds = parseInt(secondStr, 10);

    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;

    return new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10), hours, minutes, seconds);
  };

  const getNextQuarterDate = (startDate: Date): Date => {
    let month = startDate.getMonth();
    let year = startDate.getFullYear();
    const currentDay = startDate.getDate();

    if (month === 11) {
      year++;
      month = 0;
    }

    if (currentDay > 5) month++;

    month += 3;

    const day = 5;

    return new Date(year, month, day, 0, 0, 0);
  };

  const calculateTimeLeft = useCallback((): TimeLeft => {
    try {
      const startDate = parseTimestamp(`${date} ${time}`);

      if (!startDate) {
        throw new Error("Invalid start date format.");
      }

      const endDate = getNextQuarterDate(startDate);
      const now = new Date();
      const difference = endDate.getTime() - now.getTime();

      if (difference <= 0) {
        setIsExpired(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } catch (error) {
      console.error("Error calculating time left:", error);
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
  }, [date, time]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  return (
    <>
      {isExpired ? (
        <p>Retiro disponible</p>
      ) : (
        <p>{`${timeLeft.days}d ${timeLeft.hours} : ${timeLeft.minutes} : ${timeLeft.seconds}`}</p>
      )}
    </>
  );
};
