"use client";

import MemberDashboard from "./_components/Dashboard";
import withAuth from "~~/app/hoc/withAuth";
import InternalLayout from "~~/components/Layouts/InternalLayout";
import { useInitializeMemberBalance } from "~~/hooks/3FProject/useInitializeMemberBalance";

const Dashboard = () => {
  useInitializeMemberBalance();

  return (
    <InternalLayout>
      <MemberDashboard />
    </InternalLayout>
  );
};

// Aplica el HOC al export
export default withAuth(Dashboard);
