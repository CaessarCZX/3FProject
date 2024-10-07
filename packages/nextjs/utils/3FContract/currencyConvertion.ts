export const parseCurrency = (longCurrency: number, exchangerRatio: number) => {
  return longCurrency * exchangerRatio;
};

export const parseThreeDecimals = (longCurrency: number): number => {
  return Number(longCurrency.toFixed(3));
};

export const formatCurrency = (value: number, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

type DisplayCurreciesProps = {
  longCurrenci: number;
  exchangeRatio: number;
};

export const displayCurrencyConvertion = ({ longCurrenci, exchangeRatio }: DisplayCurreciesProps): string => {
  const convertCurrency = parseCurrency(longCurrenci, exchangeRatio);
  const currencyFixed = parseThreeDecimals(convertCurrency);
  return formatCurrency(currencyFixed);
};
