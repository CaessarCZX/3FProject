import { validateAddress, validateEmailWithMessage, validateName, validatePassword } from ".";
import { notification } from "../scaffold-eth";

export const validateField = (name: string, value: string) => {
  switch (name) {
    case "name":
      return validateName(value);

    case "email":
      return validateEmailWithMessage(value);

    case "password":
      return validatePassword(value);

    case "wallet":
      return validateAddress(value);

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
