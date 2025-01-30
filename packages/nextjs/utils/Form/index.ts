import { isAddress } from "viem";

const PASSWORD_REGEX =
  /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!"#$%&'()*+,\-./:;<=>?@[\\\]^_{|}~])[A-Za-z\d!"#$%&'()*+,\-./:;<=>?@[\\\]^_{|}~]{8,}/;

const PASSWORD_ONLY_SIMBOLS_REGEX = /[@$!#?"%&'()*+,\-./:;<=>[\]\\^_{|}~]/;

const EMAIL_REGEX =
  /^(([^<>()[\],;:\s@"]+(\.[^<>()[\],;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|([a-zA-Z0-9.-]+\.[a-zA-Z]{2,}))$/;

const NAME_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

export const EmailRegex = new RegExp(EMAIL_REGEX);
export const NameRegex = new RegExp(NAME_REGEX);
export const PasswordRegex = {
  hasMinLength: 8,
  hasLowercase: new RegExp(/[a-z]/),
  hasUppercase: new RegExp(/[A-Z]/),
  hasNumber: new RegExp(/[0-9]/),
  hasSpecialChar: new RegExp(PASSWORD_ONLY_SIMBOLS_REGEX),
  full: new RegExp(PASSWORD_REGEX),
};

export const validateEmail = (email: string) => {
  const normalizeEmail = String(email).toLowerCase();
  if (!normalizeEmail.trim()) return false;
  return EmailRegex.test(normalizeEmail);
};

export const validatePassword = (password: string) => {
  if (!password.trim()) return "La contraseña es requerida";
  if (password.length < 8) return "Mínimo 8 caracteres";
  if (!PasswordRegex.full.test(password)) {
    return "Debe contener mayúscula, minúscula, número y carácter especial";
  }
  return "";
};

export const validateName = (name: string): string => {
  const value = name;
  if (!value.trim()) return "El nombre es requerido";
  if (value.trim().length < 2) return "Mínimo 2 caracteres";
  if (!NameRegex.test(value)) return "Solo se permiten letras";
  return "";
};

export const validateEmailWithMessage = (email: string): string => {
  return validateEmail(email) ? "" : "Email invalido";
};

export const validateAddress = (address: string) => {
  if (!isAddress(address)) return "Ingrese una direccion de wallet valida";
  return "";
};
