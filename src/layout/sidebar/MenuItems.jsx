import {
  IconBuilding,
  IconCircleDot,
  IconComponents,
  IconLayoutDashboard,
  IconPin,
  IconReceipt,
  IconRepeat,
  IconSettings,
  IconTool,
  IconTruck,
  IconTruckDelivery,
  IconUsers
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
  "User Management": IconReceipt,
};

const isItemAllowed = (item, pageControl, userId) => {
  const itemHref = item.href?.replace(/^\//, ""); 

  return pageControl.some((control) => {
    return (
      control.page === item.title &&
      control.url === itemHref &&
      control.userIds.includes(userId) &&
      control.status === "Active"
    );
  });
};

const filterMenuItems = (items, pageControl, userId) => {
  if (!items) return [];

  return items.reduce((acc, item) => {
    if (item.subItems) {
      const filteredSubItems = filterMenuItems(
        item.subItems,
        pageControl,
        userId
      );
      if (filteredSubItems.length > 0) {
        acc.push({
          ...item,
          subItems: filteredSubItems,
        });
      }
    } else if (isItemAllowed(item, pageControl, userId)) {
      acc.push(item);
    }
    return acc;
  }, []);
};

const mapItems = (items) => {
  return items.map((item) => ({
    id: uniqueId(),
    title: item.title,
    icon: iconComponents[item.title] || IconSettings,
    href: item.href || undefined,
    subItems: item.subItems ? mapItems(item.subItems) : undefined,
  }));
};

const MenuItems = () => {
  const pageControl = JSON.parse(localStorage.getItem("pageControl") || "[]");
  const userId = localStorage.getItem("id");

  const filteredItems = filterMenuItems(menuItems, pageControl, userId);

  return mapItems(filteredItems);
};

export default MenuItems;
