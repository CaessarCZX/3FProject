import React from "react";
import { CheckBadgeIcon, TrophyIcon } from "@heroicons/react/24/outline";
import { useGetMemberStatus } from "~~/hooks/user/useGetMemberStatus";

const CardMembership: React.FC = () => {
  const { memberStatus } = useGetMemberStatus();
  return (
    <div
      className={`rounded-sm border bg-white border-stroke px-7.5 py-6 shadow-default dark:border-strokedark ${
        memberStatus ? "dark:bg-boxdark" : "dark:bg-boxdark-2"
      } `}
    >
      {/* For Icon */}
      <div className="flex justify-between">
        <div
          className={`flex h-11.5 w-11.5 items-center justify-center rounded-full ${
            memberStatus
              ? "bg-meta-2 text-brand-default dark:text-whiten dark:bg-meta-4"
              : "bg-gray-100 text-gray-300 dark:text-gray-500 dark:bg-graydark"
          } `}
        >
          <TrophyIcon className="w-6 h-6" />
        </div>
        {memberStatus && <CheckBadgeIcon className="w-6 h-6 text-meta-5" />}
      </div>
      {/* For Icon */}

      <div className="mt-4">
        {/* For title */}
        <div className="flex gap-2 items-center">
          <h4
            className={`text-2xl m-0 font-medium ${
              memberStatus ? "text-brand-default dark:text-white" : "text-gray-400 dark:text-gray-600"
            }`}
          >
            {memberStatus ? "$500" : "$0"}
          </h4>
          <div className="text-xs font-medium">
            <p className="m-0 leading-none text-gray-300 w-10">{memberStatus && "USDT Pagado"}</p>
          </div>
        </div>
        {/* For title */}
      </div>
      <div
        className={`text-xs mt-2  font-light items-center cursor-default text-brand-default ${
          memberStatus ? "text-brand-default dark:text-gray-300" : "text-gray-400 dark:text-gray-600"
        }`}
      >
        Membresia unica
      </div>
    </div>
  );
};

export default CardMembership;
