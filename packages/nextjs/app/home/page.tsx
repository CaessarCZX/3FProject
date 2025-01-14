"use client";

import withAuth from "../hoc/withAuth";
import HeroHome from "./_components/HeroHome";
import InternalLayout from "~~/components/Layouts/InternalLayout";
import { useGetNotfications } from "~~/hooks/user/useGetNotifications";

const HomePage = () => {
  useGetNotfications();

  return (
    <InternalLayout>
      <HeroHome />
    </InternalLayout>
  );
};

export default withAuth(HomePage);
