import AddAffiliate from "./_components/AddAffiliate";
import HeroExpansion from "./_components/HeroExpansion";
import TableForm from "./_components/TableForm";
import { NextPage } from "next";
import Breadcrumb from "~~/components/Breadcumbs";
import InternalLayout from "~~/components/Layouts/InternalLayout";

const Expansion: NextPage = () => {
  return (
    <InternalLayout>
      <Breadcrumb pageName="Expansión" />
      <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4 xl:grid-cols-5 2xl:gap-7.5">
        {/* AddAffiliate */}
        <AddAffiliate />

        {/* HeroExpansion */}
        <HeroExpansion />
      </div>
      <div className="h-[500px] min-h-[500px] w-full rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h4 className="mb-2 text-3xl font-light text-black dark:text-white">Tu organización</h4>
        <TableForm />
      </div>
    </InternalLayout>
  );
};

export default Expansion;
