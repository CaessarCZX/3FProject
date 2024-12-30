"use client";

import React, { useState } from "react";

const AddAffiliate: React.FC = () => {
  const [affiliateEmail, setAffiliateEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleAddAffiliate = () => {
    setIsSaving(true);
  };

  return (
    <>
      {/* Campo para referido directo */}
      <div className="pb-6">
        <div className=" bg-white shadow-md rounded-lg p-6">
          <h2 className="text-3xl font-light text-gray-500 mb-4">Añadir prospecto</h2>
          <div>
            <div className="">
              <label className="block text-sm font-medium text-gray-700">Correo</label>
              <div className="flex max-h-13 gap-8">
                <input
                  type="email"
                  name="email"
                  value={affiliateEmail}
                  onChange={e => setAffiliateEmail(e.target.value)}
                  placeholder="Correo de nuevo referido"
                  className="flex-1 block px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                  onClick={handleAddAffiliate}
                  disabled={isSaving}
                  className="max-w-55 px-6 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 focus:outline-none"
                >
                  {isSaving ? "Registrando..." : "Crear referido"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddAffiliate;
