"use client";

import CommonDashboard from "./_components/CommonDashboard";
import FirstDepositScreen from "./_components/FirstDepositScreen";
// import { useWatchContractEvent } from "wagmi";
import withAuth from "~~/app/hoc/withAuth";
import InternalLayout from "~~/components/Layouts/InternalLayout";
// import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import { useGetMemberStatus } from "~~/hooks/user/useGetMemberStatus";
import { useGetNotfications } from "~~/hooks/user/useGetNotifications";

const Dashboard = () => {
  useGetNotfications();
  const { memberStatus } = useGetMemberStatus();

  // Chage memberStatus to false to production
  return <InternalLayout>{!memberStatus ? <FirstDepositScreen /> : <CommonDashboard />}</InternalLayout>;
};
// Aplica el HOC al export
export default withAuth(Dashboard);

// export default Dashboard;
