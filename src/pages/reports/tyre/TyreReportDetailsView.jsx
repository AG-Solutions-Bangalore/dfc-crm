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
import SkeletonLoading from "../agencies/SkeletonLoading";
import { IconFileTypePdf } from "@tabler/icons-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "react-toastify";
import moment from "moment";
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
const TyreReportDetailsView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vechiles, setVechiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const componentRef = React.useRef();
  const tableRef = useRef(null);

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
    const fetchVechilesData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        let data = {
          tyre_from_date: localStorage.getItem("tyre_from_date"),
          tyre_to_date: localStorage.getItem("tyre_to_date"),
          tyre_supplier: localStorage.getItem("tyre_supplier"),
          tyre_company: localStorage.getItem("tyre_company"),
          tyre_branch: localStorage.getItem("tyre_branch"),
          tyre_count: localStorage.getItem("tyre_count"),
        };

        const Response = await axios.post(
          `${BASE_URL}/api/fetch-tyre-details-report`,
          data,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setVechiles(Response.data.tyre);
        console.log(Response.data, "resposne");
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchVechilesData();
  }, []);

  if (loading) {
    return <SkeletonLoading />;
  }
  const handleSavePDF = () => {
    const input = tableRef.current;

    html2canvas(input, { scale: 2 })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("p", "mm", "a4");

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = canvas.width;
        const imgHeight = canvas.height;

        const margin = 10;

        const availableWidth = pdfWidth - 2 * margin;

        const ratio = Math.min(
          availableWidth / imgWidth,
          pdfHeight / imgHeight
        );

        const imgX = margin;
        const imgY = 0;

        pdf.addImage(
          imgData,
          "PNG",
          imgX,
          imgY,
          imgWidth * ratio,
          imgHeight * ratio
        );
        pdf.save("invoice.pdf");
      })
      .catch((error) => {
        console.error("Error generating PDF: ", error);
      });
  };
  const onSubmit = (e) => {
    e.preventDefault();
    let data = {
      tyre_from_date: localStorage.getItem("tyre_from_date"),
      tyre_to_date: localStorage.getItem("tyre_to_date"),
      tyre_supplier: localStorage.getItem("tyre_supplier"),
      tyre_company: localStorage.getItem("tyre_company"),
      tyre_branch: localStorage.getItem("tyre_branch"),
      tyre_count: localStorage.getItem("tyre_count"),
    };

    axios({
      url: BASE_URL + "/api/download-tyre-details-report",
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
        link.setAttribute("download", "tyre.csv");
        document.body.appendChild(link);
        link.click();
        toast.success("tyre Report is Downloaded Successfully");
      })
      .catch((err) => {
        toast.error("tyre Report is Not Downloaded");
      });
  };
  return (
    <Layout>
      <div className="bg-[#FFFFFF] p-2 rounded-lg ">
        <div className="sticky top-0 p-2 mb-4 border-b-2 border-red-500 rounded-lg bg-[#E1F5FA]">
          <h2 className="px-5 text-[black] text-lg flex flex-row justify-between items-center rounded-xl p-2">
            <div className="flex items-center gap-2">
              <IconInfoCircle className="w-4 h-4" />
              <span>Tyres Details Summary</span>
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
                onClick={() => navigate("/report-tyre-form")}
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
                TYRES DETAILS SUMMARY
              </h3>
              {vechiles.length > 0 ? (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-200">
                      {[
                        "Branch",

                        "Tyre No",
                        "Tyre Type",
                        "Tyre Make	",
                        "Tyre Status",
                      ].map((header) => (
                        <th key={header} className="p-1 text-xs border border-black">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {vechiles.map((item, index) => (
                      <tr key={index}>
                        <td className="p-1 text-xs border border-black">
                          {item.tyre_sub_branch || "N/A"}
                        </td>
                        <td className="p-1 text-xs border border-black">
                          {item.tyre_sub_no || "N/A"}
                        </td>
                        <td className="p-1 text-xs border border-black">
                          {item.tyre_sub_type || "N/A"}
                        </td>
                        <td className="p-1 text-xs border border-black">
                          {item.tyre_sub_make || "N/A"}
                        </td>

                        <td className="p-1 text-xs border border-black">
                          {item.tyre_sub_status || "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center text-gray-500 py-4">
                  No Tyre Data Available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TyreReportDetailsView;
