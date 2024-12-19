import {
  CalendarDaysIcon,
  ChartPieIcon,
  CloudArrowDownIcon,
  CogIcon,
  CommandLineIcon,
  KeyIcon,
  Squares2X2Icon,
  TableCellsIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { SidebarMenuGroup } from "~~/types/sidebar";

const defaultSizeIcon = "w-5 h-5";

export const projectMenuGoups: SidebarMenuGroup[] = [
  {
    name: "MENÚ",
    menuItems: [
      {
        icon: <Squares2X2Icon className={defaultSizeIcon} />,
        label: "Panel de control",
        route: "#",
        children: [{ label: "Mi cuenta", route: "/dashboard" }],
      },
      // {
      //   icon: <CalendarDaysIcon className={defaultSizeIcon} />,
      //   label: "Calendario",
      //   route: "/calendar",
      // },
      // {
      //   icon: <UserCircleIcon className={defaultSizeIcon} />,
      //   label: "Tu perfil",
      //   route: "/profile",
      // },
      {
        icon: <CogIcon className={defaultSizeIcon} />,
        label: "Configuraciones",
        route: "/settings",
      },
      {
        icon: <UserIcon className={defaultSizeIcon} />,
        label: "Admin",
        route: "/admin",
      },
    ],
  },
];

export const menuGroups: SidebarMenuGroup[] = [
  {
    name: "MENU",
    menuItems: [
      {
        icon: <Squares2X2Icon className={defaultSizeIcon} />,
        label: "Dashboard",
        route: "#",
        children: [{ label: "eCommerce", route: "/" }],
      },
      {
        icon: <CalendarDaysIcon className={defaultSizeIcon} />,
        label: "Calendar",
        route: "/calendar",
      },
      {
        icon: <UserIcon className={defaultSizeIcon} />,
        label: "Profile",
        route: "/profile",
      },
      {
        icon: <CommandLineIcon className={defaultSizeIcon} />,
        label: "Forms",
        route: "#",
        children: [
          { label: "Form Elements", route: "/forms/form-elements" },
          { label: "Form Layout", route: "/forms/form-layout" },
        ],
      },
      {
        icon: <TableCellsIcon className={defaultSizeIcon} />,
        label: "Tables",
        route: "/tables",
      },
      {
        icon: <CogIcon className={defaultSizeIcon} />,
        label: "Settings",
        route: "/settings",
      },
    ],
  },
  {
    name: "OTHERS",
    menuItems: [
      {
        icon: <ChartPieIcon className={defaultSizeIcon} />,
        label: "Chart",
        route: "/chart",
      },
      {
        icon: <CloudArrowDownIcon className={defaultSizeIcon} />,
        label: "UI Elements",
        route: "#",
        children: [
          { label: "Alerts", route: "/ui/alerts" },
          { label: "Buttons", route: "/ui/buttons" },
        ],
      },
      {
        icon: <KeyIcon className={defaultSizeIcon} />,
        label: "Authentication",
        route: "#",
        children: [
          { label: "Sign In", route: "/auth/signin" },
          { label: "Sign Up", route: "/auth/signup" },
        ],
      },
    ],
  },
];
