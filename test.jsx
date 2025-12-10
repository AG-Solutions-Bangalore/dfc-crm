import React, { useState, useEffect, useRef } from "react";
import Layout from "../../../layout/Layout";
import axios from "axios";
import moment from "moment";
import * as ExcelJS from "exceljs";
import BASE_URL from "../../../base/BaseUrl";
import { Button, Paper, TextInput, Group, Box } from "@mantine/core";
import { FileSpreadsheet, RefreshCw, Search, X } from "lucide-react";
import { toast } from "sonner";

const FittedTyreReport = () => {
  const [reportData, setReportData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef(null);

  // Group data by reg_sub_no
  const groupData = (data) => {
    return data.reduce((acc, item) => {
      const vehicleNo = item.reg_sub_no;
      if (!acc[vehicleNo]) {
        acc[vehicleNo] = [];
      }
      acc[vehicleNo].push(item);
      return acc;
    }, {});
  };

  // Get grouped data
  const groupedData = groupData(filteredData);
  console.log(groupedData, "groupedData");
  // Function to get tyre positions based on vehicle type
  const getTyrePositions = (vehicleData) => {
    // Check if it's a 10W Truck (has housing/dummy fields)
    if (
      vehicleData.some(
        (item) =>
          item.tyre_assign_3_back_housing_left_no ||
          item.tyre_assign_3_back_housing_left_type
      )
    ) {
      return [
        {
          name: "1.Front Left",
          no: "tyre_assign_1_front_left_no",
          type: "tyre_assign_1_front_left_type",
          make: "tyre_assign_1_front_left_make",
          date: "tyre_assign_1_front_left_date",
          km: "tyre_assign_1_front_left_km",
          preDate: "tyre_assign_1_front_left_pre_date",
          preKm: "tyre_assign_1_front_left_pre_km",
          status: "tyre_assign_1_front_left_status",
        },
        {
          name: "2.Front Right",
          no: "tyre_assign_2_front_right_no",
          type: "tyre_assign_2_front_right_type",
          make: "tyre_assign_2_front_right_make",
          date: "tyre_assign_2_front_right_date",
          km: "tyre_assign_2_front_right_km",
          preDate: "tyre_assign_2_front_right_pre_date",
          preKm: "tyre_assign_2_front_right_pre_km",
          status: "tyre_assign_2_front_right_status",
        },
        {
          name: "3.Back Housing Left",
          no: "tyre_assign_3_back_housing_left_no",
          type: "tyre_assign_3_back_housing_left_type",
          make: "tyre_assign_3_back_housing_left_make",
          date: "tyre_assign_3_back_housing_left_date",
          km: "tyre_assign_3_back_housing_left_km",
          preDate: "tyre_assign_3_back_housing_left_pre_date",
          preKm: "tyre_assign_3_back_housing_left_pre_km",
          status: "tyre_assign_3_back_housing_left_status",
        },
        {
          name: "4.Back Housing Left",
          no: "tyre_assign_4_back_housing_left_no",
          type: "tyre_assign_4_back_housing_left_type",
          make: "tyre_assign_4_back_housing_left_make",
          date: "tyre_assign_4_back_housing_left_date",
          km: "tyre_assign_4_back_housing_left_km",
          preDate: "tyre_assign_4_back_housing_left_pre_date",
          preKm: "tyre_assign_4_back_housing_left_pre_km",
          status: "tyre_assign_4_back_housing_left_status",
        },
        {
          name: "5.Back Dummy Left",
          no: "tyre_assign_5_back_dummy_left_no",
          type: "tyre_assign_5_back_dummy_left_type",
          make: "tyre_assign_5_back_dummy_left_make",
          date: "tyre_assign_5_back_dummy_left_date",
          km: "tyre_assign_5_back_dummy_left_km",
          preDate: "tyre_assign_5_back_dummy_left_pre_date",
          preKm: "tyre_assign_5_back_dummy_left_pre_km",
          status: "tyre_assign_5_back_dummy_left_status",
        },
        {
          name: "6.Back Dummy Left",
          no: "tyre_assign_6_back_dummy_left_no",
          type: "tyre_assign_6_back_dummy_left_type",
          make: "tyre_assign_6_back_dummy_left_make",
          date: "tyre_assign_6_back_dummy_left_date",
          km: "tyre_assign_6_back_dummy_left_km",
          preDate: "tyre_assign_6_back_dummy_left_pre_date",
          preKm: "tyre_assign_6_back_dummy_left_pre_km",
          status: "tyre_assign_6_back_dummy_left_status",
        },
        {
          name: "7.Back Housing Right",
          no: "tyre_assign_7_back_housing_right_no",
          type: "tyre_assign_7_back_housing_right_type",
          make: "tyre_assign_7_back_housing_right_make",
          date: "tyre_assign_7_back_housing_right_date",
          km: "tyre_assign_7_back_housing_right_km",
          preDate: "tyre_assign_7_back_housing_right_pre_date",
          preKm: "tyre_assign_7_back_housing_right_pre_km",
          status: "tyre_assign_7_back_housing_right_status",
        },
        {
          name: "8.Back Housing Right",
          no: "tyre_assign_8_back_housing_right_no",
          type: "tyre_assign_8_back_housing_right_type",
          make: "tyre_assign_8_back_housing_right_make",
          date: "tyre_assign_8_back_housing_right_date",
          km: "tyre_assign_8_back_housing_right_km",
          preDate: "tyre_assign_8_back_housing_right_pre_date",
          preKm: "tyre_assign_8_back_housing_right_pre_km",
          status: "tyre_assign_8_back_housing_right_status",
        },
        {
          name: "9.Back Dummy Right",
          no: "tyre_assign_9_back_dummy_right_no",
          type: "tyre_assign_9_back_dummy_right_type",
          make: "tyre_assign_9_back_dummy_right_make",
          date: "tyre_assign_9_back_dummy_right_date",
          km: "tyre_assign_9_back_dummy_right_km",
          preDate: "tyre_assign_9_back_dummy_right_pre_date",
          preKm: "tyre_assign_9_back_dummy_right_pre_km",
          status: "tyre_assign_9_back_dummy_right_status",
        },
        {
          name: "10.Back Dummy Right",
          no: "tyre_assign_10_back_dummy_right_no",
          type: "tyre_assign_10_back_dummy_right_type",
          make: "tyre_assign_10_back_dummy_right_make",
          date: "tyre_assign_10_back_dummy_right_date",
          km: "tyre_assign_10_back_dummy_right_km",
          preDate: "tyre_assign_10_back_dummy_right_pre_date",
          preKm: "tyre_assign_10_back_dummy_right_pre_km",
          status: "tyre_assign_10_back_dummy_right_status",
        },
        {
          name: "Stepney Tyre",
          no: "tyre_assign_stepney_no",
          type: "tyre_assign_stepney_type",
          make: "tyre_assign_stepney_make",
          date: "tyre_assign_stepney_date",
          km: "tyre_assign_stepney_km",
          preDate: "tyre_assign_stepney_pre_date",
          preKm: "tyre_assign_stepney_pre_km",
          status: "tyre_assign_stepney_status",
        },
      ];
    } else {
      // 6W Truck or Other
      return [
        {
          name: "1.Front Left",
          no: "tyre_assign_1_front_left_no",
          type: "tyre_assign_1_front_left_type",
          make: "tyre_assign_1_front_left_make",
          date: "tyre_assign_1_front_left_date",
          km: "tyre_assign_1_front_left_km",
          preDate: "tyre_assign_1_front_left_pre_date",
          preKm: "tyre_assign_1_front_left_pre_km",
          status: "tyre_assign_1_front_left_status",
        },
        {
          name: "2.Front Right",
          no: "tyre_assign_2_front_right_no",
          type: "tyre_assign_2_front_right_type",
          make: "tyre_assign_2_front_right_make",
          date: "tyre_assign_2_front_right_date",
          km: "tyre_assign_2_front_right_km",
          preDate: "tyre_assign_2_front_right_pre_date",
          preKm: "tyre_assign_2_front_right_pre_km",
          status: "tyre_assign_2_front_right_status",
        },
        {
          name: "3.Back Left",
          no: "tyre_assign_3_back_left_no",
          type: "tyre_assign_3_back_left_type",
          make: "tyre_assign_3_back_left_make",
          date: "tyre_assign_3_back_left_date",
          km: "tyre_assign_3_back_left_km",
          preDate: "tyre_assign_3_back_left_pre_date",
          preKm: "tyre_assign_3_back_left_pre_km",
          status: "tyre_assign_3_back_left_status",
        },
        {
          name: "4.Back Left",
          no: "tyre_assign_4_back_left_no",
          type: "tyre_assign_4_back_left_type",
          make: "tyre_assign_4_back_left_make",
          date: "tyre_assign_4_back_left_date",
          km: "tyre_assign_4_back_left_km",
          preDate: "tyre_assign_4_back_left_pre_date",
          preKm: "tyre_assign_4_back_left_pre_km",
          status: "tyre_assign_4_back_left_status",
        },
        {
          name: "5.Back Right",
          no: "tyre_assign_5_back_right_no",
          type: "tyre_assign_5_back_right_type",
          make: "tyre_assign_5_back_right_make",
          date: "tyre_assign_5_back_right_date",
          km: "tyre_assign_5_back_right_km",
          preDate: "tyre_assign_5_back_right_pre_date",
          preKm: "tyre_assign_5_back_right_pre_km",
          status: "tyre_assign_5_back_right_status",
        },
        {
          name: "6.Back Right",
          no: "tyre_assign_6_back_right_no",
          type: "tyre_assign_6_back_right_type",
          make: "tyre_assign_6_back_right_make",
          date: "tyre_assign_6_back_right_date",
          km: "tyre_assign_6_back_right_km",
          preDate: "tyre_assign_6_back_right_pre_date",
          preKm: "tyre_assign_6_back_right_pre_km",
          status: "tyre_assign_6_back_right_status",
        },
        {
          name: "Stepney Tyre",
          no: "tyre_assign_stepney_no",
          type: "tyre_assign_stepney_type",
          make: "tyre_assign_stepney_make",
          date: "tyre_assign_stepney_date",
          km: "tyre_assign_stepney_km",
          preDate: "tyre_assign_stepney_pre_date",
          preKm: "tyre_assign_stepney_pre_km",
          status: "tyre_assign_stepney_status",
        },
      ];
    }
  };

  const fetchReportData = async (controller) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${BASE_URL}/api/fetch-vehicle-tyre-report`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        }
      );
      setReportData(response.data.tyre || []);
      setFilteredData(response.data.tyre || []);

      if (response.data.tyre?.length > 0) {
        toast.success("Report loaded successfully");
      } else {
        toast.info("No data found");
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request cancelled:", error.message);
        return;
      }
      console.error("Error fetching tyre report:", error);
      toast.error("Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    fetchReportData(controller);

    return () => {
      controller.abort();
    };
  }, []);

  // Function to handle search
  const handleSearch = (term) => {
    setSearchTerm(term);

    if (!term.trim()) {
      setFilteredData(reportData);
      return;
    }

    const searchLower = term.toLowerCase().trim();

    const filtered = reportData.filter((item) => {
      // Search in vehicle number
      const vehicleNo = item.reg_sub_no || "";
      if (vehicleNo.toLowerCase().includes(searchLower)) {
        return true;
      }

      // Search in all tyre numbers
      const tyrePositions = getTyrePositions([item]);
      for (const position of tyrePositions) {
        const tyreNo = item[position.no] || "";
        if (tyreNo.toLowerCase().includes(searchLower)) {
          return true;
        }
      }

      return false;
    });

    setFilteredData(filtered);
  };

  // Function to clear search
  const clearSearch = () => {
    setSearchTerm("");
    setFilteredData(reportData);
  };

  const handleExcelExport = async () => {
    if (filteredData.length === 0) {
      toast.error("No data to export");
      return;
    }

    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Fitted Tyre Report");

      // Add headers
      const headers = [
        "Vehicle No",
        "Branch",
        "Tyre Position",
        "Tyre No",
        "Type",
        "Make",
        "Date",
        "KM",
        "Present Date",
        "Present KM",
        "KM Run",
        "Status",
      ];
      worksheet.addRow(headers);

      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true };
      headerRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD3D3D3" },
      };

      // Add data rows
      Object.entries(groupedData).forEach(([vehicleNo, vehicleData]) => {
        vehicleData.forEach((item) => {
          const tyrePositions = getTyrePositions(vehicleData);

          tyrePositions.forEach((position) => {
            const tyreNo = item[position.no];
            const tyreType = item[position.type];
            const tyreMake = item[position.make];
            const date = item[position.date];
            const km = item[position.km];
            const preDate = item[position.preDate];
            const preKm = item[position.preKm];
            const status = item[position.status];

            // Calculate KM Run
            const kmRun = preKm && km ? parseFloat(preKm) - parseFloat(km) : "";

            if (tyreNo || tyreType || tyreMake) {
              worksheet.addRow([
                vehicleNo,
                item.tyre_assign_branch || "",
                position.name,
                tyreNo || "",
                tyreType || "",
                tyreMake || "",
                date ? moment(date).format("DD-MM-YYYY") : "",
                km || "",
                preDate && preDate !== "0000-00-00"
                  ? moment(preDate).format("DD-MM-YYYY")
                  : "",
                preKm || "",
                kmRun,
                status || "",
              ]);
            }
          });
        });
      });

      // Auto-fit columns
      worksheet.columns.forEach((column) => {
        let maxLength = 0;
        column.eachCell({ includeEmpty: true }, (cell) => {
          const columnLength = cell.value ? cell.value.toString().length : 10;
          if (columnLength > maxLength) {
            maxLength = columnLength;
          }
        });
        column.width = maxLength < 10 ? 10 : maxLength + 2;
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Fitted-Tyre-Report-${moment().format(
        "DD-MM-YYYY"
      )}.xlsx`;
      link.click();
      URL.revokeObjectURL(url);

      toast.success("Excel file downloaded successfully");
    } catch (error) {
      console.error("Excel export error:", error);
      toast.error("Failed to export Excel file");
    }
  };

  return (
    <Layout>
      <div className="min-h-screen ">
        <div className="max-w-full mx-auto">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Left Sidebar - Report Actions */}
            <div className="w-full lg:w-1/6">
              <Paper shadow="md" p="md" className="sticky top-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">
                      Report Actions
                    </h3>
                    <Button
                      leftIcon={<RefreshCw size={16} />}
                      onClick={fetchReportData}
                      loading={loading}
                      fullWidth
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Refresh Report
                    </Button>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-semibold mb-2">Search:</h4>
                    <Group spacing="xs" mb="md">
                      <TextInput
                        placeholder="Search Vehicle No or Tyre No"
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        icon={<Search size={16} />}
                        className="flex-grow"
                        size="sm"
                      />
                      {searchTerm && (
                        <Button
                          onClick={clearSearch}
                          size="sm"
                          variant="light"
                          color="gray"
                        >
                          <X size={16} />
                        </Button>
                      )}
                    </Group>
                    <div className="text-xs text-gray-500 mb-3">
                      Search by Vehicle Number (AP 04 TU 2314) or Tyre Number
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-semibold mb-2">
                      Export Options:
                    </h4>
                    <div className="space-y-2">
                      <Button
                        leftIcon={<FileSpreadsheet size={16} />}
                        onClick={handleExcelExport}
                        disabled={filteredData.length === 0}
                        fullWidth
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Excel
                      </Button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                      <h4 className="font-semibold mb-1">Report Summary:</h4>
                      <p className="mb-1">
                        Total Vehicles: {Object.keys(groupedData).length}
                      </p>
                      <p>Total Records: {filteredData.length}</p>
                      {searchTerm && (
                        <p className="mt-2 text-blue-600 font-medium">
                          Showing {Object.keys(groupedData).length} of{" "}
                          {groupData(reportData).length} vehicles
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Paper>
            </div>

            {/* Main Content - Report Data */}
            <div className="w-full lg:w-5/6">
              <Paper shadow="md" p="md" className="min-h-[800px]">
                {/* Search Header */}
                <Box mb="md">
                  <Group position="apart">
                    <div>
                      <h2 className="text-xl font-bold">Fitted Tyre Report</h2>
                      {searchTerm && (
                        <p className="text-sm text-gray-600 mt-1">
                          Search results for:{" "}
                          <span className="font-semibold text-blue-600">
                            {searchTerm}
                          </span>
                        </p>
                      )}
                    </div>
                    {searchTerm && (
                      <Button
                        onClick={clearSearch}
                        size="sm"
                        variant="light"
                        color="gray"
                        leftIcon={<X size={16} />}
                      >
                        Clear Search
                      </Button>
                    )}
                  </Group>
                </Box>

                {filteredData.length > 0 ? (
                  <div>
                    <div ref={containerRef} className="md:overflow-x-auto">
                      <div>
                        {Object.entries(groupedData).map(
                          ([vehicleNo, vehicleData]) => {
                            const firstItem = vehicleData[0];
                            const tyrePositions = getTyrePositions(vehicleData);
                            console.log(tyrePositions, "tyrePositions");
                            return (
                              <div
                                key={vehicleNo}
                                className="mb-8 border border-gray-300 rounded-lg overflow-hidden"
                              >
                                <div className="p-3 bg-blue-50 font-bold border-b border-gray-300">
                                  <div className="flex justify-between">
                                    <span className="text-blue-700">
                                      Vehicle No: {vehicleNo}
                                    </span>
                                    <span className="text-gray-700">
                                      Branch:{" "}
                                      {firstItem.tyre_assign_branch || "N/A"}
                                    </span>
                                  </div>
                                </div>

                                <div className="overflow-x-auto">
                                  <table className="w-full">
                                    <thead>
                                      <tr className="bg-gray-50">
                                        <th className="border py-2 text-xs">
                                          Tyre Position
                                        </th>
                                        <th className="border py-2 text-xs">
                                          Tyre No
                                        </th>
                                        <th className="border py-2 text-xs">
                                          Type
                                        </th>
                                        <th className="border py-2 text-xs">
                                          Make
                                        </th>
                                        <th className="border py-2 text-xs">
                                          Date
                                        </th>
                                        <th className="border py-2 text-xs">
                                          KM
                                        </th>
                                        <th className="border py-2 text-xs">
                                          Present Date
                                        </th>
                                        <th className="border py-2 text-xs">
                                          Present KM
                                        </th>
                                        <th className="border py-2 text-xs">
                                          KM Run
                                        </th>
                                        <th className="border py-2 text-xs">
                                          Status
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {tyrePositions.map(
                                        (position, posIndex) => {
                                          const item = vehicleData[0];
                                          const tyreNo = item[position.no];
                                          const tyreType = item[position.type];
                                          const tyreMake = item[position.make];
                                          const date = item[position.date];
                                          const km = item[position.km];
                                          const preDate =
                                            item[position.preDate];
                                          const preKm = item[position.preKm];
                                          const status = item[position.status];

                                          const kmRun =
                                            preKm && km
                                              ? parseFloat(preKm) -
                                                parseFloat(km)
                                              : "";

                                          if (!tyreNo) {
                                            return null;
                                          }

                                          return (
                                            <tr
                                              key={posIndex}
                                              className="hover:bg-gray-50"
                                            >
                                              <td className="border py-2 text-xs px-3">
                                                {position.name}
                                              </td>
                                              <td className="border py-2 text-xs px-3">
                                                {tyreNo || "-"}
                                              </td>
                                              <td className="border py-2 text-xs px-3">
                                                {tyreType || "-"}
                                              </td>
                                              <td className="border py-2 text-xs px-3">
                                                {tyreMake || "-"}
                                              </td>
                                              <td className="border py-2 text-xs text-center">
                                                {date
                                                  ? moment(date).format(
                                                      "DD-MMM-YYYY"
                                                    )
                                                  : "-"}
                                              </td>
                                              <td className="border py-2 text-xs text-center">
                                                {km || "-"}
                                              </td>
                                              <td className="border py-2 text-xs text-center">
                                                {preDate &&
                                                preDate !== "0000-00-00"
                                                  ? moment(preDate).format(
                                                      "DD-MMM-YYYY"
                                                    )
                                                  : "-"}
                                              </td>
                                              <td className="border py-2 text-xs text-center">
                                                {preKm || "-"}
                                              </td>
                                              <td className="border py-2 text-xs text-center">
                                                {kmRun || "-"}
                                              </td>
                                              <td className="border py-2 text-xs text-center">
                                                {status || "-"}
                                              </td>
                                            </tr>
                                          );
                                        }
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-20 text-gray-400">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold mb-2">
                      {searchTerm
                        ? "No Matching Results Found"
                        : "No Tyre Data"}
                    </h3>
                    <p>
                      {searchTerm
                        ? `No results found for "${searchTerm}". Try a different search term.`
                        : "No fitted tyre data available. Please refresh the report."}
                    </p>
                    {searchTerm && (
                      <Button
                        onClick={clearSearch}
                        variant="light"
                        className="mt-4"
                      >
                        Clear Search
                      </Button>
                    )}
                  </div>
                )}
              </Paper>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FittedTyreReport;
