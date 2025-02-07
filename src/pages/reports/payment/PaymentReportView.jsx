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
import { toast } from "sonner";
import moment from "moment";
import { NumericFormat } from "react-number-format";
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
const PaymentReportView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState([]);
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
    const fetchPaymentData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        let data = {
          payment_details_date_from: localStorage.getItem(
            "payment_details_date_from"
          ),
          payment_details_date_to: localStorage.getItem(
            "payment_details_date_to"
          ),
          payment_details_credit: localStorage.getItem(
            "payment_details_credit"
          ),
        };

        const Response = await axios.post(
          `${BASE_URL}/api/fetch-payments-details-report`,
          data,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setPayment(Response.data.payment);
        console.log(Response.data, "resposne");
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchPaymentData();
  }, []);

  if (loading) {
    return <SkeletonLoading />;
  }
  const handleSavePDF = () => {
    // Table body structure
    const tableBody = [
      ["Date", "Voucher", "Debit", "Credit", "Amount"],
      ...payment.map((item) => [
        moment(item.payment_details_date).format("DD-MM-YYYY"),
        item.payment_details_voucher_type || "-",
        item.payment_details_debit || "-",
        item.payment_details_credit || "-",
        item.payment_details_amount
          ? `₹${Number(item.payment_details_amount).toLocaleString("en-IN", {
              maximumFractionDigits: 2,
            })}`
          : "-",
      ]),
      [
        { text: "Total:", colSpan: 4, alignment: "right", bold: true },
        "",
        "",
        "",
        `₹${(
          Number(
            payment.length > 0
              ? payment.reduce(
                  (sum, payment) => sum + payment.payment_details_amount,
                  0
                )
              : 0
          ) || 0
        ).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`,
      ],
    ];

    const docDefinition = {
      pageSize: "A4",
      pageMargins: [10, 10, 10, 40],
      content: [
        {
          text: "PAYMENT DETAILS SUMMARY",
          style: "header",
          alignment: "center",
        },
        {
          table: {
            headerRows: 1,
            widths: ["15%", "20%", "30%", "20%", "15%"],
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
    toast.success("PDF is Downloaded Successfully");

    pdfMake.createPdf(docDefinition).download("Payment_report.pdf");
  };

  const onSubmit = (e) => {
    e.preventDefault();
    let data = {
      payment_details_date_to: localStorage.getItem("payment_details_date_to"),
      payment_details_date_from: localStorage.getItem(
        "payment_details_date_from"
      ),
      payment_details_credit: localStorage.getItem("payment_details_credit"),
    };

    axios({
      url: BASE_URL + "/api/download-payments-details-report",
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
        link.setAttribute("download", "paymentDetails.csv");
        document.body.appendChild(link);
        link.click();
        toast.success("paymentDetails Report is Downloaded Successfully");
      })
      .catch((err) => {
        toast.error("paymentDetails Report is Not Downloaded");
      });
  };
  return (
    <Layout>
      <div className="bg-[#FFFFFF] p-2 rounded-lg ">
        <div className="sticky top-0 p-2 mb-4 border-b-2 border-red-500 rounded-lg bg-[#E1F5FA]">
          <h2 className="px-5 text-[black] text-lg flex flex-row justify-between items-center rounded-xl p-2">
            <div className="flex items-center gap-2">
              <IconInfoCircle className="w-4 h-4" />
              <span>Payment Details Summary</span>
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
                onClick={() => navigate("/report-payment-form")}
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
                PAYMENT DETAILS SUMMARY
              </h3>
              {payment.length > 0 ? (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-200">
                      {["Date", "Voucher", "Debit", "Credit", "Amount"].map(
                        (header) => (
                          <th
                            key={header}
                            className="text-xs p-1 border border-black"
                          >
                            {header}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {payment.map((item, index) => (
                      <tr key={index}>
                        <td className="text-xs p-1 border border-black text-center">
                          {moment(item.payment_details_date).format(
                            "DD-MM-YYYY"
                          )}
                        </td>
                        <td className="text-xs p-1 border border-black px-2">
                          {item.payment_details_voucher_type || "-"}
                        </td>
                        <td className="text-xs p-1 border border-black px-2">
                          {item.payment_details_debit || "-"}
                        </td>
                        <td className="text-xs p-1 border border-black px-2">
                          {item.payment_details_credit || "-"}
                        </td>

                        <td className="text-xs p-1 border border-black text-end px-2">
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
                    <tr className="bg-gray-100 font-bold">
                      <td
                        colSpan={4}
                        className="p-1 text-xs border border-black text-right"
                      >
                        Total:
                      </td>

                      <td className="text-xs p-1 border border-black text-end">
                        <NumericFormat
                          value={payment.reduce(
                            (sum, payment) =>
                              sum + payment.payment_details_amount,
                            0
                          )}
                          displayType="text"
                          thousandSeparator={true}
                          prefix="₹"
                          thousandsGroupStyle="lakh"
                        ></NumericFormat>
                      </td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <div className="text-center text-gray-500 py-4">
                  No Payment Data Available
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

export default PaymentReportView;
