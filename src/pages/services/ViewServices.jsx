import React, { useEffect, useRef, useState } from "react";
import Layout from "../../layout/Layout";
import { useNavigate, useParams } from "react-router-dom";
import {
  IconArrowBack,
  IconInfoCircle,
  IconPrinter,
} from "@tabler/icons-react";
import BASE_URL from "../../base/BaseUrl";
import { useReactToPrint } from "react-to-print";
import moment from "moment";
import axios from "axios";
import { ReportDate, ReportTitle } from "../../components/common/ReportTitle";
import { decryptId } from "../../components/common/EncryptionDecryption";

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
                {[...Array(3)].map((_, index) => (
                  <th key={index} className="p-3 bg-gray-200 text-left">
                    <div className="h-4 bg-gray-300 w-3/4 rounded"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, rowIndex) => (
                <tr key={rowIndex} className="border-b">
                  {[...Array(3)].map((_, colIndex) => (
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
};
const ViewServices = () => {
  const { id } = useParams();
  const decryptedId = decryptId(id);

  const navigate = useNavigate();
  const componentRef = useRef(null);

  const [service, setService] = useState(null);
  const [serviceSub, setServiceSub] = useState([]);
  const [loading, setLoading] = useState(true);

  // Print handler using react-to-print
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
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
                    .trademark {
    position: fixed;
    bottom: 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
    // padding: 0 10mm;
    font-size: 8px;
    color: gray;
  }

            }
          `,
  });
  //   const handlePrint = useReactToPrint({
  //     content: () => componentRef.current,
  //     pageStyle: `
  //         @page {
  //             size: A4;
  //             margin: 4mm;
  //         }
  //         @media print {
  //             body {
  //                 margin: 0;
  //                 font-size: 12px;
  //                 min-height:100vh
  //             }
  //             table {
  //                 width: 100%;
  //                 border-collapse: collapse;
  //             }
  //             th, td {
  //                 border: 1px solid #ddd;
  //                 padding: 4px;
  //             }

  // .trademark {
  // position: fixed;
  // bottom: 0;
  // width: 100%;
  // display: flex;
  // justify-content: space-between;
  // // padding: 0 10mm;
  // font-size: 8px;
  // color: gray;
  // }

  //             th {
  //                 background-color: #f4f4f4;
  //             }
  //             .text-center {
  //                 text-align: center;
  //             }
  //                 .margin-first{
  //                 margin:10px
  //                 }

  //         }
  //       `,
  //   });
  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `${BASE_URL}/api/web-fetch-services-by-id/${decryptedId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setService(response.data.services);
        setServiceSub(response.data.servicesSub);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching service details:", error);
        setLoading(false);
      }
    };

    fetchServiceDetails();
  }, [id, navigate]);

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <Layout>
      <div className="bg-[#FFFFFF] p-2 rounded-lg">
        <div className="sticky top-0 p-2 mb-4 border-b-2 border-red-500 rounded-lg bg-[#E1F5FA]">
          <h2 className="px-5 text-black text-lg flex flex-row justify-between items-center rounded-xl p-2">
            <div className="flex items-center gap-2">
              <IconInfoCircle className="w-4 h-4" />
              <span>Service View</span>
            </div>
            <div className="flex items-center space-x-4">
              <IconPrinter
                className="cursor-pointer text-gray-600 hover:text-blue-600"
                onClick={handlePrint}
                title="Print"
              />
              <IconArrowBack
                className="cursor-pointer text-gray-600 hover:text-red-600"
                onClick={() => navigate("/service-list")}
                title="Go Back"
              />
            </div>
          </h2>
        </div>

        <div ref={componentRef} className="p-4">
          <h3 className="text-xl font-bold mb-2 text-center">SERVICE</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <table className="w-full">
                <tbody>
                  <tr className="border-b">
                    <td className="font-semibold w-1/3 py-1">Vechile No</td>
                    <td className="font-bold">{service?.service_truck_no}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="font-semibold w-1/3 py-1">Date</td>
                    <td>
                      {moment(service?.service_date).format("DD-MMMM-YYYY")}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="font-semibold w-1/3 py-1">Company</td>
                    <td>{service?.service_company}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="font-semibold w-1/3 py-1">Branch</td>
                    <td>{service?.service_branch}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <table className="w-full ">
                <tbody>
                  <tr className="border-b">
                    <td className="font-semibold w-1/3 py-1">Garage</td>
                    <td>{service?.service_garage}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="font-semibold w-1/3 py-1">KM</td>
                    <td>{service?.service_km}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="font-semibold w-1/3 py-1">Amount</td>
                    <td>₹ {service?.service_amount.toLocaleString()}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="font-semibold w-1/3 py-1">Remarks</td>
                    <td>{service?.service_remarks}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Services</th>
                <th className="border p-2">Amount</th>
                <th className="border p-2">Description</th>
              </tr>
            </thead>
            <tbody>
              {serviceSub.map((subService, index) => (
                <tr key={index} className="border">
                  <td className="border p-2">{subService?.service_sub_type}</td>
                  <td className="border p-2 text-right">
                    ₹ {subService?.service_sub_amount.toLocaleString()}
                  </td>
                  <td className="border p-2">
                    {subService?.service_sub_details}
                  </td>
                </tr>
              ))}

              {/* Calculate and display total */}
              <tr className="border font-bold">
                <td className="border p-2" colSpan="1">
                  Total
                </td>
                <td className="border p-2 text-right">
                  ₹{" "}
                  {serviceSub
                    .reduce(
                      (total, subService) =>
                        total + Number(subService?.service_sub_amount || 0), // Ensure the amount is treated as a number
                      0
                    )
                    .toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="hidden print:block">
            <div className="trademark flex justify-between items-center mt-4 ">
              <h2 className="text-xs font-medium px-1">{ReportTitle}</h2>
              <h2 className="text-xs font-medium px-5">{ReportDate} </h2>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ViewServices;
