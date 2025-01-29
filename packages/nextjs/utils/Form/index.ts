import { isAddress } from "viem";

export const validateEmail = (email: string) => {
  const normalizeEmail = String(email).toLowerCase();
  if (!normalizeEmail.trim()) return false;
  const regexPattern =
    /^(([^<>()[\],;:\s@"]+(\.[^<>()[\],;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|([a-zA-Z0-9.-]+\.[a-zA-Z]{2,}))$/;
  const regex = new RegExp(regexPattern);
  return regex.test(normalizeEmail);
};

export const validatePassword = (password: string) => {
  if (!password.trim()) return "La contraseña es requerida";
  if (password.length < 8) return "Mínimo 8 caracteres";
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!#?])[A-Za-z\d@$!#?]{8,}/.test(password)) {
    return "Debe contener mayúscula, minúscula, número y carácter especial";
  }
  return "";
};

export const validateName = (name: string): string => {
  const value = name;
  if (!value.trim()) return "El nombre es requerido";
  if (value.trim().length < 2) return "Mínimo 2 caracteres";
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) return "Solo se permiten letras";
  return "";
};

export const validateEmailWithMessage = (email: string): string => {
  return validateEmail(email) ? "" : "Email invalido";
};

export const validateAddress = (address: string) => {
  if (!isAddress(address)) return "Ingrese una direccion de wallet valida";
  return "";
};
