import React, { useEffect, useMemo, useState } from 'react'
import Layout from '../../../layout/Layout'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../../../base/BaseUrl';
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';

const StockTyreList = () => {
  const [stockTyreData, setStockTyreData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();



  const fetchStockTyreData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/web-fetch-tyre-stock-list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStockTyreData(response.data?.tyre);
    } catch (error) {
      console.error("Error fetching Stock data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockTyreData();
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
        accessorKey: "tyre_sub_status",
        header: "Status",
        size: 50,
      },
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
     
    ],
    []
  );

  const table = useMantineReactTable({
    columns,
    data: stockTyreData || [],
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
                Stock tyre List
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

export default StockTyreList