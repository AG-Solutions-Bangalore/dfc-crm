import { Tooltip } from "@mantine/core";
import axios from "axios";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../base/BaseUrl";
import {
  VechilesCreate,
  VechilesCreateTyre,
  VechilesEdit,
  VechilesTruck,
  VechilesView,
} from "../../components/buttonIndex/ButtonComponents";
import { CreateButton } from "../../components/common/ButtonColors";
import { encryptId } from "../../components/common/EncryptionDecryption";
import Layout from "../../layout/Layout";
import PartialVechileView from "./PartialVechileView";

const VehiclesList = () => {
  const [vehiclesData, setVehiclesData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Active");
  const [isViewExpanded, setIsViewExpanded] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);

  const fetchVehiclesData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/web-fetch-vehicles-list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setVehiclesData(response.data?.vehicles);
    } catch (error) {
      console.error("Error fetching Vechiles data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehiclesData();
  }, []);

  const getStatusColor = (dueDate) => {
    const currentDate = moment();
    const dueDateObj = moment(dueDate);
    if (dueDateObj.isSameOrBefore(currentDate)) {
      return "red";
    }
    const oneMonthAfter = moment(currentDate).add(1, "month");
    if (dueDateObj.isBetween(currentDate, oneMonthAfter)) {
      return "orange";
    }
    return "green";
  };

  const filteredVehiclesData = useMemo(() => {
    if (!vehiclesData) return [];
    return vehiclesData.filter(
      (vehicle) => vehicle.vehicle_status === activeTab
    );
  }, [vehiclesData, activeTab]);
  const columns = useMemo(
    () => [
      // {
      //   accessorKey: "reg_no",
      //   header: "Register No",
      //   size:150,

      // },
      // {
      //   accessorKey: "vehicle_type",
      //   header: "Vehicle Type",
      //   size: 150,
      // },
      {
        accessorKey: "combined",
        header: "Register No & V Type",
        size: 180,
        accessorFn: (row) => `${row.reg_no} - ${row.vehicle_type}`,
        Cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="text-black font-bold">{row.original.reg_no}</span>
            <span>{row.original.vehicle_type}</span>
          </div>
        ),
      },
      // {
      //   accessorKey: "vehicle_company",
      //   header: "Company",
      //   size: 50,
      // },
      // {
      //   accessorKey: "vehicle_branch",
      //   header: "Branch",
      //   size: 150,
      // },
      {
        accessorKey: "combined2",
        header: "Branch & Company",
        size: 200,
        accessorFn: (row) => `${row.vehicle_branch} - ${row.vehicle_company}`,
        Cell: ({ row }) => (
          <div className="flex flex-col">
            <span>{row.original.vehicle_branch}</span>
            <span>{row.original.vehicle_company}</span>
          </div>
        ),
      },
      {
        accessorKey: "mfg_year",
        header: "Modal Year",
        size: 50,
      },
      // {
      //   accessorKey: "ins_due",
      //   header: "Insu Due",
      //   size: 50,
      // },
      // {
      //   accessorKey: "permit_due",
      //   header: "Permit Due",
      //   size: 50,
      // },

      // {
      //   accessorKey: "fc_due",
      //   header: "FC Due",
      //   size: 50,
      // },
      {
        accessorKey: "combined_status",
        header: "Insu/Per /FC",
        size: 150,
        Cell: ({ row }) => {
          const { ins_due, permit_due, fc_due } = row.original;

          return (
            <div className="flex flex-row items-center gap-2 ">
              <div className="flex items-center ">
                <Tooltip
                  label={`Insurance Due: ${moment(ins_due).format(
                    "DD-MM-YYYY"
                  )}`}
                  withArrow
                >
                  <span
                    className={`h-3 w-3 rounded-full 
                    ${
                      getStatusColor(ins_due) == "red"
                        ? "bg-red-500"
                        : getStatusColor(ins_due) == "orange"
                        ? "bg-orange-500"
                        : "bg-green-500"
                    }`}
                  />
                </Tooltip>
              </div>
              <div className="flex items-center">
                <Tooltip
                  label={`Permit Due: ${moment(permit_due).format(
                    "DD-MM-YYYY"
                  )}`}
                  withArrow
                >
                  <span
                    className={`h-3 w-3 rounded-full 
                    ${
                      getStatusColor(permit_due) == "red"
                        ? "bg-red-500"
                        : getStatusColor(permit_due) == "orange"
                        ? "bg-orange-500"
                        : "bg-green-500"
                    }`}
                  />
                </Tooltip>
              </div>
              <div className="flex items-center ">
                <Tooltip
                  label={`FC Due: ${moment(fc_due).format("DD-MM-YYYY")}`}
                  withArrow
                >
                  <span
                    className={`h-3 w-3 rounded-full 
                    ${
                      getStatusColor(fc_due) == "red"
                        ? "bg-red-500"
                        : getStatusColor(fc_due) == "orange"
                        ? "bg-orange-500"
                        : "bg-green-500"
                    }`}
                  />
                </Tooltip>
              </div>
            </div>
          );
        },
      },
      // {
      //   accessorKey: "vehicle_status",
      //   header: "Status",
      //   size: 50,
      // },
      {
        accessorKey: "created_by",
        header: "Created By",
        size: 50,
      },
      {
        accessorKey: "updated_by",
        header: "Update By",
        size: 50,
      },
      {
        id: "id",
        header: "Action",
        size: 20,
        enableHiding: false,
        Cell: ({ row }) => {
          const id = row.original.id;

          return (
            <div className="flex gap-2">
              
              <VechilesView
                onClick={() => {
                  setSelectedVehicleId(id);
                  setIsViewExpanded(true);
                }}
                className="flex items-center space-x-2"
              />

              <VechilesEdit
                className="flex items-center space-x-2"
                onClick={() => {
                  const encryptedId = encryptId(id);

                  navigate(`/vechile-edit/${encodeURIComponent(encryptedId)}`);
                }}
              />

           

              <VechilesTruck
                className="flex items-center space-x-2"
                onClick={() => {
                  const encryptedId = encryptId(id);

                  navigate(
                    `/truckdetails-viewall/${encodeURIComponent(encryptedId)}`
                  );
                }}
              />
            </div>
          );
        },
      },
    ],
    []
  );


  const table = useMantineReactTable({
    columns,
    data: filteredVehiclesData || [],
    enableFullScreenToggle: false,
    enableDensityToggle: false,
    enableColumnActions: false,
    enableHiding: false,
    enableStickyHeader: true,
    enableStickyFooter: true,
    mantineTableContainerProps: { sx: { maxHeight: "400px" } },
  });

  return (
    <Layout>
      <div className="max-w-screen">
        <div className="bg-white p-4 mb-4 rounded-lg shadow-md">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
            <h1 className="border-b-2 font-[400] border-dashed border-orange-800 text-center md:text-left">
              Vehicles List
            </h1>
            <div className="flex flex-row items-center gap-2">
         

              <VechilesCreate
                onClick={() => navigate("/createVechiles")}
                className={CreateButton}
              />
      

              <VechilesCreateTyre
                onClick={() => navigate("/createTyre")}
                className={CreateButton}
              />
              <div className="flex justify-center ">
                <div className="inline-flex bg-gray-200 border border-gray-500 rounded-lg shadow-md">
                  <button
                    onClick={() => setActiveTab("Active")}
                    className={`
          px-4 py-2 w-[6rem] text-sm font-[400] rounded-lg transition-all duration-300 ease-in-out
          ${
            activeTab === "Active"
              ? "bg-blue-600 text-white shadow-md"
              : "text-gray-700 hover:bg-gray-300"
          }
        `}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => setActiveTab("Inactive")}
                    className={`
          px-4 py-2 w-[6rem] text-sm font-[400] rounded-lg transition-all duration-300 ease-in-out
          ${
            activeTab === "Inactive"
              ? "bg-blue-600 text-white shadow-md"
              : "text-gray-700 hover:bg-gray-300"
          }
        `}
                  >
                    Inactive
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* layout change  */}
        <div className=" flex w-full  gap-2 relative ">
          <div
            className={`
            ${isViewExpanded ? "w-[70%]" : "w-full"} 
            transition-all duration-300 ease-in-out  
            pr-4
          `}
          >
            <MantineReactTable table={table} />
          </div>

          {isViewExpanded && (
            <div
              className={`
                      w-[30%] 
                       p-4
                      border-l 
                      border-red-400
                      transition-all 
                      duration-300 
                      ease-in-out 
                      absolute 
                      right-0
                      
                     
                    
                      ${
                        isViewExpanded
                          ? "opacity-100 translate-x-0"
                          : "opacity-0 translate-x-full"
                      }
                    `}
            >
              <div className="flex justify-end ml-2 ">
                <button
                  title="close"
                  className="text-black font-[700] cursor-pointer hover:text-red-900"
                  onClick={() => {
                    setIsViewExpanded(false);
                    setSelectedVehicleId(null);
                  }}
                >
                  ✕
                </button>
              </div>
              <PartialVechileView vehicleId={selectedVehicleId} />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default VehiclesList;
