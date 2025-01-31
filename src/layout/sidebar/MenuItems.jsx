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
  IconTruckDelivery,
  IconTruck,
  IconSettings,
  IconBuilding,
  IconCircleDot,
  IconPin,
  IconTool,
} from "@tabler/icons-react";

import { uniqueId } from "lodash";
import menuItems from "../../json/menuItems.json";


const iconComponents = {
  Dashboard: IconLayoutDashboard,
  Master: IconUsers,
  Company: IconBuilding,
  Branch: IconPin,
  "Tyre Position": IconCircleDot,
  "Tyre Make": IconCircleDot,
  "Service Type": IconTool,
  Team: IconUsers,
  Driver: IconUsers,
  Agencies: IconUsers,
  Vendor: IconUsers,
  Vehicles: IconTruck,
  Tyre: IconTool,
  Purchase: IconRepeat,
  "Fitted Tyre": IconComponents,
  "Stock Tyre": IconRepeat,
  "Under Inspec.": IconRepeat,
  Service: IconTool,
  Trip: IconTruckDelivery,
  Payment: IconTruckDelivery,
  Todo: IconReceipt,
  Report: IconReceipt,
  "User Management": IconReceipt
};



const mapItems = (items) => {
  console.log("iconComponents", iconComponents);
console.log("Payment Icon:", iconComponents["Payment"]);
console.log("Report Icon:", iconComponents["Report"]);

  return items.map(item => ({
    id: uniqueId(),
    title: item.title,
    icon: iconComponents[item.title] || IconSettings,
    href: item.href || undefined,
    subItems: item.subItems ? mapItems(item.subItems) : undefined
  }));
};

const Menuitems = () => mapItems(menuItems);

export default Menuitems;
