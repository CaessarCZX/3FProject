"use client";

import { useState } from "react";
import CommonDashboard from "./_components/CommonDashboard";
import FirstDepositScreen from "./_components/FirstDepositScreen";
import InternalLayout from "~~/components/Layouts/InternalLayout";

// import withAuth from "~~/app/hoc/withAuth";

const Dashboard = () => {
  const [isNewUser, setIsNewUser] = useState(true);

  if (isNewUser) setIsNewUser(true);

  return <InternalLayout>{!isNewUser ? <CommonDashboard /> : <FirstDepositScreen />}</InternalLayout>;
};
// Aplica el HOC al export
// export default withAuth(Dashboard);

export default Dashboard;
