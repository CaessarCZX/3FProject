"use client";

import { useEffect, useState } from "react";
import withAuth from "../hoc/withAuth";
import BeneficiaryForm from "./_components/BeneficiaryForm";
import ResetPassword from "./_components/ResetPassword";
import SettingsForm from "./_components/SettingsForm";
import WalletConfig from "./_components/WalletConfig";
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
      console.log(beneficiary);
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
      <div className="mt-4 grid grid-cols-5 gap-8">
        <div className="col-span-5 xl:col-span-3">
          <SettingsForm />
        </div>
        <div className="col-span-5 xl:col-span-2">
          <WalletConfig />
        </div>
        <div className="col-span-5 xl:col-span-3">
          <ResetPassword />
        </div>
        <div className="col-span-5 xl:col-span-3">
          <BeneficiaryForm
            updateFunction={fetchUserInfo}
            currentBeneficiaryEmail={beneficiary.email_beneficiary}
            currentBeneficiaryName={beneficiary.name_beneficiary}
          />
        </div>
      </div>
    </InternalLayout>
  );
};

export default withAuth(Settings);
