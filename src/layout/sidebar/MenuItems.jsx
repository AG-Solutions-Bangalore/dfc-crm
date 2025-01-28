import {
  IconCopy,
  IconHierarchy,
  IconChartDots2,
  IconLayoutDashboard,
  IconUser,
  IconLanguage,
  IconBriefcase,
  IconMessages,
  IconTypography,
  IconCash,
  IconCardboards,
  IconUsers,
  IconReceipt,
  IconSchool,
  IconListDetails,
  IconRepeat,
  IconComponents,
  IconReport,
  IconDownload,
  IconPeace,
  IconBell,
} from "@tabler/icons-react";

import { uniqueId } from "lodash";

const Menuitems = () => [
  {
    navlabel: true,
    subheader: "Home",
  },
  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconLayoutDashboard,
    href: "/home",
  },
  {
    navlabel: true,
    subheader: "Operation",
  },
 
  {
    id: uniqueId(),
    title: "Master",
    icon: IconUsers,
    subItems: [
      {
        id: uniqueId(),
        title: "Comapany",
        icon: IconListDetails,
        href: "/master/company-list",
      },
      {
        id: uniqueId(),
        title: "Branch",
        icon: IconUsers,
        href: "/master/branch-list",
      },
      {
        id: uniqueId(),
        title: "Tyre Position",
        icon: IconCash,
        href: "/master/tyreposition-list",
      },
      {
        id: uniqueId(),
        title: "Tyre Make",
        icon: IconListDetails,
        href: "/master/tyremake-list",
      },
      {
        id: uniqueId(),
        title: "Service Type",
        icon: IconUsers,
        href: "/master/servicetype-list",
      },
      {
        id: uniqueId(),
        title: "Team",
        icon: IconCash,
        href: "/master/team-list",
      },
      {
        id: uniqueId(),
        title: "Driver",
        icon: IconListDetails,
        href: "/master/driver-list",
      },
      {
        id: uniqueId(),
        title: "Agencies",
        icon: IconUsers,
        href: "/master/agencies-list",
      },
      {
        id: uniqueId(),
        title: "Vendor",
        icon: IconCash,
        href: "/master/vendor-list",
      },
    ],
  },
  {
    id: uniqueId(),
    title: "Vehicles",
    icon: IconReceipt,
    href: "/vechiles-list",
  },
  {
    id: uniqueId(),
    title: "Tyre",
    icon: IconSchool,
    subItems: [
      {
        id: uniqueId(),
        title: "Purchase",
        icon: IconListDetails,
        href: "/tyre/purchase-list",
      },
      // {
      //   id: uniqueId(),
      //   title: "Stock",
      //   icon: IconComponents,
      //   href: "/tyre/stock-list",
      // },
      {
        id: uniqueId(),
        title: "Fitted Tyre",
        icon: IconComponents,
        href: "/tyre/assign-list",
      },
      {
        id: uniqueId(),
        title: "Stock Tyre",
        icon: IconRepeat,
        href: "/tyre/unassign-list",
      },
      {
        id: uniqueId(),
        title: "Under Inspec.",
        icon: IconRepeat,
        href: "/tyre/inspection-list",
      },
    ],
  },
  {
    id: uniqueId(),
    title: "Service",
    icon: IconReceipt,
    href: "/service-list",
  },
  {
    id: uniqueId(),
    title: "Trip",
    icon: IconReceipt,
    href: "/form-trip",
  },
  {
    navlabel: true,
    subheader: "Summary",
  },
  {
    id: uniqueId(),
    title: "Payment",
    icon: IconReport,
    subItems: [
      {
        id: uniqueId(),
        title: "Branch",
        icon: IconCopy,
        href: "/payment/branch-list",
      },
      {
        id: uniqueId(),
        title: "Advance",
        icon: IconCopy,
        href: "/payment/advance-list",
      },
      {
        id: uniqueId(),
        title: "Details",
        icon: IconCopy,
        href: "/payment/details-list",
      },
      
    ],
  },
  {
    id: uniqueId(),
    title: "Todo",
    icon: IconReceipt,
    href: "/todo-list",
  },
  {
    id: uniqueId(),
    title: "Report",
    icon: IconDownload,
    subItems: [
      {
        id: uniqueId(),
        title: "Agencies",
        icon: IconCopy,
        href: "/report-agencies-form",
      },
      {
        id: uniqueId(),
        title: "Team",
        icon: IconCopy,
        href: "/report-team-form",
      },
      {
        id: uniqueId(),
        title: "Driver",
        icon: IconCopy,
        href: "/report-driver-form",
      },
      {
        id: uniqueId(),
        title: "Vendor",
        icon: IconCopy,
        href: "/report-vendor-form",
      },
      {
        id: uniqueId(),
        title: "Vechiles",
        icon: IconCopy,
        href: "/report-vechiles-form",
      },
      {
        id: uniqueId(),
        title: "V-Details",
        icon: IconCopy,
        href: "/report-vdetails-form",
      },
      {
        id: uniqueId(),
        title: "Tyre",
        icon: IconCopy,
        href: "/report-tyre-form",
      },
      {
        id: uniqueId(),
        title: "Services",
        icon: IconCopy,
        href: "/report-services-form",
      },
      {
        id: uniqueId(),
        title: "Trip",
        icon: IconCopy,
        href: "/report-trip-form",
      },
      {
        id: uniqueId(),
        title: "Salary",
        icon: IconCopy,
        href: "/report-salary-form",
      },
      {
        id: uniqueId(),
        title: "Payment",
        icon: IconCopy,
        href: "/report-payment-form",
      },
    ],
  },
 
];

export default Menuitems;
