"use client";

import withAuth from "../hoc/withAuth";
import NotificationExplorer from "./_components/NotificationExplorer";
import Breadcrumb from "~~/components/Breadcumbs";
import InternalLayout from "~~/components/Layouts/InternalLayout";

const Activity = () => {
  return (
    <InternalLayout>
      <Breadcrumb pageName="Registro de eventos" />
      <NotificationExplorer />
    </InternalLayout>
  );
};

export default withAuth(Activity);
