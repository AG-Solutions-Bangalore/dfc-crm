import React, { useEffect, useMemo, useState } from "react";
import Layout from "../../../layout/Layout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import { IconEdit, IconEye, IconPlus } from "@tabler/icons-react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import moment from "moment/moment";
import {
  MasterPurchaseCreate,
  MasterPurchaseEdit,
  MasterPurchaseView,
} from "../../../components/buttonIndex/ButtonComponents";
import { CreateButton } from "../../../components/common/ButtonColors";
import { encryptId } from "../../../components/common/EncryptionDecryption";
import { TextInput } from "@mantine/core"; // Import Mantine TextInput

const PurchaseTyreList = () => {
  const [purchaseTyreData, setPurchaseTyreData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(null);
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

      setPurchaseTyreData(
        response.data?.tyre?.map(item => ({
          ...item,
          tyre_sub_no_list: item.subs?.map(sub => sub.tyre_sub_no).join(", ") || ""
        }))
      );
      
    } catch (error) {
      console.error("Error fetching Purchase Tyre data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchaseTyreData();
  }, []);

  // Filter data based on search
  useEffect(() => {
    if (!purchaseTyreData) return;
    
    if (!searchTerm.trim()) {
      setFilteredData(purchaseTyreData);
    } else {
      const term = searchTerm.toLowerCase().trim();
      const filtered = purchaseTyreData.filter(item => {
        // Check all fields for partial match
        
        // 1. Check tyre_sub_no_list (comma-separated values)
        if (item.tyre_sub_no_list) {
          const subNos = item.tyre_sub_no_list.toLowerCase();
          if (subNos.includes(term)) {
            return true;
          }
        }
        
        // 2. Check individual tyre_sub_no in subs array
        if (item.subs && Array.isArray(item.subs)) {
          const hasMatchingSub = item.subs.some(sub => {
            if (sub.tyre_sub_no) {
              return sub.tyre_sub_no.toLowerCase().includes(term);
            }
            return false;
          });
          if (hasMatchingSub) return true;
        }
        
        // 3. Check other string fields
        const stringFields = [
          'tyre_bill_ref',
          'tyre_supplier',
          'tyre_company',
          'tyre_branch',
          'tyre_status',
          'tyre_reference'
        ];
        
        for (const field of stringFields) {
          const value = item[field];
          if (value && typeof value === 'string') {
            if (value.toLowerCase().includes(term)) {
              return true;
            }
          }
        }
        
        // 4. Check numeric fields (convert to string)
        const numericFields = [
          'tyre_bill_amount',
          'tyre_count',
          'id'
        ];
        
        for (const field of numericFields) {
          const value = item[field];
          if (value !== null && value !== undefined) {
            if (String(value).includes(term)) {
              return true;
            }
          }
        }
        
        // 5. Check date field
        if (item.tyre_date) {
          const formattedDate = moment(item.tyre_date).format("DD-MMM-YYYY").toLowerCase();
          if (formattedDate.includes(term)) {
            return true;
          }
        }
        
        return false;
      });
      setFilteredData(filtered);
    }
  }, [searchTerm, purchaseTyreData]);

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
        accessorKey: "tyre_sub_no_list",
        header: "Tyre Sub No",
        enableHiding: true,
        enableColumnVisibility: false,
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
              <MasterPurchaseEdit
                onClick={() => {
                  const encryptedId = encryptId(id);
                  navigate(`/tyre/purchase-edit/${encodeURIComponent(encryptedId)}`);
                }}
                className="flex items-center space-x-2"
              />
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
    data: filteredData || purchaseTyreData || [],
    enableFullScreenToggle: false,
    enableDensityToggle: false,
    enableColumnActions: false,
    enableHiding: false,
    enableStickyHeader: true,
    enableStickyFooter: true,
    mantineTableContainerProps: { sx: { maxHeight: "400px" } },
    initialState: { 
      columnVisibility: { 
        tyre_sub_no_list: false
      } 
    },
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
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Search Input */}
              <div className="w-full md:w-auto">
                <TextInput
                  placeholder="Search in all fields..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  size="sm"
                  className="w-full md:w-64"
                  styles={(theme) => ({
                    input: {
                      '&:focus': {
                        borderColor: theme.colors.blue[6],
                      }
                    }
                  })}
                />
              </div>
              
              <div className="flex gap-2">
                <MasterPurchaseCreate
                  onClick={() => navigate("/tyre/createPurchase")}
                  className={`${CreateButton} w-full`}
                />
              </div>
            </div>
          </div>
          
          {/* Search Info */}
          {searchTerm && (
            <div className="mt-3 text-sm text-gray-600">
              Searching for: <span className="font-semibold">"{searchTerm}"</span>
              {filteredData && (
                <span className="ml-2">({filteredData.length} records found)</span>
              )}
              <button 
                onClick={() => setSearchTerm('')}
                className="ml-3 text-blue-600 hover:text-blue-800 text-xs"
              >
                Clear search
              </button>
            </div>
          )}
        </div>

        <div className="shadow-md">
          <MantineReactTable table={table} />
        </div>
      </div>
    </Layout>
  );
};

export default PurchaseTyreList;