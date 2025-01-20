"use client";

import withAuth from "../hoc/withAuth";
import HeroHome from "./_components/HeroHome";
import OneRenderBlockchainNotifications from "~~/components/Actions/NotificationBlockchain";
import InternalLayout from "~~/components/Layouts/InternalLayout";
import { useGlobalState } from "~~/services/store/store";

const HomePage = () => {
  const blockchainNotificationsStatus = useGlobalState(state => state.blockchainNotifications);
  return (
    <InternalLayout>
      {!blockchainNotificationsStatus && <OneRenderBlockchainNotifications />}
      <HeroHome />
    </InternalLayout>
  );
};

export default withAuth(HomePage);
