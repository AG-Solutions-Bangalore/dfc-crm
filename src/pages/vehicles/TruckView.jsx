import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../layout/Layout";
import {
  IconArrowBack,
  IconChevronRight,
  IconEdit,
  IconEditCircle,
  IconInfoCircle,
  IconMessageCircle,
  IconPhoto,
  IconPrinter,
  IconSettings,
} from "@tabler/icons-react";
import { useReactToPrint } from "react-to-print";
import moment from "moment";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";
import { Tabs } from "@mantine/core";

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

  const [vehicle, setVehicle] = useState({}); //first one
  const [service, setService] = useState([]); //secodn one
  const [trip, setTrip] = useState({}); // third one
  const [tyre, setTyre] = useState({}); //last one
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("info");

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

  useEffect(() => {
    const fetchTyreDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/fetch-vehicle-detail-id/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setVehicle(response.data.vehicle);
        setService(response.data.fullservices);
        setTrip(response.data.trip);
        setTyre(response.data.vehiceltyresub);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching Vechile View details:", error);
        setLoading(false);
      }
    };

    fetchTyreDetails();
  }, [id]);

 
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
                    Modal Year
                  </td>
                  <td className="text-xs">{vehicle?.mfg_year}</td>
                </tr>
                <tr className="border-b">
                  <td className="font-semibold w-1/3 text-xs print:py-0 py-2">
                    Vechile KM
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

  const serviceInfo = () => {
    return (
      <>
        {service.length > 0 && (
          <div className="mt-2">
            <h3 className="text-lg font-semibold mb-2 text-center">Service</h3>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border py-2 text-xs">Services</th>
                  <th className="border py-2 text-xs">Date</th>
                  <th className="border py-2 text-xs">KM</th>
                  <th className="border py-2 text-xs">Present Date</th>
                  <th className="border py-2 text-xs">Present KM</th>
                  <th className="border py-2 text-xs">Difference KM</th>
                  <th className="border py-2 text-xs print:hidden">Action</th>
                </tr>
              </thead>
              <tbody>
                {/* left  */}
                {service?.map((item, key) => (
                  <tr key={key} className="text-center">
                    <td className="border py-2 text-xs">
                      {item?.service_sub_type}
                    </td>
                    <td className="border py-2 text-xs">
                      {item?.service_sub_date}
                    </td>
                    <td className="border py-2 text-xs">
                      {item?.service_sub_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {item?.service_sub_pre_date}
                    </td>
                    <td className="border py-2 text-xs">
                      {item?.service_sub_pre_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {item?.service_sub_pre_km - item?.service_sub_km}
                    </td>

                    <td className="border py-0 text-xs print:hidden">
                      <button
                        onClick={()=>{
                            navigate(`/spkm/${item.id}`)
                            localStorage.setItem("spkmId",id)
                    }}
                        title="change present km"
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <IconEditCircle size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {service.length > 0 && (
          <div className="mt-2">
            <div className="overflow-x-auto ">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {service.map((dataSumm, index) => (
                  <div
                    key={index}
                    className="border border-gray-300  rounded-lg p-1 text-center shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="font-[500] text-xs">
                      <p className="">{dataSumm.service_sub_type}</p>
                      <p className="text-gray-600 ">
                        {moment(dataSumm.service_sub_date).format("DD-MM-YYYY")}
                      </p>
                      <p className="text-black font-semibold">
                        {dataSumm.service_sub_km}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {service.length <= 0 && (
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
                    <td className="border py-2 text-xs ">{item?.trip_date}</td>
                    <td className="border py-2 text-xs ">
                      {item?.trip_agency}
                    </td>
                    <td className="border py-2 text-xs">{item?.trip_km}</td>
                    <td className="border py-2 text-xs">
                      {item?.trip_supplier}
                    </td>
                    <td className="border py-2 text-xs ">{item?.trip_hsd}</td>
                    <td className="border py-2 text-xs ">
                      {item?.trip_hsd_supplied}
                    </td>
                    <td className="border py-2 text-xs ">
                      {item?.trip_driver}
                    </td>
                    <td className="border py-2  text-xs ">
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
            <h3 className="text-lg font-semibold mb-2 text-center">Tyre</h3>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border py-2 text-xs">Tyre Position</th>
                  <th className="border py-2 text-xs">Tyre No</th>
                  <th className="border py-2 text-xs">Date</th>
                  <th className="border py-2 text-xs">KM</th>
                  <th className="border py-2 text-xs">Present Date</th>
                  <th className="border py-2 text-xs">Present KM</th>
                  <th className="border py-2 text-xs">Difference KM</th>
                  <th className="border py-2 text-xs">Status</th>
                </tr>
              </thead>
              <tbody>
                {/* left  */}
                {vehicle?.vehicle_type != "Other" && (
                  <tr className="text-center">
                    <td className="border py-2 text-xs">1.Front Left</td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_1_front_left_no}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_1_front_left_date}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_1_front_left_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_1_front_left_pre_date}
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
                  </tr>
                )}
                {/* right  */}
                {vehicle.vehicle_type != "Other" && (
                  <tr className="text-center">
                    <td className="border py-2 text-xs">2.Front Right</td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_2_front_right_no}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_2_front_right_date}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_2_front_right_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_2_front_right_pre_date}
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
                  </tr>
                )}

                {/* 6w truck 1 back left */}
                {vehicle.vehicle_type == "6W Truck" && (
                  <tr className="text-center">
                    <td className="border py-2 text-xs">3. Back Left</td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_3_back_left_no}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_3_back_left_date}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_3_back_left_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_3_back_left_pre_date}
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
                  </tr>
                )}
                {/* 6w truck 2 back left */}
                {vehicle.vehicle_type == "6W Truck" && (
                  <tr className="text-center">
                    <td className="border py-2 text-xs">4. Back Left</td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_4_back_left_no}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_4_back_left_date}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_4_back_left_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_4_back_left_pre_date}
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
                  </tr>
                )}
                {/* 6w truck 3 back right  */}
                {vehicle.vehicle_type == "6W Truck" && (
                  <tr className="text-center">
                    <td className="border py-2 text-xs">5. Back Right</td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_5_back_right_no}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_5_back_right_date}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_5_back_right_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_5_back_right_pre_date}
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
                  </tr>
                )}
                {/* 6w truck 4 back right  */}
                {vehicle.vehicle_type == "6W Truck" && (
                  <tr className="text-center">
                    <td className="border py-2 text-xs">6. Back Right</td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_6_back_right_no}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_6_back_right_date}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_6_back_right_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_6_back_right_pre_date}
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
                  </tr>
                )}

                {/* 10w truck 1 back housing  left  */}
                {vehicle.vehicle_type == "10W Truck" && (
                  <tr className="text-center">
                    <td className="border py-2 text-xs">
                      3. Back Housing Left
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_3_back_housing_left_no}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_3_back_housing_left_date}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_3_back_housing_left_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_3_back_housing_left_pre_date}
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
                  </tr>
                )}

                {/* 10w truck 2 back housing  left  */}
                {vehicle.vehicle_type == "10W Truck" && (
                  <tr className="text-center">
                    <td className="border py-2 text-xs">
                      4. Back Housing Left
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_4_back_housing_left_no}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_4_back_housing_left_date}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_4_back_housing_left_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_4_back_housing_left_pre_date}
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
                  </tr>
                )}

                {/* 10w truck 3 back dummy  left  */}
                {vehicle.vehicle_type == "10W Truck" && (
                  <tr className="text-center">
                    <td className="border py-2 text-xs">5. Back Dummy Left</td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_5_back_dummy_left_no}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_5_back_dummy_left_date}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_5_back_dummy_left_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_5_back_dummy_left_pre_date}
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
                  </tr>
                )}
                {/* 10w truck 4 back dummy  left  */}
                {vehicle.vehicle_type == "10W Truck" && (
                  <tr className="text-center">
                    <td className="border py-2 text-xs">6. Back Dummy Left</td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_6_back_dummy_left_no}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_6_back_dummy_left_date}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_6_back_dummy_left_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_6_back_dummy_left_pre_date}
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
                  </tr>
                )}

                {/* 10w truck 5 back Housing  Right  */}
                {vehicle.vehicle_type == "10W Truck" && (
                  <tr className="text-center">
                    <td className="border py-2 text-xs">
                      7. Back Housing Right
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_7_back_housing_right_no}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_7_back_housing_right_date}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_7_back_housing_right_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_7_back_housing_right_pre_date}
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
                  </tr>
                )}

                {/* 10w truck 6 back Housing  Right  */}
                {vehicle.vehicle_type == "10W Truck" && (
                  <tr className="text-center">
                    <td className="border py-2 text-xs">
                      8. Back Housing Right
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_8_back_housing_right_no}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_8_back_housing_right_date}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_8_back_housing_right_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_8_back_housing_right_pre_date}
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
                  </tr>
                )}
                {/* 10w truck 7 back Dummy Right  */}
                {vehicle.vehicle_type == "10W Truck" && (
                  <tr className="text-center">
                    <td className="border py-2 text-xs">9. Back Dummy Right</td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_9_back_dummy_right_no}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_9_back_dummy_right_date}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_9_back_dummy_right_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_9_back_dummy_right_pre_date}
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
                  </tr>
                )}
                {/* 10w truck 8 back Dummy Right  */}
                {vehicle.vehicle_type == "10W Truck" && (
                  <tr className="text-center">
                    <td className="border py-2 text-xs">
                      10. Back Dummy Right
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_10_back_dummy_right_no}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_10_back_dummy_right_date}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_10_back_dummy_right_km}
                    </td>
                    <td className="border py-2 text-xs">
                      {tyre?.tyre_assign_10_back_dummy_right_pre_date}
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
  const handleTabChange = (value) => {
    setActiveTab(value);
  };
  const renderContent = () => {
    switch (activeTab) {
      case "info":
        return vechileInfo();

      case "service":
        return serviceInfo();

      case "trip":
        return tripInfo();
      case "tyre":
        return tyreInfo();

      default:
        return null;
    }
  };

  if (loading) return <SkeletonLoader />;

  return (
    <Layout>
      <div className="bg-[#FFFFFF]  p-2 rounded-lg">
        <div className="sticky top-0 p-2  mb-4 border-b-2 border-red-500 rounded-lg  bg-[#E1F5FA] ">
          <h2 className="px-5 text-black text-lg flex flex-row justify-between items-center rounded-xl p-2">
            <div className="flex items-center gap-2">
              <IconInfoCircle className="w-4 h-4" />
              <span>Vechile Details </span>
            </div>
            <div className="flex items-center space-x-4">
              <IconPrinter
                className="cursor-pointer text-gray-600 hover:text-blue-600"
                onClick={handlePrint}
                title="Print"
              />
              <IconArrowBack
                className="cursor-pointer text-gray-600 hover:text-red-600"
                onClick={() => navigate("/vechiles-list")}
                title="Go Back"
              />
            </div>
          </h2>
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
                <Tabs.Tab value="info" icon={<IconPhoto size={16} />}>
                  Vehicle Info
                </Tabs.Tab>
                <Tabs.Tab
                  value="service"
                  icon={<IconMessageCircle size={16} />}
                >
                  Service
                </Tabs.Tab>
                <Tabs.Tab value="trip" icon={<IconSettings size={16} />}>
                  Trip
                </Tabs.Tab>
                <Tabs.Tab value="tyre" icon={<IconSettings size={16} />}>
                  Tyre
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
  );
};

export default TruckView;
