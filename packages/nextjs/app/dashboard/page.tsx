"use client";

import CommonDashboard from "./_components/CommonDashboard";
import FirstDepositScreen from "./_components/FirstDepositScreen";
import InternalLayout from "~~/components/Layouts/InternalLayout";
import { useGetMemberStatus } from "~~/hooks/user/useGetMemberStatus";

// import withAuth from "~~/app/hoc/withAuth";

const Dashboard = () => {
  const { memberStatus, isLoading } = useGetMemberStatus();
  console.log(memberStatus, isLoading);

  return <InternalLayout>{!memberStatus ? <CommonDashboard /> : <FirstDepositScreen />}</InternalLayout>;
};
// Aplica el HOC al export
// export default withAuth(Dashboard);

export default Dashboard;
