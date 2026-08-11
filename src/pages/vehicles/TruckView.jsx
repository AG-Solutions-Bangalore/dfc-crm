import { Modal, Tabs } from "@mantine/core";
import {
  IconArrowBack,
  IconChevronDown,
  IconChevronRight,
  IconEye,
  IconFilter,
  IconInfoCircle,
  IconMessageCircle,
  IconPrinter,
  IconSearch,
  IconSettings,
  IconTruck,
  IconTruckDelivery,
} from "@tabler/icons-react";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { toast } from "sonner";
import BASE_URL from "../../base/BaseUrl";
import { decryptId } from "../../components/common/EncryptionDecryption";
import Layout from "../../layout/Layout";
import { IconScanEye } from "@tabler/icons-react";
import { IconEdit } from "@tabler/icons-react";

// Skeleton Loader Component
const SkeletonLoader = () => {
  return (
    <Layout>
      <div className="bg-white p-4 rounded-lg">
        {/* Header Skeleton */}
        <div className="sticky top-0 mb-4 border-b-2 border-gray-200 rounded-lg bg-gray-50 animate-pulse">
          <div className="flex justify-between items-center p-4">
            <div className="h-8 bg-gray-300 w-1/3 rounded"></div>
            <div className="flex space-x-4">
              <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
              <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Details Skeleton */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {[...Array(2)].map((_, colIndex) => (
            <div key={colIndex} className="space-y-4">
              {[...Array(4)].map((_, rowIndex) => (
                <div key={rowIndex} className="flex items-center">
                  <div className="h-4 bg-gray-300 w-1/3 mr-4 rounded"></div>
                  <div className="h-4 bg-gray-300 w-2/3 rounded"></div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Table Skeleton */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                {[...Array(8)].map((_, index) => (
                  <th key={index} className="p-3 bg-gray-200 text-left">
                    <div className="h-4 bg-gray-300 w-3/4 rounded"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(9)].map((_, rowIndex) => (
                <tr key={rowIndex} className="border-b">
                  {[...Array(8)].map((_, colIndex) => (
                    <td key={colIndex} className="p-3">
                      <div className="h-4 bg-gray-300 w-3/4 rounded"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

const TruckView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const printRef = useRef(null);
  const decryptedId = decryptId(id);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [open, setOpen] = useState(false);
  const [vehicle, setVehicle] = useState({}); //first one
  const [service, setService] = useState([]); //secodn one
  const [trip, setTrip] = useState({}); // third one
  const [tyre, setTyre] = useState({}); //fourth one
  const [tyrehistroy, setTyreHistroy] = useState({}); //fourth one
  const [serviceTypeFixed, setServiceTypeFixed] = useState([]); //fifth one
  const [oldService, setOldService] = useState([]); //last one
  const [expandedServiceGroups, setExpandedServiceGroups] = useState({});
  const [serviceSearchTerm, setServiceSearchTerm] = useState("");
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("info");
  const [loadingkm, setLodingKm] = useState(false); //last one
  const [vehicleskm, setVehiclesKm] = useState({
    reg_no: vehicle.reg_no,
    vehicle_present_km: vehicle.vehicle_present_km,
    vehicle_present_date: vehicle.vehicle_present_date,
  });

  const getMajorHeadName = React.useCallback((items) => {
    if (!items || items.length === 0) return "Service Work";

    const genericWords = [
      "labour",
      "labor",
      "misc",
      "miscellaneous",
      "repair",
      "service",
      "charge",
      "charges",
      "work",
    ];

    const pumpItem = items.find((i) =>
      i.service_sub_type?.toUpperCase().includes("PUMP"),
    );
    const nozzleItem = items.find((i) =>
      i.service_sub_type?.toUpperCase().includes("NOZZLE"),
    );

    if (pumpItem && nozzleItem) {
      const details =
        pumpItem.service_sub_details || nozzleItem.service_sub_details || "";
      return details ? `PUMP & NOZZLE ${details}` : "PUMP & NOZZLE";
    }
    if (pumpItem) {
      const details = pumpItem.service_sub_details || "";
      return details
        ? `${pumpItem.service_sub_type} ${details}`
        : pumpItem.service_sub_type;
    }
    if (nozzleItem) {
      const details = nozzleItem.service_sub_details || "";
      return details ? `PUMP / NOZZLE ${details}` : "PUMP / NOZZLE";
    }

    const specificItem = items.find(
      (i) =>
        i.service_sub_type &&
        !genericWords.includes(i.service_sub_type.trim().toLowerCase()),
    );

    const mainItem = specificItem || items[0];
    const subType = mainItem?.service_sub_type || "Service Work";
    const details = mainItem?.service_sub_details || "";

    if (details) {
      if (subType.toLowerCase().includes(details.toLowerCase())) {
        return subType;
      }
      return `${subType} ${details}`;
    }
    return subType;
  }, []);

  // Unique service types for Category Filter
  const categoryOptions = React.useMemo(() => {
    if (!oldService || oldService.length === 0) return [];
    const types = new Set();
    oldService.forEach((item) => {
      if (item.service_sub_type) {
        types.add(item.service_sub_type.trim());
      }
    });
    return Array.from(types).sort();
  }, [oldService]);

  // Group oldService entries by bill / date + km / service reference ID
  const groupedServices = React.useMemo(() => {
    if (!oldService || oldService.length === 0) return [];
    const map = new Map();
    oldService.forEach((item) => {
      const key =
        item.service_sub_ref_id ||
        item.service_ref_id ||
        item.service_id ||
        `${item.service_sub_date}_${item.service_sub_km}`;
      if (!map.has(key)) {
        map.set(key, {
          key,
          date: item.service_sub_date,
          km: item.service_sub_km,
          presentDate: vehicle?.vehicle_present_date || item.vehicle_present_date,
          presentKm: vehicle?.vehicle_present_km || item.vehicle_present_km,
          items: [],
        });
      }
      map.get(key).items.push(item);
    });
    return Array.from(map.values());
  }, [oldService, vehicle]);

  // Filter groups by category and search query
  const filteredGroups = React.useMemo(() => {
    let result = groupedServices;

    // Filter by Category Dropdown
    if (serviceCategoryFilter !== "all") {
      const selectedCat = serviceCategoryFilter.toLowerCase();
      result = result.filter((group) => {
        const majorName = getMajorHeadName(group.items).toLowerCase();
        return (
          majorName.includes(selectedCat) ||
          group.items.some(
            (i) =>
              i.service_sub_type &&
              i.service_sub_type.toLowerCase().includes(selectedCat),
          )
        );
      });
    }

    // Filter by Search Query
    if (serviceSearchTerm.trim()) {
      const query = serviceSearchTerm.toLowerCase().trim();
      result = result.filter((group) => {
        const majorName = getMajorHeadName(group.items).toLowerCase();
        const dateStr = group.date
          ? moment(group.date).format("DD-MMM-YYYY").toLowerCase()
          : "";
        const kmStr = group.km ? String(group.km) : "";
        const itemsMatch = group.items.some(
          (item) =>
            (item.service_sub_type &&
              item.service_sub_type.toLowerCase().includes(query)) ||
            (item.service_sub_details &&
              item.service_sub_details.toLowerCase().includes(query)),
        );
        return (
          majorName.includes(query) ||
          dateStr.includes(query) ||
          kmStr.includes(query) ||
          itemsMatch
        );
      });
    }

    return result;
  }, [groupedServices, serviceSearchTerm, serviceCategoryFilter, getMajorHeadName]);
  const handleOpen = (service_sub_type) => {
    const filtered = oldService.filter(
      (item) => item.service_sub_type == service_sub_type,
    );
    setFilteredHistory(filtered);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFilteredHistory([]);
  };

  // --- status change ------

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [removeConfirmOpen, setRemoveConfirmOpen] = useState(false);
  const [selectedTyre, setSelectedTyre] = useState({
    fieldName: "",
    tyreNo: "",
    tyreType: "",
    status: "",
  });

  const TYRE_SUB_STATUS = [
    { value: "New", label: "New" },
    { value: "1st Retread", label: "1st Retread" },
    { value: "2nd Retread", label: "2nd Retread" },
    { value: "Casing", label: "Casing" },
    { value: "Dead", label: "Dead" },
  ];

  const openEditModal = (fieldName, tyreNo, tyreType, status) => {
    setSelectedTyre({
      fieldName,
      tyreNo: tyreNo || "",
      tyreType: tyreType || "",
      status: status || "New",
    });
    setEditModalOpen(true);
  };

  const handleModalInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedTyre((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveTyre = async () => {
    try {
      const token = localStorage.getItem("token");
      const data = {
        tyre_no: selectedTyre.tyreNo,
        tyre_type: selectedTyre.fieldName,
        status: selectedTyre.status,
      };

      const response = await axios.put(
        `${BASE_URL}/api/web-update-vehicle-tyre-assign-status/${tyre.id}`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.code === 200) {
        toast.success(response.data.msg);
        setEditModalOpen(false);
        fetchTyreDetails();
      } else {
        toast.error(response.data.msg || "Failed to update tyre");
      }
    } catch (error) {
      console.error("Error updating tyre:", error);
      toast.error("Something went wrong");
    }
  };

  // ----- status end ------
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    pageStyle: `
      @page {
        size: A4;
        margin: 2mm;
      }
      @media print {
        body {
          margin: 0;
          padding: 0;
             border: 1px solid #000;
                   min-height:100vh
        }
        
        * {
          font-size: 11px !important;
          line-height: 2 !important;
        }
  
        table {
          width: 100%;
          border-collapse: collapse;
          page-break-inside: avoid;
        }
  
        th, td {
          border: 0.5px solid #ddd;
          padding: 2px !important;
        }
  
        .py-2 {
          padding-top: 2px !important;
          padding-bottom: 2px !important;
        }
  
        h1, h2, h3 {
          font-size: 10px !important;
          margin: 4px 0 !important;
        }
  
        .p-4 {
          padding: 8px !important;
        }
  
        .mb-2, .mb-4 {
          margin-bottom: 4px !important;
        }
  
        .gap-4 {
          gap: 8px !important;
        }
  
        .print\\:py-0 {
          padding-top: 0 !important;
          padding-bottom: 0 !important;
        }
  
        .print\\:hidden {
          display: none !important;
        }
  
        .bg-gray-100 {
          background-color: #f3f4f6 !important;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    `,
  });

  const fetchTyreDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/fetch-vehicle-detail-id/${decryptedId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const vehicledata = response.data.vehicle;
      setVehicle(vehicledata);
      if (vehicledata?.reg_no) {
        setVehiclesKm({
          reg_no: vehicledata.reg_no,
          vehicle_present_km: vehicledata.vehicle_present_km || "",
          vehicle_present_date: vehicledata.vehicle_present_date || "",
        });
      }
      setService(response.data.fullservices);
      setServiceTypeFixed(response.data.servicesTypesFixed);
      setTrip(response.data.trip);
      setTyre(response.data.vehiceltyresub);
      setTyreHistroy(response.data.tyreHistory);
      setOldService(response.data.historyservices);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching Vehicle View details:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    if (decryptedId) {
      fetchTyreDetails();
    }
  }, [decryptedId]);

  const vechileInfo = () => {
    return (
      <>
        <div className="mb-2 ">
          <h1 className="print:text-lg print:text-black text-blue-500 font-bold">
            {vehicle.reg_no}
          </h1>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-2 ">
          <div>
            <table className="w-full ">
              <tbody>
                <tr className="border-b">
                  <td className="font-semibold w-1/3 text-xs print:py-0 py-3 ">
                    Branch
                  </td>
                  <td className="text-xs">{vehicle?.vehicle_branch}</td>
                </tr>
                <tr className="border-b">
                  <td className="font-semibold w-1/3 text-xs print:py-0 py-3">
                    Company
                  </td>
                  <td className="text-xs">{vehicle?.vehicle_company}</td>
                </tr>
                <tr className="border-b">
                  <td className="font-semibold w-1/3 text-xs print:py-0 py-3">
                    Vehicle Type
                  </td>
                  <td className="text-xs">{vehicle?.vehicle_type}</td>
                </tr>
                <tr className="border-b">
                  <td className="font-semibold w-1/3 text-xs print:py-0 py-3">
                    Model Year
                  </td>
                  <td className="text-xs">{vehicle?.mfg_year}</td>
                </tr>
                <tr className="border-b">
                  <td className="font-semibold w-1/3 text-xs print:py-0 py-2">
                    Vehicle KM
                  </td>
                  <td className="text-xs">{vehicle?.vehicle_open_km}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <table className="w-full">
              <tbody>
                <tr className="border-b">
                  <td className="font-semibold w-1/3 text-xs print:py-0  py-2">
                    Insurance Due
                  </td>
                  <td className="text-xs">
                    {moment(vehicle?.ins_due).format("DD-MMMM-YYYY")}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="font-semibold w-1/3 text-xs print:py-0 py-2">
                    Permit Due
                  </td>
                  <td className="text-xs">
                    {moment(vehicle?.permit_due).format("DD-MMMM-YYYY")}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="font-semibold w-1/3 text-xs print:py-0 py-2">
                    FC Due
                  </td>
                  <td className="text-xs">
                    {moment(vehicle?.fc_due).format("DD-MMMM-YYYY")}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="font-semibold w-1/3 text-xs print:py-0 py-2">
                    Mileage
                  </td>
                  <td className="text-xs">{vehicle?.vehicle_mileage}</td>
                </tr>
                <tr className="border-b">
                  <td className="font-semibold w-1/3 text-xs print:py-0 py-2">
                    Driver
                  </td>
                  <td className="text-xs">
                    {vehicle?.vehicle_driver} {" - "}
                    {vehicle.vehicle_driver_no}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="font-semibold w-1/3 text-xs print:py-0 py-2">
                    Status
                  </td>
                  <td className="text-xs">{vehicle?.vehicle_status}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  };

  const oldServiceInfo = () => {
    return (
      <>
        {serviceTypeFixed.length > 0 && (
          <div className="mt-2">
            <div className="overflow-x-auto ">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {serviceTypeFixed.map((serviceType, index) => {
                  const hasData = service.some(
                    (serviceItem) =>
                      serviceItem.service_sub_type ===
                      serviceType.service_types_fixed,
                  );

                  return (
                    <div key={index}>
                      <div className="border  border-gray-300 hover:bg-gray-50 transition-colors duration-300">
                        <p
                          className={`p-1 text-xs border font-bold flex items-center justify-center gap-1 ${
                            hasData ? "bg-blue-200" : "bg-gray-200"
                          } border-black text-center`}
                        >
                          {serviceType.service_types_fixed}
                          {hasData ? (
                            <IconScanEye
                              size={20}
                              onClick={() =>
                                handleOpen(serviceType?.service_types_fixed)
                              }
                              className="cursor-pointer"
                            />
                          ) : (
                            ""
                          )}
                        </p>
                        <p className="p-2 text-xs border border-black text-center">
                          {service.map((serviceItem) => {
                            if (
                              serviceItem.service_sub_type ===
                              serviceType.service_types_fixed
                            ) {
                              return (
                                <React.Fragment key={serviceItem.id}>
                                  <div>
                                    {moment(
                                      serviceItem.service_sub_date,
                                    ).format("DD-MMM-YYYY")}
                                  </div>
                                  <div>
                                    <span className=" font-semibold">
                                      KM&nbsp;:&nbsp;
                                    </span>
                                    {Number(vehicleskm.vehicle_present_km) -
                                      Number(serviceItem.service_sub_km)}
                                  </div>
                                </React.Fragment>
                              );
                            }
                            return null;
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {serviceTypeFixed.length <= 0 && (
          <div className="text-center">
            <h1>No Data Available</h1>
          </div>
        )}
      </>
    );
  };
  const toggleServiceGroup = (key) => {
    setExpandedServiceGroups((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const serviceInfo = () => {
    return (
      <>
        {oldService.length > 0 && (
          <div className="mt-2">
            <div className="flex flex-col md:flex-row justify-between items-center mb-3 gap-3">
              <h3 className="text-lg font-semibold text-gray-800">
                Service History
              </h3>
              <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto print:hidden">
                {/* Category Filter Dropdown */}
                <div className="relative w-full sm:w-48">
                  <select
                    value={serviceCategoryFilter}
                    onChange={(e) => setServiceCategoryFilter(e.target.value)}
                    className="w-full pl-3 pr-8 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                  >
                    <option value="all">All Service Categories</option>
                    {categoryOptions.map((cat, i) => (
                      <option key={i} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Search Input */}
                <div className="relative w-full sm:w-60">
                  <IconSearch className="absolute left-2.5 top-2.5 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search service, date, km..."
                    value={serviceSearchTerm}
                    onChange={(e) => setServiceSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {filteredGroups.length > 0 ? (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border py-2 text-xs text-start px-3">
                      Services (Major Head)
                    </th>
                    <th className="border py-2 text-xs text-right px-3">Amount</th>
                    <th className="border py-2 text-xs">Date</th>
                    <th className="border py-2 text-xs">KM</th>
                    <th className="border py-2 text-xs">KM Run</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGroups.map((group) => {
                    const isExpanded =
                      expandedServiceGroups[group.key] ||
                      serviceSearchTerm.trim() !== "" ||
                      serviceCategoryFilter !== "all";

                    // Smart Major Head Name (e.g. PUMP & NOZZLE or PUMP O/H)
                    const majorHeadName = getMajorHeadName(group.items);

                    // Total Amount for this service task/bill
                    const totalAmount = group.items.reduce(
                      (sum, item) => sum + (Number(item?.service_sub_amount) || 0),
                      0,
                    );

                    return (
                      <React.Fragment key={group.key}>
                        <tr className="text-center hover:bg-gray-50 transition-colors">
                          <td className="border py-2 text-xs text-start px-2">
                            <div className="flex items-center gap-1.5 select-none">
                              {group.items.length > 1 ? (
                                <button
                                  type="button"
                                  onClick={() => toggleServiceGroup(group.key)}
                                  className="p-1 hover:bg-blue-100 rounded text-blue-600 focus:outline-none flex items-center gap-1 cursor-pointer"
                                  title={
                                    isExpanded
                                      ? "Click to collapse minor head breakups"
                                      : "Click to expand minor head breakups"
                                  }
                                >
                                  {isExpanded ? (
                                    <IconChevronDown className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                  ) : (
                                    <IconChevronRight className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                  )}
                                </button>
                              ) : (
                                <span className="w-6 inline-block" />
                              )}
                              <span
                                className="font-semibold text-gray-900 cursor-pointer"
                                onClick={() => {
                                  if (group.items.length > 1) {
                                    toggleServiceGroup(group.key);
                                  }
                                }}
                              >
                                {majorHeadName}
                              </span>
                              {group.items.length > 1 && (
                                <span
                                  onClick={() => toggleServiceGroup(group.key)}
                                  className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium cursor-pointer hover:bg-blue-200"
                                >
                                  {group.items.length} breakup items
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="border py-2 text-xs font-semibold text-gray-800 text-right px-3">
                            {totalAmount > 0
                              ? `₹${totalAmount.toLocaleString("en-IN")}`
                              : "-"}
                          </td>
                          <td className="border py-2 text-xs">
                            {moment(group.date).format("DD-MMM-YYYY")}
                          </td>
                          <td className="border py-2 text-xs">{group.km}</td>
                          <td className="border py-2 text-xs">
                            {vehicle?.vehicle_present_km
                              ? vehicle.vehicle_present_km - group.km
                              : ""}
                          </td>
                        </tr>

                        {isExpanded && group.items.length > 1 && (
                          <tr className="bg-blue-50/30">
                            <td colSpan={5} className="border p-3">
                              <div className="pl-4 pr-2 text-xs">
                                <p className="font-semibold text-gray-700 mb-2">
                                  Minor Head Breakup Items ({group.items.length} line items):
                                </p>
                                <div className="overflow-x-auto">
                                  <table className="w-full bg-white border border-gray-200 rounded-md text-xs">
                                    <thead>
                                      <tr className="bg-gray-100 text-gray-700">
                                        <th className="py-1.5 px-3 border-b text-center w-10">#</th>
                                        <th className="py-1.5 px-3 border-b text-left">Minor Head (Line Item)</th>
                                        <th className="py-1.5 px-3 border-b text-left">Description / Narration</th>
                                        <th className="py-1.5 px-3 border-b text-right">Amount</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {group.items.map((item, idx) => (
                                        <tr key={idx} className="border-b hover:bg-gray-50">
                                          <td className="py-1.5 px-3 text-center text-gray-500 font-medium">{idx + 1}</td>
                                          <td className="py-1.5 px-3 text-gray-800 font-semibold">{item?.service_sub_type}</td>
                                          <td className="py-1.5 px-3 text-gray-600">{item?.service_sub_details || "-"}</td>
                                          <td className="py-1.5 px-3 text-right font-medium text-gray-800">
                                            {item?.service_sub_amount ? `₹${Number(item.service_sub_amount).toLocaleString("en-IN")}` : "-"}
                                          </td>
                                        </tr>
                                      ))}
                                      {totalAmount > 0 && (
                                        <tr className="bg-blue-50/70 font-bold text-gray-800">
                                          <td colSpan={3} className="py-2 px-3 text-right">Total Breakup Amount:</td>
                                          <td className="py-2 px-3 text-right text-blue-700 font-bold">
                                            ₹{totalAmount.toLocaleString("en-IN")}
                                          </td>
                                        </tr>
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No matching service records found.
              </div>
            )}
          </div>
        )}

        {oldService.length <= 0 && (
          <div className="text-center">
            <h1>No Data Available</h1>
          </div>
        )}
      </>
    );
  };

  const tripInfo = () => {
    return (
      <>
        {trip.length > 0 && (
          <div className="mt-2">
            <h3 className="text-lg font-semibold mb-2 text-center">Trip</h3>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border py-2 text-xs ">Date</th>
                  <th className="border py-2 text-xs ">Agency</th>
                  <th className="border py-2 text-xs ">KM</th>
                  <th className="border py-2 text-xs ">Supplier</th>
                  <th className="border py-2 text-xs ">HSD</th>
                  <th className="border py-2 text-xs ">HSD Supplied</th>
                  <th className="border py-2 text-xs  ">Driver</th>
                  <th className="border py-2 text-xs  ">Status</th>
                </tr>
              </thead>
              <tbody>
                {/* left  */}
                {trip?.map((item, key) => (
                  <tr key={key} className="text-center">
                    <td className="border py-2 text-xs ">
                      {moment(item?.trip_date).format("DD-MMM-YYYY")}
                    </td>
                    <td className="border py-2 text-xs text-start px-2">
                      {item?.trip_agency}
                    </td>
                    <td className="border py-2 text-xs">{item?.trip_km}</td>
                    <td className="border py-2 text-xs text-start px-2">
                      {item?.trip_supplier}
                    </td>
                    <td className="border py-2 text-xs ">{item?.trip_hsd}</td>
                    <td className="border py-2 text-xs ">
                      {item?.trip_hsd_supplied}
                    </td>
                    <td className="border py-2 text-xs text-start px-2">
                      {item?.trip_driver}-{item?.trip_driver_no}
                    </td>
                    <td className="border py-2  text-xs text-start px-2">
                      {item?.trip_status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {trip.length <= 0 && (
          <div className="text-center">
            <h1>No Data Available</h1>
          </div>
        )}
      </>
    );
  };

  const tyreInfo = () => {
    return (
      <>
        {tyre != 0 && (
          <div className="mt-2">
            <h3 className="text-lg font-semibold mb-2 text-center">
              Present Tyre
            </h3>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border py-2 text-xs">Tyre Position</th>
                  <th className="border py-2 text-xs">Tyre No</th>
                  <th className="border py-2 text-xs">Type</th>
                  <th className="border py-2 text-xs">Make</th>
                  <th className="border py-2 text-xs">Date</th>
                  <th className="border py-2 text-xs">KM</th>
                  <th className="border py-2 text-xs">Present Date</th>
                  <th className="border py-2 text-xs">Present KM</th>
                  <th className="border py-2 text-xs">KM Run</th>
                  <th className="border py-2 text-xs">Status</th>
                  <th className="border py-2 text-xs">Action</th>
                </tr>
              </thead>
              <tbody>
                {vehicle?.vehicle_type != "Other" && (
                  <tr className="text-center">
                    <td className="border py-2 text-xs text-start px-2">
                      1.Front Left
                    </td>
                    <td className="border py-2 text-xs text-start px-2">
                      {tyre?.tyre_assign_1_front_left_no}
                    </td>
                    <td className="border py-2 text-xs text-start px-2">
                      {tyre?.tyre_assign_1_front_left_type}
                    </td>
                    <td className="border py-2 text-xs text-start px-2">
                      {tyre?.tyre_assign_1_front_left_make}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_1_front_left_date
                        ? moment(tyre?.tyre_assign_1_front_left_date).format(
                            "DD-MMM-YYYY",
                          )
                        : ""}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_1_front_left_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_1_front_left_pre_date
                        ? moment(
                            tyre?.tyre_assign_1_front_left_pre_date,
                          ).format("DD-MMM-YYYY")
                        : ""}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_1_front_left_pre_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_1_front_left_pre_km -
                        tyre?.tyre_assign_1_front_left_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_1_front_left_status}
                    </td>
                    <td className="border py-2 text-xs">
                      <IconEdit
                        size={18}
                        className="cursor-pointer text-blue-600 hover:text-blue-800 mx-auto"
                        onClick={() =>
                          openEditModal(
                            "tyre_assign_1_front_left_no",
                            tyre?.tyre_assign_1_front_left_no,
                            tyre?.tyre_assign_1_front_left_type,
                            tyre?.tyre_assign_1_front_left_status,
                            tyre.id,
                          )
                        }
                        title="Edit Tyre"
                      />
                    </td>
                  </tr>
                )}

                {vehicle.vehicle_type != "Other" && (
                  <tr className="text-center">
                    <td className="border py-2 text-xs text-start px-2">
                      2.Front Right
                    </td>
                    <td className="border py-2 text-xs text-start px-2">
                      {tyre?.tyre_assign_2_front_right_no}
                    </td>
                    <td className="border py-2 text-xs text-start px-2">
                      {tyre?.tyre_assign_2_front_right_type}
                    </td>
                    <td className="border py-2 text-xs text-start px-2">
                      {tyre?.tyre_assign_2_front_right_make}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_2_front_right_date
                        ? moment(tyre?.tyre_assign_2_front_right_date).format(
                            "DD-MMM-YYYY",
                          )
                        : ""}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_2_front_right_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_2_front_right_pre_date
                        ? moment(
                            tyre?.tyre_assign_2_front_right_pre_date,
                          ).format("DD-MMM-YYYY")
                        : ""}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_2_front_right_pre_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_2_front_right_pre_km -
                        tyre?.tyre_assign_2_front_right_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_2_front_right_status}
                    </td>
                    <td className="border py-2 text-xs">
                      <IconEdit
                        size={18}
                        className="cursor-pointer text-blue-600 hover:text-blue-800 mx-auto"
                        onClick={() =>
                          openEditModal(
                            "tyre_assign_2_front_right_no",
                            tyre?.tyre_assign_2_front_right_no,
                            tyre?.tyre_assign_2_front_right_type,
                            tyre?.tyre_assign_2_front_right_status,
                          )
                        }
                        title="Edit Tyre"
                      />
                    </td>
                  </tr>
                )}
                {vehicle.vehicle_type == "Car" && (
                  <tr className="text-center">
                    <td className="border py-2 text-xs text-start px-2">
                      3. Back Left
                    </td>
                    <td className="border py-2 text-xs text-start px-2">
                      {tyre?.tyre_assign_3_back_left_no}
                    </td>
                    <td className="border py-2 text-xs text-start px-2">
                      {tyre?.tyre_assign_3_back_left_type}
                    </td>
                    <td className="border py-2 text-xs text-start px-2">
                      {tyre?.tyre_assign_3_back_left_make}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_3_back_left_date
                        ? moment(tyre?.tyre_assign_3_back_left_date).format(
                            "DD-MMM-YYYY",
                          )
                        : ""}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_3_back_left_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_3_back_left_pre_date
                        ? moment(tyre?.tyre_assign_3_back_left_pre_date).format(
                            "DD-MMM-YYYY",
                          )
                        : ""}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_3_back_left_pre_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_3_back_left_pre_km -
                        tyre?.tyre_assign_3_back_left_km}
                    </td>
                    <td className="border py-2 text-xs ">
                      {tyre?.tyre_assign_3_back_left_status}
                    </td>
                    <td className="border py-2 text-xs">
                      <IconEdit
                        size={18}
                        className="cursor-pointer text-blue-600 hover:text-blue-800 mx-auto"
                        onClick={() =>
                          openEditModal(
                            "tyre_assign_3_back_left_no",
                            tyre?.tyre_assign_3_back_left_no,
                            tyre?.tyre_assign_3_back_left_type,
                            tyre?.tyre_assign_3_back_left_status,
                          )
                        }
                        title="Edit Tyre"
                      />
                    </td>
                  </tr>
                )}
                {vehicle.vehicle_type == "Car" && (
                  <tr className="text-center">
                    <td className="border py-2 text-xs text-start px-2">
                      4. Back Right
                    </td>
                    <td className="border py-2 text-xs text-start px-2">
                      {tyre?.tyre_assign_5_back_right_no}
                    </td>
                    <td className="border py-2 text-xs text-start px-2">
                      {tyre?.tyre_assign_5_back_right_type}
                    </td>
                    <td className="border py-2 text-xs text-start px-2">
                      {tyre?.tyre_assign_5_back_right_make}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_5_back_right_date
                        ? moment(tyre?.tyre_assign_5_back_right_date).format(
                            "DD-MMM-YYYY",
                          )
                        : ""}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_5_back_right_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_5_back_right_pre_date
                        ? moment(
                            tyre?.tyre_assign_5_back_right_pre_date,
                          ).format("DD-MMM-YYYY")
                        : ""}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_5_back_right_pre_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_5_back_right_pre_km -
                        tyre?.tyre_assign_5_back_right_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_5_back_right_status}
                    </td>
                    <td className="border py-2 text-xs">
                      <IconEdit
                        size={18}
                        className="cursor-pointer text-blue-600 hover:text-blue-800 mx-auto"
                        onClick={() =>
                          openEditModal(
                            "tyre_assign_5_back_right_no",
                            tyre?.tyre_assign_5_back_right_no,
                            tyre?.tyre_assign_5_back_right_type,
                            tyre?.tyre_assign_5_back_right_status,
                          )
                        }
                        title="Edit Tyre"
                      />
                    </td>
                  </tr>
                )}
                {vehicle.vehicle_type == "6W Truck" && (
                  <tr className="text-center">
                    <td className="border py-2 text-xs text-start px-2">
                      3. Back Left
                    </td>
                    <td className="border py-2 text-xs text-start px-2">
                      {tyre?.tyre_assign_3_back_left_no}
                    </td>
                    <td className="border py-2 text-xs text-start px-2">
                      {tyre?.tyre_assign_3_back_left_type}
                    </td>
                    <td className="border py-2 text-xs text-start px-2">
                      {tyre?.tyre_assign_3_back_left_make}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_3_back_left_date
                        ? moment(tyre?.tyre_assign_3_back_left_date).format(
                            "DD-MMM-YYYY",
                          )
                        : ""}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_3_back_left_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_3_back_left_pre_date
                        ? moment(tyre?.tyre_assign_3_back_left_pre_date).format(
                            "DD-MMM-YYYY",
                          )
                        : ""}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_3_back_left_pre_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_3_back_left_pre_km -
                        tyre?.tyre_assign_3_back_left_km}
                    </td>
                    <td className="border py-2 text-xs ">
                      {tyre?.tyre_assign_3_back_left_status}
                    </td>
                    <td className="border py-2 text-xs">
                      <IconEdit
                        size={18}
                        className="cursor-pointer text-blue-600 hover:text-blue-800 mx-auto"
                        onClick={() =>
                          openEditModal(
                            "tyre_assign_3_back_left_no",
                            tyre?.tyre_assign_3_back_left_no,
                            tyre?.tyre_assign_3_back_left_type,
                            tyre?.tyre_assign_3_back_left_status,
                          )
                        }
                        title="Edit Tyre"
                      />
                    </td>
                  </tr>
                )}

                {vehicle.vehicle_type == "6W Truck" && (
                  <tr className="text-center">
                    <td className="border py-2 text-xs text-start px-2">
                      4. Back Left
                    </td>
                    <td className="border py-2 text-xs text-start px-2">
                      {tyre?.tyre_assign_4_back_left_no}
                    </td>
                    <td className="border py-2 text-xs text-start px-2">
                      {tyre?.tyre_assign_4_back_left_type}
                    </td>
                    <td className="border py-2 text-xs text-start px-2">
                      {tyre?.tyre_assign_4_back_left_make}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_4_back_left_date
                        ? moment(tyre?.tyre_assign_4_back_left_date).format(
                            "DD-MMM-YYYY",
                          )
                        : ""}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_4_back_left_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_4_back_left_pre_date
                        ? moment(tyre?.tyre_assign_4_back_left_pre_date).format(
                            "DD-MMM-YYYY",
                          )
                        : ""}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_4_back_left_pre_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_4_back_left_pre_km -
                        tyre?.tyre_assign_4_back_left_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_4_back_left_status}
                    </td>
                    <td className="border py-2 text-xs">
                      <IconEdit
                        size={18}
                        className="cursor-pointer text-blue-600 hover:text-blue-800 mx-auto"
                        onClick={() =>
                          openEditModal(
                            "tyre_assign_4_back_left_no",
                            tyre?.tyre_assign_4_back_left_no,
                            tyre?.tyre_assign_4_back_left_type,
                            tyre?.tyre_assign_4_back_left_status,
                          )
                        }
                        title="Edit Tyre"
                      />
                    </td>
                  </tr>
                )}

                {vehicle.vehicle_type == "6W Truck" && (
                  <tr className="text-center">
                    <td className="border py-2 text-xs text-start px-2">
                      5. Back Right
                    </td>
                    <td className="border py-2 text-xs text-start px-2">
                      {tyre?.tyre_assign_5_back_right_no}
                    </td>
                    <td className="border py-2 text-xs text-start px-2">
                      {tyre?.tyre_assign_5_back_right_type}
                    </td>
                    <td className="border py-2 text-xs text-start px-2">
                      {tyre?.tyre_assign_5_back_right_make}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_5_back_right_date
                        ? moment(tyre?.tyre_assign_5_back_right_date).format(
                            "DD-MMM-YYYY",
                          )
                        : ""}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_5_back_right_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_5_back_right_pre_date
                        ? moment(
                            tyre?.tyre_assign_5_back_right_pre_date,
                          ).format("DD-MMM-YYYY")
                        : ""}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_5_back_right_pre_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_5_back_right_pre_km -
                        tyre?.tyre_assign_5_back_right_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_5_back_right_status}
                    </td>
                    <td className="border py-2 text-xs">
                      <IconEdit
                        size={18}
                        className="cursor-pointer text-blue-600 hover:text-blue-800 mx-auto"
                        onClick={() =>
                          openEditModal(
                            "tyre_assign_5_back_right_no",
                            tyre?.tyre_assign_5_back_right_no,
                            tyre?.tyre_assign_5_back_right_type,
                            tyre?.tyre_assign_5_back_right_status,
                          )
                        }
                        title="Edit Tyre"
                      />
                    </td>
                  </tr>
                )}

                {vehicle.vehicle_type == "6W Truck" && (
                  <tr className="text-center">
                    <td className="border py-2 text-xs text-start px-2">
                      6. Back Right
                    </td>
                    <td className="border py-2 text-xs text-start px-2">
                      {tyre?.tyre_assign_6_back_right_no}
                    </td>
                    <td className="border py-2 text-xs text-start px-2">
                      {tyre?.tyre_assign_6_back_right_type}
                    </td>
                    <td className="border py-2 text-xs text-start px-2">
                      {tyre?.tyre_assign_6_back_right_make}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_6_back_right_date
                        ? moment(tyre?.tyre_assign_6_back_right_date).format(
                            "DD-MMM-YYYY",
                          )
                        : ""}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_6_back_right_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_6_back_right_pre_date
                        ? moment(
                            tyre?.tyre_assign_6_back_right_pre_date,
                          ).format("DD-MMM-YYYY")
                        : ""}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_6_back_right_pre_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_6_back_right_pre_km -
                        tyre?.tyre_assign_6_back_right_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_6_back_right_status}
                    </td>
                    <td className="border py-2 text-xs">
                      <IconEdit
                        size={18}
                        className="cursor-pointer text-blue-600 hover:text-blue-800 mx-auto"
                        onClick={() =>
                          openEditModal(
                            "tyre_assign_6_back_right_no",
                            tyre?.tyre_assign_6_back_right_no,
                            tyre?.tyre_assign_6_back_right_type,
                            tyre?.tyre_assign_6_back_right_status,
                          )
                        }
                        title="Edit Tyre"
                      />
                    </td>
                  </tr>
                )}

                {vehicle.vehicle_type == "10W Truck" && (
                  <tr className="text-center">
                    <td className="border py-2 text-xs text-start px-2">
                      3. Back Housing Left
                    </td>
                    <td className="border py-2 text-xs text-start px-2">
                      {tyre?.tyre_assign_3_back_housing_left_no}
                    </td>
                    <td className="border py-2 text-xs text-start px-2">
                      {tyre?.tyre_assign_3_back_housing_left_type}
                    </td>
                    <td className="border py-2 text-xs text-start px-2">
                      {tyre?.tyre_assign_3_back_housing_left_make}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_3_back_housing_left_date
                        ? moment(
                            tyre?.tyre_assign_3_back_housing_left_date,
                          ).format("DD-MMM-YYYY")
                        : ""}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_3_back_housing_left_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_3_back_housing_left_pre_date
                        ? moment(
                            tyre?.tyre_assign_3_back_housing_left_pre_date,
                          ).format("DD-MMM-YYYY")
                        : ""}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_3_back_housing_left_pre_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_3_back_housing_left_pre_km -
                        tyre?.tyre_assign_3_back_housing_left_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_3_back_housing_left_status}
                    </td>
                    <td className="border py-2 text-xs">
                      <IconEdit
                        size={18}
                        className="cursor-pointer text-blue-600 hover:text-blue-800 mx-auto"
                        onClick={() =>
                          openEditModal(
                            "tyre_assign_3_back_housing_left_no",
                            tyre?.tyre_assign_3_back_housing_left_no,
                            tyre?.tyre_assign_3_back_housing_left_type,
                            tyre?.tyre_assign_3_back_housing_left_status,
                          )
                        }
                        title="Edit Tyre"
                      />
                    </td>
                  </tr>
                )}

                {vehicle.vehicle_type == "10W Truck" && (
                  <tr className="text-center">
                    <td className="border py-2 text-xs text-start px-2">
                      4. Back Housing Left
                    </td>
                    <td className="border py-2 text-xs text-start px-2">
                      {tyre?.tyre_assign_4_back_housing_left_no}
                    </td>
                    <td className="border py-2 text-xs text-start px-2">
                      {tyre?.tyre_assign_4_back_housing_left_type}
                    </td>
                    <td className="border py-2 text-xs text-start px-2">
                      {tyre?.tyre_assign_4_back_housing_left_make}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_4_back_housing_left_date
                        ? moment(
                            tyre?.tyre_assign_4_back_housing_left_date,
                          ).format("DD-MMM-YYYY")
                        : ""}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_4_back_housing_left_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_4_back_housing_left_pre_date
                        ? moment(
                            tyre?.tyre_assign_4_back_housing_left_pre_date,
                          ).format("DD-MMM-YYYY")
                        : ""}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_4_back_housing_left_pre_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_4_back_housing_left_pre_km -
                        tyre?.tyre_assign_4_back_housing_left_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_4_back_housing_left_status}
                    </td>
                    <td className="border py-2 text-xs">
                      <IconEdit
                        size={18}
                        className="cursor-pointer text-blue-600 hover:text-blue-800 mx-auto"
                        onClick={() =>
                          openEditModal(
                            "tyre_assign_4_back_housing_left_no",
                            tyre?.tyre_assign_4_back_housing_left_no,
                            tyre?.tyre_assign_4_back_housing_left_type,
                            tyre?.tyre_assign_4_back_housing_left_status,
                          )
                        }
                        title="Edit Tyre"
                      />
                    </td>
                  </tr>
                )}

                {vehicle.vehicle_type == "10W Truck" && (
                  <tr className="text-center">
                    <td className="border py-2 text-xs text-start px-2">
                      5. Back Dummy Left
                    </td>
                    <td className="border py-2 text-xs text-start px-2">
                      {tyre?.tyre_assign_5_back_dummy_left_no}
                    </td>
                    <td className="border py-2 text-xs text-start px-2">
                      {tyre?.tyre_assign_5_back_dummy_left_type}
                    </td>
                    <td className="border py-2 text-xs text-start px-2">
                      {tyre?.tyre_assign_5_back_dummy_left_make}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_5_back_dummy_left_date
                        ? moment(
                            tyre?.tyre_assign_5_back_dummy_left_date,
                          ).format("DD-MMM-YYYY")
                        : ""}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_5_back_dummy_left_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_5_back_dummy_left_pre_date
                        ? moment(
                            tyre?.tyre_assign_5_back_dummy_left_pre_date,
                          ).format("DD-MMM-YYYY")
                        : ""}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_5_back_dummy_left_pre_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_5_back_dummy_left_pre_km -
                        tyre?.tyre_assign_5_back_dummy_left_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_5_back_dummy_left_status}
                    </td>
                    <td className="border py-2 text-xs">
                      <IconEdit
                        size={18}
                        className="cursor-pointer text-blue-600 hover:text-blue-800 mx-auto"
                        onClick={() =>
                          openEditModal(
                            "tyre_assign_5_back_dummy_left_no",
                            tyre?.tyre_assign_5_back_dummy_left_no,
                            tyre?.tyre_assign_5_back_dummy_left_type,
                            tyre?.tyre_assign_5_back_dummy_left_status,
                          )
                        }
                        title="Edit Tyre"
                      />
                    </td>
                  </tr>
                )}

                {vehicle.vehicle_type == "10W Truck" && (
                  <tr className="text-center">
                    <td className="border py-2 text-xs text-start px-2">
                      6. Back Dummy Left
                    </td>
                    <td className="border py-2 text-xs text-start px-2">
                      {tyre?.tyre_assign_6_back_dummy_left_no}
                    </td>
                    <td className="border py-2 text-xs text-start px-2">
                      {tyre?.tyre_assign_6_back_dummy_left_type}
                    </td>
                    <td className="border py-2 text-xs text-start px-2">
                      {tyre?.tyre_assign_6_back_dummy_left_make}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_6_back_dummy_left_date
                        ? moment(
                            tyre?.tyre_assign_6_back_dummy_left_date,
                          ).format("DD-MMM-YYYY")
                        : ""}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_6_back_dummy_left_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_6_back_dummy_left_pre_date
                        ? moment(
                            tyre?.tyre_assign_6_back_dummy_left_pre_date,
                          ).format("DD-MMM-YYYY")
                        : ""}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_6_back_dummy_left_pre_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_6_back_dummy_left_pre_km -
                        tyre?.tyre_assign_6_back_dummy_left_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_6_back_dummy_left_status}
                    </td>
                    <td className="border py-2 text-xs">
                      <IconEdit
                        size={18}
                        className="cursor-pointer text-blue-600 hover:text-blue-800 mx-auto"
                        onClick={() =>
                          openEditModal(
                            "tyre_assign_6_back_dummy_left_no",
                            tyre?.tyre_assign_6_back_dummy_left_no,
                            tyre?.tyre_assign_6_back_dummy_left_type,
                            tyre?.tyre_assign_6_back_dummy_left_status,
                          )
                        }
                        title="Edit Tyre"
                      />
                    </td>
                  </tr>
                )}

                {vehicle.vehicle_type == "10W Truck" && (
                  <tr className="text-center">
                    <td className="border py-2 text-xs text-start px-2">
                      7. Back Housing Right
                    </td>
                    <td className="border py-2 text-xs text-start px-2">
                      {tyre?.tyre_assign_7_back_housing_right_no}
                    </td>
                    <td className="border py-2 text-xs text-start px-2">
                      {tyre?.tyre_assign_7_back_housing_right_type}
                    </td>
                    <td className="border py-2 text-xs text-start px-2">
                      {tyre?.tyre_assign_7_back_housing_right_make}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_7_back_housing_right_date
                        ? moment(
                            tyre?.tyre_assign_7_back_housing_right_date,
                          ).format("DD-MMM-YYYY")
                        : ""}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_7_back_housing_right_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_7_back_housing_right_pre_date
                        ? moment(
                            tyre?.tyre_assign_7_back_housing_right_pre_date,
                          ).format("DD-MMM-YYYY")
                        : ""}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_7_back_housing_right_pre_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_7_back_housing_right_pre_km -
                        tyre?.tyre_assign_7_back_housing_right_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_7_back_housing_right_status}
                    </td>
                    <td className="border py-2 text-xs">
                      <IconEdit
                        size={18}
                        className="cursor-pointer text-blue-600 hover:text-blue-800 mx-auto"
                        onClick={() =>
                          openEditModal(
                            "tyre_assign_7_back_housing_right_no",
                            tyre?.tyre_assign_7_back_housing_right_no,
                            tyre?.tyre_assign_7_back_housing_right_type,
                            tyre?.tyre_assign_7_back_housing_right_status,
                          )
                        }
                        title="Edit Tyre"
                      />
                    </td>
                  </tr>
                )}

                {vehicle.vehicle_type == "10W Truck" && (
                  <tr className="text-center">
                    <td className="border py-2 text-xs text-start px-2">
                      8. Back Housing Right
                    </td>
                    <td className="border py-2 text-xs text-start px-2">
                      {tyre?.tyre_assign_8_back_housing_right_no}
                    </td>
                    <td className="border py-2 text-xs text-start px-2">
                      {tyre?.tyre_assign_8_back_housing_right_type}
                    </td>
                    <td className="border py-2 text-xs text-start px-2">
                      {tyre?.tyre_assign_8_back_housing_right_make}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_8_back_housing_right_date
                        ? moment(
                            tyre?.tyre_assign_8_back_housing_right_date,
                          ).format("DD-MMM-YYYY")
                        : ""}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_8_back_housing_right_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_8_back_housing_right_pre_date
                        ? moment(
                            tyre?.tyre_assign_8_back_housing_right_pre_date,
                          ).format("DD-MMM-YYYY")
                        : ""}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_8_back_housing_right_pre_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_8_back_housing_right_pre_km -
                        tyre?.tyre_assign_8_back_housing_right_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_8_back_housing_right_status}
                    </td>
                    <td className="border py-2 text-xs">
                      <IconEdit
                        size={18}
                        className="cursor-pointer text-blue-600 hover:text-blue-800 mx-auto"
                        onClick={() =>
                          openEditModal(
                            "tyre_assign_8_back_housing_right_no",
                            tyre?.tyre_assign_8_back_housing_right_no,
                            tyre?.tyre_assign_8_back_housing_right_type,
                            tyre?.tyre_assign_8_back_housing_right_status,
                          )
                        }
                        title="Edit Tyre"
                      />
                    </td>
                  </tr>
                )}

                {vehicle.vehicle_type == "10W Truck" && (
                  <tr className="text-center">
                    <td className="border py-2 text-xs text-start px-2">
                      9. Back Dummy Right
                    </td>
                    <td className="border py-2 text-xs text-start px-2">
                      {tyre?.tyre_assign_9_back_dummy_right_no}
                    </td>
                    <td className="border py-2 text-xs text-start px-2">
                      {tyre?.tyre_assign_9_back_dummy_right_type}
                    </td>
                    <td className="border py-2 text-xs text-start px-2">
                      {tyre?.tyre_assign_9_back_dummy_right_make}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_9_back_dummy_right_date
                        ? moment(
                            tyre?.tyre_assign_9_back_dummy_right_date,
                          ).format("DD-MMM-YYYY")
                        : ""}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_9_back_dummy_right_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_9_back_dummy_right_pre_date
                        ? moment(
                            tyre?.tyre_assign_9_back_dummy_right_pre_date,
                          ).format("DD-MMM-YYYY")
                        : ""}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_9_back_dummy_right_pre_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_9_back_dummy_right_pre_km -
                        tyre?.tyre_assign_9_back_dummy_right_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_9_back_dummy_right_status}
                    </td>
                    <td className="border py-2 text-xs">
                      <IconEdit
                        size={18}
                        className="cursor-pointer text-blue-600 hover:text-blue-800 mx-auto"
                        onClick={() =>
                          openEditModal(
                            "tyre_assign_9_back_dummy_right_no",
                            tyre?.tyre_assign_9_back_dummy_right_no,
                            tyre?.tyre_assign_9_back_dummy_right_type,
                            tyre?.tyre_assign_9_back_dummy_right_status,
                          )
                        }
                        title="Edit Tyre"
                      />
                    </td>
                  </tr>
                )}

                {vehicle.vehicle_type == "10W Truck" && (
                  <tr className="text-center">
                    <td className="border py-2 text-xs text-start px-2">
                      10. Back Dummy Right
                    </td>
                    <td className="border py-2 text-xs text-start px-2">
                      {tyre?.tyre_assign_10_back_dummy_right_no}
                    </td>
                    <td className="border py-2 text-xs text-start px-2">
                      {tyre?.tyre_assign_10_back_dummy_right_type}
                    </td>
                    <td className="border py-2 text-xs text-start px-2">
                      {tyre?.tyre_assign_10_back_dummy_right_make}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_10_back_dummy_right_date
                        ? moment(
                            tyre?.tyre_assign_10_back_dummy_right_date,
                          ).format("DD-MMM-YYYY")
                        : ""}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_10_back_dummy_right_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_10_back_dummy_right_pre_date
                        ? moment(
                            tyre?.tyre_assign_10_back_dummy_right_pre_date,
                          ).format("DD-MMM-YYYY")
                        : ""}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_10_back_dummy_right_pre_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_10_back_dummy_right_pre_km -
                        tyre?.tyre_assign_10_back_dummy_right_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_10_back_dummy_right_status}
                    </td>
                    <td className="border py-2 text-xs">
                      <IconEdit
                        size={18}
                        className="cursor-pointer text-blue-600 hover:text-blue-800 mx-auto"
                        onClick={() =>
                          openEditModal(
                            "tyre_assign_10_back_dummy_right_no",
                            tyre?.tyre_assign_10_back_dummy_right_no,
                            tyre?.tyre_assign_10_back_dummy_right_type,
                            tyre?.tyre_assign_10_back_dummy_right_status,
                          )
                        }
                        title="Edit Tyre"
                      />
                    </td>
                  </tr>
                )}

                {vehicle?.vehicle_type != "Other" && (
                  <tr className="text-center">
                    <td className="border py-2 text-xs text-start px-2">
                      Stepney tyre
                    </td>
                    <td className="border py-2 text-xs text-start px-2">
                      {tyre?.tyre_assign_stepney_no}
                    </td>
                    <td className="border py-2 text-xs text-start px-2">
                      {tyre?.tyre_assign_stepney_type}
                    </td>
                    <td className="border py-2 text-xs text-start px-2">
                      {tyre?.tyre_assign_stepney_make}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_stepney_date
                        ? moment(tyre?.tyre_assign_stepney_date).format(
                            "DD-MMM-YYYY",
                          )
                        : ""}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_stepney_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_stepney_pre_date
                        ? moment(tyre?.tyre_assign_stepney_pre_date).format(
                            "DD-MMM-YYYY",
                          )
                        : ""}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_stepney_pre_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_stepney_pre_km -
                        tyre?.tyre_assign_stepney_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_stepney_status}
                    </td>
                    <td className="border py-2 text-xs">
                      <IconEdit
                        size={18}
                        className="cursor-pointer text-blue-600 hover:text-blue-800 mx-auto"
                        onClick={() => setRemoveConfirmOpen(true)}
                        title="Remove Stepney Tyre"
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        {tyre == 0 && (
          <div className="text-center">
            <h1>No Data Available</h1>
          </div>
        )}
      </>
    );
  };
  const tyreHistroyInfo = () => {
    return (
      <>
        {tyrehistroy != 0 && (
          <div className="mt-2">
            <h3 className="text-lg font-semibold mb-2 text-center">
              Tyre Histroy
            </h3>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border py-2 text-xs">Tyre Position</th>
                  <th className="border py-2 text-xs">Tyre No</th>
                  <th className="border py-2 text-xs">Type</th>
                  <th className="border py-2 text-xs">Make</th>
                  <th className="border py-2 text-xs">Fitting Date</th>
                  <th className="border py-2 text-xs">Fitting KM</th>
                  <th className="border py-2 text-xs">Remove Date</th>
                  <th className="border py-2 text-xs">Remove KM</th>
                  <th className="border py-2 text-xs">KM Run</th>
                  <th className="border py-2 text-xs">Status</th>
                </tr>
              </thead>
              <tbody>
                {tyrehistroy.map((data, index) => (
                  <tr className="text-center" key={index}>
                    <td className="border py-2 text-xs text-start px-2">
                      {data?.history_assign_positionL || ""}
                    </td>
                    <td className="border py-2 text-xs text-start px-2">
                      {data?.history_assign_no || ""}
                    </td>
                    <td className="border py-2 text-xs text-start px-2">
                      {data?.history_assign_type || ""}
                    </td>
                    <td className="border py-2 text-xs text-start px-2">
                      {data?.history_assign_make || ""}
                    </td>
                    <td className="border py-2 text-xs">
                      {data?.history_assign_date
                        ? moment(data?.history_assign_date).format(
                            "DD-MMM-YYYY",
                          )
                        : ""}
                    </td>
                    <td className="border py-2 text-xs">
                      {data?.history_assign_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {data?.history_assign_pre_date
                        ? moment(data?.history_assign_pre_date).format(
                            "DD-MMM-YYYY",
                          )
                        : ""}
                    </td>
                    <td className="border py-2 text-xs">
                      {data?.history_assign_pre_km || ""}
                    </td>
                    <td className="border py-2 text-xs">
                      {data?.history_assign_pre_km - data?.history_assign_km ||
                        ""}
                    </td>
                    <td className="border py-2 text-xs ">
                      {data?.history_assign_status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {tyrehistroy == 0 && (
          <div className="text-center">
            <h1>No Data Available</h1>
          </div>
        )}
      </>
    );
  };
  const handleTabChange = (value) => {
    setActiveTab(value);
  };
  const renderContent = () => {
    switch (activeTab) {
      case "info":
        return vechileInfo();

      case "Service History":
        return serviceInfo();

      case "trip":
        return tripInfo();
      case "tyre":
        return tyreInfo();
      case "tyre histroy":
        return tyreHistroyInfo();
      case "services":
        return oldServiceInfo();

      default:
        return null;
    }
  };

  const onInputChange = (e) => {
    if (e.target.name === "vehicle_present_km") {
      const onlyDigits = e.target.value.replace(/\D/g, "");
      setVehiclesKm({
        ...vehicleskm,
        [e.target.name]: onlyDigits,
      });
    } else {
      setVehiclesKm({
        ...vehicleskm,
        [e.target.name]: e.target.value,
      });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLodingKm(true);
    const form = document.getElementById("addIndiv");
    if (!form.checkValidity() || vehicleskm.reg_no == "") {
      toast.error("Please fill all required fields");
      return;
    }

    const data = {
      reg_no: vehicle.reg_no,
      vehicle_present_km: vehicleskm.vehicle_present_km,
      vehicle_present_date: vehicleskm.vehicle_present_date,
    };
    try {
      const res = await axios.post(
        `${BASE_URL}/api/web-update-vehicle-presentkm`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (res.data.code === 200) {
        toast.success(res.data.msg);
        setVehiclesKm({
          vehicle_present_km: "",
          vehicle_present_date: "",
        });
        fetchTyreDetails();
      } else if (res.data.code === 400) {
        toast.error(res.data.msg);
      }
    } catch (error) {
      console.error("Submit Error:", error);
      toast.error("Something went wrong while submitting");
      setLodingKm(false);
    } finally {
      setLodingKm(false);
    }
  };

  const FormLabel = ({ children, required }) => (
    <label className="block text-xs font-semibold text-black mb-1 ">
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );

  const inputClass =
    "w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500 border-blue-500";
  if (loading) return <SkeletonLoader />;

  return (
    <>
      <Layout>
        <div className="bg-[#FFFFFF]  p-2 rounded-lg">
          <div className="sticky top-0 mb-4 p-4 bg-[#E1F5FA] border-b-2 border-red-500 rounded-lg shadow-sm">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              {/* Left Section: Title */}
              <div className="flex items-center gap-2">
                <IconInfoCircle className="w-4 h-4 text-blue-600" />
                <span className="text-black text-lg">
                  Vehicle Details &nbsp;
                  <strong className="text-blue-700">{vehicle.reg_no}</strong>
                </span>
              </div>

              {/* Right Section: Form + Icons */}
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 w-full lg:w-auto">
                <form
                  id="addIndiv"
                  className="flex flex-col sm:flex-row items-start sm:items-end gap-4"
                  onSubmit={handleSubmit}
                >
                  <div className="w-32">
                    <FormLabel required>Present Km</FormLabel>
                    <input
                      type="text"
                      name="vehicle_present_km"
                      value={vehicleskm.vehicle_present_km}
                      onChange={onInputChange}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div className="w-32">
                    <FormLabel required>Present Date</FormLabel>
                    <input
                      type="date"
                      name="vehicle_present_date"
                      value={vehicleskm.vehicle_present_date}
                      onChange={onInputChange}
                      className={inputClass}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="text-sm font-medium w-24 text-white bg-blue-600 hover:bg-green-700 px-4 py-2 rounded-lg shadow-md"
                  >
                    {loadingkm ? "Updating" : "Update"}
                  </button>
                </form>

                {/* Action Icons */}
                <div className="flex items-center space-x-3">
                  <IconPrinter
                    className="cursor-pointer text-gray-600 hover:text-blue-600"
                    onClick={handlePrint}
                    title="Print"
                  />
                  <IconArrowBack
                    className="cursor-pointer text-gray-600 hover:text-red-600"
                    onClick={() => navigate("/vehicles-list")}
                    title="Go Back"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex">
            <div className=" border-r h-[33rem] border-gray-200">
              <Tabs
                value={activeTab}
                onTabChange={handleTabChange}
                orientation="vertical"
                color="orange"
                variant="default"
                radius="lg"
                className=""
              >
                <Tabs.List>
                  <Tabs.Tab value="info" icon={<IconTruck size={16} />}>
                    Vehicle Info
                  </Tabs.Tab>
                  <Tabs.Tab
                    value="services"
                    icon={<IconMessageCircle size={16} />}
                  >
                    Service
                  </Tabs.Tab>
                  <Tabs.Tab
                    value="Service History"
                    icon={<IconMessageCircle size={16} />}
                  >
                    Services History
                  </Tabs.Tab>
                  <Tabs.Tab value="trip" icon={<IconTruckDelivery size={16} />}>
                    Trip
                  </Tabs.Tab>
                  <Tabs.Tab value="tyre" icon={<IconSettings size={16} />}>
                    Present Tyre
                  </Tabs.Tab>
                  <Tabs.Tab
                    value="tyre histroy"
                    icon={<IconSettings size={16} />}
                  >
                    Tyre History
                  </Tabs.Tab>
                </Tabs.List>
              </Tabs>
            </div>
            <div className="flex-1  pl-6">
              <div className="visible print:hidden">{renderContent()}</div>

              <div ref={printRef} className=" p-4 hidden print:block">
                {vechileInfo()}

                {/* service  */}
                {serviceInfo()}

                {/* trip  */}
                {tripInfo()}

                {/* tyre  */}
                {tyreInfo()}
              </div>
            </div>
          </div>
        </div>
      </Layout>
      <Modal
        opened={open}
        onClose={handleClose}
        title="Service History"
        size="xl"
        centered
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <div style={{ maxHeight: "70vh", overflow: "auto" }}>
          {filteredHistory.length > 0 ? (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-100">
                  <th className="border py-2 text-xs">Services</th>
                  <th className="border py-2 text-xs">Date</th>
                  <th className="border py-2 text-xs">KM</th>
                  <th className="border py-2 text-xs">Present Date</th>
                  <th className="border py-2 text-xs">Present KM</th>
                  <th className="border py-2 text-xs">KM Run</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((item, key) => (
                  <tr key={key} className="text-center">
                    <td className="border py-2 text-xs text-start px-2">
                      {item?.service_sub_type}
                    </td>
                    <td className="border py-2 text-xs">
                      {moment(item?.service_sub_date).format("DD-MMM-YYYY")}
                    </td>
                    <td className="border py-2 text-xs">
                      {item?.service_sub_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {vehicle?.vehicle_present_date
                        ? moment(vehicle?.vehicle_present_date).format(
                            "DD-MMM-YYYY",
                          )
                        : ""}
                    </td>
                    <td className="border py-2 text-xs">
                      {vehicle?.vehicle_present_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {vehicle?.vehicle_present_km - item?.service_sub_km}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center">No Data Available</p>
          )}
        </div>
      </Modal>

      <Modal
        opened={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Tyre Details"
        centered
        size="md"
      >
        <div className="space-y-4">
          {/* <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">
                   Tyre Number 
                 </label>
                 <input
                   type="text"
                   name="tyreNo"
                   value={selectedTyre.tyreNo}
                   onChange={handleModalInputChange}
                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                 />
               </div>
               
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">
                   Tyre Type
                 </label>
                 <input
                   type="text"
                   name="tyreType"
                   value={selectedTyre.fieldName}
                   onChange={handleModalInputChange}
                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                 />
               </div> */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={selectedTyre.status}
              onChange={handleModalInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {TYRE_SUB_STATUS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setEditModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveTyre}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        opened={removeConfirmOpen}
        onClose={() => setRemoveConfirmOpen(false)}
        title="Remove Stepney Tyre"
        centered
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-center">Do you want to remove the stepney tyre?</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setRemoveConfirmOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              No
            </button>
            <button
              onClick={async () => {
                setRemoveConfirmOpen(false);
                try {
                  const token = localStorage.getItem("token");
                  const response = await axios.put(
                    `${BASE_URL}/api/web-update-vehicle-tyre-remove-stepney/${tyre.id}`,
                    {},
                    {
                      headers: { Authorization: `Bearer ${token}` },
                    },
                  );

                  if (response.data.code === 200) {
                    toast.success(response.data.msg);
                    fetchTyreDetails();
                  } else {
                    toast.error(
                      response.data.msg || "Failed to remove stepney tyre",
                    );
                  }
                } catch (error) {
                  console.error("Error removing stepney tyre:", error);
                  toast.error("Something went wrong");
                }
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Yes, Remove
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TruckView;
