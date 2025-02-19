"use client";

import { useState } from "react";
import AdminTableForm from "./AdminTableForm";
import TransactionsAdminTableForm from "./TransactionsAdminTableForm";
import TransactionsTableForm from "./TransactionsTableForm";
import WhiteListTableForm from "./WhiteListTableForm";

const AdminForm = () => {
  const [currentView, setCurrentView] = useState<string>("admin");

  const renderComponent = () => {
    switch (currentView) {
      case "admin":
        return <AdminTableForm />;
      case "whitelist":
        return <WhiteListTableForm />;
      case "transactions":
        return <TransactionsTableForm />;
      case "transactionsAdmin":
        return <TransactionsAdminTableForm />;
      default:
        return <AdminTableForm />;
    }
  };

  return (
    <div className="container mx-auto rounded-xl overflow-hidden p-4">
      {/* Botones de navegación */}
      <div className="flex flex-col sm:flex-row justify-around mb-4 space-y-2 sm:space-y-0 sm:space-x-4">
        <button
          onClick={() => setCurrentView("admin")}
          className={`px-4 py-2 rounded ${currentView === "admin" ? "bg-gray-600 text-white" : "bg-gray-200"}`}
        >
          Admin Table
        </button>
        <button
          onClick={() => setCurrentView("whitelist")}
          className={`px-4 py-2 rounded ${currentView === "whitelist" ? "bg-gray-600 text-white" : "bg-gray-200"}`}
        >
          White List Table
        </button>
        <button
          onClick={() => setCurrentView("transactions")}
          className={`px-4 py-2 rounded ${currentView === "transactions" ? "bg-gray-600 text-white" : "bg-gray-200"}`}
        >
          Transactions Table
        </button>
        <button
          onClick={() => setCurrentView("transactionsAdmin")}
          className={`px-4 py-2 rounded ${
            currentView === "transactionsAdmin" ? "bg-gray-600 text-white" : "bg-gray-200"
          }`}
        >
          Transactions Admin Table
        </button>
      </div>

      <div className="rounded-lg border p-4 shadow-md bg-white">{renderComponent()}</div>
    </div>
  );
};

export default AdminForm;
