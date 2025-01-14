import React from "react";
import { NotificationsTableRow } from "./NotificationsTableRow";
import { MemberActivity } from "~~/types/activity/activity";

type NotificationsTableProps = {
  activities: MemberActivity[];
};

const NotificationsTable: React.FC<NotificationsTableProps> = ({ activities }) => {
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-6 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
      <h4 className="mb-6 text-3xl font-light text-gray-500 dark:text-white">Actividad de la cuenta</h4>

      <table className="flex flex-col">
        <tbody className="space-y-4">
          {activities.map(ac => {
            // const value = formatUnits(BigInt(tx.value), 6);
            return (
              <NotificationsTableRow
                key={ac._id}
                type={ac.type || ""}
                email={ac.email}
                date={ac.date}
                message_ui={ac.message_ui}
                amount={ac.amount}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default NotificationsTable;
