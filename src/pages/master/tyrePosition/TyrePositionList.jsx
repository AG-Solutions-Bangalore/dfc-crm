import React, { useEffect, useMemo, useState } from 'react'
import Layout from '../../../layout/Layout'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../../../base/BaseUrl';
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';

const TyrePositionList = () => {
  const [tyrePositionData, setTyrePositionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();



  const fetchTyrePositionData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/web-fetch-tyre-position-list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTyrePositionData(response.data?.tyrePosition);
    } catch (error) {
      console.error("Error fetching Tyre Position data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTyrePositionData();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "vehicle_type",
        header: "Vehicle",
        size:150,
       
      },
      {
        accessorKey: "tyre_position",
        header: "Tyre Position",
        size: 150,
      },
      {
        accessorKey: "tyre_positioning_status",
        header: "Status",
        size: 50,
      },
      
    ],
    []
  );

  const table = useMantineReactTable({
    columns,
    data: tyrePositionData || [],
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
              Tyre Position List
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

export default TyrePositionList