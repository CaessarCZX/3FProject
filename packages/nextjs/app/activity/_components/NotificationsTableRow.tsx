import React from "react";
import { HiOutlineBellAlert } from "react-icons/hi2";
import { IoAlertCircleOutline } from "react-icons/io5";
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
    <tr className="flex flex-col p-4 transition-all border border-gray-200 dark:border-strokedark bg-white dark:bg-gray-800 shadow-md hover:shadow-default rounded-lg">
      <td className="flex items-center">
        <IoAlertCircleOutline className="min-h-10 min-w-10 sm:min-h-14 sm:min-w-14 bg-brand-default rounded-full text-whiten opacity-25" />
        <div className="flex items-center w-full">
          <div className="flex w-full flex-col ml-6 gap-0 md:gap-2">
            <div className="flex items-center flex-wrap md:">
              <div className="font-medium text-base md:text-xl dark:text-gray-100 leading-none">
                {type ? MESSAGE_HEADERS[type as keyof typeof MESSAGE_HEADERS] : "Notificación"}
              </div>
              <HiOutlineBellAlert className="ml-2 text-meta-10 dark:text-green-400" />
              <p className="font-light text-[9px] md:text-[11px] text-gray-400 ml-2 my-0">{email}</p>
            </div>
            <div className="flex items-center gap-1">
              <p className="flex-1 text-[10px] mt-2 md:my-0 md:text-sm font-light text-gray-600 dark:text-gray-100 leading-none">
                {message_ui}
              </p>
              {amount && (
                <div className="py-2 text-[10px] xsm:text-sm md:text-lg font-bold tracking-wider text-green-800 dark:text-green-500">
                  {`$ ${amount} USDT`}
                </div>
              )}
            </div>
            <p className="font-medium text-[12px] text-meta-5 m-0">{formatedDate}</p>
          </div>
        </div>
      </td>
    </tr>
  );
};
