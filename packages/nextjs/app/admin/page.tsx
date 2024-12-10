"use client";

// Marca este archivo como un Client Component
import withAdmin from "../hoc/withAdmin";
import AdminForm from "./_components/AdminForm";
import InternalLayout from "~~/components/Layouts/InternalLayout";

const Admin = () => {
  return (
    <InternalLayout>
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12">
          <AdminForm />
        </div>
      </div>
    </InternalLayout>
  );
};

export default withAdmin(Admin); // Aplica el HOC al export
