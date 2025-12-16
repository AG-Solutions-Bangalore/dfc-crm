import React, { useState, useEffect, useMemo } from "react";
import Layout from "../../../layout/Layout";
import axios from "axios";
import moment from "moment";
import * as ExcelJS from "exceljs";
import BASE_URL from "../../../base/BaseUrl";
import {
  Button,
  Paper,
  TextInput,
  Group,
  Box,
  Select,
  Modal,
} from "@mantine/core";
import { FileSpreadsheet, RefreshCw, Search } from "lucide-react";
import { toast } from "sonner";
import { IconScanEye } from "@tabler/icons-react";
import {
  getServiceColor,
  SERVICE_COLOR_CLASSES,
} from "../../../utils/serviceRules";

// Group vehicles by reg_no
const groupData = (data = []) => {
  if (!Array.isArray(data)) return {};
  return data.reduce((acc, item) => {
    const vehicleNo = item.reg_no;
    if (!acc[vehicleNo]) acc[vehicleNo] = [];
    acc[vehicleNo].push(item);
    return acc;
  }, {});
};

const ServiceR = () => {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [vehicle, setVehicle] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [servicesTypesFixed, setServiceTypeFixed] = useState([]);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [oldService, setOldService] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [serviceLookup, setServiceLookup] = useState({});
  const [selectedServiceType, setSelectedServiceType] = useState("all");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm.toLowerCase());
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    if (oldService.length > 0) {
      const lookup = oldService.reduce((acc, item) => {
        const key = `${item.service_sub_truck_no}_${item.service_sub_type}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
      }, {});
      setServiceLookup(lookup);
    }
  }, [oldService]);

  // Fetch report
  const fetchReportData = async (controller) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BASE_URL}/api/fetch-vehicle-services-report`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller?.signal,
        }
      );
      setVehicle(response.data.vehicle || []);
      setServiceTypeFixed(response.data.servicesTypesFixed || []);
      setOldService(response.data.historyservices || []);

      toast[response.data.vehicle?.length > 0 ? "success" : "info"](
        response.data.vehicle?.length > 0
          ? "Report loaded successfully"
          : "No data found"
      );
    } catch (error) {
      if (!axios.isCancel(error)) toast.error("Failed to load report");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchReportData(controller);
    return () => controller.abort();
  }, []);

  const vehicleArray = Array.isArray(vehicle) ? vehicle : [];

  const filteredVehicles = useMemo(() => {
    return vehicleArray.filter((v) => {
      const regNo = v.reg_no?.toLowerCase() || "";
      const branch = v.vehicle_branch?.toLowerCase() || "";
      const matchesSearch =
        regNo.includes(debouncedSearch) || branch.includes(debouncedSearch);
      const matchesBranch =
        selectedBranch === "all" || v.vehicle_branch === selectedBranch;

      const matchesService =
        selectedServiceType === "all" ||
        v.services?.some((s) => s.service_sub_type == selectedServiceType);

      return matchesSearch && matchesBranch && matchesService;
    });
  }, [vehicleArray, debouncedSearch, selectedBranch, selectedServiceType]);

  // Group filtered vehicles
  const groupedData = useMemo(
    () => groupData(filteredVehicles),
    [filteredVehicles]
  );

  const filteredGroups = useMemo(() => {
    return Object.entries(groupedData).filter(([_, vData]) => {
      return (
        selectedBranch === "all" || vData[0]?.vehicle_branch === selectedBranch
      );
    });
  }, [groupedData, selectedBranch]);

  const branchOptions = useMemo(() => {
    const branches = vehicleArray.map((v) => v.vehicle_branch).filter(Boolean);
    return [
      // { value: "all", label: "All Branches" },
      ...Array.from(new Set(branches)).map((b) => ({ value: b, label: b })),
    ];
  }, [vehicleArray]);

  const handleOpen = (service_sub_type, vehicleNo, vehicleObj) => {
    const key = `${vehicleNo}_${service_sub_type}`;
    setFilteredHistory(serviceLookup[key] || []);
    setSelectedVehicle(vehicleObj);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFilteredHistory([]);
  };

  // Excel export
  const handleExcelExport = async () => {
    if (!filteredGroups.length) return toast.error("No data to export");
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Service Report");

    const header = [
      "Vehicle No",
      "Branch",
      ...servicesTypesFixed.map((s) => s.service_types_fixed),
    ];
    sheet.addRow(header).font = { bold: true };

    filteredGroups.forEach(([vehicleNo, vData]) => {
      const v = vData[0];
      const row = [
        vehicleNo,
        v.vehicle_branch,
        ...servicesTypesFixed.map((stype) => {
          const matched =
            v.services?.filter(
              (s) => s.service_sub_type === stype.service_types_fixed
            ) || [];
          return matched.length > 0
            ? matched
                .map(
                  (s) =>
                    `${moment(s.service_sub_date).format("DD-MMM-YYYY")} / ${
                      s.service_sub_km
                    }`
                )
                .join(", ")
            : "-";
        }),
      ];
      sheet.addRow(row);
    });

    sheet.columns.forEach((col) => (col.width = 20));

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Service_Report_${moment().format("DD-MM-YYYY")}.xlsx`;
    link.click();
    toast.success("Excel downloaded");
  };

  return (
    <>
      <Layout>
        <div className="min-h-screen">
          <div className="max-w-full mx-auto flex flex-col lg:flex-row gap-4">
            {/* Sidebar */}
            <div className="w-full lg:w-1/6">
              <Paper shadow="md" p="md" className="sticky top-4 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Report Actions</h3>
                  <Button
                    leftIcon={<RefreshCw size={16} />}
                    onClick={() => fetchReportData()}
                    loading={loading}
                    fullWidth
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Refresh
                  </Button>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-semibold mb-2">Search:</h4>
                  <Group spacing="xs" mb="md">
                    <TextInput
                      placeholder="Search Vehicle No or Tyre No"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      icon={<Search size={16} />}
                      size="sm"
                      className="flex-grow"
                    />
                  </Group>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-semibold mb-2">
                    Export Options:
                  </h4>
                  <Button
                    leftIcon={<FileSpreadsheet size={16} />}
                    onClick={handleExcelExport}
                    disabled={filteredGroups.length === 0}
                    fullWidth
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Excel
                  </Button>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    <h4 className="font-semibold mb-1">Report Summary:</h4>

                    <p className="mb-1">
                      Total Vehicles:{" "}
                      <span className="font-semibold">
                        {filteredGroups.length}
                      </span>
                    </p>

                    <p className="mb-1">
                      Total Records:{" "}
                      <span className="font-semibold">
                        {filteredGroups.reduce(
                          (sum, [, vehicleData]) => sum + vehicleData.length,
                          0
                        )}
                      </span>
                    </p>

                    {(searchTerm || selectedBranch !== "all") && (
                      <p className="mt-2 text-blue-600 font-medium">
                        Showing {filteredGroups.length} of{" "}
                        {Object.keys(groupedData).length} vehicles
                      </p>
                    )}
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-semibold mb-2">
                      Service Color Indicators:
                    </h4>

                    <div className="space-y-3 text-xs text-gray-700">
                      {/* ORANGE */}
                      <div className="flex items-start space-x-2">
                        <div className="w-4 h-4 rounded bg-orange-300 border" />
                        <div>
                          <span className="font-semibold">Orange:</span>
                          <ul className="list-disc pl-4">
                            <li>
                              Engine Oil Change →{" "}
                              <strong>55,000 – 60,000 KM</strong> OR{" "}
                              <strong>12 months</strong>
                            </li>
                            <li>
                              Gear / Crown Oil Change →{" "}
                              <strong>1,30,000 – 1,40,000 KM</strong> OR{" "}
                              <strong>30 months</strong>
                            </li>
                            <li>
                              Front / Back Hub Grease →{" "}
                              <strong>60,000 – 70,000 KM</strong> OR{" "}
                              <strong>12 months</strong>
                            </li>
                          </ul>
                        </div>
                      </div>

                      {/* RED */}
                      <div className="flex items-start space-x-2">
                        <div className="w-4 h-4 rounded bg-red-300 border" />
                        <div>
                          <span className="font-semibold">Red:</span>
                          <ul className="list-disc pl-4">
                            <li>
                              Engine Oil Change → <strong>60,000+ KM</strong> OR{" "}
                              <strong>14+ months</strong>
                            </li>
                            <li>
                              Gear / Crown Oil Change →{" "}
                              <strong>1,40,000+ KM</strong> OR{" "}
                              <strong>36+ months</strong>
                            </li>
                            <li>
                              Front / Back Hub Grease →{" "}
                              <strong>70,000+ KM</strong> OR{" "}
                              <strong>14+ months</strong>
                            </li>
                            <li>
                              Pump / Battery → <strong>36+ months</strong>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Paper>
            </div>

            {/* Main content */}
            <div className="w-full lg:w-5/6">
              <Paper shadow="md" p="md" className="min-h-[800px]">
                <Box mb="md">
                  <Group position="apart">
                    <h2 className="text-xl font-bold">Service Report</h2>
                    <div className="flex gap-4">
                      <Select
                        placeholder="Select Service Type"
                        value={selectedServiceType}
                        onChange={(value) =>
                          setSelectedServiceType(value || "all")
                        }
                        data={[
                          ...servicesTypesFixed.map((s) => ({
                            value: s.service_types_fixed,
                            label: s.service_types_fixed,
                          })),
                        ]}
                        clearable
                        searchable
                        size="sm"
                        className="min-w-[200px]"
                      />

                      <Select
                        placeholder="Select Branch"
                        value={selectedBranch}
                        onChange={(value) => setSelectedBranch(value || "all")}
                        data={branchOptions}
                        searchable
                        clearable
                        size="sm"
                        className="min-w-[200px]"
                      />
                    </div>
                  </Group>
                </Box>

                <div className="overflow-x-auto mt-4">
                  {filteredGroups.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                      <div className="text-6xl mb-4">🔍</div>
                      <h3 className="text-xl font-semibold mb-2">
                        {searchTerm
                          ? "No Matching Results Found"
                          : "No Service Data"}
                      </h3>
                      <p>
                        {searchTerm
                          ? `No results found for "${searchTerm}". Try a different search term.`
                          : "No fitted service data available. Please refresh the report."}
                      </p>
                      {searchTerm && (
                        <Button
                          onClick={() => setSearchTerm("")}
                          variant="light"
                          className="mt-4"
                        >
                          Clear Search
                        </Button>
                      )}
                    </div>
                  ) : (
                    filteredGroups.map(([vehicleNo, vehicleData]) => {
                      const v = vehicleData[0];
                      const serviceWithData = servicesTypesFixed.filter(
                        (stype) =>
                          v.services?.some(
                            (s) =>
                              s.service_sub_type === stype.service_types_fixed
                          )
                      );

                      if (serviceWithData.length === 0) return null;

                      return (
                        <div
                          key={vehicleNo}
                          className="mb-8 border border-gray-300 rounded-lg overflow-hidden"
                        >
                          <div className="p-3 bg-blue-50 font-bold border-b border-gray-300 flex justify-between items-center text-xs md:text-sm">
                            <div className="text-blue-700 truncate">
                              Vehicle No:{" "}
                              <span className="font-extrabold">
                                {vehicleNo}
                              </span>
                            </div>
                            <div className="flex items-center gap-6 text-gray-700 whitespace-nowrap">
                              <span>
                                <span className="font-semibold">Date:</span>{" "}
                                {v.vehicle_present_date
                                  ? moment(v.vehicle_present_date).format(
                                      "DD-MMM-YYYY"
                                    )
                                  : "-"}
                              </span>
                              <span>
                                <span className="font-semibold">KM:</span>{" "}
                                {v.vehicle_present_km || "-"}
                              </span>
                              <span>
                                <span className="font-semibold">Branch:</span>{" "}
                                {v.vehicle_branch || "-"}
                              </span>
                            </div>
                          </div>

                          <div className="p-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                            {serviceWithData.map((stype, index) => {
                              const matched =
                                v.services?.filter(
                                  (s) =>
                                    s.service_sub_type ===
                                    stype.service_types_fixed
                                ) || [];
                              const color = getServiceColor(
                                stype.service_types_fixed,
                                matched[0],
                                v
                              );
                              return (
                                <div
                                  key={index}
                                  className="border border-black hover:bg-gray-50 transition-colors duration-300"
                                >
                                  <p className="p-1 text-xs border-b font-bold flex items-center justify-center gap-1 bg-blue-200 border-black text-center">
                                    {stype.service_types_fixed}
                                    <IconScanEye
                                      size={16}
                                      onClick={() =>
                                        handleOpen(
                                          stype.service_types_fixed,
                                          vehicleNo,
                                          v
                                        )
                                      }
                                      className="cursor-pointer"
                                    />
                                  </p>

                                  <div
                                    className={`p-2 text-xs text-center space-y-1 ${SERVICE_COLOR_CLASSES[color]}`}
                                  >
                                    {matched.map((item, i) => (
                                      <div key={i}>
                                        <div>
                                          {moment(item.service_sub_date).format(
                                            "DD-MMM-YYYY"
                                          )}
                                        </div>
                                        <div>
                                          <span className="font-semibold">
                                            KM&nbsp;:&nbsp;
                                          </span>
                                          {item.service_sub_km}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </Paper>
            </div>
          </div>
        </div>
      </Layout>

      <Modal
        opened={open}
        onClose={handleClose}
        title="History Services"
        size="xl"
        centered
        overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
      >
        <div style={{ maxHeight: "70vh", overflow: "auto" }}>
          {filteredHistory.length > 0 ? (
            <table className="w-full border-collapse text-xs text-center">
              <thead>
                <tr className="bg-blue-100">
                  <th className="border py-2">Services</th>
                  <th className="border py-2">Date</th>
                  <th className="border py-2">KM</th>
                  <th className="border py-2">Present Date</th>
                  <th className="border py-2">Present KM</th>
                  <th className="border py-2">KM Run</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((item, key) => (
                  <tr key={key}>
                    <td className="border py-2 px-2 text-start">
                      {item?.service_sub_type}
                    </td>
                    <td className="border py-2">
                      {moment(item?.service_sub_date).format("DD-MMM-YYYY")}
                    </td>
                    <td className="border py-2">{item?.service_sub_km}</td>
                    <td className="border py-2">
                      {selectedVehicle?.vehicle_present_date
                        ? moment(selectedVehicle.vehicle_present_date).format(
                            "DD-MMM-YYYY"
                          )
                        : "-"}
                    </td>
                    <td className="border py-2">
                      {selectedVehicle?.vehicle_present_km || "-"}
                    </td>
                    <td className="border py-2">
                      {selectedVehicle?.vehicle_present_km &&
                      item?.service_sub_km
                        ? selectedVehicle.vehicle_present_km -
                          item.service_sub_km
                        : "-"}
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
    </>
  );
};

export default ServiceR;
