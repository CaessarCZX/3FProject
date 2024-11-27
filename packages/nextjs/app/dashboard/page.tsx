import ContentStats from "./_content/ContentStats";
import { NextPage } from "next";
import InternalLayout from "~~/components/Layouts/InternalLayout";
import CardDataStats from "~~/components/UI/CardDataStats";

const Dashboard: NextPage = () => {
  return (
    <>
      <InternalLayout>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
          {ContentStats.map((statInfo, statIndex) => {
            return (
              <CardDataStats key={statIndex} title={statInfo.title} total={statInfo.total} rate={statInfo.rate}>
                <statInfo.icon className="w-6 h-6 text-primary dark:text-white" />
              </CardDataStats>
            );
          })}
        </div>
      </InternalLayout>
    </>
  );
};

export default Dashboard;
