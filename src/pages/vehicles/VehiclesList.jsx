import React, { useEffect, useMemo, useState } from 'react'
import Layout from "../../layout/Layout"
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../../base/BaseUrl';
import { IconEdit, IconEye, IconPlus, IconTruck } from '@tabler/icons-react';
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
const VehiclesList = () => {
  const [vehiclesData, setVehiclesData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();



  const fetchVehiclesData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/web-fetch-vehicles-list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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

  const columns = useMemo(
    () => [
      {
        accessorKey: "reg_no",
        header: "Register No",
        size:150,
       
      },
      {
        accessorKey: "vehicle_type",
        header: "Vehicle Type",
        size: 150,
      },
      {
        accessorKey: "vehicle_company",
        header: "Company",
        size: 50,
      },
      {
        accessorKey: "vehicle_branch",
        header: "Branch",
        size: 150,
      },
      {
        accessorKey: "mfg_year",
        header: "Modal Year",
        size: 50,
      },
      {
        accessorKey: "ins_due",
        header: "Insu Due",
        size: 50,
      },
      {
        accessorKey: "permit_due",
        header: "Permit Due",
        size: 50,
      },
      {
        accessorKey: "fc_due",
        header: "FC Due",
        size: 50,
      },
      {
        accessorKey: "vehicle_status",
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
                // onClick={toggleViewerDrawer(true, id)}
                className="flex items-center space-x-2"
                title="Edit"
              >
                <IconEdit className="h-5 w-5 text-blue-500 cursor-pointer" />
              </div>
              <div
                // onClick={toggleViewerDrawer(true, id)}
                className="flex items-center space-x-2"
                title="View"
              >
                <IconEye className="h-5 w-5 text-blue-500 cursor-pointer" />
              </div>
              <div
                // onClick={toggleViewerDrawer(true, id)}
                className="flex items-center space-x-2"
                title="View"
              >
                <IconTruck className="h-5 w-5 text-blue-500 cursor-pointer" />
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
    data: vehiclesData || [],
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
            Vehicles List
            </h1>
            <div className="flex gap-2">
              <button
                className=" flex flex-row items-center gap-1 text-center text-sm font-[400] cursor-pointer  w-[7rem] text-white bg-blue-600 hover:bg-red-700 p-2 rounded-lg shadow-md"
              
              >
                <IconPlus className='w-4 h-4'/> Vehicles
              </button>
              </div>
          </div>
        </div>

        <div className=" shadow-md">
          <MantineReactTable table={table} />
        </div>
      </div>
    </Layout>
  )
}

export default VehiclesList