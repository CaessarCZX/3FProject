"use client";

import withAuth from "../hoc/withAuth";
import ResetPassword from "./_components/ResetPassword";
import SettingsForm from "./_components/SettingsForm";
import Breadcrumb from "~~/components/Breadcumbs";
import InternalLayout from "~~/components/Layouts/InternalLayout";

const Settings = () => {
  return (
    <InternalLayout>
      <Breadcrumb pageName="Configuraciones" />
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12">
          <SettingsForm />
          <ResetPassword />
        </div>
      </div>
    </InternalLayout>
  );
};

export default withAuth(Settings);
