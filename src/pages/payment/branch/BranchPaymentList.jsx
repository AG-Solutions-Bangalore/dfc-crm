import React, { useEffect, useMemo, useState } from "react";
import Layout from "../../../layout/Layout";
import { useNavigate } from "react-router-dom";
import { IconEdit, IconPlus } from "@tabler/icons-react";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import moment from "moment/moment";
import {
  PaymentBranchCreate,
  PaymentBranchEdit,
} from "../../../components/buttonIndex/ButtonComponents";
import { CreateButton } from "../../../components/common/ButtonColors";
import { encryptId } from "../../../components/common/EncryptionDecryption";

const BranchPaymentList = () => {
  const [branchPaymentData, setBranchPaymentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchBranchPaymentData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/web-fetch-payment-list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBranchPaymentData(response.data?.payment);
    } catch (error) {
      console.error("Error fetching Branch Payment data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranchPaymentData();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "payment_date",
        header: "Date",
        size: 150,

        Cell: ({ row }) => {
          const date = row.original.payment_date;
          return date ? moment(date).format("DD-MMM-YYYY") : "";
        },
      },
      {
        accessorKey: "payment_branch",
        header: "Branch",
        size: 150,
      },
      {
        accessorKey: "payment_amount",
        header: "Total Amount",
        size: 50,
        Cell: ({ row }) => {
          const amount = row.original.payment_amount;

          return <span>&#8377; {amount}</span>;
        },
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
                onClick={() => navigate(`/payment/edit-branchpay/${id}`)}
                className="flex items-center space-x-2"
                title="Edit"
              >
                <IconEdit className="h-5 w-5 text-blue-500 cursor-pointer" />
              </div> */}
              <PaymentBranchEdit
                // onClick={() => navigate(`/payment/edit-branchpay/${id}`)}
                onClick={() => {
                  const encryptedId = encryptId(id);

                  navigate(
                    `/payment/edit-branchpay/${encodeURIComponent(encryptedId)}`
                  );
                }}
                className="h-5 w-5 text-blue-500 cursor-pointer"
                // title="Edit"
              >
                {/* <IconEdit className="h-5 w-5 text-blue-500 cursor-pointer" /> */}
              </PaymentBranchEdit>
            </div>
          );
        },
      },
    ],
    []
  );

  const table = useMantineReactTable({
    columns,
    data: branchPaymentData || [],
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
              Branch Payment List
            </h1>
            {/* <div className="flex gap-2">
              <button
                onClick={() => navigate("/payment/createBranchPay")}
                className=" flex flex-row items-center gap-1 text-center text-sm font-[400] cursor-pointer  w-[9rem] text-white bg-blue-600 hover:bg-red-700 p-2 rounded-lg shadow-md"
              >
                <IconPlus className="w-4 h-4" /> Branch Payment
              </button>
            </div> */}
            <div className="flex gap-2">
              <PaymentBranchCreate
                onClick={() => navigate("/payment/createBranchPay")}
                className={`${CreateButton} w-full`}
              ></PaymentBranchCreate>
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

export default BranchPaymentList;
