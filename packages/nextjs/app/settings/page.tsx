"use client";

import { useEffect, useState } from "react";
import withAuth from "../hoc/withAuth";
import BeneficiaryForm from "./_components/BeneficiaryForm";
import ResetPassword from "./_components/ResetPassword";
import SettingsForm from "./_components/SettingsForm";
import WalletConfig from "./_components/WalletConfig";
import WalletDisplayInfo from "./_components/WalletDisplayInfo";
import Breadcrumb from "~~/components/Breadcumbs";
import InternalLayout from "~~/components/Layouts/InternalLayout";
import { useGetTokenData } from "~~/hooks/user/useGetTokenData";
import { getUser } from "~~/services/CRUD/users";

export interface WithdrawalWallet {
  wallet: string;
  isActive: boolean;
  isUsable: boolean;
  releaseDate: string;
  updateDate: string;
}

interface UserResponse {
  email_beneficiary?: string | undefined;
  name_beneficiary?: string | undefined;
  withdrawalWallet?: WithdrawalWallet;
}

const Settings = () => {
  const { tokenInfo } = useGetTokenData();
  const [userData, setUserData] = useState<UserResponse>({ email_beneficiary: "", name_beneficiary: "" });
  const [secondaryWallet, setSecondaryWallet] = useState<WithdrawalWallet | undefined>({
    wallet: "",
    isActive: false,
    isUsable: false,
    releaseDate: "",
    updateDate: "",
  });

  const fetchUserInfo = async (userId: string) => {
    try {
      const data = await getUser(userId);

      if (!data) return;

      const user: UserResponse = data.user;
      setUserData(user);
      setSecondaryWallet(user.withdrawalWallet);
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
      <div className="mt-4 grid grid-cols-5 grid-row-auto gap-8">
        <div className="col-span-5 xl:col-span-3">
          <SettingsForm />
        </div>
        <div className="col-span-5 xl:col-span-2 row-span-3">
          <div className="flex flex-col gap-8">
            <WalletDisplayInfo />
            <WalletConfig updateFunction={fetchUserInfo} withdrawalWallet={secondaryWallet as WithdrawalWallet} />
          </div>
        </div>
        <div className="col-span-5 xl:col-span-3">
          <ResetPassword />
        </div>
        <div className="col-span-5 xl:col-span-3">
          <BeneficiaryForm
            updateFunction={fetchUserInfo}
            currentBeneficiaryEmail={userData.email_beneficiary}
            currentBeneficiaryName={userData.name_beneficiary}
          />
        </div>
      </div>
    </InternalLayout>
  );
};

export default withAuth(Settings);
