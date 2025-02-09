import { useState } from "react";
import { useShowUiNotifications } from "../3FProject/useShowUiNotifications";

// Validator Object interface
interface DataObject {
  [key: string]: any;
}
// Validator helper
export const ValidateInObject = {
  isString: (value: any): value is string => typeof value === "string",
  isNumber: (value: any): value is number => typeof value === "number",
  isBoolean: (value: any): value is boolean => typeof value === "boolean",
};

export function findKeyWithType<T>(
  obj: DataObject,
  keyName: string,
  validator: (value: any) => value is T,
): T | undefined {
  if (keyName in obj && validator(obj[keyName])) {
    return obj[keyName];
  }

  for (const key in obj) {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      const result = findKeyWithType(obj[key], keyName, validator);
      if (result !== undefined) {
        return result;
      }
    }
  }

  return undefined;
}

interface UseApiRequestProps<T, P extends any[]> {
  apiFunction: (...params: P) => Promise<T>; // Función de petición (puede ser GET, POST, etc.)
  validateParams?: (...params: P) => string | null; // Función opcional de validación
  onPrevius?: (...params: P) => T;
  onSuccess?: (data: T) => void; // Callback opcional cuando la petición es exitosa
  onError?: (error: string) => void; // Callback opcional cuando hay un error
  enableSuccessMsg?: boolean; //Habilitar mensaje de exito en la peticion
  errorMsg?: string; // Ingresar mensaje personalizado en caso de error
  successMsg?: string; // Ingresar mensaje personalizado en caso de exito
}

export const useApiRequest = <T, P extends any[]>({
  apiFunction,
  validateParams,
  onPrevius,
  onError,
  onSuccess,
  enableSuccessMsg = true,
  successMsg,
  errorMsg,
}: UseApiRequestProps<T, P>) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  useShowUiNotifications({ success, setSuccess, error, setError });

  const fetchData = async (...args: P): Promise<T | null> => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      if (validateParams) {
        const validationError = validateParams(...args);
        if (validationError) throw new Error(validationError);
      }

      if (onPrevius) onPrevius(...args);

      const data = await apiFunction(...args);

      if (!data) throw new Error(errorMsg || "Error en la respuesta del servidor");

      if (onSuccess) onSuccess(data);

      if (enableSuccessMsg) setSuccess(successMsg || "Peticion exitosa");
      return data;
    } catch (e: any) {
      setError(e.message);
      if (onError) onError(e.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, fetchData, error, success };
};
