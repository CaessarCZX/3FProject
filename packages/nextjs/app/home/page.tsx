"use client";

import withAuth from "../hoc/withAuth";
import HeroHome from "./_components/HeroHome";
import InternalLayout from "~~/components/Layouts/InternalLayout";

const Activity = () => {
  return (
    <InternalLayout>
      <HeroHome />
    </InternalLayout>
  );
};

export default withAuth(Activity);
