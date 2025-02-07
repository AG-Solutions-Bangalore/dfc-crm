import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import SkeletonLoading from "./SkeletonLoading";
import { IconFileTypePdf } from "@tabler/icons-react";
import { toast } from "sonner";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import {
  ReportDate,
  ReportTitle,
} from "../../../components/common/ReportTitle";
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
const AgenciesReportView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [agencies, setAgencies] = useState([]);
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
    const fetchVehicleData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        let data = {
          agency_branch: localStorage.getItem("agency_branch"),
        };
        const Response = await axios.post(
          `${BASE_URL}/api/fetch-agencies-report`,
          data,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setAgencies(Response.data.agencies);
        console.log(Response.data, "resposne");
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchVehicleData();
  }, []);

  if (loading) {
    return <SkeletonLoading />;
  }

  const handleSavePDF = () => {
    const tableBody = [
      ["Agency", "Branch", "RT KM", "City", "State", "Mobile"], // Header row
      ...agencies.map((item) => [
        item.agency_name || "-",
        item.agency_branch || "-",
        item.agency_rt_km || "-",
        item.agency_city || "-",
        item.agency_state || "-",
        item.agency_mobile || "-",
      ]),
    ];

    const docDefinition = {
      pageSize: "A4",
      pageMargins: [10, 10, 10, 40],
      content: [
        { text: "AGENCIES SUMMARY", style: "header", alignment: "center" },
        {
          table: {
            headerRows: 1,
            widths: ["30%", "15%", "10%", "15%", "15%", "15%"],
            body: tableBody,
          },
          layout: {
            fillColor: (rowIndex) => (rowIndex === 0 ? "#CCCCCC" : null), // Header background
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
          margin: [5, 5, 5, 5],
        },
      },
      defaultStyle: {
        fontSize: 8,
      },
      footer: (currentPage, pageCount) => ({
        columns: [
          {
            text: ReportTitle,
            style: "footerText",
            alignment: "left",
            margin: [10, 0],
          },
          {
            text: ReportDate,
            style: "footerText",
            alignment: "right",
            margin: [0, 0, 10, 0],
          },
        ],
        margin: [10, 0, 10, 10],
      }),
    };
    toast.success("Pdf is Downloaded Successfully");

    pdfMake.createPdf(docDefinition).download("agencies_report.pdf");
  };

  const onSubmit = (e) => {
    e.preventDefault();
    let data = {
      agency_branch: localStorage.getItem("agency_branch"),
    };

    axios({
      url: BASE_URL + "/api/download-agencies-report",
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
        link.setAttribute("download", "agencies.csv");
        document.body.appendChild(link);
        link.click();
        toast.success("Agencies is Downloaded Successfully");
      })
      .catch((err) => {
        toast.error("Agencies is Not Downloaded");
      });
  };
  return (
    <Layout>
      <div className="bg-[#FFFFFF] p-2 rounded-lg ">
        <div className="sticky top-0 p-2 mb-4 border-b-2 border-red-500 rounded-lg bg-[#E1F5FA]">
          <h2 className="px-5 text-[black] text-lg flex flex-row justify-between items-center rounded-xl p-2">
            <div className="flex items-center gap-2">
              <IconInfoCircle className="w-4 h-4" />
              <span> AGENCIES SUMMARY</span>
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
                onClick={() => navigate("/report-agencies-form")}
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
                AGENCIES SUMMARY
              </h3>
              {agencies.length > 0 ? (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-200">
                      {[
                        "Agency",
                        "Branch",
                        "RT KM",
                        "City",
                        "State",
                        "Mobile",
                      ].map((header) => (
                        <th
                          key={header}
                          className="p-1 text-xs border border-black"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {agencies.map((item, index) => (
                      <tr key={index}>
                        <td className="p-1 text-xs border border-black px-2">
                          {item.agency_name || "-"}
                        </td>
                        <td className="p-1 text-xs  border border-black px-2">
                          {item.agency_branch || "-"}
                        </td>
                        <td className="p-1 text-xs  border border-black text-center">
                          {item.agency_rt_km || "-"}
                        </td>
                        <td className="p-1 text-xs  border border-black px-2">
                          {item.agency_city || "-"}
                        </td>
                        <td className="p-1 text-xs  border border-black px-2">
                          {item.agency_state || "-"}
                        </td>
                        <td className="p-1 text-xs  border border-black text-center">
                          {item.agency_mobile || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center text-gray-500 py-4">
                  No Agencies Data Available
                </div>
              )}
            </div>
            <div className="hidden print:block">
              <div className="trademark flex justify-between items-center mt-4 ">
                <h2 className="text-xs font-medium px-1">{ReportTitle}</h2>
                <h2 className="text-xs font-medium px-5">{ReportDate} </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AgenciesReportView;
