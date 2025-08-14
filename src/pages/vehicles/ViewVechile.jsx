import {
  IconArrowBack,
  IconChevronRight,
  IconEdit,
  IconEditCircle,
  IconInfoCircle,
  IconPrinter,
} from "@tabler/icons-react";
import axios from "axios";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import BASE_URL from "../../base/BaseUrl";
import Layout from "../../layout/Layout";
import ChnagePkmNew from "./ChnagePkmNew";

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
const ViewVechile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const printRef = useRef(null);
  const [open, setOpen] = useState();
  const [vehicle, setVehicle] = useState({});
  const [tyre, setTyre] = useState({});
  const [loading, setLoading] = useState(true);
  const [isInfoVisible, setIsInfoVisible] = useState(false);

  const toggleInfo = () => {
    setIsInfoVisible(!isInfoVisible);
  };

  // Print handler using react-to-print
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
              font-size: 12px; 
               border: 1px solid #000;
                 min-height:100vh
          }
          table {
              width: 100%;
              border-collapse: collapse;
          }
          th, td {
              border: 1px solid #ddd;
              padding: 4px;
          }
          th {
              background-color: #f4f4f4;
          }
          .text-center {
              text-align: center;
          }
      }
    `,
  });

  const fetchTyreDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/web-fetch-vehicles-by-id/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setVehicle(response?.data.vehicles);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching Vehicle View details:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTyreDetails();
  }, [id]);
  const fetchTyreVechile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/web-fetch-vehicles-tyre-sub/${vehicle?.reg_no}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTyre(response.data.vehiceltyresub);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching Vehicle tyre View details:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTyreVechile();
  }, [vehicle.reg_no]);

  const handleChangeTyre = (e, value) => {
    e.preventDefault();

    localStorage.setItem("tyre_sub_id", value.substring(0, value.indexOf("#")));
    localStorage.setItem(
      "tyre_position",
      value.includes("#") &&
        value.substr(value.lastIndexOf("#") + 1).split(" ")[0]
    );
    localStorage.setItem("vehicle_no", vehicle.reg_no);
    localStorage.setItem("vehicle_branch", vehicle.vehicle_branch);
    localStorage.setItem("vechile_view", id);
    navigate("/changeTyre");
  };
  const handleChangePkm = (e, value) => {
    e.preventDefault();

    localStorage.setItem("tyre_sub_id", value.substring(0, value.indexOf("#")));
    localStorage.setItem(
      "tyre_position",
      value.includes("#") &&
        value.substr(value.lastIndexOf("#") + 1).split(" ")[0]
    );
    localStorage.setItem("vehicle_no", vehicle.reg_no);
    localStorage.setItem("vehicle_branch", vehicle.vehicle_branch);
    localStorage.setItem("vechile_view", id);
    // navigate("/changePkm");
    setOpen(true);
  };

  if (loading) return <SkeletonLoader />;
  return (
    <Layout>
      <div className="bg-[#FFFFFF] p-2 rounded-lg">
        <div className="sticky top-0 p-2  mb-4 border-b-2 border-red-500 rounded-lg  bg-[#E1F5FA] ">
          <h2 className="px-5 text-black text-lg flex flex-row justify-between items-center rounded-xl p-2">
            <div className="flex items-center gap-2">
              <IconInfoCircle className="w-4 h-4" />
              <span>Vehicle View</span>
            </div>
            <div className="flex items-center space-x-4">
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
          </h2>
        </div>

        <div ref={printRef} className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <h1 className="print:text-lg print:text-black text-blue-500 font-bold">
              {vehicle.reg_no}
            </h1>
            <div className="block print:hidden">
              <button
                onClick={toggleInfo}
                className="p-1 border  bg-orange-500 text-xs border-black rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-1"
              >
                View Info
                <IconChevronRight
                  className={`w-4 h-4 transition-transform duration-300 ${
                    isInfoVisible ? "rotate-90" : ""
                  }`}
                />
              </button>
            </div>
          </div>
          {/* Sliding Info Panel */}
          <div
            className={`transition-all duration-300 ease-in-out block print:hidden overflow-hidden mb-4 ${
              isInfoVisible ? "max-h-96" : "max-h-0"
            }`}
          >
            <div className="bg-orange-100 rounded-lg p-4 mt-2">
              <div className="grid grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="bg-white rounded-lg shadow p-4">
                  <table className="w-full">
                    <tbody className="divide-y">
                      <tr>
                        <td className="font-semibold w-1/3 py-2">Branch</td>
                        <td>{vehicle?.vehicle_branch}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold w-1/3 py-2">Company</td>
                        <td>{vehicle?.vehicle_company}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold w-1/3 py-2">
                          Vehicle Type
                        </td>
                        <td>{vehicle?.vehicle_type}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold w-1/3 py-2">Model Year</td>
                        <td>{vehicle?.mfg_year}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold w-1/3 py-2">Open KM</td>
                        <td>{vehicle?.vehicle_open_km}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold w-1/3 py-2">Open HSD</td>
                        <td>{vehicle?.vehicle_hsd_open}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Right Column */}
                <div className="bg-white rounded-lg shadow p-4">
                  <table className="w-full">
                    <tbody className="divide-y">
                      <tr>
                        <td className="font-semibold w-1/3 py-2">
                          Insurance Due
                        </td>
                        <td>
                          {moment(vehicle?.ins_due).format("DD-MMM-YYYY")}
                        </td>
                      </tr>
                      <tr>
                        <td className="font-semibold w-1/3 py-2">Permit Due</td>
                        <td>
                          {moment(vehicle?.permit_due).format("DD-MMM-YYYY")}
                        </td>
                      </tr>
                      <tr>
                        <td className="font-semibold w-1/3 py-2">FC Due</td>
                        <td>{moment(vehicle?.fc_due).format("DD-MMM-YYYY")}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold w-1/3 py-2">Mileage</td>
                        <td>{vehicle?.vehicle_mileage}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold w-1/3 py-2">Driver</td>
                        <td>
                          {vehicle?.vehicle_driver} {" - "}{" "}
                          {vehicle.vehicle_driver_no}
                        </td>
                      </tr>
                      <tr>
                        <td className="font-semibold w-1/3 py-2">
                          No of Cylinder
                        </td>
                        <td>{vehicle?.no_of_gas_cylinder}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden print:block">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <table className="w-full">
                  <tbody>
                    <tr className="border-b">
                      <td className="font-semibold w-1/3 print:py-0 py-2 ">
                        Branch
                      </td>
                      <td>{vehicle?.vehicle_branch}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="font-semibold w-1/3 print:py-0 py-2">
                        Company
                      </td>
                      <td>{vehicle?.vehicle_company}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="font-semibold w-1/3 print:py-0 py-2">
                        Vehicle Type
                      </td>
                      <td>{vehicle?.vehicle_type}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="font-semibold w-1/3 print:py-0 py-2">
                        Model Year
                      </td>
                      <td>{vehicle?.mfg_year}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="font-semibold w-1/3 print:py-0 py-2">
                        Open KM
                      </td>
                      <td>{vehicle?.vehicle_open_km}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="font-semibold w-1/3 print:py-0 py-2">
                        Open HSD
                      </td>
                      <td>{vehicle?.vehicle_hsd_open}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div>
                <table className="w-full">
                  <tbody>
                    <tr className="border-b">
                      <td className="font-semibold w-1/3 print:py-0  py-2">
                        Insurance Due
                      </td>
                      <td>{moment(vehicle?.ins_due).format("DD-MMMM-YYYY")}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="font-semibold w-1/3 print:py-0 py-2">
                        Permit Due
                      </td>
                      <td>
                        {moment(vehicle?.permit_due).format("DD-MMMM-YYYY")}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="font-semibold w-1/3 print:py-0 py-2">
                        FC Due
                      </td>
                      <td>{moment(vehicle?.fc_due).format("DD-MMMM-YYYY")}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="font-semibold w-1/3 print:py-0 py-2">
                        Mileage
                      </td>
                      <td>{vehicle?.vehicle_mileage}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="font-semibold w-1/3 print:py-0 py-2">
                        Driver
                      </td>
                      <td>
                        {vehicle?.vehicle_driver} {" - "}
                        {vehicle.vehicle_driver_no}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="font-semibold w-1/3 print:py-0 py-2">
                        No of Cylinder
                      </td>
                      <td>{vehicle?.no_of_gas_cylinder}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {tyre != 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2 text-center">Tyre</h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2">Tyre Position</th>
                    <th className="border p-2">Tyre No</th>
                    <th className="border p-2">Type</th>
                    <th className="border p-2">Make</th>
                    <th className="border p-2">Date</th>

                    <th className="border p-2">KM</th>
                    <th className="border p-2">Present Date</th>
                    <th className="border p-2">Present KM</th>
                    <th className="border p-2">KM Run</th>
                    <th className="border p-2">Status</th>
                    <th className="border p-2 print:hidden">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {/* left  */}
                  {vehicle?.vehicle_type != "Other" && (
                    <tr className="text-center">
                      <td className="border p-2">1.Front Left</td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_1_front_left_no}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_1_front_left_type}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_1_front_left_make}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_1_front_left_date
                          ? moment(tyre?.tyre_assign_1_front_left_date).format(
                              "DD-MMMM-YYYY"
                            )
                          : ""}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_1_front_left_km}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_1_front_left_pre_date
                          ? moment(
                              tyre?.tyre_assign_1_front_left_pre_date
                            ).format("DD-MMMM-YYYY")
                          : ""}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_1_front_left_pre_km}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_1_front_left_pre_km -
                          tyre?.tyre_assign_1_front_left_km}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_1_front_left_status}
                      </td>
                      <td className="border p-2 print:hidden">
                        <div className="flex items-center justify-center gap-4">
                          <button
                            onClick={(e) =>
                              handleChangeTyre(
                                e,
                                tyre?.id + "#tyre_assign_1_front_left_no"
                              )
                            }
                            title="Change Tyre"
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <IconEdit size={20} />
                          </button>

                          <button
                            onClick={(e) =>
                              handleChangePkm(
                                e,
                                tyre?.id + "#tyre_assign_1_front_left_no"
                              )
                            }
                            title="Change Date & Km"
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <IconEditCircle size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                  {/* right  */}
                  {vehicle.vehicle_type != "Other" && (
                    <tr className="text-center">
                      <td className="border p-2">2.Front Right</td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_2_front_right_no}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_2_front_right_type}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_2_front_right_make}
                      </td>
                      <td className="border p-2">
                        {/* {tyre?.tyre_assign_2_front_right_date} */}

                        {tyre?.tyre_assign_2_front_right_date
                          ? moment(tyre?.tyre_assign_2_front_right_date).format(
                              "DD-MMMM-YYYY"
                            )
                          : ""}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_2_front_right_km}
                      </td>
                      <td className="border p-2">
                        {/* {tyre?.tyre_assign_2_front_right_pre_date} */}
                        {tyre?.tyre_assign_2_front_right_pre_date
                          ? moment(
                              tyre?.tyre_assign_2_front_right_pre_date
                            ).format("DD-MMMM-YYYY")
                          : ""}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_2_front_right_pre_km}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_2_front_right_pre_km -
                          tyre?.tyre_assign_2_front_right_km}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_2_front_right_status}
                      </td>
                      <td className="border p-2 print:hidden">
                        <div className="flex items-center justify-center gap-4">
                          <button
                            onClick={(e) =>
                              handleChangeTyre(
                                e,
                                tyre?.id + "#tyre_assign_2_front_right_no"
                              )
                            }
                            title="Change Tyre"
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <IconEdit size={20} />
                          </button>

                          <button
                            onClick={(e) =>
                              handleChangePkm(
                                e,
                                tyre?.id + "#tyre_assign_2_front_right_no"
                              )
                            }
                            title="Change Date & Km"
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <IconEditCircle size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}

                  {/* 6w truck 1 back left */}
                  {vehicle.vehicle_type == "6W Truck" && (
                    <tr className="text-center">
                      <td className="border p-2">3. Back Left</td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_3_back_left_no}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_3_back_left_type}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_3_back_left_make}
                      </td>
                      <td className="border p-2">
                        {/* {tyre?.tyre_assign_3_back_left_date} */}
                        {tyre?.tyre_assign_3_back_left_date
                          ? moment(tyre?.tyre_assign_3_back_left_date).format(
                              "DD-MMMM-YYYY"
                            )
                          : ""}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_3_back_left_km}
                      </td>
                      <td className="border p-2">
                        {/* {tyre?.tyre_assign_3_back_left_pre_date} */}
                        {tyre?.tyre_assign_3_back_left_pre_date
                          ? moment(
                              tyre?.tyre_assign_3_back_left_pre_date
                            ).format("DD-MMMM-YYYY")
                          : ""}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_3_back_left_pre_km}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_3_back_left_pre_km -
                          tyre?.tyre_assign_3_back_left_km}
                      </td>
                      <td className="border p-2 ">
                        {tyre?.tyre_assign_3_back_left_status}
                      </td>
                      <td className="border p-2 print:hidden">
                        <div className="flex items-center justify-center gap-4">
                          <button
                            onClick={(e) =>
                              handleChangeTyre(
                                e,
                                tyre?.id + "#tyre_assign_3_back_left_no"
                              )
                            }
                            title="Change Tyre"
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <IconEdit size={20} />
                          </button>

                          <button
                            onClick={(e) =>
                              handleChangePkm(
                                e,
                                tyre?.id + "#tyre_assign_3_back_left_no"
                              )
                            }
                            title="Change Date & Km"
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <IconEditCircle size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                  {/* 6w truck 2 back left */}
                  {vehicle.vehicle_type == "6W Truck" && (
                    <tr className="text-center">
                      <td className="border p-2">4. Back Left</td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_4_back_left_no}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_4_back_left_type}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_4_back_left_make}
                      </td>
                      <td className="border p-2">
                        {/* {tyre?.tyre_assign_4_back_left_date} */}
                        {tyre?.tyre_assign_4_back_left_date
                          ? moment(tyre?.tyre_assign_4_back_left_date).format(
                              "DD-MMMM-YYYY"
                            )
                          : ""}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_4_back_left_km}
                      </td>
                      <td className="border p-2">
                        {/* {tyre?.tyre_assign_4_back_left_pre_date} */}
                        {tyre?.tyre_assign_4_back_left_pre_date
                          ? moment(
                              tyre?.tyre_assign_4_back_left_pre_date
                            ).format("DD-MMMM-YYYY")
                          : ""}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_4_back_left_pre_km}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_4_back_left_pre_km -
                          tyre?.tyre_assign_4_back_left_km}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_4_back_left_status}
                      </td>
                      <td className="border p-2 print:hidden">
                        <div className="flex items-center justify-center gap-4">
                          <button
                            onClick={(e) =>
                              handleChangeTyre(
                                e,
                                tyre?.id + "#tyre_assign_4_back_left_no"
                              )
                            }
                            title="Change Tyre"
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <IconEdit size={20} />
                          </button>

                          <button
                            onClick={(e) =>
                              handleChangePkm(
                                e,
                                tyre?.id + "#tyre_assign_4_back_left_no"
                              )
                            }
                            title="Change Date & Km"
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <IconEditCircle size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                  {/* 6w truck 3 back right  */}
                  {vehicle.vehicle_type == "6W Truck" && (
                    <tr className="text-center">
                      <td className="border p-2">5. Back Right</td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_5_back_right_no}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_5_back_right_type}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_5_back_right_make}
                      </td>
                      <td className="border p-2">
                        {/* {tyre?.tyre_assign_5_back_right_date} */}
                        {tyre?.tyre_assign_5_back_right_date
                          ? moment(tyre?.tyre_assign_5_back_right_date).format(
                              "DD-MMMM-YYYY"
                            )
                          : ""}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_5_back_right_km}
                      </td>
                      <td className="border p-2">
                        {/* {tyre?.tyre_assign_5_back_right_pre_date} */}
                        {tyre?.tyre_assign_5_back_right_pre_date
                          ? moment(
                              tyre?.tyre_assign_5_back_right_pre_date
                            ).format("DD-MMMM-YYYY")
                          : ""}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_5_back_right_pre_km}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_5_back_right_pre_km -
                          tyre?.tyre_assign_5_back_right_km}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_5_back_right_status}
                      </td>
                      <td className="border p-2 print:hidden">
                        <div className="flex items-center justify-center gap-4">
                          <button
                            onClick={(e) =>
                              handleChangeTyre(
                                e,
                                tyre?.id + "#tyre_assign_5_back_right_no"
                              )
                            }
                            title="Change Tyre"
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <IconEdit size={20} />
                          </button>

                          <button
                            onClick={(e) =>
                              handleChangePkm(
                                e,
                                tyre?.id + "#tyre_assign_5_back_right_no"
                              )
                            }
                            title="Change Date & Km"
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <IconEditCircle size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                  {/* 6w truck 4 back right  */}
                  {vehicle.vehicle_type == "6W Truck" && (
                    <tr className="text-center">
                      <td className="border p-2">6. Back Right</td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_6_back_right_no}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_6_back_right_type}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_6_back_right_make}
                      </td>
                      <td className="border p-2">
                        {/* {tyre?.tyre_assign_6_back_right_date} */}
                        {tyre?.tyre_assign_6_back_right_date
                          ? moment(tyre?.tyre_assign_6_back_right_date).format(
                              "DD-MMMM-YYYY"
                            )
                          : ""}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_6_back_right_km}
                      </td>
                      <td className="border p-2">
                        {/* {tyre?.tyre_assign_6_back_right_pre_date} */}
                        {tyre?.tyre_assign_6_back_right_pre_date
                          ? moment(
                              tyre?.tyre_assign_6_back_right_pre_date
                            ).format("DD-MMMM-YYYY")
                          : ""}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_6_back_right_pre_km}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_6_back_right_pre_km -
                          tyre?.tyre_assign_6_back_right_km}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_6_back_right_status}
                      </td>
                      <td className="border p-2 print:hidden">
                        <div className="flex items-center justify-center gap-4">
                          <button
                            onClick={(e) =>
                              handleChangeTyre(
                                e,
                                tyre?.id + "#tyre_assign_6_back_right_no"
                              )
                            }
                            title="Change Tyre"
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <IconEdit size={20} />
                          </button>

                          <button
                            onClick={(e) =>
                              handleChangePkm(
                                e,
                                tyre?.id + "#tyre_assign_6_back_right_no"
                              )
                            }
                            title="Change Date & Km"
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <IconEditCircle size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}

                  {/* 10w truck 1 back housing  left  */}
                  {vehicle.vehicle_type == "10W Truck" && (
                    <tr className="text-center">
                      <td className="border p-2">3. Back Housing Left</td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_3_back_housing_left_no}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_3_back_housing_left_type}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_3_back_housing_left_make}
                      </td>
                      <td className="border p-2">
                        {/* {tyre?.tyre_assign_3_back_housing_left_date} */}
                        {tyre?.tyre_assign_3_back_housing_left_date
                          ? moment(
                              tyre?.tyre_assign_3_back_housing_left_date
                            ).format("DD-MMMM-YYYY")
                          : ""}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_3_back_housing_left_km}
                      </td>
                      <td className="border p-2">
                        {/* {tyre?.tyre_assign_3_back_housing_left_pre_date} */}
                        {tyre?.tyre_assign_3_back_housing_left_pre_date
                          ? moment(
                              tyre?.tyre_assign_3_back_housing_left_pre_date
                            ).format("DD-MMMM-YYYY")
                          : ""}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_3_back_housing_left_pre_km}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_3_back_housing_left_pre_km -
                          tyre?.tyre_assign_3_back_housing_left_km}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_3_back_housing_left_status}
                      </td>
                      <td className="border p-2 print:hidden">
                        <div className="flex items-center justify-center gap-4">
                          <button
                            onClick={(e) =>
                              handleChangeTyre(
                                e,
                                tyre?.id + "#tyre_assign_3_back_housing_left_no"
                              )
                            }
                            title="Change Tyre"
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <IconEdit size={20} />
                          </button>

                          <button
                            onClick={(e) =>
                              handleChangePkm(
                                e,
                                tyre?.id + "#tyre_assign_3_back_housing_left_no"
                              )
                            }
                            title="Change Date & Km"
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <IconEditCircle size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}

                  {/* 10w truck 2 back housing  left  */}
                  {vehicle.vehicle_type == "10W Truck" && (
                    <tr className="text-center">
                      <td className="border p-2">4. Back Housing Left</td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_4_back_housing_left_no}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_4_back_housing_left_type}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_4_back_housing_left_make}
                      </td>
                      <td className="border p-2">
                        {/* {tyre?.tyre_assign_4_back_housing_left_date} */}
                        {tyre?.tyre_assign_4_back_housing_left_date
                          ? moment(
                              tyre?.tyre_assign_4_back_housing_left_date
                            ).format("DD-MMMM-YYYY")
                          : ""}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_4_back_housing_left_km}
                      </td>
                      <td className="border p-2">
                        {/* {tyre?.tyre_assign_4_back_housing_left_pre_date} */}
                        {tyre?.tyre_assign_4_back_housing_left_pre_date
                          ? moment(
                              tyre?.tyre_assign_4_back_housing_left_pre_date
                            ).format("DD-MMMM-YYYY")
                          : ""}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_4_back_housing_left_pre_km}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_4_back_housing_left_pre_km -
                          tyre?.tyre_assign_4_back_housing_left_km}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_4_back_housing_left_status}
                      </td>
                      <td className="border p-2 print:hidden">
                        <div className="flex items-center justify-center gap-4">
                          <button
                            onClick={(e) =>
                              handleChangeTyre(
                                e,
                                tyre?.id + "#tyre_assign_4_back_housing_left_no"
                              )
                            }
                            title="Change Tyre"
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <IconEdit size={20} />
                          </button>

                          <button
                            onClick={(e) =>
                              handleChangePkm(
                                e,
                                tyre?.id + "#tyre_assign_4_back_housing_left_no"
                              )
                            }
                            title="Change Date & Km"
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <IconEditCircle size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}

                  {/* 10w truck 3 back dummy  left  */}
                  {vehicle.vehicle_type == "10W Truck" && (
                    <tr className="text-center">
                      <td className="border p-2">5. Back Dummy Left</td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_5_back_dummy_left_no}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_5_back_dummy_left_type}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_5_back_dummy_left_make}
                      </td>
                      <td className="border p-2">
                        {/* {tyre?.tyre_assign_5_back_dummy_left_date} */}
                        {tyre?.tyre_assign_5_back_dummy_left_date
                          ? moment(
                              tyre?.tyre_assign_5_back_dummy_left_date
                            ).format("DD-MMMM-YYYY")
                          : ""}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_5_back_dummy_left_km}
                      </td>
                      <td className="border p-2">
                        {/* {tyre?.tyre_assign_5_back_dummy_left_pre_date} */}
                        {tyre?.tyre_assign_5_back_dummy_left_pre_date
                          ? moment(
                              tyre?.tyre_assign_5_back_dummy_left_pre_date
                            ).format("DD-MMMM-YYYY")
                          : ""}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_5_back_dummy_left_pre_km}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_5_back_dummy_left_pre_km -
                          tyre?.tyre_assign_5_back_dummy_left_km}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_5_back_dummy_left_status}
                      </td>
                      <td className="border p-2 print:hidden">
                        <div className="flex items-center justify-center gap-4">
                          <button
                            onClick={(e) =>
                              handleChangeTyre(
                                e,
                                tyre?.id + "#tyre_assign_5_back_dummy_left_no"
                              )
                            }
                            title="Change Tyre"
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <IconEdit size={20} />
                          </button>

                          <button
                            onClick={(e) =>
                              handleChangePkm(
                                e,
                                tyre?.id + "#tyre_assign_5_back_dummy_left_no"
                              )
                            }
                            title="Change Date & Km"
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <IconEditCircle size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                  {/* 10w truck 4 back dummy  left  */}
                  {vehicle.vehicle_type == "10W Truck" && (
                    <tr className="text-center">
                      <td className="border p-2">6. Back Dummy Left</td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_6_back_dummy_left_no}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_6_back_dummy_left_type}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_6_back_dummy_left_make}
                      </td>
                      <td className="border p-2">
                        {/* {tyre?.tyre_assign_6_back_dummy_left_date} */}
                        {tyre?.tyre_assign_6_back_dummy_left_date
                          ? moment(
                              tyre?.tyre_assign_6_back_dummy_left_date
                            ).format("DD-MMMM-YYYY")
                          : ""}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_6_back_dummy_left_km}
                      </td>
                      <td className="border p-2">
                        {/* {tyre?.tyre_assign_6_back_dummy_left_pre_date} */}
                        {tyre?.tyre_assign_6_back_dummy_left_pre_date
                          ? moment(
                              tyre?.tyre_assign_6_back_dummy_left_pre_date
                            ).format("DD-MMMM-YYYY")
                          : ""}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_6_back_dummy_left_pre_km}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_6_back_dummy_left_pre_km -
                          tyre?.tyre_assign_6_back_dummy_left_km}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_6_back_dummy_left_status}
                      </td>
                      <td className="border p-2 print:hidden">
                        <div className="flex items-center justify-center gap-4">
                          <button
                            onClick={(e) =>
                              handleChangeTyre(
                                e,
                                tyre?.id + "#tyre_assign_6_back_dummy_left_no"
                              )
                            }
                            title="Change Tyre"
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <IconEdit size={20} />
                          </button>

                          <button
                            onClick={(e) =>
                              handleChangePkm(
                                e,
                                tyre?.id + "#tyre_assign_6_back_dummy_left_no"
                              )
                            }
                            title="Change Date & Km"
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <IconEditCircle size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}

                  {/* 10w truck 5 back Housing  Right  */}
                  {vehicle.vehicle_type == "10W Truck" && (
                    <tr className="text-center">
                      <td className="border p-2">7. Back Housing Right</td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_7_back_housing_right_no}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_7_back_housing_right_type}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_7_back_housing_right_make}
                      </td>
                      <td className="border p-2">
                        {/* {tyre?.tyre_assign_7_back_housing_right_date} */}
                        {tyre?.tyre_assign_7_back_housing_right_date
                          ? moment(
                              tyre?.tyre_assign_7_back_housing_right_date
                            ).format("DD-MMMM-YYYY")
                          : ""}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_7_back_housing_right_km}
                      </td>
                      <td className="border p-2">
                        {/* {tyre?.tyre_assign_7_back_housing_right_pre_date} */}
                        {tyre?.tyre_assign_7_back_housing_right_pre_date
                          ? moment(
                              tyre?.tyre_assign_7_back_housing_right_pre_date
                            ).format("DD-MMMM-YYYY")
                          : ""}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_7_back_housing_right_pre_km}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_7_back_housing_right_pre_km -
                          tyre?.tyre_assign_7_back_housing_right_km}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_7_back_housing_right_status}
                      </td>
                      <td className="border p-2 print:hidden">
                        <div className="flex items-center justify-center gap-4">
                          <button
                            onClick={(e) =>
                              handleChangeTyre(
                                e,
                                tyre?.id +
                                  "#tyre_assign_7_back_housing_right_no"
                              )
                            }
                            title="Change Tyre"
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <IconEdit size={20} />
                          </button>

                          <button
                            onClick={(e) =>
                              handleChangePkm(
                                e,
                                tyre?.id +
                                  "#tyre_assign_7_back_housing_right_no"
                              )
                            }
                            title="Change Date & Km"
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <IconEditCircle size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}

                  {/* 10w truck 6 back Housing  Right  */}
                  {vehicle.vehicle_type == "10W Truck" && (
                    <tr className="text-center">
                      <td className="border p-2">8. Back Housing Right</td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_8_back_housing_right_no}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_8_back_housing_right_type}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_8_back_housing_right_make}
                      </td>
                      <td className="border p-2">
                        {/* {tyre?.tyre_assign_8_back_housing_right_date} */}
                        {tyre?.tyre_assign_8_back_housing_right_date
                          ? moment(
                              tyre?.tyre_assign_8_back_housing_right_date
                            ).format("DD-MMMM-YYYY")
                          : ""}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_8_back_housing_right_km}
                      </td>
                      <td className="border p-2">
                        {/* {tyre?.tyre_assign_8_back_housing_right_pre_date} */}
                        {tyre?.tyre_assign_8_back_housing_right_pre_date
                          ? moment(
                              tyre?.tyre_assign_8_back_housing_right_pre_date
                            ).format("DD-MMMM-YYYY")
                          : ""}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_8_back_housing_right_pre_km}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_8_back_housing_right_pre_km -
                          tyre?.tyre_assign_8_back_housing_right_km}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_8_back_housing_right_status}
                      </td>
                      <td className="border p-2 print:hidden">
                        <div className="flex items-center justify-center gap-4">
                          <button
                            onClick={(e) =>
                              handleChangeTyre(
                                e,
                                tyre?.id +
                                  "#tyre_assign_8_back_housing_right_no"
                              )
                            }
                            title="Change Tyre"
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <IconEdit size={20} />
                          </button>

                          <button
                            onClick={(e) =>
                              handleChangePkm(
                                e,
                                tyre?.id +
                                  "#tyre_assign_8_back_housing_right_no"
                              )
                            }
                            title="Change Date & Km"
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <IconEditCircle size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                  {/* 10w truck 7 back Dummy Right  */}
                  {vehicle.vehicle_type == "10W Truck" && (
                    <tr className="text-center">
                      <td className="border p-2">9. Back Dummy Right</td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_9_back_dummy_right_no}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_9_back_dummy_right_type}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_9_back_dummy_right_make}
                      </td>
                      <td className="border p-2">
                        {/* {tyre?.tyre_assign_9_back_dummy_right_date} */}
                        {tyre?.tyre_assign_9_back_dummy_right_date
                          ? moment(
                              tyre?.tyre_assign_9_back_dummy_right_date
                            ).format("DD-MMMM-YYYY")
                          : ""}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_9_back_dummy_right_km}
                      </td>
                      <td className="border p-2">
                        {/* {tyre?.tyre_assign_9_back_dummy_right_pre_date} */}
                        {tyre?.tyre_assign_9_back_dummy_right_pre_date
                          ? moment(
                              tyre?.tyre_assign_9_back_dummy_right_pre_date
                            ).format("DD-MMMM-YYYY")
                          : ""}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_9_back_dummy_right_pre_km}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_9_back_dummy_right_pre_km -
                          tyre?.tyre_assign_9_back_dummy_right_km}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_9_back_dummy_right_status}
                      </td>
                      <td className="border p-2 print:hidden">
                        <div className="flex items-center justify-center gap-4">
                          <button
                            onClick={(e) =>
                              handleChangeTyre(
                                e,
                                tyre?.id + "#tyre_assign_9_back_dummy_right_no"
                              )
                            }
                            title="Change Tyre"
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <IconEdit size={20} />
                          </button>

                          <button
                            onClick={(e) =>
                              handleChangePkm(
                                e,
                                tyre?.id + "#tyre_assign_9_back_dummy_right_no"
                              )
                            }
                            title="Change Date & Km"
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <IconEditCircle size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                  {/* 10w truck 8 back Dummy Right  */}
                  {vehicle.vehicle_type == "10W Truck" && (
                    <tr className="text-center">
                      <td className="border p-2">10. Back Dummy Right</td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_10_back_dummy_right_no}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_10_back_dummy_right_type}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_10_back_dummy_right_make}
                      </td>
                      <td className="border p-2">
                        {/* {tyre?.tyre_assign_10_back_dummy_right_date} */}
                        {tyre?.tyre_assign_10_back_dummy_right_date
                          ? moment(
                              tyre?.tyre_assign_10_back_dummy_right_date
                            ).format("DD-MMMM-YYYY")
                          : ""}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_10_back_dummy_right_km}
                      </td>
                      <td className="border p-2">
                        {/* {tyre?.tyre_assign_10_back_dummy_right_pre_date} */}
                        {tyre?.tyre_assign_10_back_dummy_right_pre_date
                          ? moment(
                              tyre?.tyre_assign_10_back_dummy_right_pre_date
                            ).format("DD-MMMM-YYYY")
                          : ""}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_10_back_dummy_right_pre_km}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_10_back_dummy_right_pre_km -
                          tyre?.tyre_assign_10_back_dummy_right_km}
                      </td>
                      <td className="border p-2">
                        {tyre?.tyre_assign_10_back_dummy_right_status}
                      </td>
                      <td className="border p-2 print:hidden">
                        <div className="flex items-center justify-center gap-4">
                          <button
                            onClick={(e) =>
                              handleChangeTyre(
                                e,
                                tyre?.id + "#tyre_assign_10_back_dummy_right_no"
                              )
                            }
                            title="Change Tyre"
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <IconEdit size={20} />
                          </button>

                          <button
                            onClick={(e) =>
                              handleChangePkm(
                                e,
                                tyre?.id + "#tyre_assign_10_back_dummy_right_no"
                              )
                            }
                            title="Change Date & Km"
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <IconEditCircle size={20} />
                          </button>
                        </div>
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
        </div>
      </div>
      <ChnagePkmNew
        open={open}
        onClose={() => setOpen(false)}
        refetch={fetchTyreVechile}
      />
    </Layout>
  );
};

export default ViewVechile;
