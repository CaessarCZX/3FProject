"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Info from "./_content/Info";
import { jwtDecode } from "jwt-decode";
import { NextPage } from "next";
import Breadcrumb from "~~/components/Breadcumbs";
import InternalLayout from "~~/components/Layouts/InternalLayout";

interface DecodedToken {
  isActive: boolean;
}

const Terms: NextPage = () => {
  const [isActiveMember, setIsActiveMember] = useState(false);
  useEffect(() => {
    const storedToken = window.localStorage.getItem("token");
    const sessionToken = window.sessionStorage.getItem("sessionToken");

    if (storedToken) {
      try {
        const decoded: DecodedToken = jwtDecode(storedToken);

        if (!sessionToken) {
          return;
        }

        if (!decoded.isActive) {
          return;
        }

        setIsActiveMember(true);
      } catch (error) {
        setIsActiveMember(false);
      }
    }
  }, []);

  return (
    <>
      {isActiveMember ? (
        <InternalLayout>
          <Breadcrumb pageName="Términos y Condiciones" />
          <Info />
        </InternalLayout>
      ) : (
        <div className="m-auto max-w-full px-4">
          <div className="my-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="text-3xl font-medium text-black dark:text-white sm:text-4xl">Términos y Condiciones</h2>
            <Link className="text-primary sm:text-base sm:ml-auto text-lg" href="/login">
              Anterior
            </Link>
          </div>
          <div className="max-w-full overflow-hidden">
            <div className="w-full max-w-[calc(100%-2rem)] overflow-x-auto">
              <Info />
            </div>
          </div>
          <p className="text-[10px] sm:text-xs text-right mt-12">
            FREE Friends and Family® Todos los derechos reservados.
          </p>
        </div>
      )}
    </>
  );
};

export default Terms;
