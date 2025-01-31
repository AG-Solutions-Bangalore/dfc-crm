import React, { useEffect, useMemo, useState } from "react";
import Layout from "../../layout/Layout";
import { IconEdit, IconEye, IconPlus } from "@tabler/icons-react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";
import ViewTrip from "./ViewTrip";
import moment from "moment/moment";
import { MasterTripCreate, MasterTripEdit, MasterTripView } from "../../components/buttonIndex/ButtonComponents";

const TripList = () => {
  const [tripData, setTripData] = useState(null);
  const [tripFooter, setTripFooter] = useState({
    trip_km: "",
    trip_hsd: "",
    trip_hsd_supplied: "",
    trip_advance: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isViewExpanded, setIsViewExpanded] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);

  const fetchTodoData = async () => {
    const data = {
      trip_date_from: localStorage.getItem("trip_date_from"),
      trip_date_to: localStorage.getItem("trip_date_to"),
      trip_branch: localStorage.getItem("trip_branch"),
      trip_driver: localStorage.getItem("trip_driver"),
    };
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BASE_URL}/api/web-fetch-trip-lists`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTripData(response.data?.trip);
      setTripFooter(response.data?.trip_footer);
    } catch (error) {
      console.error("Error fetching trip data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodoData();
  }, []);

  const columns = useMemo(
    () => [
      // {
      //   accessorKey: "trip_date",
      //   header: "Date",
      //   size: 150,
      // },
      {
        accessorKey: "combined3",
        header: "Date/Truck No",
        size: 150,
        accessorFn: (row) => `${row.trip_date} - ${row.trip_vehicle}`,
        Cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="text-black font-semibold text-xs">
              {row.original.trip_date
                ? moment(row.original.trip_date).format("DD-MMM-YYYY")
                : ""}
            </span>

            <span className="text-black text-xs">
              {row.original.trip_vehicle}
            </span>
          </div>
        ),
      },
      // {
      //   accessorKey: "trip_company",
      //   header: "Company",
      //   size: 150,
      // },
      // {
      //   accessorKey: "trip_branch",
      //   header: "Branch",
      //   size: 50,

      // },

      {
        accessorKey: "combined",
        header: "Company/Branch",
        size: 150,
        accessorFn: (row) => `${row.trip_company} - ${row.trip_branch}`,
        Cell: ({ row }) => (
          <div className="flex flex-col text-xs">
            <span className="text-black font-semibold">
              {row.original.trip_company}
            </span>
            <span className="text-black text-xs">
              {row.original.trip_branch}
            </span>
          </div>
        ),
      },
      // {
      //   accessorKey: "trip_vehicle",
      //   header: "Truck No",
      //   size: 50,
      // },
      {
        accessorKey: "trip_driver",
        header: "Driver",
        size: 50,
        Cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="text-black text-xs">
              {row.original.trip_driver}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "trip_agency",
        header: "Agencies",
        size: 50,
        Cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="text-black text-xs">
              {row.original.trip_agency}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "trip_km",
        header: "RT KM",
        size: 50,
        Cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="text-black text-xs">{row.original.trip_km}</span>
          </div>
        ),
      },

      {
        accessorKey: "combined1",
        header: "HSD Fix/Sup",
        size: 150,
        accessorFn: (row) => `${row.trip_hsd} - ${row.trip_hsd_supplied}`,
        Cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="text-black font-semibold text-xs">
              {row.original.trip_hsd}
            </span>
            <span className="text-black text-xs">
              {row.original.trip_hsd_supplied}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "trip_advance",
        header: "Advance",
        size: 50,
        Cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="text-black text-xs">
              {row.original.trip_advance}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "trip_supplier",
        header: "Supplier",
        size: 50,
        Cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="text-black text-xs">
              {row.original.trip_supplier}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "trip_status",
        header: "Status",
        size: 50,
        Cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="text-black text-xs">
              {row.original.trip_status}
            </span>
          </div>
        ),
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
              {/* <div
                onClick={() => navigate(`/edit-trip/${id}`)}
                className="flex items-center space-x-2"
                title="Edit"
              >
                <IconEdit className="h-5 w-5 text-blue-500 cursor-pointer " />
              </div> */}
              <MasterTripEdit
               onClick={() => navigate(`/edit-trip/${id}`)}
                className="flex items-center space-x-2"
              
              />
              {/* <div
                onClick={() => {
                  setSelectedVehicleId(id);
                  setIsViewExpanded(true);
                }}
                className="flex items-center space-x-2"
                title="View"
              >
                <IconEye className="h-5 w-5 text-blue-500 cursor-pointer" />
              </div> */}
              <MasterTripView
                 onClick={() => {
                  setSelectedVehicleId(id);
                  setIsViewExpanded(true);
                }}
                className="flex items-center space-x-2"
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
    data: tripData || [],
    enableFullScreenToggle: false,
    enableDensityToggle: false,
    enableColumnActions: false,
    enableHiding: false,
    enableStickyHeader: true,
    enableStickyFooter: true,
    mantineTableContainerProps: { sx: { maxHeight: "400px" } },

    initialState: { columnVisibility: { address: false } },
  });

  return (
    <Layout>
      <div className="max-w-screen">
        <div className="bg-white p-4 mb-4 rounded-lg shadow-md">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
            <h1 className="border-b-2 font-[400] border-dashed border-orange-800 text-center md:text-left">
              Trip List
            </h1>
            <div className="flex gap-2">
              {/* <button
                className=" flex flex-row items-center gap-1 text-center text-sm font-[400] cursor-pointer  w-[5rem] text-white bg-blue-600 hover:bg-red-700 p-2 rounded-lg shadow-md"
                onClick={() => navigate(`/createTrip`)}
              >
                <IconPlus className="w-4 h-4" /> Trip
              </button> */}
              <MasterTripCreate
                className=" flex flex-row items-center gap-1 text-center text-sm font-[400] cursor-pointer  w-[5rem] text-white bg-blue-600 hover:bg-red-700 p-2 rounded-lg shadow-md"
                onClick={() => navigate(`/createTrip`)}
              
              />
            </div>
          </div>
        </div>
        <div className="bg-white p-4  rounded-t-lg shadow-md">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
            <h1 className="border-b-2 font-[400] border-dashed border-orange-800 text-center md:text-left">
              RT KM :{tripFooter?.trip_km}
            </h1>
            <h1 className="border-b-2 font-[400] border-dashed border-orange-800 text-center md:text-left">
              HSD Fixed : {tripFooter?.trip_hsd}
            </h1>
            <h1 className="border-b-2 font-[400] border-dashed border-orange-800 text-center md:text-left">
              HSD Supplied: {tripFooter?.trip_hsd_supplied}
            </h1>
            <h1 className="border-b-2 font-[400] border-dashed border-orange-800 text-center md:text-left">
              Advance :{tripFooter?.trip_advance}
            </h1>
          </div>
        </div>

        <div className=" flex w-full mt-2  gap-2 relative ">
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
              <ViewTrip tripId={selectedVehicleId} />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TripList;
