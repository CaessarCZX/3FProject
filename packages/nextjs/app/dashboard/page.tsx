"use client";

import CommonDashboard from "./_components/CommonDashboard";
import FirstDepositScreen from "./_components/FirstDepositScreen";
import { useWatchContractEvent } from "wagmi";
import withAuth from "~~/app/hoc/withAuth";
import InternalLayout from "~~/components/Layouts/InternalLayout";
import { useInitializeMemberBalance } from "~~/hooks/3FProject/useInitializeMemberBalance";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import { useGetMemberStatus } from "~~/hooks/user/useGetMemberStatus";
import { useGetNotfications } from "~~/hooks/user/useGetNotifications";
import { useGetMemberAffiliatesNumber } from "~~/hooks/user/useMemberAffiliatesNumber";

const Dashboard = () => {
  const { data: contract } = useDeployedContractInfo("FFFBusiness");
  useGetNotfications();
  useGetMemberAffiliatesNumber();
  useInitializeMemberBalance();

  useWatchContractEvent({
    address: contract?.address,
    abi: contract?.abi,
    eventName: "ProccessPayment",
    onLogs(logs) {
      console.log("Payment proccess!", logs);
    },
  });

  const { memberStatus } = useGetMemberStatus();

  // Cambiar memberStatus a false en producción
  return (
    <InternalLayout>
      {/* Mostrar FirstDepositScreen si el miembro no tiene estado */}
      {!memberStatus ? (
        <div className="max-w-full w-full px-4 sm:px-6 md:px-8">
          <FirstDepositScreen />
        </div>
      ) : (
        <div className="max-w-full w-full px-4 sm:px-6 md:px-8">
          <CommonDashboard />
        </div>
      )}
    </InternalLayout>
  );
};

// Aplica el HOC al export
export default withAuth(Dashboard);

// export default Dashboard;
