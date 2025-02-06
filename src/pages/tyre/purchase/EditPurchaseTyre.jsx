import React, { useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { toast } from "sonner";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import { IconArrowBack, IconInfoCircle } from "@tabler/icons-react";

const TMake = [
  {
    value: "Nylon",
    label: "Nylon",
  },
  {
    value: "Radial",
    label: "Radial",
  },
];

const EditPurchaseTyre = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tyre, setTyre] = useState({
    tyre_date: "",
    tyre_reference: "",
    tyre_supplier: "",
    tyre_company: "",
    tyre_bill_ref: "",
    tyre_bill_amount: "",
    tyre_remarks: "",
    tyre_count: "",
    tyre_sub_data: "",
    tyre_branch: "",
  });
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const useTemplate = {
    tyre_sub_no: "",
    tyre_sub_type: "",
    tyre_sub_make: "",
    id: "",
  };

  const [users, setUsers] = useState([useTemplate]);
  const [loading, setLoading] = useState(false);
  const [branch, setBranch] = useState([]); //
  const [tyreMake, setTyreMake] = useState([]); //
  const [vendor, setVendor] = useState([]); //
  const [company, setCompany] = useState([]); //
  const fetchEditPurchase = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/web-fetch-tyre-by-id/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTyre(response.data?.tyre);
      setUsers(response.data?.tyreSub);
    } catch (error) {
      console.error("Error fetching edit purchase tyre add data", error);
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
      console.error("Error fetching purchase tyre add data", error);
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
      console.error("Error fetching purchase tyre company data", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchVendor = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/web-fetch-vendorsNew/Tyre`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setVendor(response.data?.vendor);
    } catch (error) {
      console.error("Error fetching Purchase Vendor tyre data", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchTyreMake = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/web-fetch-tyre-make`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTyreMake(response.data?.tyreMake);
    } catch (error) {
      console.error("Error fetching tyre make data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEditPurchase();
    fetchBranch();
    fetchCompany();
    fetchTyreMake();
  }, []);

  useEffect(() => {
    fetchVendor();
  }, []);

  const onChange = (e, index) => {
    const updatedUsers = users.map((user, i) =>
      index == i
        ? Object.assign(user, { [e.target.name]: e.target.value })
        : user
    );
    setUsers(updatedUsers);
  };

  const validateOnlyNumber = (inputtxt) => {
    var phoneno = /^\d*\.?\d*$/;
    if (inputtxt.match(phoneno) || inputtxt.length == 0) {
      return true;
    } else {
      return false;
    }
  };

  const onInputChange = (e) => {
    if (e.name == "tyre_supplier") {
      setTyre({
        ...tyre,
        tyre_supplier: e.value,
      });
    } else if (e.target.name == "tyre_bill_amount") {
      if (validateOnlyNumber(e.target.value)) {
        setTyre({
          ...tyre,
          [e.target.name]: e.target.value,
        });
      }
    } else {
      setTyre({
        ...tyre,
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
      tyre_date: tyre.tyre_date,
      tyre_reference: tyre.tyre_reference,
      tyre_supplier: tyre.tyre_supplier,
      tyre_company: tyre.tyre_company,
      tyre_branch: tyre.tyre_branch,
      tyre_bill_ref: tyre.tyre_bill_ref,
      tyre_bill_amount: tyre.tyre_bill_amount,
      tyre_remarks: tyre.tyre_remarks,
      tyre_count: tyre.tyre_count,
      tyre_sub_data: users,
    };

    setIsButtonDisabled(true);
    try {
      const res = await axios.put(`${BASE_URL}/api/web-update-tyre/${id}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      if (res.data.code == 200) {
        toast.success(res.data.msg);
        navigate("/tyre/purchase-list");
      } else {
        toast.error(res.data.msg);
      }
    } catch (error) {
      toast.error(error.response?.data?.msg || "Something went wrong!");
    } finally {
      setIsButtonDisabled(false);
    }
  };

  const FormLabel = ({ children, required }) => (
    <label className="block text-sm font-semibold text-black mb-1 ">
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );

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
              <span>Edit Purchase Tyre </span>
            </div>
            <IconArrowBack
              onClick={() => navigate("/tyre/purchase-list")}
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
            {/* date  */}
            <div>
              <FormLabel required>Date</FormLabel>
              <input
                type="date"
                required
                name="tyre_date"
                value={tyre.tyre_date}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
              />
            </div>
            {/* company  */}

            <div>
              <FormLabel required>Company</FormLabel>
              <select
                name="tyre_company"
                value={tyre.tyre_company}
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
            {/* Branch  */}
            <div>
              <FormLabel required>Branch</FormLabel>
              <select
                name="tyre_branch"
                value={tyre.tyre_branch}
                onChange={(e) => onInputChange(e)}
                required
                className={inputClassSelect}
              >
                <option value="">Select Branch</option>
                {branch.map((option) => (
                  <option key={option.branch_name} value={option.branch_name}>
                    {option.branch_name}
                  </option>
                ))}
              </select>
            </div>

            {/* suplier  */}
            <div>
              <FormLabel>Supplier</FormLabel>
              <Select
                name="payment_details_debit"
                options={vendor.map((option) => ({
                  value: option.vendor_name,
                  label: option.vendor_name,
                  name: "tyre_supplier",
                }))}
                onChange={(e) => onInputChange(e)}
                value={
                  tyre.tyre_supplier
                    ? {
                        value: tyre.tyre_supplier,
                        label: tyre.tyre_supplier,
                      }
                    : null
                }
                placeholder="Select Supplier"
                styles={customStyles}
                isSearchable={true}
              />
            </div>
            {/* Bill Ref  */}
            <div>
              <FormLabel>Bill Reference</FormLabel>
              <input
                type="text"
                name="tyre_bill_ref"
                value={tyre.tyre_bill_ref}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
              />
            </div>

            {/* Bill amount  */}
            <div>
              <FormLabel>Bill Amount</FormLabel>
              <input
                type="tel"
                name="tyre_bill_amount"
                value={tyre.tyre_bill_amount}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
              />
            </div>

            {/* Remark  */}
            <div className=" col-span-0 lg:col-span-3">
              <FormLabel>Remarks</FormLabel>
              <textarea
                type="text"
                name="tyre_remarks"
                value={tyre.tyre_remarks}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
                rows={3}
              />
            </div>
          </div>
          <hr />
          {users.map((user, index) => (
            <div
              className="grid grid-cols-1  md:grid-cols-1 lg:grid-cols-3 gap-6"
              key={index}
            >
              <div>
                <FormLabel required>Tyre No</FormLabel>
                <input
                  type="text"
                  name="tyre_sub_no"
                  value={user.tyre_sub_no}
                  onChange={(e) => onChange(e, index)}
                  className={inputClass}
                  required
                />
              </div>

              {/* Tyre Type  */}
              <div>
                <FormLabel required>Tyre Type</FormLabel>
                <select
                  name="tyre_sub_type"
                  value={user.tyre_sub_type}
                  onChange={(e) => onChange(e, index)}
                  required
                  className={inputClassSelect}
                >
                  <option value="">Select Tyre Type</option>
                  {TMake.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.value}
                    </option>
                  ))}
                </select>
              </div>
              {/* Tyre Make  */}
              <div>
                <FormLabel required>Tyre Make</FormLabel>
                <select
                  name="tyre_sub_make"
                  value={user.tyre_sub_make}
                  onChange={(e) => onChange(e, index)}
                  required
                  className={inputClassSelect}
                >
                  <option value="">Select Tyre Make</option>
                  {tyreMake.map((option) => (
                    <option key={option.tyre_make} value={option.tyre_make}>
                      {option.tyre_make}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}

          {/* Form Actions */}
          <div className="flex flex-wrap gap-4 justify-start">
            <button
              type="submit"
              className="text-center text-sm font-[400] cursor-pointer  w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
              disabled={isButtonDisabled}
            >
              {isButtonDisabled ? "Updating..." : "Update"}
            </button>

            <button
              type="button"
              className="text-center text-sm font-[400] cursor-pointer  w-36 text-white bg-red-600 hover:bg-red-400 p-2 rounded-lg shadow-md"
              onClick={() => {
                navigate("/tyre/purchase-list");
              }}
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditPurchaseTyre;
