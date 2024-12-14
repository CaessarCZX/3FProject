"use client";

import AdminTableForm from "./AdminTableForm";
import WhiteListTableForm from "./WhiteListTableForm";

const AdminForm = () => {
  return (
    <div className="container mx-auto rounded-xl overflow-hidden">
      <div>
        <AdminTableForm />
      </div>
      <div>
        <WhiteListTableForm />
      </div>
    </div>
  );
};

export default AdminForm;
