import React, { useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import BASE_URL from "../../../base/BaseUrl";
import axios from "axios";
import { IconArrowBack, IconInfoCircle } from "@tabler/icons-react";
import Select from "react-select";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";
import {
  BackButton,
  CreateButton,
} from "../../../components/common/ButtonColors";
import { decryptId } from "../../../components/common/EncryptionDecryption";

const details_type = [
  {
    value: "Cash",
    label: "Cash",
  },
  {
    value: "Bank",
    label: "Bank",
  },
  {
    value: "NEFT",
    label: "NEFT",
  },
  {
    value: "Cheque",
    label: "Cheque",
  },
];

const EditAdvancePayment = () => {
  const { id } = useParams();
  const decryptedId = decryptId(id);

  const navigate = useNavigate();
  const [payment, setPayment] = useState({
    payment_details_date: "",
    payment_details_type: "",
    payment_details_company: "",
    payment_details_voucher_type: "Advance",
    payment_details_debit: "",
    payment_details_amount: "",
    payment_details_credit: "",
    payment_details_transaction: "",
    payment_details_narration: "",
  });
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  // credit
  const [branch, setBranch] = useState([]);
  // debit
  const [debitData, setDebitData] = useState([]);
  const [company, setCompany] = useState([]);
  const fetchEditPayment = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/web-fetch-payment-details-by-id/${decryptedId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPayment(response.data?.payment);
    } catch (error) {
      console.error("Error fetching edit Advance Payment data", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchBranch = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/web-fetch-branch`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBranch(response.data?.branch);
    } catch (error) {
      console.error("Error fetching Advance Payment data", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchCompany = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/web-fetch-company`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCompany(response.data?.company);
    } catch (error) {
      console.error("Error fetching Advance Company data", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchDebit = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/web-fetch-mix-by-id/${payment.payment_details_voucher_type}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDebitData(response.data?.mix);
    } catch (error) {
      console.error("Error fetching Debit Payment data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEditPayment();
    fetchBranch();
    fetchCompany();
  }, []);

  useEffect(() => {
    fetchDebit();
  }, [payment.payment_details_voucher_type]);

  const validateOnlyDigits = (inputtxt) => {
    var phoneno = /^\d+$/;
    if (inputtxt.match(phoneno) || inputtxt.length == 0) {
      return true;
    } else {
      return false;
    }
  };

  const onInputChange = (e) => {
    if (e.name == "payment_details_debit") {
      setPayment({
        ...payment,
        payment_details_debit: e.value,
      });
    } else if (e.target.name == "payment_details_amount") {
      if (validateOnlyDigits(e.target.value)) {
        setPayment({
          ...payment,
          [e.target.name]: e.target.value,
        });
      }
    } else {
      setPayment({
        ...payment,
        [e.target.name]: e.target.value,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = document.getElementById("addIndiv");
    if (!form.checkValidity()) {
      toast.error("Fill all required");
      setIsButtonDisabled(false);

      return;
    }
    const data = {
      payment_details_date: payment.payment_details_date,
      payment_details_type: payment.payment_details_type,
      payment_details_company: payment.payment_details_company,
      payment_details_voucher_type: payment.payment_details_voucher_type,
      payment_details_debit: payment.payment_details_debit,
      payment_details_amount: payment.payment_details_amount,
      payment_details_credit: payment.payment_details_credit,
      payment_details_transaction: payment.payment_details_transaction,
      payment_details_narration: payment.payment_details_narration,
    };

    setIsButtonDisabled(true);
    axios({
      url: BASE_URL + `/api/web-update-payment-details/${decryptedId}`,
      method: "PUT",
      data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      if (res.data.code == 200) {
        toast.success(res.data.msg);
      } else if (res.data.code == 400) {
        toast.error(res.data.msg);
      }
      navigate("/payment/advance-list");
    });
  };

  const FormLabel = ({ children, required }) => (
    <label className="block text-sm font-semibold text-black mb-1 ">
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
  const onDelete = (e) => {
    e.preventDefault();
    let data = {
      payment_details_id: decryptedId,
    };

    var v = document.getElementById("addIndiv").checkValidity();
    var v = document.getElementById("addIndiv").reportValidity();

    if (v) {
      setIsButtonDisabled(true);
      axios({
        url: BASE_URL + "/api/web-delete-payment-details",
        method: "POST",
        data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then((res) => {
        if (res.data.code == "200") {
          toast.success("Payment is Deleted Sucessfully");
          setOpenDialog(false);
          navigate("/payment/advance-list");
        } else {
          toast.error("Could Not Delete the Payment");
        }
      });
    }
  };

  const inputClassSelect =
    "w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 border-blue-500";
  const inputClass =
    "w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500 border-blue-500";

  return (
    <Layout>
      <div className=" bg-[#FFFFFF] p-2  rounded-lg  ">
        <div className="sticky top-0 p-2  mb-4 border-b-2 border-red-500 rounded-lg  bg-[#E1F5FA] ">
          <h2 className=" px-5 text-[black] text-lg   flex flex-row  justify-between items-center  rounded-xl p-2 ">
            <div className="flex  items-center gap-2">
              <IconInfoCircle className="w-4 h-4" />
              <span>Edit Advance Payment</span>
            </div>
            <IconArrowBack
              onClick={() => navigate("/payment/advance-list")}
              className="cursor-pointer hover:text-red-600"
            />
          </h2>
        </div>
        <hr />
        <form
          onSubmit={handleSubmit}
          id="addIndiv"
          className="w-full max-w-7xl  rounded-lg mx-auto p-4 space-y-6 "
        >
          <div className="grid grid-cols-1  md:grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <FormLabel required>Date</FormLabel>
              <input
                type="date"
                required
                name="payment_details_date"
                value={payment.payment_details_date}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
              />
            </div>
            {/* type  */}
            <div>
              <FormLabel required>Type</FormLabel>
              <select
                name="payment_details_type"
                value={payment.payment_details_type}
                onChange={(e) => onInputChange(e)}
                required
                className={inputClassSelect}
              >
                <option value="">Select Type</option>
                {details_type.map((option) => (
                  <option key={option.label} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* debit  */}
            <div>
              <FormLabel required>Debit</FormLabel>
              <Select
                name="payment_details_debit"
                options={debitData.map((option) => ({
                  value: option.common_name,
                  label: option.common_name,
                  name: "payment_details_debit",
                }))}
                onChange={(e) => onInputChange(e)}
                value={
                  payment.payment_details_debit
                    ? {
                        value: payment.payment_details_debit,
                        label: payment.payment_details_debit,
                      }
                    : null
                }
                placeholder="Select Debit"
                styles={customStyles}
                isSearchable={true}
                required
              />
              {/* <select
                name="payment_details_debit"
                value={payment.payment_details_debit}
                onChange={(e) => onInputChange(e)}
               
                className={inputClassSelect}
              >
                <option value="">Select Debit</option>
                {debitData.map((option) => (
                  <option key={option.common_name} value={option.common_name}>
                    {option.common_name}
                  </option>
                ))}
              </select> */}
            </div>
            {/* amount  */}
            <div>
              <FormLabel required>Amount</FormLabel>
              <input
                type="tel"
                name="payment_details_amount"
                value={payment.payment_details_amount}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
                required
              />
            </div>
            {/* company  */}

            <div>
              <FormLabel required>Company</FormLabel>
              <select
                name="payment_details_company"
                value={payment.payment_details_company}
                onChange={(e) => onInputChange(e)}
                required
                className={inputClassSelect}
              >
                <option value="">Select Company</option>
                {company.map((option) => (
                  <option key={option.company_name} value={option.company_name}>
                    {option.company_name}
                  </option>
                ))}
              </select>
            </div>

            {/* credit  */}
            <div>
              <FormLabel required>Credit</FormLabel>
              <select
                name="payment_details_credit"
                value={payment.payment_details_credit}
                onChange={(e) => onInputChange(e)}
                required
                className={inputClassSelect}
              >
                <option value="">Select Credit</option>
                {branch.map((option) => (
                  <option key={option.branch_name} value={option.branch_name}>
                    {option.branch_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {" "}
            {/* Transaction details  */}
            <div>
              <FormLabel>Transaction Details</FormLabel>
              <textarea
                type="text"
                name="payment_details_transaction"
                value={payment.payment_details_transaction}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
                rows={3}
              />
            </div>
            {/* narration details  */}
            <div>
              <FormLabel>Narration Details</FormLabel>
              <textarea
                type="text"
                name="payment_details_narration"
                value={payment.payment_details_narration}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
                rows={3}
              />
            </div>
          </div>
          {/* Form Actions */}
          <div className="flex flex-wrap gap-4 justify-start">
            <button
              type="submit"
              className={CreateButton}
              disabled={isButtonDisabled}
            >
              {isButtonDisabled ? "Updating..." : "Update"}
            </button>

            <button
              type="button"
              className={BackButton}
              onClick={() => {
                setOpenDialog(true);
              }}
            >
              Delete
            </button>
            <button
              type="button"
              className={BackButton}
              onClick={() => {
                navigate("/payment/advance-list");
              }}
            >
              Back
            </button>
          </div>
        </form>
      </div>
      <Dialog
        open={openDialog}
        handler={() => setOpenDialog(false)}
        transition="slide-in"
        transitionDuration={500}
      >
        <DialogHeader className="text-xl">
          Are you sure you want to Delete Advance Payment?
        </DialogHeader>

        <DialogFooter>
          <button
            className={`${BackButton} mx-2`}
            onClick={() => setOpenDialog(false)}
            aria-label="Cancel logout"
          >
            <span>Cancel</span>
          </button>
          <button
            className={CreateButton}
            onClick={onDelete}
            aria-label="Confirm logout"
          >
            <span>Yes</span>
          </button>
        </DialogFooter>
      </Dialog>
    </Layout>
  );
};

export default EditAdvancePayment;
