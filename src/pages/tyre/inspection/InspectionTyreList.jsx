import React, { useEffect, useMemo, useState } from 'react'
import Layout from '../../../layout/Layout'
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import { IconEdit, IconEditCircle, IconEye, IconPlus } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../../../base/BaseUrl';

const InspectionTyreList = () => {
  const [inspectionTyreData, setInspectionTyreData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();



  const fetchInspectionData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/web-fetch-tyre-inspection-list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setInspectionTyreData(response.data?.tyre);
    } catch (error) {
      console.error("Error fetching inspection Tyre data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInspectionData();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "tyre_sub_no",
        header: "Tyre No",
        size:150,
       
      },
      {
        accessorKey: "tyre_sub_branch",
        header: "Branch",
        size: 150,
      },
      {
        accessorKey: "tyre_sub_type",
        header: "Tyre Type",
        size: 50,
      },
      {
        accessorKey: "tyre_sub_make",
        header: "Tyre Make",
        size: 150,
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
                <IconEditCircle className="h-5 w-5 text-blue-500 cursor-pointer" />
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
    data: inspectionTyreData || [],
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
              Inspection Tyre List
            </h1>
            
          </div>
        </div>

        <div className=" shadow-md">
          <MantineReactTable table={table} />
        </div>
      </div>
   </Layout>
  )
}

export default InspectionTyreList