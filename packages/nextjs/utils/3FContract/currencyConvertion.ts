export const parseCurrency = (longCurrency: number, exchangerRatio: number) => {
  return longCurrency * exchangerRatio;
};

export const parseThreeDecimals = (longCurrency: number): string => {
  return longCurrency.toFixed(3);
};
