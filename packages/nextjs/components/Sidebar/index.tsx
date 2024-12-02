"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
// It's only provitional for development (developMenuGroups)
import { developMenuGoups } from "./SidebarContent";
// import { menuGroups } from "./SidebarContent"; <----- Change for production
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import ClickOutside from "~~/components/Actions/ClickOutside";
import SidebarItem from "~~/components/Sidebar/SidebarItem";
import useLocalStorage from "~~/hooks/common/useLocalStorage";
import { SidebarProps } from "~~/types/sidebar";

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72.5 flex-col overflow-y-hidden bg-boxdark-2 duration-300 ease-linear dark:bg-boxdark lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* <!-- SIDEBAR HEADER --> */}
        <div className="flex items-center justify-between px-6 py-6 lg:pt-8">
          <Link className="ml-4 flex items-center gap-4" href="/">
            <Image width={49} height={32} src={"/logo/logo_white.svg"} alt="Free Friends and Family" priority />
            <article className="font-poppins text-white">
              <h4 className="m-0 font-medium text-3xl tracking-widest leading-none">FREE</h4>
              <p className="m-0 font-light text-[10.2px]">Friends and Family</p>
            </article>
          </Link>

          <button onClick={() => setSidebarOpen(!sidebarOpen)} aria-controls="sidebar" className="block lg:hidden">
            <ChevronLeftIcon className="w-8 h-8 text-white" />
          </button>
        </div>
        {/* <!-- SIDEBAR HEADER --> */}

        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          {/* <!-- Sidebar Menu --> */}
          <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
            {developMenuGoups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">{group.name}</h3>

                <ul className="mb-6 flex flex-col gap-1.5">
                  {group.menuItems.map((menuItem, menuIndex) => (
                    <SidebarItem key={menuIndex} item={menuItem} pageName={pageName} setPageName={setPageName} />
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          {/* <!-- Sidebar Menu --> */}
        </div>
      </aside>
    </ClickOutside>
  );
};

export default Sidebar;
