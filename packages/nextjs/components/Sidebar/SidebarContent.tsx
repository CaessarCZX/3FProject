import { FaPeopleGroup } from "react-icons/fa6";
import {
  CalendarDaysIcon,
  ChartPieIcon,
  CloudArrowDownIcon,
  CogIcon,
  CommandLineIcon,
  HomeIcon,
  KeyIcon,
  ScaleIcon,
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
        icon: <HomeIcon className={defaultSizeIcon} />,
        label: "Inicio",
        route: "/home",
      },
      {
        icon: <Squares2X2Icon className={defaultSizeIcon} />,
        label: "Mi cuenta",
        route: "#",
        children: [
          { label: "Panel de control", route: "/dashboard" },
          { label: "Desglose", route: "/savings" },
          { label: "Actividad", route: "/activity" },
        ],
      },
      {
        icon: <FaPeopleGroup className={defaultSizeIcon} />,
        label: "Expansión",
        route: "/expansion",
      },
      {
        icon: <CogIcon className={defaultSizeIcon} />,
        label: "Configuraciones",
        route: "/settings",
      },
      {
        icon: <UserIcon className={defaultSizeIcon} />,
        label: "Administración",
        route: "#",
        children: [
          { label: "Información", route: "/admin" },
          { label: "Pagos a miembros", route: "/payment" },
        ],
      },
      {
        icon: <ScaleIcon className={defaultSizeIcon} />,
        label: "Legal",
        route: "/terms",
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
