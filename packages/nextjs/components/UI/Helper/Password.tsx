import React from "react";
import { FiHelpCircle } from "react-icons/fi";
import { CustomTooltip } from "~~/components/UI/CustomTooltip";

export const HelperPassword = () => (
  <CustomTooltip
    content={
      <ul>
        <li>Al menos 8 caracteres</li>
        <li>Al menos una minúscula y una mayúscula</li>
        <li>Al menos un número</li>
        <li>
          Al menos un carácter especial: <span className="font-bold">@ ! # ?</span>
        </li>
      </ul>
    }
  >
    <FiHelpCircle className="text-gray-300 dark:text-gray-600 cursor-pointer" />
  </CustomTooltip>
);
