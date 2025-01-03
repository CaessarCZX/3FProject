import { useMemo, useState } from "react";
import { InputBase } from "../Base";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import { CommonInputProps, SIGNED_NUMBER_REGEX } from "~~/components/scaffold-eth";
import { useDisplayPreferredCurrencies } from "~~/hooks/3FProject/useDisplayPreferredCurrencies";
import { useGlobalState } from "~~/services/store/store";

const MAX_DECIMALS_USD = 2;

// usdtToMexnValue
function usdtValueToMxnValue(mxnMode: boolean, usdtValue: string, mexicanPesoPrice: number) {
  if (mxnMode && mexicanPesoPrice) {
    const parsedEthValue = parseFloat(usdtValue);
    if (Number.isNaN(parsedEthValue)) {
      return usdtValue;
    } else {
      // We need to round the value rather than use toFixed,
      // since otherwise a user would not be able to modify the decimal value
      return (
        Math.round(parsedEthValue * mexicanPesoPrice * 10 ** MAX_DECIMALS_USD) /
        10 ** MAX_DECIMALS_USD
      ).toString();
    }
  } else {
    return usdtValue;
  }
}

// mxnToUsdtValue
function mxnValueToUsdtValue(mxnMode: boolean, mxnValue: string, mexicanPesoPrice: number) {
  if (mxnMode && mexicanPesoPrice) {
    const parsedDisplayValue = parseFloat(mxnValue);
    if (Number.isNaN(parsedDisplayValue)) {
      // Invalid number.
      return mxnValue;
    } else {
      // Compute the USDT value if a valid number.
      return (parsedDisplayValue / mexicanPesoPrice).toString();
    }
  } else {
    return mxnValue;
  }
}

type InputBaseClassModifierProps = {
  classNameBox?: string; // To overwrite current styles accoirding be neccessary
  classNameInput?: string; // To overwrite current styles accoirding be neccessary
};

type UsdtInputProps = CommonInputProps & InputBaseClassModifierProps;

/**
 * Input for USDT amount with MXN conversion.
 *
 * onChange will always be called with the value in USDT
 */
export const UsdtInput = ({
  value,
  name,
  onChange,
  disabled,
  mxnMode,
  classNameBox,
  classNameInput,
}: UsdtInputProps & { mxnMode?: boolean }) => {
  const [transitoryDisplayValue, setTransitoryDisplayValue] = useState<string>();
  const mexicanPesoPrice = useGlobalState(state => state.mexicanPeso.price);
  const isMexicanPesoPriceFetching = useGlobalState(state => state.mexicanPeso.isFetching);

  const { displayCurrenciesMode, toggleDisplayCurrenciesMode } = useDisplayPreferredCurrencies({
    defaultDisplayMode: mxnMode,
  });

  // The displayValue is derived from the usdt value that is controlled outside of the component
  // In mxnMode, it is converted to its mxn value, in regular mode it is unaltered
  const displayValue = useMemo(() => {
    const newDisplayValue = usdtValueToMxnValue(displayCurrenciesMode, value, mexicanPesoPrice || 0);
    if (transitoryDisplayValue && parseFloat(newDisplayValue) === parseFloat(transitoryDisplayValue)) {
      return transitoryDisplayValue;
    }
    // Clear any transitory display values that might be set
    setTransitoryDisplayValue(undefined);
    return newDisplayValue;
  }, [mexicanPesoPrice, transitoryDisplayValue, displayCurrenciesMode, value]);

  const handleChangeNumber = (newValue: string) => {
    if (newValue && !SIGNED_NUMBER_REGEX.test(newValue)) {
      return;
    }

    // Following condition is a fix to prevent usdMode from experiencing different display values
    // than what the user entered. This can happen due to floating point rounding errors that are introduced in the back and forth conversion
    if (displayCurrenciesMode) {
      const decimals = newValue.split(".")[1];
      if (decimals && decimals.length > MAX_DECIMALS_USD) {
        return;
      }
    }

    // Since the display value is a derived state (calculated from the ether value), usdMode would not allow introducing a decimal point.
    // This condition handles a transitory state for a display value with a trailing decimal sign
    if (newValue.endsWith(".") || newValue.endsWith(".0")) {
      setTransitoryDisplayValue(newValue);
    } else {
      setTransitoryDisplayValue(undefined);
    }

    const newUsdtValue = mxnValueToUsdtValue(displayCurrenciesMode, newValue, mexicanPesoPrice || 0);
    onChange(newUsdtValue);
  };

  return (
    <InputBase
      name={name}
      value={displayValue}
      placeholder={
        displayCurrenciesMode
          ? window.innerWidth < 640
            ? "Pesos"
            : "Ingresa en Pesos"
          : window.innerWidth < 640
          ? "USDT"
          : "Ingresa en USDT"
      }
      onChange={handleChangeNumber}
      disabled={disabled}
      reFocus
      prefix={
        <span className="pl-4 -mr-2 absolute text-accent self-center text-lg">
          {displayCurrenciesMode ? "🇲🇽" : "🇺🇸"}
        </span>
      }
      suffix={
        <div
          className={`${
            mexicanPesoPrice > 0
              ? ""
              : "tooltip tooltip-secondary before:content-[attr(data-tip)] before:right-[-10px] before:left-auto before:transform-none"
          }`}
          data-tip={isMexicanPesoPriceFetching ? "Recuperando precio" : "No se ha podido fijar el precio"}
        >
          <button
            className="flex items-center h-full w-full p-2"
            onClick={toggleDisplayCurrenciesMode}
            disabled={!displayCurrenciesMode && !mexicanPesoPrice}
          >
            <ArrowsRightLeftIcon
              className="h-6 w-6 cursor-pointer hover:drop-shadow-icon-1 dark:hover:drop-shadow-icon-2"
              aria-hidden="true"
            />
          </button>
        </div>
      }
      classNameBox={classNameBox}
      classNameInput={classNameInput}
    />
  );
};
