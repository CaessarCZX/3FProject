"use client";

// Marca este archivo como un Client Component
import BlockExplorer from "./_components/BlockExplorer";
import DepositContract from "./_components/DepositContract";
import ContentStats from "./_content/ContentStats";
import withAuth from "~~/app/hoc/withAuth";
import InternalLayout from "~~/components/Layouts/InternalLayout";
import CardDataStats from "~~/components/UI/CardDataStats";

const Dashboard = () => {
  return (
    <InternalLayout>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-4 xl:grid-cols-5 2xl:gap-7.5">
        <DepositContract />
        {ContentStats.map((statInfo, statIndex) => (
          <CardDataStats key={statIndex} title={statInfo.title} total={statInfo.total} rate={statInfo.rate}>
            <statInfo.icon className="w-6 h-6 text-primary dark:text-white" />
          </CardDataStats>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12">
          <BlockExplorer />
        </div>
      </div>
    </InternalLayout>
  );
};

export default withAuth(Dashboard); // Aplica el HOC al export
