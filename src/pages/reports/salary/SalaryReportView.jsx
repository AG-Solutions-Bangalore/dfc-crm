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
const SalaryReportView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [salarysummary, setSummary] = useState({});
  const [salarysummarytop, setSummaryTop] = useState({});
  const [salarysummaryfooter, setSummaryFooter] = useState({});
  const [salarysummaryfootertcount, setSummaryFooterTCount] = useState({});
  const [salarysummaryfootertmileage, setSummaryFooterTMileage] = useState({});
  const [salarysummaryfooterthmali, setSummaryFooterTHmali] = useState({});
  const [salarysummaryfootertkm, setSummaryFooterTKM] = useState({});
  const [salarysummaryfooterthsd, setSummaryFooterTHSD] = useState({});
  const [salarysummaryfooterthsdsupplied, setSummaryFooterTHSDSupplied] =
    useState({});
  const [salarysummaryfootertadvance, setSummaryFooterTAdvance] = useState({});
  const [salarysummaryfootertbataamount, setSummaryFooterTBataAmount] =
    useState({});
  const [salarysummaryfootertbata, setSummaryFooterTBata] = useState({});
  const [salarysummaryfootertmysore, setSummaryFooterTMysore] = useState({});
  const [salarysummaryfootertripbatacount, setSummaryFooterTripBataCount] =
    useState({});
  const [salarysummaryfooterhsd, setSummaryFooterHSD] = useState({});
  const [salarysummaryfooterpayment, setSummaryFooterPayment] = useState({});
  const [salarysummarypayment, setSummaryPayment] = useState({});
  const [salarysummarypaymentcount, setSummaryPaymentCount] = useState({});
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

        const res = await axios.post(
          `${BASE_URL}/api/fetch-salary-report`,
          data,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setSummaryTop(res.data.salary_top);
        setSummary(res.data.salary_bottom);
        setSummaryFooter(res.data.salary_footer);
        setSummaryFooterTCount(res.data.salary_footer_trip_count);
        setSummaryFooterTMileage(res.data.salary_footer_trip_mileage);
        setSummaryFooterTHmali(res.data.salary_footer_trip_hmali);
        setSummaryFooterTKM(res.data.salary_footer_trip_km);
        setSummaryFooterTHSD(res.data.salary_footer_trip_hsd);
        setSummaryFooterTHSDSupplied(res.data.salary_footer_trip_hsd_supplied);
        setSummaryFooterTAdvance(res.data.salary_footer_trip_advance);
        setSummaryFooterTBataAmount(res.data.salary_footer_trip_bata_amount);
        setSummaryFooterTBata(res.data.salary_footer_trip_bata);
        setSummaryFooterTMysore(res.data.salary_footer_mysore);
        setSummaryFooterHSD(res.data.salary_footer_hsd);
        setSummaryFooterPayment(res.data.salary_payament_advance);
        setSummaryFooterTripBataCount(res.data.trip_bata_per_day_count.length);
        setSummaryPaymentCount(res.data.salary_payament_count);
        setSummaryPayment(res.data.salary_payament);
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
                onClick={() => navigate("/report-salary-form")}
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
            {/* //TABLE ONE........................................... */}
            <div className="mb-4 width">
              <h3 className="text-xl font-bold mb-2 text-center">
                Salary Summary
              </h3>
              {salarysummary.length > 0 ? (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-200">
                      {[
                        "Sl No",

                        "Date",
                        "Destination",
                        "Average",
                        "Hamali",
                        "RT KM",
                        "Fixed HSD",
                        "Issued HSD",
                        "Advance",
                        "RT KM Incentive",
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
                    <tr>
                      <td className="text-xs border border-black"></td>
                      <td className="text-xs border border-black"></td>
                      <td className="text-xs border border-black text-center">
                        HSD BALANCE B/F
                      </td>
                      <td className="text-xs border border-black"></td>
                      <td className="text-xs border border-black"></td>
                      <td className="text-xs border border-black"></td>

                      <td className="text-xs border border-black text-center">
                        {salarysummaryfooterhsd}
                      </td>
                      <td className="text-xs border border-black"></td>
                      <td className="text-xs border border-black"></td>

                      <td className="text-xs border border-black"></td>
                    </tr>
                    {salarysummary.map((item, index) => (
                      <tr key={index}>
                        <td className="text-xs border border-black text-center">
                          {index + 1 || "N/A"}
                        </td>
                        <td className="text-xs border border-black text-center">
                          {moment(item.trip_date).format("DD-MM-YYYY")}
                        </td>
                        <td className="text-xs border border-black text-center">
                          {item.trip_agency || "N/A"}
                        </td>
                        <td className="text-xs border border-black text-center">
                          {item.trip_km / item.trip_hsd_supplied == "Infinity"
                            ? 0
                            : (item.trip_km / item.trip_hsd_supplied).toFixed(
                                2
                              )}
                        </td>

                        <td className="text-xs border border-black text-center">
                          <NumericFormat
                            value={item.trip_hmali}
                            displayType="text"
                            thousandSeparator={true}
                            prefix="₹"
                            thousandsGroupStyle="lakh"
                          />
                        </td>
                        <td className="text-xs border border-black text-center">
                          {item.trip_km || "N/A"}
                        </td>
                        <td className="text-xs border border-black text-center">
                          {item.trip_hsd || "N/A"}
                        </td>
                        <td className="text-xs border border-black text-center">
                          {item.trip_hsd_supplied || "N/A"}
                        </td>
                        <td className="text-xs border border-black text-center">
                          <NumericFormat
                            value={item.trip_advance}
                            displayType="text"
                            thousandSeparator={true}
                            prefix="₹"
                            thousandsGroupStyle="lakh"
                          />
                        </td>
                        <td className="text-xs border border-black text-center">
                          <NumericFormat
                            value={item.trip_bata_amount}
                            displayType="text"
                            thousandSeparator={true}
                            prefix="₹"
                            thousandsGroupStyle="lakh"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>

                  <tfoot>
                    <tr className="bg-gray-100 font-bold">
                      <td
                        colSpan={3}
                        className="text-xs p-1  border border-black text-center"
                      >
                        Total:
                      </td>
                      <td className="text-xs p-1  border border-black text-center">
                        <span>
                          {Math.round(
                            (salarysummaryfootertkm.trip_km /
                              salarysummaryfooterthsdsupplied.trip_hsd_supplied) *
                              100
                          ) / 100}
                        </span>
                      </td>

                      <td className="text-xs p-1  border border-black text-center">
                        <NumericFormat
                          value={salarysummaryfooterthmali.trip_hmali}
                          displayType="text"
                          thousandSeparator={true}
                          prefix="₹"
                          thousandsGroupStyle="lakh"
                        ></NumericFormat>
                      </td>

                      <td className="text-xs p-1  border border-black text-center">
                        {salarysummaryfootertkm.trip_km}
                      </td>
                      <td className="text-xs p-1  border border-black text-center">
                        {salarysummaryfooterthsd.trip_hsd}
                      </td>
                      <td className="text-xs p-1 border border-black text-center">
                        {salarysummaryfooterthsdsupplied.trip_hsd_supplied}
                      </td>

                      <td className="text-xs p-1 border border-black text-center">
                        <NumericFormat
                          value={salarysummaryfootertadvance.trip_advance}
                          displayType="text"
                          thousandSeparator={true}
                          prefix="₹"
                          thousandsGroupStyle="lakh"
                        ></NumericFormat>
                      </td>

                      <td className="text-xs p-1 border border-black text-center">
                        <NumericFormat
                          value={
                            salarysummaryfootertbataamount.trip_bata_amount
                          }
                          displayType="text"
                          thousandSeparator={true}
                          prefix="₹"
                          thousandsGroupStyle="lakh"
                        ></NumericFormat>
                      </td>
                    </tr>
                    <tr>
                      <td
                        className="text-xs p-1 border border-black text-right"
                        colSpan={8}
                      >
                        Driver Salary
                      </td>
                      <td className="text-xs p-1  border border-black text-center">
                        <NumericFormat
                          value={salarysummaryfooter.trip_driver_salary}
                          displayType="text"
                          thousandSeparator={true}
                          prefix="₹"
                          thousandsGroupStyle="lakh"
                        ></NumericFormat>
                      </td>
                      <td className="text-xs border border-black"></td>
                    </tr>
                    <tr>
                      <td
                        className="text-xs p-1  border border-black text-right"
                        colSpan={8}
                      >
                        Trip Salary
                      </td>
                      <td className="text-xs p-1  border border-black text-center">
                        <NumericFormat
                          value={
                            salarysummaryfooter.trip_incentive_amount *
                            salarysummaryfootertcount.trip_count
                          }
                          displayType="text"
                          thousandSeparator={true}
                          prefix="₹"
                          thousandsGroupStyle="lakh"
                        ></NumericFormat>
                      </td>
                      <td className="text-xs  border border-black"></td>
                    </tr>
                    <tr>
                      <td
                        className="text-xs p-1  border border-black text-right"
                        colSpan={8}
                      >
                        Incentive RTKM Amount
                      </td>
                      <td className="text-xs p-1  border border-black text-center">
                        <NumericFormat
                          value={
                            salarysummaryfooter.trip_bata_for_km *
                            salarysummaryfootertkm.trip_km
                          }
                          displayType="text"
                          thousandSeparator={true}
                          prefix="₹"
                          thousandsGroupStyle="lakh"
                        ></NumericFormat>
                      </td>
                      <td className="text-xs   border border-black"></td>
                    </tr>
                    <tr>
                      <td
                        className="text-xs p-1 border border-black text-right"
                        colSpan={8}
                      >
                        Incentive Trip Amount
                      </td>
                      <td className="text-xs p-1 border border-black text-center">
                        <NumericFormat
                          value={salarysummaryfootertbata.trip_bata_for_trip}
                          displayType="text"
                          thousandSeparator={true}
                          prefix="₹"
                          thousandsGroupStyle="lakh"
                        ></NumericFormat>
                      </td>
                      <td className="text-xs border border-black"></td>
                    </tr>
                    <tr>
                      <td
                        className="text-xs p-1  border border-black text-right"
                        colSpan={8}
                      >
                        Trip Hamali
                      </td>
                      <td className="text-xs p-1 border border-black text-center">
                        <NumericFormat
                          value={salarysummaryfooterthmali.trip_hmali}
                          displayType="text"
                          thousandSeparator={true}
                          prefix="₹"
                          thousandsGroupStyle="lakh"
                        ></NumericFormat>
                      </td>
                      <td className="text-xs border border-black"></td>
                    </tr>
                    <tr>
                      <td
                        className="text-xs p-1 border border-black text-right"
                        colSpan={8}
                      >
                        Gross Payable
                      </td>
                      <td className="text-xs p-1 border border-black font-bold text-center">
                        <NumericFormat
                          value={
                            salarysummaryfooter.trip_incentive_amount *
                              salarysummaryfootertcount.trip_count +
                            salarysummaryfootertbata.trip_bata_for_trip +
                            (salarysummaryfooterthmali.trip_hmali -
                              salarysummaryfootertadvance.trip_advance) +
                            +salarysummaryfooter.trip_driver_salary +
                            salarysummaryfooter.trip_bata_for_km *
                              salarysummaryfootertkm.trip_km
                          }
                          displayType="text"
                          thousandSeparator={true}
                          prefix="₹"
                          thousandsGroupStyle="lakh"
                        ></NumericFormat>
                      </td>
                      <td className="text-xs border border-black"></td>
                    </tr>
                    <tr>
                      <td
                        className="text-xs p-1 border border-black text-right"
                        colSpan={8}
                      >
                        Incentive Add
                      </td>
                      <td className="text-xs p-1 border border-black text-center">
                        <NumericFormat
                          value={
                            parseInt(
                              salarysummaryfootertbataamount.trip_bata_amount
                            ) +
                            +(
                              salarysummaryfootertmysore.rtkm_mysore *
                              salarysummaryfooter.trip_bata_for_km
                            )
                          }
                          displayType="text"
                          thousandSeparator={true}
                          prefix="₹"
                          thousandsGroupStyle="lakh"
                        ></NumericFormat>
                      </td>
                      <td className="text-xs border border-black"></td>
                    </tr>
                    <tr>
                      <td
                        className="p-1 text-xs border border-black text-right"
                        colSpan={8}
                      >
                        Trip Bata for a Day
                      </td>
                      <td className="text-xs p-1 border border-black text-center">
                        <NumericFormat
                          value={
                            parseInt(salarysummaryfootertripbatacount) *
                            parseInt(
                              salarysummarytop.trip_bata_for_day == null
                                ? 0
                                : salarysummarytop.trip_bata_for_day
                            )
                          }
                          displayType="text"
                          thousandSeparator={true}
                          prefix="₹"
                          thousandsGroupStyle="lakh"
                        ></NumericFormat>
                      </td>
                      <td className="text-xs border border-black"></td>
                    </tr>
                    <tr>
                      <td
                        className="p-1 text-xs border border-black text-right"
                        colSpan={8}
                      >
                        Payment Advance
                      </td>
                      <td className="text-xs p-1 border border-black text-center">
                        <NumericFormat
                          value={
                            salarysummaryfooterpayment.payment_details_amount ==
                            null
                              ? 0
                              : salarysummaryfooterpayment.payment_details_amount
                          }
                          displayType="text"
                          thousandSeparator={true}
                          prefix="₹"
                          thousandsGroupStyle="lakh"
                        ></NumericFormat>
                      </td>
                      <td className="text-xs border border-black"></td>
                    </tr>
                    <tr>
                      <td
                        className="text-xs p-1  border border-black text-right"
                        colSpan={8}
                      >
                        Net Payable{" "}
                      </td>
                      <td className="text-xs p-1 border border-black font-bold text-center">
                        <NumericFormat
                          value={
                            salarysummaryfooter.trip_incentive_amount *
                              salarysummaryfootertcount.trip_count +
                            salarysummaryfootertmysore.rtkm_mysore *
                              salarysummaryfooter.trip_bata_for_km +
                            salarysummaryfootertbata.trip_bata_for_trip +
                            (salarysummaryfooterthmali.trip_hmali -
                              salarysummaryfootertadvance.trip_advance) +
                            +salarysummaryfootertbataamount.trip_bata_amount +
                            +salarysummaryfooter.trip_driver_salary +
                            salarysummaryfooter.trip_bata_for_km *
                              salarysummaryfootertkm.trip_km -
                            (salarysummaryfooterpayment.payment_details_amount ==
                            null
                              ? 0
                              : salarysummaryfooterpayment.payment_details_amount) +
                            salarysummaryfootertripbatacount *
                              (salarysummarytop.trip_bata_for_day == null
                                ? 0
                                : salarysummarytop.trip_bata_for_day)
                          }
                          displayType="text"
                          thousandSeparator={true}
                          prefix="₹"
                          thousandsGroupStyle="lakh"
                        ></NumericFormat>
                      </td>
                      <td className="text-xs border border-black"></td>
                    </tr>
                    <tr>
                      <td
                        className="text-xs p-1 border border-black"
                        colSpan={10}
                      >
                        Remarks
                      </td>
                    </tr>

                    <tr>
                      <td className="text-xs border border-black"></td>
                      <td className="text-xs border border-black"></td>
                      <td className="text-xs border border-black">
                        HSD BALANCE C/F
                      </td>
                      <td className="text-xs border border-black"></td>

                      <td className="text-xs border border-black"></td>

                      <td className="text-xs border border-black"></td>

                      <td className="text-xs border border-black"></td>
                      <td className="text-xs border border-black text-center">
                        {salarysummaryfooterthsdsupplied.trip_hsd_supplied +
                          +salarysummaryfooterhsd -
                          salarysummaryfooterthsd.trip_hsd}
                      </td>
                      <td className="text-xs border border-black"></td>

                      <td className="text-xs border border-black"></td>
                    </tr>
                  </tfoot>
                </table>
              ) : (
                <div className="text-center text-gray-500 py-4">
                  No Tyre Data Available
                </div>
              )}
            </div>
            {/* {.............................../* //TABLE TWO ............................................*/}
            <div>
              {salarysummary.length > 0 ? (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-200">
                      {[
                        "HSD BALANCE B/F",
                        "FIXED HSD",
                        "ISSUED HSD",
                        "HSD DEDUCTION",
                        "HSD BALANCE C/F",
                      ].map((header) => (
                        <th
                          key={header}
                          className="text-xs p-4 border border-black"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-xs border border-black text-center">
                        {salarysummaryfooterhsd || "N/A"}
                      </td>
                      <td className="text-xs border border-black text-center">
                        {salarysummaryfooterthsd.trip_hsd || "N/A"}
                      </td>
                      <td className="text-xs border border-black text-center">
                        {salarysummaryfooterthsdsupplied.trip_hsd_supplied ||
                          "N/A"}
                      </td>
                      <td className="text-xs border border-black text-center"></td>
                      <td className="text-xs border border-black text-center">
                        {salarysummaryfooterthsdsupplied.trip_hsd_supplied +
                          +salarysummaryfooterhsd -
                          salarysummaryfooterthsd.trip_hsd}
                      </td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <div className="text-center text-gray-500 py-4">
                  No Service Data Available
                </div>
              )}
            </div>
            {/* ///......................TABLE THREE.................. */}

            <div>
              {salarysummarypayment.length > 1 && (
                <>
                  <h3 className="text-xl font-bold mb-2 text-center my-4">
                    ADVANCE LIST
                  </h3>

                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-200">
                        {["Sl No", "Date", "Amount"].map((header) => (
                          <th
                            key={header}
                            className="text-xs border border-black"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {salarysummarypayment.map((item, index) => (
                        <tr key={index}>
                          <td className="text-xs border border-black text-center">
                            {index + 1 || "N/A"}
                          </td>

                          <td className="text-xs border border-black text-center">
                            {moment(item.payment_details_date).format(
                              "DD-MM-YYYY"
                            )}
                          </td>

                          <td className="text-xs border border-black text-center">
                            <NumericFormat
                              value={item.payment_details_amount}
                              displayType="text"
                              thousandSeparator={true}
                              prefix="₹"
                              thousandsGroupStyle="lakh"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-100 font-bold text-center">
                        <td
                          colSpan={2}
                          className="text-xs border border-black text-right"
                        >
                          Total:
                        </td>
                        <td className="text-xs border border-black font-bold">
                          <NumericFormat
                            value={
                              salarysummaryfooterpayment.payment_details_amount ==
                              null
                                ? 0
                                : salarysummaryfooterpayment.payment_details_amount
                            }
                            displayType="text"
                            thousandSeparator={true}
                            prefix="₹"
                            thousandsGroupStyle="lakh"
                          />
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SalaryReportView;
