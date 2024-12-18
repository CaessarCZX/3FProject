import { notification } from "../scaffold-eth";
import { isAddress } from "viem";

const validateAddress = (address: string) => {
  return isAddress(address);
};

export const validateField = (name: string, value: string) => {
  switch (name) {
    case "name":
      if (!value.trim()) return "El nombre es requerido";
      if (value.trim().length < 2) return "Mínimo 2 caracteres";
      if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) return "Solo se permiten letras";
      return "";

    case "email": {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value.trim()) return "El correo es requerido";
      if (!emailRegex.test(value)) return "Correo inválido";
      return "";
    }

    case "password":
      if (!value.trim()) return "La contraseña es requerida";
      if (value.length < 8) return "Mínimo 8 caracteres";
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/.test(value))
        return "Debe contener mayúscula, minúscula, número y carácter especial";
      return "";

    case "wallet":
      if (!validateAddress(value)) return "Ingrese una direccion de wallet valida";
      return "";

    default:
      return "";
  }
};

export interface ValidateFormData {
  name: string;
  email: string;
  password: string;
  wallet: string;
}

export const validateFormData = (formData: ValidateFormData) => {
  const newErrors: Record<string, string> = {};
  Object.keys(formData).forEach(key => {
    const fieldKey = key as keyof ValidateFormData;
    const error = validateField(fieldKey, formData[fieldKey]);
    if (error) newErrors[fieldKey] = error;
  });

  return newErrors;
};

export const RenderWarningMessages = (errors: any) => {
  Object.keys(errors).forEach(key => {
    notification.warning(errors[key], { position: "bottom-right", duration: 5000 });
  });
};
