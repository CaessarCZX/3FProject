interface TimestampDateAndTimeReturn {
  date: string;
  time: string;
}

export const getDateAndTimeFromTimestamp = (timestamp: string): TimestampDateAndTimeReturn => {
  const date = new Date(timestamp);
  return {
    date: date.toLocaleDateString(),
    time: date.toLocaleTimeString(),
  };
};
