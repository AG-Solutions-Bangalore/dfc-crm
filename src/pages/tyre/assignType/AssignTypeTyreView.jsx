import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  IconInfoCircle,
  IconArrowBack,
  IconPrinter,
} from "@tabler/icons-react";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import Layout from "../../../layout/Layout";
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import { decryptId } from "../../../components/common/EncryptionDecryption";

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

const AssignTypeTyreView = () => {
  const { id } = useParams();
  const decryptedId = decryptId(id);

  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState({});
  const [tyre, setTyre] = useState({});
  const [loading, setLoading] = useState(true);
  const componentRef = React.useRef();

  // Print handler using react-to-print
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: `
      @page {
          size: A4;
          margin: 2mm;
      }
      @media print {
          body {
              margin: 0;
              font-size: 12px; 
               
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

  useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        const token = localStorage.getItem("token");

        const vehicleResponse = await axios.get(
          `${BASE_URL}/api/web-fetch-tyre-vehicle-by/${decryptedId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setVehicle(vehicleResponse.data.vehicles);

        // Fetch tyre data using vehicle registration number
        const tyreResponse = await axios.get(
          `${BASE_URL}/api/web-fetch-vehicles-tyre-sub/${vehicleResponse.data.vehicles.reg_no}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setTyre(tyreResponse.data.vehiceltyresub);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchVehicleData();
  }, [id, navigate]);

  // const renderTyreRows = () => {
  //   const vehicleType = vehicle.vehicle_type;
  //   const tyreData = tyre;

  //   const tyrePositions = {
  //     Other: [
  //       { position: "1. Front Left", prefix: "tyre_assign_1_front_left" },
  //       { position: "2. Front Right", prefix: "tyre_assign_2_front_right" },
  //     ],
  //     "6W Truck": [
  //       { position: "1. Front Left", prefix: "tyre_assign_1_front_left" },
  //       { position: "2. Front Right", prefix: "tyre_assign_2_front_right" },
  //       { position: "3. Back Left", prefix: "tyre_assign_3_back_left" },
  //       { position: "4. Back Left", prefix: "tyre_assign_4_back_left" },
  //       { position: "5. Back Right", prefix: "tyre_assign_5_back_right" },
  //       { position: "6. Back Right", prefix: "tyre_assign_6_back_right" },
  //     ],
  //     "10W Truck": [
  //       { position: "1. Front Left", prefix: "tyre_assign_1_front_left" },
  //       { position: "2. Front Right", prefix: "tyre_assign_2_front_right" },
  //       {
  //         position: "3. Back Housing Left",
  //         prefix: "tyre_assign_3_back_housing_left",
  //       },
  //       {
  //         position: "4. Back Housing Left",
  //         prefix: "tyre_assign_4_back_housing_left",
  //       },
  //       {
  //         position: "5. Back Dummy Left",
  //         prefix: "tyre_assign_5_back_dummy_left",
  //       },
  //       {
  //         position: "6. Back Dummy Left",
  //         prefix: "tyre_assign_6_back_dummy_left",
  //       },
  //       {
  //         position: "7. Back Housing Right",
  //         prefix: "tyre_assign_7_back_housing_right",
  //       },
  //       {
  //         position: "8. Back Housing Right",
  //         prefix: "tyre_assign_8_back_housing_right",
  //       },
  //       {
  //         position: "9. Back Dummy Right",
  //         prefix: "tyre_assign_9_back_dummy_right",
  //       },
  //       {
  //         position: "10. Back Dummy Right",
  //         prefix: "tyre_assign_10_back_dummy_right",
  //       },
  //     ],
  //   };

  //   const positionsToRender = tyrePositions[vehicleType] || [];

  //   return positionsToRender.map((tyre, index) => (
  //     <tr key={index} className="border border-gray-300">
  //       <td className="p-2 border border-gray-300">{tyre.position}</td>
  //       <td className="p-2 border border-gray-300">
  //         {tyreData[`${tyre.prefix}_no`] || "-"}
  //       </td>

  //       <td className="p-2 border border-gray-300">
  //         {tyreData[`${tyre.prefix}_date`]
  //           ? moment(tyreData[`${tyre.prefix}_date`]).format("DD-MM-YYYY")
  //           : "-"}
  //       </td>
  //       <td className="p-2 border border-gray-300">
  //         {tyreData[`${tyre.prefix}_km`] || "-"}
  //       </td>
  //       <td className="p-2 border border-gray-300">
  //         {tyreData[`${tyre.prefix}_pre_km`] || "-"}
  //       </td>
  //       <td className="p-2 border border-gray-300">
  //         {tyreData[`${tyre.prefix}_status`] || "-"}
  //       </td>
  //     </tr>
  //   ));
  // };
  const renderTyreRows = () => {
    const vehicleType = vehicle.vehicle_type;
    const tyreData = tyre;

    const tyrePositions = {
      Other: [
        { position: "1. Front Left", prefix: "tyre_assign_1_front_left" },
        { position: "2. Front Right", prefix: "tyre_assign_2_front_right" },
        { position: "3. Stephany Tyre", prefix: "tyre_assign_stepney_no" },
      ],
      "6W Truck": [
        { position: "1. Front Left", prefix: "tyre_assign_1_front_left" },
        { position: "2. Front Right", prefix: "tyre_assign_2_front_right" },
        { position: "3. Back Left", prefix: "tyre_assign_3_back_left" },
        { position: "4. Back Left", prefix: "tyre_assign_4_back_left" },
        { position: "5. Back Right", prefix: "tyre_assign_5_back_right" },
        { position: "6. Back Right", prefix: "tyre_assign_6_back_right" },
        { position: "7. Stephany Tyre", prefix: "tyre_assign_stepney_no" },
      ],
      "10W Truck": [
        { position: "1. Front Left", prefix: "tyre_assign_1_front_left" },
        { position: "2. Front Right", prefix: "tyre_assign_2_front_right" },
        {
          position: "3. Back Housing Left",
          prefix: "tyre_assign_3_back_housing_left",
        },
        {
          position: "4. Back Housing Left",
          prefix: "tyre_assign_4_back_housing_left",
        },
        {
          position: "5. Back Dummy Left",
          prefix: "tyre_assign_5_back_dummy_left",
        },
        {
          position: "6. Back Dummy Left",
          prefix: "tyre_assign_6_back_dummy_left",
        },
        {
          position: "7. Back Housing Right",
          prefix: "tyre_assign_7_back_housing_right",
        },
        {
          position: "8. Back Housing Right",
          prefix: "tyre_assign_8_back_housing_right",
        },
        {
          position: "9. Back Dummy Right",
          prefix: "tyre_assign_9_back_dummy_right",
        },
        {
          position: "10. Back Dummy Right",
          prefix: "tyre_assign_10_back_dummy_right",
        },
        { position: "11. Stephany Tyre", prefix: "tyre_assign_stepney_no" },
      ],
    };

    const positionsToRender = tyrePositions[vehicleType] || [];

    return positionsToRender.map((tyre, index) => {
      const no = tyreData[`${tyre.prefix}_no`] || "-";
      const date = tyreData[`${tyre.prefix}_date`]
        ? moment(tyreData[`${tyre.prefix}_date`]).format("DD-MM-YYYY")
        : "-";
      const km = parseInt(tyreData[`${tyre.prefix}_km`] || 0);
      const preKm = parseInt(tyreData[`${tyre.prefix}_pre_km`] || 0);
      const differenceKm = preKm - km;
      const type = tyreData[`${tyre.prefix}_type`] || "-";
      const make = tyreData[`${tyre.prefix}_make`] || "-";
      const status = tyreData[`${tyre.prefix}_status`] || "-";

      return (
        <tr key={index} className="border border-gray-300">
          <td className="p-2 border border-gray-300">{tyre.position}</td>
          <td className="p-2 border border-gray-300">{no}</td>
          <td className="p-2 border border-gray-300">{type}</td>
          <td className="p-2 border border-gray-300">{make}</td>
          <td className="p-2 border border-gray-300">{date}</td>
          <td className="p-2 border border-gray-300">{km || "-"}</td>
          <td className="p-2 border border-gray-300">{preKm || "-"}</td>
          <td className="p-2 border border-gray-300">
            {differenceKm || "-"}
          </td>
          <td className="p-2 border border-gray-300">{status}</td>
        </tr>
      );
    });
  };

  if (loading) {
    return <SkeletonLoading />;
  }

  return (
    <Layout>
      <div className=" bg-[#FFFFFF] p-2  rounded-lg  ">
        <div className="sticky top-0 p-2  mb-4 border-b-2 border-red-500 rounded-lg  bg-[#E1F5FA] ">
          <h2 className=" px-5 text-[black] text-lg   flex flex-row  justify-between items-center  rounded-xl p-2 ">
            <div className="flex  items-center gap-2">
              <IconInfoCircle className="w-4 h-4" />
              <span>
                Stock Tyre Vehicle View -{" "}
                <span className="font-bold">({vehicle?.reg_no})</span>{" "}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <IconPrinter
                className="cursor-pointer text-gray-600 hover:text-blue-600"
                onClick={handlePrint}
                title="Print"
              />
              <IconArrowBack
                className="cursor-pointer text-gray-600 hover:text-red-600"
                onClick={() => navigate("/tyre/assign-list")}
                title="Go Back"
              />
            </div>
          </h2>
        </div>
        <div ref={componentRef}>
          <h3 className="text-xl font-bold mb-2 text-center hidden print:block">
            Stock Tyre Vehicle View - ({vehicle?.reg_no})
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <table className="w-full">
                <tbody>
                  {[
                    { label: "Branch", value: vehicle.vehicle_branch },
                    { label: "Company", value: vehicle.vehicle_company },
                    { label: "Vehicle Type", value: vehicle.vehicle_type },
                    { label: "Model Year", value: vehicle.mfg_year },
                    { label: "Open KM", value: vehicle.vehicle_open_km },
                    { label: "Open HSD", value: vehicle.vehicle_hsd_open },
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
                    { label: "Mileage", value: vehicle.vehicle_mileage },
                    {
                      label: "Driver",
                      value: `${vehicle.vehicle_driver} - ${vehicle.vehicle_driver_no}`,
                    },
                    {
                      label: "No of Cylinder",
                      value: vehicle.no_of_gas_cylinder,
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
          <div className="mb-4">
            <h3 className="text-xl font-bold mb-2 text-center">Tyre Details</h3>
            {tyre && Object.keys(tyre).length > 0 ? (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    {[
                      "Tyre Position",
                      "Tyre No",
                      "Tyre",
                      "Make",
                      "Date",
                      "KM",
                      "Present KM",
                      "Differnce KM",
                      "Status",
                    ].map((header) => (
                      <th key={header} className="p-2 border border-gray-300">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>{renderTyreRows()}</tbody>
              </table>
            ) : (
              <div className="text-center text-gray-500 py-4">
                No Tyre Data Available
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AssignTypeTyreView;
