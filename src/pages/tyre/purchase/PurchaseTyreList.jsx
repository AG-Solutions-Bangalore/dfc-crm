import React, { useEffect, useMemo, useState } from "react";
import Layout from "../../../layout/Layout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import { IconEdit, IconEye, IconPlus } from "@tabler/icons-react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import moment from "moment/moment";
import { MasterPurchaseCreate, MasterPurchaseEdit, MasterPurchaseView } from "../../../components/buttonIndex/ButtonComponents";

const PurchaseTyreList = () => {
  const [purchaseTyreData, setPurchaseTyreData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchPurchaseTyreData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/web-fetch-tyre-list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPurchaseTyreData(response.data?.tyre);
    } catch (error) {
      console.error("Error fetching Purchase Tyre data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchaseTyreData();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "tyre_date",
        header: "Date",
        Cell: ({ row }) => {
          const tyre_date = row.original.tyre_date;

          return tyre_date ? moment(tyre_date).format("DD-MMM-YYYY") : "";
        },
      },
      // {
      //   accessorKey: "tyre_company",
      //   header: "Company",
      //   size: 150,
      // },
      {
        accessorKey: "combined",
        header: "Company/Branch",
        size: 150,
        accessorFn: (row) => `${row.tyre_company} - ${row.tyre_branch}`,
        Cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="text-black font-semibold">
              {row.original.tyre_company}/{row.original.tyre_branch}
            </span>
          </div>
        ),
      },
      // {
      //   accessorKey: "tyre_branch",
      //   header: "Branch",
      //   size: 150,
      // },
      {
        accessorKey: "tyre_supplier",
        header: "Supplier",
        size: 50,
      },
      {
        accessorKey: "tyre_bill_ref",
        header: "Bill Ref",
        size: 50,
      },
      {
        accessorKey: "tyre_bill_amount",
        header: "Amount",
        size: 50,
        Cell: ({ row }) => {
          const amount = row.original.tyre_bill_amount;

          return <span>&#8377; {amount}</span>;
        },
      },
      {
        accessorKey: "tyre_count",
        header: "No. of Tyre",
        size: 50,
      },
      {
        accessorKey: "tyre_status",
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
              {/* <div
                onClick={() => navigate(`/tyre/purchase-edit/${id}`)}
                className="flex items-center space-x-2"
                title="Edit"
              >
                <IconEdit className="h-5 w-5 text-blue-500 cursor-pointer" />
              </div> */}
              <MasterPurchaseEdit
                  onClick={() => navigate(`/tyre/purchase-edit/${id}`)}
                className="flex items-center space-x-2"
              
              />
              {/* <div
                onClick={() => navigate(`/tyre/purchase-view/${id}`)}
                className="flex items-center space-x-2"
                title="View"
              >
                <IconEye className="h-5 w-5 text-blue-500 cursor-pointer" />
              </div> */}
              <MasterPurchaseView
                 onClick={() => navigate(`/tyre/purchase-view/${id}`)}
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
    data: purchaseTyreData || [],
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
              Purchase Tyre List
            </h1>
            <div className="flex gap-2">
              {/* <button
                onClick={() => navigate("/tyre/createPurchase")}
                className=" flex flex-row items-center gap-1 text-center text-sm font-[400] cursor-pointer  w-[8rem] text-white bg-blue-600 hover:bg-red-700 p-2 rounded-lg shadow-md"
              >
                <IconPlus className="w-4 h-4" /> Purchase Tyre
              </button> */}
              <MasterPurchaseCreate
               onClick={() => navigate("/tyre/createPurchase")}
                className=" flex flex-row items-center gap-1 text-center text-sm font-[400] cursor-pointer  w-[8rem] text-white bg-blue-600 hover:bg-red-700 p-2 rounded-lg shadow-md"
              
              />
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

export default PurchaseTyreList;
