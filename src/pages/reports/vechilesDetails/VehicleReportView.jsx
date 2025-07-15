import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  IconInfoCircle,
  IconArrowBack,
  IconPrinter,
  IconFileTypePdf,
} from "@tabler/icons-react";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import Layout from "../../../layout/Layout";
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import html2pdf from "html2pdf.js";
import { toast } from "sonner";
import { ReportDate, ReportTitle } from "../../../components/common/ReportTitle";
const SkeletonLoading = () => {
  return (
    <Layout>
      <div className="bg-[#FFFFFF] p-2 rounded-lg animate-pulse">
        {/* Header Skeleton */}
        <div className="sticky top-0 p-2 mb-4 border-b-2 border-red-500 rounded-lg bg-[#E1F5FA]">
          <div className="h-10 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
              <div className="w-48 h-6 bg-gray-300 rounded"></div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
              <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Vehicle Info Skeleton */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[1, 2].map((col) => (
            <div key={col} className="space-y-2">
              {[1, 2, 3, 4, 5, 6].map((row) => (
                <div key={row} className="flex justify-between">
                  <div className="w-1/3 h-8 bg-gray-200 rounded"></div>
                  <div className="w-1/2 h-8 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Tyre Details Skeleton */}
        <div className="mb-4">
          <div className="w-48 h-8 bg-gray-300 rounded mx-auto mb-4"></div>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {[1, 2, 3, 4, 5, 6].map((header) => (
                  <th key={header} className="p-2 border border-gray-300">
                    <div className="h-6 bg-gray-300 rounded"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5, 6].map((row) => (
                <tr key={row} className="border border-gray-300">
                  {[1, 2, 3, 4, 5, 6].map((cell) => (
                    <td key={cell} className="p-2 border border-gray-300">
                      <div className="h-6 bg-gray-200 rounded"></div>
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

const VehicleReportView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const componentRef = React.useRef();
  const [vehicle, setSummary] = useState({});
  const [service, setService] = useState({});
  const [serviceSub, setServiceSub] = useState({});
  const [fullservicesSub, setfullservicesSub] = useState({});
  const [tyre, setTyre] = useState({});
  const [trip, setTrip] = useState({});
  // Print handler using react-to-print
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: `
          @page {
              size: A4;
              margin: 4mm;
          }
          @media print {
              body {
                  margin: 0;
                  font-size: 12px; 
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


.trademark {
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  // padding: 0 10mm;
  font-size: 8px;
  color: gray;
}

              th {
                  background-color: #f4f4f4;
              }
              .text-center {
                  text-align: center;
              }
                  .margin-first{
                  margin:10px
                  }
                  
          }
        `,
  });

  useEffect(() => {
    const fetchVehicleData = async () => {
      let data = {
        vehicle_reg_no: localStorage.getItem("vehicle_reg_no"),
      };
      try {
        const token = localStorage.getItem("token");

        const res = await axios.post(
          `${BASE_URL}/api/fetch-vehicle-detail-report`,
          data,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setSummary(res.data.vehicle);
        console.log(res.data.vehicle);
        setService(res.data.services);
        setServiceSub(res.data.servicesSub);
        setfullservicesSub(res.data.fullservices);
        setTrip(res.data.trip);
        setTyre(res.data.vehiceltyresub);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchVehicleData();
  }, []);

  if (loading) {
    return <SkeletonLoading />;
  }
  const handleSavePDF = () => {
    const element = componentRef.current;
    const opt = {
      margin: 0.2,
      filename: "vehicle-report.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, width: 780 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().set(opt).from(element).save();
    toast
      .success("Vehicle is Downloaded Successfully")

      .catch((error) => {
        console.error("PDF generation error:", error);
        toast.error("Failed to download PDF.");
      });
  };
  return (
    <Layout>
      <div className=" bg-[#FFFFFF] p-2  rounded-lg  ">
        <div className="sticky top-0 p-2  mb-4 border-b-2 border-red-500 rounded-lg  bg-[#E1F5FA] ">
          <h2 className=" px-5 text-[black] text-lg   flex flex-row  justify-between items-center  rounded-xl p-2 ">
            <div className="flex  items-center gap-2">
              <IconInfoCircle className="w-4 h-4" />
              <span>Vehicles Details </span>
            </div>
            <div className="flex items-center space-x-4">
              <IconPrinter
                className="cursor-pointer text-gray-600 hover:text-blue-600"
                onClick={handlePrint}
                title="Print"
              />
              <IconFileTypePdf
                className="cursor-pointer text-gray-600 hover:text-blue-600"
                onClick={handleSavePDF}
                title="Print"
              />
              <IconArrowBack
                className="cursor-pointer text-gray-600 hover:text-red-600"
                onClick={() => navigate("/report-vdetails-form")}
                title="Go Back"
              />
            </div>
          </h2>
        </div>
        <div className=" grid sm:grid-cols-1 overflow-x-auto">
          {" "}
          <div ref={componentRef}>
            <h3 className="text-xl font-bold my-4  text-center">
              VEHICLES DETAILS
            </h3>
            <h3 className="text-xl font-medium my-4 text-start ml-10">
              <h1>{vehicle.reg_no}</h1>
            </h3>
            <div className="grid grid-cols-1 print:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
              <div>
                <table className="w-full">
                  <tbody>
                    {[
                      { label: "Branch", value: vehicle.vehicle_branch },
                      { label: "Company", value: vehicle.vehicle_company },
                      { label: "Mileage", value: vehicle.vehicle_mileage },
                      { label: "Model Year", value: vehicle.mfg_year },
                      { label: "Vehicle Type", value: vehicle.vehicle_type },
                      { label: "Vehicle KM", value: vehicle.vehicle_open_km },
                    ].map((row, index) => (
                      <tr key={index} className="border border-gray-300">
                        <td className="p-1 font-medium bg-gray-100 w-1/3">
                          {row.label}
                        </td>
                        <td className="p-[0.28rem]">{row.value || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div>
                <table className="w-full">
                  <tbody>
                    {[
                      {
                        label: "Insurance Due",
                        value: vehicle.ins_due
                          ? moment(vehicle.ins_due).format("DD-MM-YYYY")
                          : "-",
                      },
                      {
                        label: "Permit Due",
                        value: vehicle.permit_due
                          ? moment(vehicle.permit_due).format("DD-MM-YYYY")
                          : "-",
                      },
                      {
                        label: "FC Due",
                        value: vehicle.fc_due
                          ? moment(vehicle.fc_due).format("DD-MM-YYYY")
                          : "-",
                      },
                      {
                        label: "Driver",
                        value: `${vehicle.vehicle_driver} - ${vehicle.vehicle_driver_no}`,
                      },
                      {
                        label: "Status",
                        value: vehicle.vehicle_status,
                      },
                    ].map((row, index) => (
                      <tr key={index} className="border border-gray-300">
                        <td className="p-2 font-medium bg-gray-100 w-1/3">
                          {row.label}
                        </td>
                        <td className="p-2">{row.value || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* //SECOND TABELE */}
            <div>
              <h3 className="text-xl font-bold my-4 text-center">SERVICES</h3>
              {fullservicesSub.length > 0 ? (
                <>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-200">
                        {["Services", "Date", "KM", "Present KM"].map(
                          (header) => (
                            <th
                              key={header}
                              className="text-xs p-1 border border-black"
                            >
                              {header}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {fullservicesSub.map((item, index) => (
                        <tr key={index}>
                          <td className="text-xs border p-1 border-black px-2">
                            {item?.service_sub_type || "-"}
                          </td>
                          <td className="text-xs border p-1 border-black text-center">
                            {moment(item?.service_sub_date).isValid()
                              ? moment(item.service_sub_date).format(
                                  "DD-MM-YYYY"
                                )
                              : "-"}
                          </td>
                          <td className="text-xs border p-1 border-black text-center">
                            {item?.service_sub_km || "-"}
                          </td>
                          <td className="text-xs border p-1 border-black text-center">
                            {item?.service_sub_pre_km || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              ) : (
                <div className="text-center text-gray-500 py-4">
                  No Service Details Available
                </div>
              )}
            </div>

            {/* //THIRS TABELE */}
            <div>
              <h3 className="text-xl font-bold my-4 text-center">TRIP</h3>
              {trip.length > 0 ? (
                <>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-200">
                        {[
                          "Date",
                          "Agency",
                          "KM",
                          "Supplier",
                          "HSD",
                          "HSD Supplied",
                          "Driver",
                          "Status",
                        ].map((header) => (
                          <th
                            key={header}
                            className="text-xs p-2 border border-black"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {trip.map((item, index) => (
                        <tr key={index}>
                          <td className="text-xs border p-2 border-black text-center">
                            {moment(item?.trip_date).format("DD-MM-YYYY") ||
                              "-"}
                          </td>
                          <td className="text-xs border  border-black p-2">
                            {item?.trip_agency || "-"}
                          </td>

                          <td className="text-xs border p-2 border-black text-center">
                            {item?.trip_km || "-"}
                          </td>
                          <td className="text-xs border p-2 border-black ">
                            {item?.trip_supplier || "-"}
                          </td>
                          <td className="text-xs border p-2 border-black text-center">
                            {item?.trip_hsd || "-"}
                          </td>
                          <td className="text-xs border p-1 border-black text-center">
                            {item?.trip_hsd_supplied || "-"}
                          </td>
                          <td className="text-xs border p-2 border-black">
                            {item?.trip_driver || "-"}
                            {" - "}
                            {item?.trip_driver_no || "-"}
                          </td>
                          <td className="text-xs border p-2 border-black text-center">
                            {item?.trip_status || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              ) : (
                <div className="text-center text-gray-500 py-4">
                  No TRIP Details Available
                </div>
              )}
            </div>

            {/* //FOUR TABELE */}
            <div>
              <h3 className="text-xl font-bold my-4 text-center">TYRE</h3>
              {tyre.length != 0 ? (
                <>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-200">
                        {[
                          "Tyre Position",
                          "Tyre No",
                          "Date",
                          "KM",
                          "Present KM",
                          "Status",
                        ].map((header) => (
                          <th
                            key={header}
                            className="text-xs p-1 border border-black"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {/* //one */}
                      {vehicle.vehicle_type != "Other" && (
                        <tr>
                          <td className="text-xs border p-1 border-black px-2">
                            1. Front Left{" "}
                          </td>
                          <td className="text-xs border p-1 border-black px-2">
                            {tyre.tyre_assign_1_front_left_no || "-"}
                          </td>
                          <td className="text-xs border p-1 border-black text-center">
                            {tyre.tyre_assign_1_front_left_date
                              ? moment(
                                  tyre.tyre_assign_1_front_left_date
                                ).format("DD-MM-YYYY")
                              : "-"}
                          </td>
                          <td className="text-xs border p-1 border-black text-center">
                            {tyre.tyre_assign_1_front_left_km || "-"}
                          </td>
                          <td className="text-xs border p-1 border-black text-center">
                            {tyre.tyre_assign_1_front_left_pre_km || "-"}
                          </td>
                          <td className="text-xs border p-1 border-black text-center">
                            {tyre.tyre_assign_1_front_left_status || "-"}
                          </td>
                        </tr>
                      )}
                      {/* //TWO */}
                      {vehicle.vehicle_type != "Other" && (
                        <tr>
                          <td className="text-xs border p-1 border-black px-2">
                            2. Front Right
                          </td>
                          <td className="text-xs border p-1 border-black px-2">
                            {tyre.tyre_assign_2_front_right_no || "-"}
                          </td>
                          <td className="text-xs border p-1 border-black text-center">
                            {tyre.tyre_assign_2_front_right_date
                              ? moment(
                                  tyre.tyre_assign_2_front_right_date
                                ).format("DD-MM-YYYY")
                              : "-"}
                          </td>
                          <td className="text-xs border p-1 border-black text-center">
                            {tyre.tyre_assign_2_front_right_km || "-"}
                          </td>
                          <td className="text-xs border p-1 border-black text-center">
                            {tyre.tyre_assign_2_front_right_pre_km || "-"}
                          </td>
                          <td className="text-xs border p-1 border-black text-center">
                            {tyre.tyre_assign_2_front_right_status || "-"}
                          </td>
                        </tr>
                      )}
                      {/* //THREE */}
                      {vehicle.vehicle_type == "6W Truck" && (
                        <tr>
                          <td className="text-xs border p-1 border-black px-2">
                            3. Back Left
                          </td>
                          <td className="text-xs border p-1 border-black px-2">
                            {tyre.tyre_assign_3_back_left_no || "-"}
                          </td>
                          <td className="text-xs border p-1 border-black text-center">
                            {tyre.tyre_assign_3_back_left_date
                              ? moment(
                                  tyre.tyre_assign_3_back_left_date
                                ).format("DD-MM-YYYY")
                              : "-"}
                          </td>
                          <td className="text-xs border p-1 border-black text-center">
                            {tyre.tyre_assign_3_back_left_km || "-"}
                          </td>
                          <td className="text-xs border p-1 border-black text-center">
                            {tyre.tyre_assign_3_back_left_pre_km || "-"}
                          </td>
                          <td className="text-xs border p-1 border-black text-center">
                            {tyre.tyre_assign_3_back_left_status || "-"}
                          </td>
                        </tr>
                      )}
                      {/* //FOUR */}
                      {vehicle.vehicle_type == "6W Truck" && (
                        <tr>
                          <td className="text-xs border p-1 border-black px-2">
                            4. Back Left
                          </td>
                          <td className="text-xs border p-1 border-black px-2">
                            {tyre.tyre_assign_4_back_left_no || "-"}
                          </td>
                          <td className="text-xs border p-1 border-black text-center">
                            {tyre.tyre_assign_4_back_left_date
                              ? moment(
                                  tyre.tyre_assign_4_back_left_date
                                ).format("DD-MM-YYYY")
                              : "-"}
                          </td>
                          <td className="text-xs border p-1 border-black text-center">
                            {tyre.tyre_assign_4_back_left_km || "-"}
                          </td>
                          <td className="text-xs border p-1 border-black text-center">
                            {tyre.tyre_assign_4_back_left_pre_km || "-"}
                          </td>
                          <td className="text-xs border p-1 border-black text-center">
                            {tyre.tyre_assign_4_back_left_status || "-"}
                          </td>
                        </tr>
                      )}
                      {/* //FIVE */}
                      {vehicle.vehicle_type == "6W Truck" && (
                        <tr>
                          <td className="text-xs border p-1 border-black px-2">
                            5. Back Right
                          </td>
                          <td className="text-xs border p-1 border-black px-2">
                            {tyre.tyre_assign_5_back_right_no || "-"}
                          </td>
                          <td className="text-xs border p-1 border-black text-center">
                            {tyre.tyre_assign_5_back_right_date
                              ? moment(
                                  tyre.tyre_assign_5_back_right_date
                                ).format("DD-MM-YYYY")
                              : "-"}
                          </td>
                          <td className="text-xs border p-1 border-black text-center">
                            {tyre.tyre_assign_5_back_right_km || "-"}
                          </td>
                          <td className="text-xs border p-1 border-black text-center">
                            {tyre.tyre_assign_5_back_right_pre_km || "-"}
                          </td>
                          <td className="text-xs border p-1 border-black text-center">
                            {tyre.tyre_assign_5_back_right_status || "-"}
                          </td>
                        </tr>
                      )}
                      {/* //SIX */}
                      {vehicle.vehicle_type == "6W Truck" && (
                        <tr>
                          <td className="text-xs border p-1 border-black px-2">
                            6. Back Right
                          </td>
                          <td className="text-xs border p-1 border-black px-2">
                            {tyre.tyre_assign_6_back_right_no || "-"}
                          </td>
                          <td className="text-xs border p-1 border-black text-center">
                            {tyre.tyre_assign_6_back_right_date
                              ? moment(
                                  tyre.tyre_assign_6_back_right_date
                                ).format("DD-MM-YYYY")
                              : "-"}
                          </td>
                          <td className="text-xs border p-1 border-black text-center">
                            {tyre.tyre_assign_6_back_right_km || "-"}
                          </td>
                          <td className="text-xs border p-1 border-black text-center">
                            {tyre.tyre_assign_6_back_right_pre_km || "-"}
                          </td>
                          <td className="text-xs border p-1 border-black text-center">
                            {tyre.tyre_assign_6_back_right_status || "-"}
                          </td>
                        </tr>
                      )}
                      {/* //SEVEN */}
                      {vehicle.vehicle_type == "10W Truck" && (
                        <tr>
                          <td className="text-xs border p-1 border-black px-2">
                            3. Back Housing Left
                          </td>
                          <td className="text-xs border p-1 border-black px-2">
                            {tyre.tyre_assign_3_back_housing_left_no || "-"}
                          </td>
                          <td className="text-xs border p-1 border-black text-center">
                            {tyre.tyre_assign_3_back_housing_left_date
                              ? moment(
                                  tyre.tyre_assign_3_back_housing_left_date
                                ).format("DD-MM-YYYY")
                              : "-"}
                          </td>
                          <td className="text-xs border p-1 border-black text-center">
                            {tyre.tyre_assign_3_back_housing_left_km || "-"}
                          </td>
                          <td className="text-xs border p-1 border-black text-center">
                            {tyre.tyre_assign_3_back_housing_left_pre_km || "-"}
                          </td>
                          <td className="text-xs border p-1 border-black text-center">
                            {tyre.tyre_assign_3_back_housing_left_status || "-"}
                          </td>
                        </tr>
                      )}
                      {/* //EIGHT */}
                      {vehicle.vehicle_type == "10W Truck" && (
                        <tr>
                          <td className="text-xs border p-1 border-black px-2">
                            4. Back Housing Left
                          </td>
                          <td className="text-xs border p-1 border-black px-2">
                            {tyre.tyre_assign_4_back_housing_left_no || "-"}
                          </td>
                          <td className="text-xs border p-1 border-black text-center">
                            {tyre.tyre_assign_4_back_housing_left_date
                              ? moment(
                                  tyre.tyre_assign_4_back_housing_left_date
                                ).format("DD-MM-YYYY")
                              : "-"}
                          </td>
                          <td className="text-xs border p-1 border-black text-center">
                            {tyre.tyre_assign_4_back_housing_left_km || "-"}
                          </td>
                          <td className="text-xs border p-1 border-black text-center">
                            {tyre.tyre_assign_4_back_housing_left_pre_km || "-"}
                          </td>
                          <td className="text-xs border p-1 border-black text-center">
                            {tyre.tyre_assign_4_back_housing_left_status || "-"}
                          </td>
                        </tr>
                      )}
                      {/* //NINE */}
                      {vehicle.vehicle_type == "10W Truck" && (
                        <tr>
                          <td className="text-xs border p-1 border-black px-2">
                            5. Back Dummy Left
                          </td>
                          <td className="text-xs border p-1 border-black px-2">
                            {tyre.tyre_assign_5_back_dummy_left_no || "-"}
                          </td>
                          <td className="text-xs border p-1 border-black text-center">
                            {tyre.tyre_assign_5_back_dummy_left_date
                              ? moment(
                                  tyre.tyre_assign_5_back_dummy_left_date
                                ).format("DD-MM-YYYY")
                              : "-"}
                          </td>
                          <td className="text-xs border p-1 border-black text-center">
                            {tyre.tyre_assign_5_back_dummy_left_km || "-"}
                          </td>
                          <td className="text-xs border p-1 border-black text-center">
                            {tyre.tyre_assign_5_back_dummy_left_pre_km || "-"}
                          </td>
                          <td className="text-xs border p-1 border-black text-center">
                            {tyre.tyre_assign_5_back_dummy_left_status || "-"}
                          </td>
                        </tr>
                      )}
                      {/* //TEN */}
                      {vehicle.vehicle_type == "10W Truck" && (
                        <tr>
                          <td className="text-xs border p-1 border-black px-2">
                            6. Back Dummy Left
                          </td>
                          <td className="text-xs border p-1 border-black px-2">
                            {tyre.tyre_assign_6_back_dummy_left_no || "-"}
                          </td>
                          <td className="text-xs border p-1 border-black text-center">
                            {tyre.tyre_assign_6_back_dummy_left_date
                              ? moment(
                                  tyre.tyre_assign_6_back_dummy_left_date
                                ).format("DD-MM-YYYY")
                              : "-"}
                          </td>
                          <td className="text-xs border p-1 border-black text-center">
                            {tyre.tyre_assign_6_back_dummy_left_km || "-"}
                          </td>
                          <td className="text-xs border p-1 border-black text-center">
                            {tyre.tyre_assign_6_back_dummy_left_pre_km || "-"}
                          </td>
                          <td className="text-xs border p-1 border-black text-center">
                            {tyre.tyre_assign_6_back_dummy_left_status || "-"}
                          </td>
                        </tr>
                      )}
                      {/* //ELEVEN */}
                      {vehicle.vehicle_type == "10W Truck" && (
                        <tr>
                          <td className="text-xs border p-1 border-black px-2">
                            7. Back Housing Right
                          </td>
                          <td className="text-xs border p-1 border-black px-2">
                            {tyre.tyre_assign_7_back_housing_right_no || "-"}
                          </td>
                          <td className="text-xs border p-1 border-black text-center">
                            {tyre.tyre_assign_7_back_housing_right_date
                              ? moment(
                                  tyre.tyre_assign_7_back_housing_right_date
                                ).format("DD-MM-YYYY")
                              : "-"}
                          </td>
                          <td className="text-xs border p-1 border-black text-center">
                            {tyre.tyre_assign_7_back_housing_right_km || "-"}
                          </td>
                          <td className="text-xs border p-1 border-black text-center">
                            {tyre.tyre_assign_7_back_housing_right_pre_km ||
                              "-"}
                          </td>
                          <td className="text-xs border p-1 border-black text-center">
                            {tyre.tyre_assign_7_back_housing_right_status ||
                              "-"}
                          </td>
                        </tr>
                      )}
                      {/* //TWELE */}
                      {vehicle.vehicle_type == "10W Truck" && (
                        <tr>
                          <td className="text-xs border p-1 border-black px-2">
                            8. Back Housing Right
                          </td>
                          <td className="text-xs border p-1 border-black px-2">
                            {tyre.tyre_assign_8_back_housing_right_no || "-"}
                          </td>
                          <td className="text-xs border p-1 border-black text-center">
                            {tyre.tyre_assign_8_back_housing_right_date
                              ? moment(
                                  tyre.tyre_assign_8_back_housing_right_date
                                ).format("DD-MM-YYYY")
                              : "-"}
                          </td>
                          <td className="text-xs border p-1 border-black text-center">
                            {tyre.tyre_assign_8_back_housing_right_km || "-"}
                          </td>
                          <td className="text-xs border p-1 border-black text-center">
                            {tyre.tyre_assign_8_back_housing_right_pre_km ||
                              "-"}
                          </td>
                          <td className="text-xs border p-1 border-black text-center">
                            {tyre.tyre_assign_8_back_housing_right_status ||
                              "-"}
                          </td>
                        </tr>
                      )}
                      {/* //THIRTEEN */}
                      {vehicle.vehicle_type == "10W Truck" && (
                        <tr>
                          <td className="text-xs border p-1 border-black px-2">
                            9. Back Dummy Right
                          </td>
                          <td className="text-xs border p-1 border-black px-2">
                            {tyre.tyre_assign_9_back_dummy_right_no || "-"}
                          </td>
                          <td className="text-xs border p-1 border-black text-center">
                            {tyre.tyre_assign_9_back_dummy_right_date
                              ? moment(
                                  tyre.tyre_assign_9_back_dummy_right_date
                                ).format("DD-MM-YYYY")
                              : "-"}
                          </td>
                          <td className="text-xs border p-1 border-black text-center">
                            {tyre.tyre_assign_9_back_dummy_right_km || "-"}
                          </td>
                          <td className="text-xs border p-1 border-black text-center">
                            {tyre.tyre_assign_9_back_dummy_right_pre_km || "-"}
                          </td>
                          <td className="text-xs border p-1 border-black text-center">
                            {tyre.tyre_assign_9_back_dummy_right_status || "-"}
                          </td>
                        </tr>
                      )}
                      {/* //FOURETRENN */}
                      {vehicle.vehicle_type == "10W Truck" && (
                        <tr>
                          <td className="text-xs border p-1 border-black px-2">
                            10. Back Dummy Right
                          </td>
                          <td className="text-xs border p-1 border-black px-2">
                            {tyre.tyre_assign_10_back_dummy_right_no || "-"}
                          </td>
                          <td className="text-xs border p-1 border-black text-center">
                            {tyre.tyre_assign_10_back_dummy_right_date
                              ? moment(
                                  tyre.tyre_assign_10_back_dummy_right_date
                                ).format("DD-MM-YYYY")
                              : "-"}
                          </td>
                          <td className="text-xs border p-1 border-black text-center">
                            {tyre.tyre_assign_10_back_dummy_right_km || "-"}
                          </td>
                          <td className="text-xs border p-1 border-black text-center">
                            {tyre.tyre_assign_10_back_dummy_right_pre_km || "-"}
                          </td>
                          <td className="text-xs border p-1 border-black text-center">
                            {tyre.tyre_assign_10_back_dummy_right_status || "-"}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </>
              ) : (
                <div className="text-center text-gray-500 py-4">
                  No Trip Details Available
                </div>
              )}
            </div>
            <div className="hidden print:block">
              <div className="trademark flex justify-between items-center mt-4 ">
                <h2 className="text-xs font-medium px-1">{ReportTitle}</h2>
                <h2 className="text-xs font-medium px-5">{ReportDate} </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VehicleReportView;
