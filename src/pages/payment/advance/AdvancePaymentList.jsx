import React, { useEffect, useMemo, useState } from "react";
import Layout from "../../../layout/Layout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import { IconEdit, IconPlus } from "@tabler/icons-react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import moment from "moment";
import {
  PaymentAdvanceCreate,
  PaymentAdvanceEdit,
} from "../../../components/buttonIndex/ButtonComponents";
import { CreateButton } from "../../../components/common/ButtonColors";
import { encryptId } from "../../../components/common/EncryptionDecryption";

const AdvancePaymentList = () => {
  const [advancePaymentData, setAdvancePaymentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchAdvancePaymentData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/web-fetch-payment-advance-list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAdvancePaymentData(response.data?.payment);
    } catch (error) {
      console.error("Error fetching Advance Payment data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvancePaymentData();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "payment_details_date",
        header: "Date",
        size: 150,
        Cell: ({ row }) => {
          const date = row.original.payment_details_date;
          return date ? moment(date).format("DD-MMM-YYYY") : "";
        },
      },
      {
        accessorKey: "payment_details_company",
        header: "Company",
        size: 150,
      },
      {
        accessorKey: "payment_details_debit",
        header: "Debit",
        size: 50,
      },
      {
        accessorKey: "payment_details_credit",
        header: "Credit",
        size: 50,
      },
      {
        accessorKey: "payment_details_amount",
        header: "Amount",
        size: 50,
        Cell: ({ row }) => {
          const amount = row.original.payment_details_amount;

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
                onClick={() => navigate(`/payment/edit-advance/${id}`)}
                className="flex items-center space-x-2"
                title="Edit"
              >
                <IconEdit className="h-5 w-5 text-blue-500 cursor-pointer" />
              </div> */}
              <PaymentAdvanceEdit
                // onClick={() => navigate(`/payment/edit-advance/${id}`)}
                onClick={() => {
                  const encryptedId = encryptId(id);

                  navigate(
                    `/payment/edit-advance/${encodeURIComponent(encryptedId)}`
                  );
                }}
                className="h-5 w-5 text-blue-500 cursor-pointer"
              ></PaymentAdvanceEdit>
            </div>
          );
        },
      },
    ],
    []
  );

  const table = useMantineReactTable({
    columns,
    data: advancePaymentData || [],
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
              Advance Payment List
            </h1>
            {/* <div className="flex gap-2">
              <button
                onClick={() => navigate("/payment/createAdvance")}
                className=" flex flex-row items-center gap-1 text-center text-sm font-[400] cursor-pointer  w-[7rem] text-white bg-blue-600 hover:bg-red-700 p-2 rounded-lg shadow-md"
              >
                <IconPlus className="w-4 h-4" /> Advance
              </button>
            </div> */}
            <div className="flex gap-2">
              <PaymentAdvanceCreate
                onClick={() => navigate("/payment/createAdvance")}
                className={CreateButton}
              ></PaymentAdvanceCreate>
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

export default AdvancePaymentList;
