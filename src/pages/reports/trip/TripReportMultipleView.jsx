import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  IconInfoCircle,
  IconArrowBack,
  IconPrinter,
  IconFileTypeXls,
} from "@tabler/icons-react";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import Layout from "../../../layout/Layout";
import { useReactToPrint } from "react-to-print";
import SkeletonLoading from "../agencies/SkeletonLoading";
import { IconFileTypePdf } from "@tabler/icons-react";
import { toast } from "sonner";
import moment from "moment";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
const printStyles = `
  @media print {




    /* Print content with 20px margin */
    .print-content {
      margin: 10px !important; /* Apply 20px margin to the printed content */
  padding: 3px;
      }

.page-break {
      page-break-before: always;
      margin-top: 10mm;
    }




  }
`;
const TripReportMultipleView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState([]);
  const [loading, setLoading] = useState(true);
  const componentRef = React.useRef();
  const tableRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: `
          @page {
              size: A4;
              margin: 4mm;
          }
          @media print {
              body {
                  margin: 0;
                  font-size: 12px; 
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

              th {
                  background-color: #f4f4f4;
              }
              .text-center {
                  text-align: center;
              }
                  .margin-first{
                  margin:10px
                  }
                  
          }
        `,
  });
  const mergeRefs =
    (...refs) =>
    (node) => {
      refs.forEach((ref) => {
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      });
    };

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = printStyles;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);
  useEffect(() => {
    const fetchTripData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        let data = {
          trip_date_from: localStorage.getItem("trip_date_from"),
          trip_date_to: localStorage.getItem("trip_date_to"),
          trip_company: localStorage.getItem("trip_company"),
          trip_branch: localStorage.getItem("trip_branch"),
          trip_vehicle: localStorage.getItem("trip_vehicle"),
          trip_full_vehicle: localStorage.getItem("trip_full_vehicle"),
          trip_vehicle_type: localStorage.getItem("trip_vehicle_type"),
          trip_driver: localStorage.getItem("trip_driver"),
          trip_agency: localStorage.getItem("trip_agency"),
          trip_supplier: localStorage.getItem("trip_supplier"),
          trip_status: localStorage.getItem("trip_status"),
        };

        const Response = await axios.post(
          `${BASE_URL}/api/fetch-trip-multiple-report`,
          data,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setTrip(Response.data.trip);
        console.log(Response.data, "resposne");
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchTripData();
  }, []);

  if (loading) {
    return <SkeletonLoading />;
  }
  const handleSavePDF = () => {
    // Table body structure
    const tableBody = [
      [
        "Company",
        "Branch",
        "Reg No",
        "Driver",
        "Total Trip",
        "RT KM",
        "HSD Supplied",
      ], // Header row
      ...trip.map((item) => [
        item.trip_company || "-",
        item.trip_branch || "-",
        item.trip_vehicle || "-",
        item.trip_driver || "-",
        item.trip_total || "-",
        item.trip_km || "-",
        item.trip_hsd_supplied || "-",
      ]),
      [
        { text: "Total:", colSpan: 3, alignment: "right", bold: true }, // Config for total row
        "",
        "",
        "",
        "",
        trip.length > 0
          ? trip.reduce((sum, trip) => sum + trip.trip_total, 0)
          : "-", // Total trip_total or "-"
        trip.length > 0
          ? trip.reduce((sum, trip) => sum + trip.trip_km, 0)
          : "-", // Total trip_km or "-"
        trip.length > 0
          ? trip.reduce((sum, trip) => sum + trip.trip_hsd_supplied, 0)
          : "-",
      ],
    ];

    const docDefinition = {
      pageSize: "A4",
      pageMargins: [10, 10, 10, 40],
      content: [
        { text: "Trip Report", style: "header", alignment: "center" },
        {
          table: {
            headerRows: 1,
            widths: ["auto", "auto", "auto", "auto", "auto", "auto", "auto"],

            body: tableBody,
          },
          layout: {
            fillColor: (rowIndex) => (rowIndex === 0 ? "#CCCCCC" : null), // Header background color
            hLineWidth: () => 0.3,
            vLineWidth: () => 0.3,
          },
        },
      ],
      styles: {
        header: {
          fontSize: 12,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        footerText: {
          fontSize: 8,
        },
      },
      defaultStyle: {
        fontSize: 6,
      },
      footer: (currentPage, pageCount) => ({
        columns: [
          {
            text: "DFC",
            style: "footerText",
            alignment: "left",
            margin: [10, 0],
          },
          {
            text: `Page ${currentPage} of ${pageCount}`,
            style: "footerText",
            alignment: "right",
            margin: [0, 0, 10, 0],
          },
        ],
        margin: [10, 0, 10, 10],
      }),
    };
    toast.success("PDF is Downloaded Successfully");

    pdfMake.createPdf(docDefinition).download("trip_report.pdf");
  };

  const onSubmit = (e) => {
    e.preventDefault();
    let data = {
      trip_date_from: localStorage.getItem("trip_date_from"),
      trip_date_to: localStorage.getItem("trip_date_to"),
      trip_company: localStorage.getItem("trip_company"),
      trip_branch: localStorage.getItem("trip_branch"),
      trip_vehicle: localStorage.getItem("trip_vehicle"),
      trip_full_vehicle: localStorage.getItem("trip_full_vehicle"),
      trip_vehicle_type: localStorage.getItem("trip_vehicle_type"),
      trip_driver: localStorage.getItem("trip_driver"),
      trip_agency: localStorage.getItem("trip_agency"),
      trip_supplier: localStorage.getItem("trip_supplier"),
      trip_status: localStorage.getItem("trip_status"),
    };

    axios({
      url: BASE_URL + "/api/download-trip-multiple-report",
      method: "POST",
      data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        console.log("data : ", res.data);
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "trip.csv");
        document.body.appendChild(link);
        link.click();
        toast.success("trip Report is Downloaded Successfully");
      })
      .catch((err) => {
        toast.error("trip Report is Not Downloaded");
      });
  };
  return (
    <Layout>
      <div className="bg-[#FFFFFF] p-2 rounded-lg ">
        <div className="sticky top-0 p-2 mb-4 border-b-2 border-red-500 rounded-lg bg-[#E1F5FA]">
          <h2 className="px-5 text-[black] text-lg flex flex-row justify-between items-center rounded-xl p-2">
            <div className="flex items-center gap-2">
              <IconInfoCircle className="w-4 h-4" />
              <span>Multiple Trips Summary</span>
            </div>
            <div className="flex items-center space-x-4">
              <IconFileTypeXls
                className="cursor-pointer text-gray-600 hover:text-blue-600"
                onClick={onSubmit}
                title="Excel"
              />
              <IconFileTypePdf
                className="cursor-pointer text-gray-600 hover:text-blue-600"
                onClick={handleSavePDF}
                title="Pdf"
              />
              <IconPrinter
                className="cursor-pointer text-gray-600 hover:text-blue-600"
                onClick={handlePrint}
                title="Print"
              />
              <IconArrowBack
                className="cursor-pointer text-gray-600 hover:text-red-600"
                onClick={() => navigate("/report-trip-form")}
                title="Go Back"
              />
            </div>
          </h2>
        </div>
        <div className=" grid sm:grid-cols-1 overflow-x-auto">
          <div
            ref={mergeRefs(componentRef, tableRef)}
            className="print-padding width margin-first"
          >
            <div className="mb-4 width">
              <h3 className="text-xl font-bold mb-2 text-center">
                MULTIPLE TRIPS SUMMARY
              </h3>
              {trip.length > 0 ? (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-200">
                      {[
                        "Company",
                        "Branch",
                        "Reg No",
                        "Driver",
                        "Total Trip",
                        "RT KM",
                        "HSD Supplied",
                      ].map((header) => (
                        <th
                          key={header}
                          className="text-xs p-1 border border-black"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {trip.map((item, index) => (
                      <tr key={index}>
                        <td className="text-xs p-1 border border-black px-2">
                          {item.trip_company || "-"}
                        </td>

                        <td className="text-xs p-1 border border-black px-2">
                          {item.trip_branch || "-"}
                        </td>

                        <td className="text-xs p-1 border border-black px-2">
                          {item.trip_vehicle || "-"}
                        </td>

                        <td className="text-xs p-1 border border-black px-2">
                          {item.trip_driver || "-"}
                        </td>

                        <td className="text-xs p-1 border border-black text-center">
                          {item.trip_total || "-"}
                        </td>

                        <td className="text-xs p-1 border border-black text-center">
                          {item.trip_km || "-"}
                        </td>

                        <td className="text-xs p-1 border border-black text-center">
                          {item.trip_hsd_supplied || "-"}
                        </td>
                      </tr>
                    ))}

                    <tr className="bg-gray-100 font-bold">
                      <td
                        colSpan={4}
                        className="p-1 text-xs border border-black text-right"
                      >
                        Total:
                      </td>
                      <td className="p-1 text-xs border border-black text-center">
                        {trip.reduce((sum, trip) => sum + trip.trip_total, 0)}
                      </td>
                      <td className="p-1 text-xs border border-black text-center">
                        {trip.reduce((sum, trip) => sum + trip.trip_km, 0)}
                      </td>
                      <td className="p-1 text-xs border border-black text-center">
                        {trip.reduce(
                          (sum, trip) => sum + trip.trip_hsd_supplied,
                          0
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <div className="text-center text-gray-500 py-4">
                  No Trip Data Available
                </div>
              )}
            </div>
            <div className="hidden print:block">
              <div className="trademark flex justify-between items-center mt-4 ">
                <h2 className="text-xs font-medium px-1">DFC</h2>
                <h2 className="text-xs font-medium px-5">
                  {new Date().toLocaleDateString("en-GB")}{" "}
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TripReportMultipleView;
