import React from "react";
import SavingsExplorer from "./_components/SavingsExplorer";
import { NextPage } from "next";
import Breadcrumb from "~~/components/Breadcumbs";
import InternalLayout from "~~/components/Layouts/InternalLayout";

const Savings: NextPage = () => {
  return (
    <InternalLayout>
      <Breadcrumb pageName="Detalle de ahorros" />
      <SavingsExplorer />
    </InternalLayout>
  );
};

export default Savings;
