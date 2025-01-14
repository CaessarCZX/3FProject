import React from "react";
import { RiMailSendLine } from "react-icons/ri";
import { useDateEs } from "~~/hooks/3FProject/useDateEs";
import { MemberActivity } from "~~/types/activity/activity";

// import { formatCurrency } from "~~/utils/3FContract/currencyConvertion";

const MESSAGE_HEADERS = {
  REGISTRATION: "Usuario se ha registrado",
  WHITELIST: "Usuario aprobado en FREE",
  "RESET PASSWORD": "Se ha reiniciado la contraseña",
  "CHANGE PASSWORD": "Usuario ha actualizado la contraseña",
  "PULL PAYMENT": "Nuevo pago de Pull detectado",
  "NEW SAVING": "Nuevo ahorro detectado",
  "COMMISSION PAYMENT": "Nuevo pago de comisión detectado",
  "NEW AFFILIATE": "Nuevo Afiliado",
};

export const NotificationsTableRow = ({ type, email, message_ui, amount, date }: MemberActivity) => {
  const formatedDate = useDateEs(date);

  return (
    <tr className="flex flex-col p-8 border-gray-500 bg-white dark:bg-gray-800 shadow-default hover:shodow-lg rounded-2xl">
      <td className="flex items-center justify-between">
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-16 h-16 rounded-2xl p-3 border border-blue-100 text-blue-400 bg-blue-50 dark:border-gray-800 dark:bg-gray-900"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <div className="flex flex-col ml-6 gap-0 md:gap-2">
            <div className="flex items-center flex-wrap md:">
              <div className="font-medium text-xl dark:text-gray-100 leading-none">
                {type ? MESSAGE_HEADERS[type as keyof typeof MESSAGE_HEADERS] : "Notificación"}
              </div>
              <RiMailSendLine className="ml-1 text-meta-10 dark:text-green-400" />
              <p className="font-light text-[11px] text-gray-400 ml-4">{email}</p>
            </div>
            <p className="text-sm font-light text-gray-600 dark:text-gray-100 leading-none mt-1">{message_ui}</p>
            <p className="font-medium text-[12px] text-meta-5 m-0">{formatedDate}</p>
          </div>
        </div>
        {amount && (
          <div className="flex-no-shrink px-5 ml-4 py-2 text-xl font-bold tracking-wider text-green-800 dark:text-green-500">
            {`$ ${amount} USDT`}
          </div>
        )}
      </td>
    </tr>
  );
};
