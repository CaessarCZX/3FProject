"use client";

import MemberDashboard from "./_components/Dashboard";
import withAuth from "~~/app/hoc/withAuth";
import InternalLayout from "~~/components/Layouts/InternalLayout";
import { useInitializeMemberBalance } from "~~/hooks/3FProject/useInitializeMemberBalance";

const Dashboard = () => {
  useInitializeMemberBalance();

  return (
    <InternalLayout>
      <div className="max-w-full w-full px-4 sm:px-6 md:px-8">
        <MemberDashboard />
      </div>
    </InternalLayout>
  );
};

// Aplica el HOC al export
export default withAuth(Dashboard);
