import Layout from "../../../layout/Layout";
import { useState, useEffect } from "react";
import BASE_URL from "../../../base/BaseUrl";
import { toast } from "sonner";
import axios from "axios";
import SelectInput from "../../../components/common/SelectField";
import { useNavigate } from "react-router-dom";
import { IconInfoCircle } from "@tabler/icons-react";
import moment from "moment";
import { ReportPaymentDownload, ReportPaymentView } from "../../../components/buttonIndex/ButtonComponents";

function PaymentReportForm() {
  const navigate = useNavigate();
  const [branch, setBranch] = useState([]);
  const todayback = moment().format("YYYY-MM-DD");
  const firstdate = moment().startOf("month").format("YYYY-MM-DD");
  const [downloadPaymentDetails, setPaymentDetailsDownload] = useState({
    payment_details_date_from: firstdate,
    payment_details_date_to: todayback,
    payment_details_credit: " ",
  });

  const onInputChange = (selectedOption, action) => {
    console.log("Selected Option:", selectedOption);
    console.log("Action:", action);

    setPaymentDetailsDownload((prevState) => ({
      ...prevState,
      [action.name]: selectedOption ? selectedOption.value : "",
    }));
  };

  const fetchBranches = async () => {
    try {
      const theLoginToken = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/web-fetch-branch`, {
        headers: {
          Authorization: `Bearer ${theLoginToken}`,
        },
      });

      console.log(response.data, "response");
      setBranch(response.data.branch || []);
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };
  useEffect(() => {
    fetchBranches();
  }, []);
  //DOWNLOAD
  const onSubmit = (e) => {
    e.preventDefault();
    let data = {
      payment_details_date_from:
        downloadPaymentDetails.payment_details_date_from,
      payment_details_date_to: downloadPaymentDetails.payment_details_date_to,
      payment_details_credit: downloadPaymentDetails.payment_details_credit,
    };
    var v = document.getElementById("dowRecp").checkValidity();
    var v = document.getElementById("dowRecp").reportValidity();

    if (v) {
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
          link.setAttribute("download", "Payment.csv");
          document.body.appendChild(link);
          link.click();
          toast.success("Payment is Downloaded Successfully");
        })
        .catch((err) => {
          toast.error("Payment is Not Downloaded");
        });
    }
  };
  const customStyles = {
    control: (provided) => ({
      ...provided,
      height: "34px",
      minHeight: "34px",
      fontSize: "0.75rem",
      borderRadius: "0.5rem",
      borderColor: "#2196F3",
    }),
    menu: (provided) => ({
      ...provided,
      fontSize: "0.75rem",
    }),
  };
  const inputClass =
    "w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 border-[#2196F3] h-[34px]";
  const FormLabel = ({ children, required }) => (
    <label className="block text-sm font-semibold text-black mb-1 ">
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );

  const handleview = () => {
    navigate("/report-payment-form/view");
    localStorage.setItem(
      "payment_details_date_from",
      downloadPaymentDetails.payment_details_date_from
    );
    localStorage.setItem(
      "payment_details_date_to",
      downloadPaymentDetails.payment_details_date_to
    );
    localStorage.setItem(
      "payment_details_credit",
      downloadPaymentDetails.payment_details_credit
    );
  };
  return (
    <Layout>
      <div className="  bg-[#FFFFFF] p-2   rounded-lg">
        <div className="sticky top-0 p-2  mb-4 border-b-2 border-red-500 rounded-lg  bg-[#E1F5FA] ">
          <h2 className=" px-5 text-[black] text-lg   flex flex-row  justify-between items-center  rounded-xl p-2 ">
            <div className="flex  items-center gap-2">
              <IconInfoCircle className="w-4 h-4" />
              <span>Payment</span>
            </div>
          </h2>
        </div>
        <hr />
        <div className="p-4">
          <form id="dowRecp" autoComplete="off">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <FormLabel required>From Date</FormLabel>
                <input
                  type="date"
                  name="payment_details_date_from"
                  value={downloadPaymentDetails.payment_details_date_from}
                  onChange={onInputChange}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <FormLabel required>To Date</FormLabel>
                <input
                  type="date"
                  name="payment_details_date_to"
                  value={downloadPaymentDetails.payment_details_date_to}
                  onChange={onInputChange}
                  className={inputClass}
                  required
                />
              </div>
              <SelectInput
                label="Branch"
                name="payment_details_credit"
                value={
                  downloadPaymentDetails.payment_details_credit
                    ? {
                        value: downloadPaymentDetails.payment_details_credit,
                        label: downloadPaymentDetails.payment_details_credit,
                      }
                    : null
                }
                options={branch.map((item) => ({
                  value: item.branch_name,
                  label: item.branch_name,
                }))}
                onChange={onInputChange}
                placeholder="Select Branch"
                styles={customStyles}
                isSearchable={true}
              />
            </div>

            {/* <div className="flex justify-center py-4">
              <button
                className=" text-center text-sm font-[400 ] cursor-pointer hover:animate-pulse w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
                onClick={onSubmit}
              >
                {" "}
                Download
              </button>
              <button
                className=" text-center text-sm font-[400 ] cursor-pointer hover:animate-pulse w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md ml-4"
                onClick={handleview}
              >
                {" "}
                View
              </button>
            </div> */}
            <div className="flex justify-center py-4">
              <ReportPaymentDownload
                className=" text-center text-sm font-[400 ] cursor-pointer hover:animate-pulse w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
                onClick={onSubmit}
              >
                {" "}
           
              </ReportPaymentDownload>
              <ReportPaymentView
                className=" text-center text-sm font-[400 ] cursor-pointer hover:animate-pulse w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md ml-4"
                onClick={handleview}
              >
        
              </ReportPaymentView>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default PaymentReportForm;
