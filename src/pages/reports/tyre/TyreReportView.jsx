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
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
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
const TyreReportView = () => {
  const navigate = useNavigate();
  const [tyre, setTyre] = useState([]);
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
          `${BASE_URL}/api/fetch-tyre-report`,
          data,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setTyre(Response.data.tyre);
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
    const tableBody = [
      [
        "Date",
        "Company	",
        "Branch",

        "Supplier",
        "Bill Ref",
        "Amount",
        "No of Tyres",
      ], // Header row
      ...tyre.map((item) => [
        moment(item.tyre_date).format("DD-MM-YYYY") || "-",
        item.tyre_company || "-",
        item.tyre_branch || "-",
        item.tyre_supplier || "-",
        item.tyre_bill_ref || "-",
        // item.tyre_bill_amount ? item.tyre_bill_amount.toLocaleString() : "-",
        item.tyre_bill_amount
          ? `₹${Number(item.tyre_bill_amount).toLocaleString("en-IN", {
              maximumFractionDigits: 2,
            })}`
          : "-",
        item.tyre_count || "-",
      ]),
    ];

    const docDefinition = {
      pageSize: "A4",
      pageMargins: [10, 10, 10, 10],
      content: [
        { text: "TYRE SUMMARY", style: "header", alignment: "center" },
        {
          table: {
            headerRows: 1,
            widths: [
              "16%",
              "16%",
              "16%",
              "16%",
              "16%",
              "10%",
              "10%", // Equal widths
            ],
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
      },
      defaultStyle: {
        fontSize: 7,
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
            text: new Date().toLocaleDateString("en-GB"),
            style: "footerText",
            alignment: "right",
            margin: [0, 0, 10, 0],
          },
        ],
        margin: [10, 0, 10, 10],
      }),
    };
    toast.success("PDF is Downloaded Successfully");

    pdfMake.createPdf(docDefinition).download("tyre_report.pdf");
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
      url: BASE_URL + "/api/download-tyre-report",
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
              <span> Tyres Summary</span>
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
                TYRE SUMMARY
              </h3>
              {tyre.length > 0 ? (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-200">
                      {[
                        "Date",

                        "Company",
                        "Branch",
                        "Supplier",
                        "Bill Ref	",
                        "Amount",
                        "No of Tyres",
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
                    {tyre.map((item, index) => (
                      <tr key={index}>
                        <td className="p-1 text-xs border border-black text-center">
                          {moment(item.tyre_date).format("DD-MM-YYYY")}
                        </td>
                        <td className="p-1 text-xs border border-black px-2">
                          {item.tyre_company || "-"}
                        </td>
                        <td className="p-1 text-xs border border-black px-2">
                          {item.tyre_branch || "-"}
                        </td>
                        <td className="p-1 text-xs border border-black px-2">
                          {item.tyre_supplier || "-"}
                        </td>
                        <td className="p-1 text-xs border border-black text-center">
                          {item.tyre_bill_ref || "-"}
                        </td>
                        <td className="p-1 text-xs border border-black text-end px-2">
                          <NumericFormat
                            value={item.tyre_bill_amount}
                            displayType="text"
                            thousandSeparator={true}
                            prefix="₹"
                            thousandsGroupStyle="lakh"
                          />
                        </td>
                        <td className="p-1 text-xs border border-black text-center">
                          {item.tyre_count || "-"}
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

export default TyreReportView;
