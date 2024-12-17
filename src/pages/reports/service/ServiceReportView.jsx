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
import { NumericFormat } from "react-number-format";

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
const ServiceReportView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState([]);
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
    const fetchServicesData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        let data = {
          service_date_from: localStorage.getItem("service_date_from"),
          service_date_to: localStorage.getItem("service_date_to"),
          service_garage: localStorage.getItem("service_garage"),
          service_company: localStorage.getItem("service_company"),
          service_branch: localStorage.getItem("service_branch"),
          service_truck_no: localStorage.getItem("service_truck_no"),
        };
        const Response = await axios.post(
          `${BASE_URL}/api/fetch-services-report`,
          data,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setService(Response.data.services);
        console.log(Response.data, "resposne");
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchServicesData();
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
      service_date_from: localStorage.getItem("service_date_from"),
      service_date_to: localStorage.getItem("service_date_to"),
      service_garage: localStorage.getItem("service_garage"),
      service_company: localStorage.getItem("service_company"),
      service_branch: localStorage.getItem("service_branch"),
      service_truck_no: localStorage.getItem("service_truck_no"),
    };

    axios({
      url: BASE_URL + "/api/download-services-report",
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
        link.setAttribute("download", "services.csv");
        document.body.appendChild(link);
        link.click();
        toast.success("services Report is Downloaded Successfully");
      })
      .catch((err) => {
        toast.error("services Report is Not Downloaded");
      });
  };
  return (
    <Layout>
      <div className="bg-[#FFFFFF] p-2 rounded-lg ">
        <div className="sticky top-0 p-2 mb-4 border-b-2 border-red-500 rounded-lg bg-[#E1F5FA]">
          <h2 className="px-5 text-[black] text-lg flex flex-row justify-between items-center rounded-xl p-2">
            <div className="flex items-center gap-2">
              <IconInfoCircle className="w-4 h-4" />
              <span> Services Summary</span>
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
                onClick={() => navigate("/report-services-form")}
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
                SERVICES SUMMARY
              </h3>
              {service.length > 0 ? (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-200">
                      {[
                        "Date",
                        "Vehicle No",
                        "Company",
                        "Branch",
                        "Garage",
                        "Amount",
                        "No of Changes",
                      ].map((header) => (
                        <th key={header} className="p-1 text-xs border border-black">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {service.map((item, index) => (
                      <tr key={index}>
                        <td className="p-1 text-xs border border-black text-center">
                          {moment(item.service_date).format("DD-MM-YYYY")}
                        </td>
                        <td className="p-1 text-xs border border-black text-center">
                          {item.service_truck_no || "N/A"}
                        </td>
                        <td className="p-1 text-xs border border-black">
                          {item.service_company || "N/A"}
                        </td>
                        <td className="p-1 text-xs border border-black">
                          {item.service_branch || "N/A"}
                        </td>
                        <td className="p-1 text-xs border border-black">
                          {item.service_garage || "N/A"}
                        </td>

                        <td className="p-1 text-xs border border-black text-center">
                          <NumericFormat
                            value={item.service_amount}
                            displayType="text"
                            thousandSeparator={true}
                            prefix="₹"
                            thousandsGroupStyle="lakh"
                          />
                        </td>
                        <td className="p-1 text-xs border border-black text-center">
                          {item.service_count || "N/A"}
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

export default ServiceReportView;
