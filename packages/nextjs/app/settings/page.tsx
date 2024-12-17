"use client";

import SettingsForm from "./_components/SettingsForm";
import InternalLayout from "~~/components/Layouts/InternalLayout";

const Settings = () => {
  return (
    <InternalLayout>
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12">
          <SettingsForm />
        </div>
      </div>
    </InternalLayout>
  );
};

export default Settings;
