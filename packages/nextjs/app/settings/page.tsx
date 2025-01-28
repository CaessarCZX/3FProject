"use client";

import { useEffect, useState } from "react";
import withAuth from "../hoc/withAuth";
import BeneficiaryForm from "./_components/BeneficiaryForm";
import ResetPassword from "./_components/ResetPassword";
import SettingsForm from "./_components/SettingsForm";
import Breadcrumb from "~~/components/Breadcumbs";
import InternalLayout from "~~/components/Layouts/InternalLayout";
import { useGetTokenData } from "~~/hooks/user/useGetTokenData";
import { getUser } from "~~/services/CRUD/users";

interface UserResponse {
  email_beneficiary: string | undefined;
  name_beneficiary: string | undefined;
}

const Settings = () => {
  const { tokenInfo } = useGetTokenData();
  const [beneficiary, setBeneficiary] = useState<UserResponse>({ email_beneficiary: "", name_beneficiary: "" });

  const fetchUserInfo = async (userId: string) => {
    try {
      const data = await getUser(userId);

      if (!data) return;

      const beneficiary: UserResponse = data.user;
      setBeneficiary(beneficiary);
    } catch (e) {
      console.error("Something is wrong: ", e);
    }
  };

  useEffect(() => {
    try {
      if (tokenInfo.id) fetchUserInfo(tokenInfo.id);
    } catch (e) {
      console.error("An mistake to pull beneficiary info: ", e);
    }
  }, [tokenInfo.id]);

  return (
    <InternalLayout>
      <Breadcrumb pageName="Configuraciones" />
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12">
          <SettingsForm />
          <BeneficiaryForm
            updateFunction={fetchUserInfo}
            currentBeneficiaryEmail={beneficiary.email_beneficiary}
            currentBeneficiaryName={beneficiary.name_beneficiary}
          />
          <ResetPassword />
        </div>
      </div>
    </InternalLayout>
  );
};

export default withAuth(Settings);
