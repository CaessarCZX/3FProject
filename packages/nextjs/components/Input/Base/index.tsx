import { ChangeEvent, FocusEvent, ReactNode, useCallback, useEffect, useRef } from "react";
import { CommonInputProps } from "~~/components/scaffold-eth";

type InputBaseClassModifierProps = {
  classNameBox?: string; // To overwrite current styles accoirding be neccessary
  classNameInput?: string; // To overwrite current styles accoirding be neccessary
};

type InputBaseProps<T> = CommonInputProps<T> &
  InputBaseClassModifierProps & {
    error?: boolean;
    prefix?: ReactNode;
    suffix?: ReactNode;
    reFocus?: boolean;
  };

export const InputBase = <T extends { toString: () => string } | undefined = string>({
  name,
  value,
  onChange,
  placeholder,
  error,
  disabled,
  prefix,
  suffix,
  reFocus,
  classNameBox,
  classNameInput,
}: InputBaseProps<T>) => {
  const inputReft = useRef<HTMLInputElement>(null);

  // For modify borders in defferent situations
  let modifier = "";
  if (error) {
    modifier = "border-error";
  } else if (disabled) {
    modifier = "border-disabled bg-base-300";
  }

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value as unknown as T);
    },
    [onChange],
  );

  // Runs only when reFocus prop is passed, useful for setting the cursor
  // at the end of the input. Example AddressInput
  const onFocus = (e: FocusEvent<HTMLInputElement, Element>) => {
    if (reFocus !== undefined) {
      e.currentTarget.setSelectionRange(e.currentTarget.value.length, e.currentTarget.value.length);
    }
  };
  useEffect(() => {
    if (reFocus !== undefined && reFocus === true) inputReft.current?.focus();
  }, [reFocus]);

  return (
    <div className={`flex flex-grow border border-gray-300 text-accent shadow-sm ${modifier} ${classNameBox}`}>
      {prefix}
      <input
        // className="input input-ghost focus-within:border-transparent focus:outline-none focus:bg-transparent focus:text-gray-400 h-[2.2rem] min-h-[2.2rem] px-4 border w-full font-medium placeholder:text-accent/50 text-gray-400"
        className={`input input-ghost rounded-none w-full pl-10 pr-2 py-2 focus-within:border-transparent focus:outline-none focus:bg-transparent focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-medium ${classNameInput}`}
        placeholder={placeholder}
        name={name}
        value={value?.toString()}
        onChange={handleChange}
        disabled={disabled}
        autoComplete="off"
        ref={inputReft}
        onFocus={onFocus}
      />
      {suffix}
    </div>
  );
};
