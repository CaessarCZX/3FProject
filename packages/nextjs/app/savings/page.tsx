"use client";

import React from "react";
import withAuth from "../hoc/withAuth";
import SavingsExplorer from "./_components/SavingsExplorer";
import Breadcrumb from "~~/components/Breadcumbs";
import InternalLayout from "~~/components/Layouts/InternalLayout";

const Savings = () => {
  return (
    <InternalLayout>
      <Breadcrumb pageName="Detalle de ahorros" />
      <SavingsExplorer />
    </InternalLayout>
  );
};

export default withAuth(Savings);
