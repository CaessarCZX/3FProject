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

    if (storedToken) {
      try {
        const decoded: DecodedToken = jwtDecode(storedToken);

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
        <>
          <div className="m-auto max-w-[1200px]">
            <div className="my-6 flex flex-col gap-3 sm:flex-row sm:items-center justify-between">
              <h2 className="text-3xl font-medium text-black dark:text-white">Términos y Condiciones</h2>
              <Link className="text-primary" href="/login">
                Anterior
              </Link>
            </div>
            <Info />
            <p className="text-[10px] text-right mt-12">FREE Friends and Family® Todos los derechos reservados.</p>
          </div>
        </>
      )}
    </>
  );
};

export default Terms;
