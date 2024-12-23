"use client";

import CommonDashboard from "./_components/CommonDashboard";
import FirstDepositScreen from "./_components/FirstDepositScreen";
import { useWatchContractEvent } from "wagmi";
import withAuth from "~~/app/hoc/withAuth";
import InternalLayout from "~~/components/Layouts/InternalLayout";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";
// import { useGetMemberCommissions } from "~~/hooks/user/useGetMemberCommissions";
import { useGetMemberStatus } from "~~/hooks/user/useGetMemberStatus";

const Dashboard = () => {
  const { data: currentContract } = useDeployedContractInfo("FFFBusiness");

  useWatchContractEvent({
    address: currentContract?.address,
    abi: currentContract?.abi,
    eventName: "CommissionPaid",
    onLogs: log => console.log("new log:", log),
  });

  const { memberStatus } = useGetMemberStatus();
  // useGetMemberCommissions();

  // Chage memberStatus to false to production
  return <InternalLayout>{!memberStatus ? <FirstDepositScreen /> : <CommonDashboard />}</InternalLayout>;
};
// Aplica el HOC al export
export default withAuth(Dashboard);

// export default Dashboard;
