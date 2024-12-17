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
const SalaryReportMultipleView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [salary, setTrip] = useState([]);
  const [salarysummaryfooter, setSummaryFooter] = useState({});
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
    const fetchSalaryData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        let data = {
          trip_date_from: localStorage.getItem("trip_date_from"),
          trip_date_to: localStorage.getItem("trip_date_to"),
          trip_company: localStorage.getItem("trip_company"),
          trip_branch: localStorage.getItem("trip_branch"),
          trip_driver: localStorage.getItem("trip_driver"),
        };

        const Response = await axios.post(
          `${BASE_URL}/api/fetch-salary-multiple-report`,
          data,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setTrip(Response.data.salary);
        setSummaryFooter(Response.data.salary_footer);
        console.log(Response.data, "resposne");
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchSalaryData();
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
      trip_date_from: localStorage.getItem("trip_date_from"),
      trip_date_to: localStorage.getItem("trip_date_to"),
      trip_company: localStorage.getItem("trip_company"),
      trip_branch: localStorage.getItem("trip_branch"),
      trip_driver: localStorage.getItem("trip_driver"),
    };
    axios({
      url: BASE_URL + "/api/download-salary-multiple-report",
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
        link.setAttribute("download", "salary.csv");
        document.body.appendChild(link);
        link.click();
        toast.success("salary Report is Downloaded Successfully");
      })
      .catch((err) => {
        toast.error("salary Report is Not Downloaded");
      });
  };
  const onReportView = (e) => {
    e.preventDefault();
    let data = {
      trip_date_from: localStorage.getItem("trip_date_from"),
      trip_date_to: localStorage.getItem("trip_date_to"),
      trip_company: localStorage.getItem("trip_company"),
      trip_branch: localStorage.getItem("trip_branch"),
      trip_driver: localStorage.getItem("trip_driver"),
    };
    axios({
      url: BASE_URL + "/api/download-salary-report",
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
        link.setAttribute("download", "salary.csv");
        document.body.appendChild(link);
        link.click();
        toast.success("salary Report is Downloaded Successfully");
      })
      .catch((err) => {
        toast.error("salary Report is Not Downloaded");
      });
  };
  return (
    <Layout>
      <div className="bg-[#FFFFFF] p-2 rounded-lg ">
        <div className="sticky top-0 p-2 mb-4 border-b-2 border-red-500 rounded-lg bg-[#E1F5FA]">
          <h2 className="px-5 text-[black] text-lg flex flex-row justify-between items-center rounded-xl p-2">
            <div className="flex items-center gap-2">
              <IconInfoCircle className="w-4 h-4" />
              <span>Salary Summary</span>
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
                TRIP ACCOUNT OF DRIVERS
              </h3>
              {salary.length > 0 ? (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-200">
                      {[
                        "Company",
                        "Branch",
                        "Vehicle",
                        "Driver",
                        "Total Trip",

                        "Total KM",
                        "Trip Amount",
                        "Hamali",
                        "Incentive",
                        "Advance",
                        "Net Payable",
                      ].map((header) => (
                        <th key={header} className="p-2 border border-black">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {salary.map((item, index) => (
                      <tr key={index}>
                        <td className="p-2 border border-black">
                          {item.trip_company || "N/A"}
                        </td>

                        <td className="p-2 border border-black">
                          {item.trip_branch || "N/A"}
                        </td>

                        <td className="p-2 border border-black">
                          {item.trip_vehicle || "N/A"}
                        </td>

                        <td className="p-2 border border-black cursor-pointer">
                          <span onClick={(e) => onReportView(e)}>
                            {item.trip_driver}
                          </span>
                        </td>

                        <td className="p-2 border border-black">
                          {item.trip_count || "N/A"}
                        </td>
                        <td className="p-2 border border-black">
                          {item.trip_km || "N/A"}
                        </td>
                        <td className="p-2 border border-black">
                          <NumericFormat
                            value={item.trip_incentive_amount * item.trip_count}
                            displayType="text"
                            thousandSeparator={true}
                            prefix="₹"
                            thousandsGroupStyle="lakh"
                          ></NumericFormat>
                        </td>
                        <td className="p-2 border border-black">
                          <NumericFormat
                            value={item.trip_hmali}
                            displayType="text"
                            thousandSeparator={true}
                            prefix="₹"
                            thousandsGroupStyle="lakh"
                          ></NumericFormat>
                        </td>
                        <td className="p-2 border border-black">
                          <NumericFormat
                            value={item.trip_bata_amount}
                            displayType="text"
                            thousandSeparator={true}
                            prefix="₹"
                            thousandsGroupStyle="lakh"
                          ></NumericFormat>
                        </td>
                        <td className="p-2 border border-black">
                          <NumericFormat
                            value={item.trip_advance}
                            displayType="text"
                            thousandSeparator={true}
                            prefix="₹"
                            thousandsGroupStyle="lakh"
                          ></NumericFormat>
                        </td>
                        <td className="p-2 border border-black">
                          <NumericFormat
                            value={
                              item.trip_incentive_amount * item.trip_count +
                              item.trip_bata_for_trip +
                              (item.trip_hmali - item.trip_advance) +
                              +item.trip_bata_amount +
                              +item.trip_driver_salary +
                              item.trip_bata_for_km * item.trip_km
                            }
                            displayType="text"
                            thousandSeparator={true}
                            prefix="₹"
                            thousandsGroupStyle="lakh"
                          ></NumericFormat>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-100 font-bold">
                      <td
                        colSpan={4}
                        className="p-2 border border-black text-right"
                      >
                        Total:
                      </td>
                      <td className="p-2 border border-black">
                        {salarysummaryfooter.trip_count}
                      </td>
                      <td className="p-2 border border-black">
                        {salarysummaryfooter.trip_km}
                      </td>
                      <td className="p-2 border border-black">
                        <NumericFormat
                          value={
                            salarysummaryfooter.trip_incentive_amount *
                            salarysummaryfooter.trip_count
                          }
                          displayType="text"
                          thousandSeparator={true}
                          prefix="₹"
                          thousandsGroupStyle="lakh"
                        ></NumericFormat>
                      </td>
                      <td className="p-2 border border-black">
                        <NumericFormat
                          value={salarysummaryfooter.trip_hmali}
                          displayType="text"
                          thousandSeparator={true}
                          prefix="₹"
                          thousandsGroupStyle="lakh"
                        ></NumericFormat>
                      </td>

                      <td className="p-2 border border-black">
                        <NumericFormat
                          value={salarysummaryfooter.trip_bata_amount}
                          displayType="text"
                          thousandSeparator={true}
                          prefix="₹"
                          thousandsGroupStyle="lakh"
                        ></NumericFormat>
                      </td>
                      <td className="p-2 border border-black">
                        <NumericFormat
                          value={salarysummaryfooter.trip_advance}
                          displayType="text"
                          thousandSeparator={true}
                          prefix="₹"
                          thousandsGroupStyle="lakh"
                        ></NumericFormat>
                      </td>
                      <td className="p-2 border border-black">
                        <NumericFormat
                          value={
                            (salarysummaryfooter.trip_incentive_amount /
                              salarysummaryfooter.trip_count) *
                              salarysummaryfooter.trip_count +
                            salarysummaryfooter.trip_bata_for_trip +
                            (salarysummaryfooter.trip_hmali -
                              salarysummaryfooter.trip_advance) +
                            +(
                              salarysummaryfooter.trip_bata_amount /
                              salarysummaryfooter.trip_count
                            ) +
                            +(
                              salarysummaryfooter.trip_driver_salary /
                              salarysummaryfooter.trip_count
                            ) +
                            (salarysummaryfooter.trip_bata_for_km /
                              salarysummaryfooter.trip_count) *
                              salarysummaryfooter.trip_km
                          }
                          displayType="text"
                          thousandSeparator={true}
                          prefix="₹"
                          thousandsGroupStyle="lakh"
                        ></NumericFormat>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              ) : (
                <div className="text-center text-gray-500 py-4">
                  No Trip Data Available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SalaryReportMultipleView;
