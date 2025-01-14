"use client";

import MemberDashboard from "./_components/Dashboard";
import withAuth from "~~/app/hoc/withAuth";
import InternalLayout from "~~/components/Layouts/InternalLayout";
import { useInitializeMemberBalance } from "~~/hooks/3FProject/useInitializeMemberBalance";
import { useGetMemberAffiliatesNumber } from "~~/hooks/user/useMemberAffiliatesNumber";

const Dashboard = () => {
  useGetMemberAffiliatesNumber();
  useInitializeMemberBalance();

  // Cambiar memberStatus a false en producción
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
