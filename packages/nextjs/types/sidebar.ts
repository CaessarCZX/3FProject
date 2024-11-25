import React from "react";

interface MenuItemChildren {
  label: string;
  route: string;
}

interface SidebarMenuItem {
  icon: React.ReactNode;
  label: string;
  route: string;
  children?: MenuItemChildren[];
}

export interface SidebarMenuGroup {
  name: string;
  menuItems: SidebarMenuItem[];
}

export interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}
