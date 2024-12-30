import HeroExpansion from "./_components/HeroExpansion";
import TableForm from "./_components/TableForm";
import { NextPage } from "next";
import Breadcrumb from "~~/components/Breadcumbs";
import InternalLayout from "~~/components/Layouts/InternalLayout";

// import CardDataStats from "~~/components/UI/CardDataStats";

const Expansion: NextPage = () => {
  return (
    <InternalLayout>
      <Breadcrumb pageName="Expansión" />
      <HeroExpansion />
      <div className=" w-full rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h4 className="mb-2 text-xl font-semibold text-black dark:text-white">Tu organización</h4>
        <TableForm />
      </div>
    </InternalLayout>
  );
};

export default Expansion;
