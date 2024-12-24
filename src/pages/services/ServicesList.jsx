import React, { useEffect, useMemo, useState } from "react";
import Layout from "../../layout/Layout";
import { IconEdit, IconEye, IconPlus } from "@tabler/icons-react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";
import moment from "moment/moment";

const ServicesList = () => {
  const [serviceData, setServiceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchServiceData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/web-fetch-services-list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setServiceData(response.data?.services);
    } catch (error) {
      console.error("Error fetching Service data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceData();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "service_date",
        header: "Date",
        size: 150,

        Cell: ({ row }) => {
          const date = row.original.service_date;
          return date ? moment(date).format("DD-MMM-YYYY") : "";
        },
      },
      // {
      //   accessorKey: "service_truck_no",
      //   header: "Truck No",
      //   size: 150,
      // },
      {
        accessorKey: "combined",
        header: "Truck No & Company",
        size: 150,
        accessorFn: (row) => `${row.service_truck_no} - ${row.service_company}`,
        Cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="text-black font-semibold">
              {row.original.service_truck_no}
            </span>
            <span className="text-black ">{row.original.service_company} </span>
          </div>
        ),
      },
      // {
      //   accessorKey: "service_company",
      //   header: "Company",
      //   size: 50,
      // },
      {
        accessorKey: "service_garage",
        header: "Garage",
        size: 150,
      },
      {
        accessorKey: "service_km",
        header: "Km",
        size: 50,
      },
      {
        accessorKey: "service_amount",
        header: "Total Amount",
        size: 50,
        Cell: ({ row }) => {
          const amount = row.original.service_amount;

          return <span>&#8377; {amount}</span>;
        },
      },
      {
        accessorKey: "service_count",
        header: "No of Change",
        size: 50,
      },
      {
        accessorKey: "service_status",
        header: "Status",
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
              <div
                onClick={() => navigate(`/service-edit/${id}`)}
                className="flex items-center space-x-2"
                title="Edit"
              >
                <IconEdit className="h-5 w-5 text-blue-500 cursor-pointer" />
              </div>
              <div
                onClick={() => navigate(`/service-view/${id}`)}
                className="flex items-center space-x-2"
                title="View"
              >
                <IconEye className="h-5 w-5 text-blue-500 cursor-pointer" />
              </div>
            </div>
          );
        },
      },
    ],
    []
  );

  const table = useMantineReactTable({
    columns,
    data: serviceData || [],
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
              Service List
            </h1>
            <div className="flex gap-2">
              <button
                onClick={() => navigate("/createService")}
                className=" flex flex-row items-center gap-1 text-center text-sm font-[400] cursor-pointer  w-[7rem] text-white bg-blue-600 hover:bg-red-700 p-2 rounded-lg shadow-md"
              >
                <IconPlus className="w-4 h-4" /> Service
              </button>
            </div>
          </div>
        </div>

        <div className=" shadow-md">
          <MantineReactTable table={table} />
        </div>
      </div>
    </Layout>
  );
};

export default ServicesList;
