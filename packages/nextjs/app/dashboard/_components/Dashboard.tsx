import React from "react";
import useGetContentStats from "../_content/ContentStats";
import BlockExplorer from "./BlockExplorer";
import DepositContract from "./DepositContract";
import Breadcrumb from "~~/components/Breadcumbs";
import CardMembership from "~~/components/UI/CardDataStats/CardMembership";
import CardDataStats from "~~/components/UI/CardDataStats/index";

const MemberDashboard: React.FC = () => {
  const ContentStats = useGetContentStats();
  // md:grid-cols-2

  return (
    <>
      <Breadcrumb pageName="Panel de control" />
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 2xl:gap-7.5 gap-4 md:gap-4">
        <DepositContract />
        {ContentStats.map((statInfo, statIndex) => (
          <CardDataStats key={statIndex} title={statInfo.title} total={statInfo.total} rate={statInfo.rate}>
            <statInfo.icon className="w-6 h-6 text-brand-default dark:text-white" />
          </CardDataStats>
        ))}
        <CardMembership />
      </div>
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12">
          <BlockExplorer />
        </div>
      </div>
    </>
  );
};

export default MemberDashboard;
