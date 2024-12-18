"use client";

import CommonDashboard from "./_components/CommonDashboard";
import FirstDepositScreen from "./_components/FirstDepositScreen";
import withAuth from "~~/app/hoc/withAuth";
import InternalLayout from "~~/components/Layouts/InternalLayout";
import { useGetMemberStatus } from "~~/hooks/user/useGetMemberStatus";

const Dashboard = () => {
  const { memberStatus } = useGetMemberStatus();

  // Chage memberStatus to false to production
  return <InternalLayout>{!memberStatus ? <FirstDepositScreen /> : <CommonDashboard />}</InternalLayout>;
};
// Aplica el HOC al export
export default withAuth(Dashboard);

// export default Dashboard;
