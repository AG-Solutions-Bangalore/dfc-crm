import Layout from "../../../layout/Layout";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  IconArrowBack,
  IconInfoCircle,
  IconPrinter,
} from "@tabler/icons-react";
import  { useReactToPrint } from "react-to-print";
import moment from "moment";
import BASE_URL from "../../../base/BaseUrl";

// Skeleton Loader Component
const SkeletonLoader = () => {
    return (
      <Layout>
        <div className="bg-white p-4 rounded-lg">
          {/* Header Skeleton */}
          <div className="sticky top-0 mb-4 border-b-2 border-gray-200 rounded-lg bg-gray-50 animate-pulse">
            <div className="flex justify-between items-center p-4">
              <div className="h-8 bg-gray-300 w-1/3 rounded"></div>
              <div className="flex space-x-4">
                <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
                <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
              </div>
            </div>
          </div>
  
          {/* Details Skeleton */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {[...Array(2)].map((_, colIndex) => (
              <div key={colIndex} className="space-y-4">
                {[...Array(4)].map((_, rowIndex) => (
                  <div key={rowIndex} className="flex items-center">
                    <div className="h-4 bg-gray-300 w-1/3 mr-4 rounded"></div>
                    <div className="h-4 bg-gray-300 w-2/3 rounded"></div>
                  </div>
                ))}
              </div>
            ))}
          </div>
  
          {/* Table Skeleton */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  {[...Array(4)].map((_, index) => (
                    <th key={index} className="p-3 bg-gray-200 text-left">
                      <div className="h-4 bg-gray-300 w-3/4 rounded"></div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, rowIndex) => (
                  <tr key={rowIndex} className="border-b">
                    {[...Array(4)].map((_, colIndex) => (
                      <td key={colIndex} className="p-3">
                        <div className="h-4 bg-gray-300 w-3/4 rounded"></div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Layout>
    );
  }
const ViewPurchaseTyre = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const printRef = useRef(null);
  
    const [tyreData, setTyreData] = useState(null);
    const [tyreSubs, setTyreSubs] = useState([]);
    const [loading, setLoading] = useState(true);

    // Print handler using react-to-print
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    pageStyle: `
      @page {
          size: A4;
          margin: 2mm;
      }
      @media print {
          body {
              margin: 0;
              font-size: 12px; 
               border: 1px solid #000;
                 min-height:100vh
          }
          table {
              width: 100%;
              border-collapse: collapse;
          }
          th, td {
              border: 1px solid #ddd;
              padding: 4px;
          }
          th {
              background-color: #f4f4f4;
          }
          .text-center {
              text-align: center;
          }
      }
    `,
  });

  
    useEffect(() => {
      const fetchTyreDetails = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `${BASE_URL}/api/web-fetch-tyre-by-id/${id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
  
          setTyreData(response.data.tyre);
          setTyreSubs(response.data.tyreSub);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching tyre details:", error);
          setLoading(false);
        }
      };
  
      fetchTyreDetails();
    }, [id]);
  
    if (loading) return <SkeletonLoader />;
  
  return (
  <Layout>
    <div className="bg-[#FFFFFF] p-2 rounded-lg">
        <div className="sticky top-0 p-2  mb-4 border-b-2 border-red-500 rounded-lg  bg-[#E1F5FA] ">
          <h2 className="px-5 text-black text-lg flex flex-row justify-between items-center rounded-xl p-2">
            <div className="flex items-center gap-2">
              <IconInfoCircle className="w-4 h-4" />
              <span>Purchase Tyre View {id}</span>
            </div>
            <div className="flex items-center space-x-4">
             
                <IconPrinter
                className="cursor-pointer text-gray-600 hover:text-blue-600"
                onClick={handlePrint}
                title="Print"
              />
              <IconArrowBack
                className="cursor-pointer text-gray-600 hover:text-red-600"
                onClick={() => navigate("/tyre/purchase-list")}
                title="Go Back"
              />
            </div>
          </h2>
        </div>

        <div ref={printRef} className="p-4">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <table className="w-full">
                <tbody>
                  <tr className="border-b">
                    <td className="font-semibold w-1/3 py-2">Date</td>
                    <td>{moment(tyreData?.tyre_date).format("DD-MMMM-YYYY")}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="font-semibold w-1/3 py-2">Company</td>
                    <td>{tyreData?.tyre_company}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="font-semibold w-1/3 py-2">Branch</td>
                    <td>{tyreData?.tyre_branch}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="font-semibold w-1/3 py-2">No of Tyres</td>
                    <td>{tyreData?.tyre_count}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <table className="w-full">
                <tbody>
                  <tr className="border-b">
                    <td className="font-semibold w-1/3 py-2">Supplier</td>
                    <td>{tyreData?.tyre_supplier}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="font-semibold w-1/3 py-2">Bill Ref</td>
                    <td>{tyreData?.tyre_bill_ref}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="font-semibold w-1/3 py-2">Amount</td>
                    <td>₹ {Number(tyreData?.tyre_bill_amount).toLocaleString("en-IN")}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="font-semibold w-1/3 py-2">Remarks</td>
                    <td>{tyreData?.tyre_remarks}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Tyre No</th>
                  <th className="border p-2">Tyre Type</th>
                  <th className="border p-2">Tyre Make</th>
                  <th className="border p-2">Tyre Status</th>
                </tr>
              </thead>
              <tbody>
                {tyreSubs.map((tyre, index) => (
                  <tr key={index} className="text-center">
                    <td className="border p-2">{tyre.tyre_sub_no}</td>
                    <td className="border p-2">{tyre.tyre_sub_type}</td>
                    <td className="border p-2">{tyre.tyre_sub_make}</td>
                    <td className="border p-2">{tyre.tyre_sub_status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
  </Layout>
  )
};

export default ViewPurchaseTyre;
