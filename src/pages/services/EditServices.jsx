import React, { useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import BASE_URL from "../../base/BaseUrl";
import axios from "axios";
import {
  IconArrowBack,
  IconInfoCircle,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import Select from "react-select";
import { BackButton, CreateButton } from "../../components/common/ButtonColors";
import { decryptId } from "../../components/common/EncryptionDecryption";

const status = [
  {
    value: "Pending",
    label: "Pending",
  },
  {
    value: "Finish",
    label: "Finish",
  },
  {
    value: "Cancel",
    label: "Cancel",
  },
];

const EditServices = () => {
  const { id } = useParams();
  const decryptedId = decryptId(id);

  const navigate = useNavigate();
  const [service, setService] = useState({
    service_date: "",
    service_ref: "",
    service_company: "",
    service_branch: "",
    service_truck_no: "",
    service_garage: "",
    service_km: "",
    service_pre_km: "",
    service_amount: "",
    service_remarks: "",
    service_count: "",
    service_status: "",
    service_sub_data: "",
  });
  const [count, setCount] = useState(1);

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const useTemplate = {
    service_sub_type: "",
    service_sub_amount: "",
    service_sub_details: "",
  };

  const [users, setUsers] = useState([useTemplate]);
  const [loading, setLoading] = useState(false);
  //garage
  const [vendor, setVendor] = useState([]);
  //service type
  const [serviceType, setServicesType] = useState([]);

  const fetchEditService = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/web-fetch-services-by-id/${decryptedId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setService(response.data?.services);
      setUsers(response.data?.servicesSub);
    } catch (error) {
      console.error("Error fetching service edit data", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGarage = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/web-fetch-vendorsNew/Garage`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setVendor(response.data?.vendor);
    } catch (error) {
      console.error("Error fetching garage data", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchServiceType = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/web-fetch-service-types`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setServicesType(response.data?.serviceTypes);
    } catch (error) {
      console.error("Error fetching service Type data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEditService();
    fetchServiceType();
  }, []);

  useEffect(() => {
    fetchGarage();
  }, [service.service_branch]);

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

  const validateOnlyDigits = (inputtxt) => {
    var phoneno = /^\d+$/;
    if (inputtxt.match(phoneno) || inputtxt.length == 0) {
      return true;
    } else {
      return false;
    }
  };

  const onInputChange = (e) => {
    if (e.name == "service_truck_no") {
      setService({
        ...service,
        service_truck_no: e.value,
      });
    } else if (e.name == "service_garage") {
      setService({
        ...service,
        service_garage: e.value,
      });
    } else if (e.target.name == "service_km") {
      if (validateOnlyNumber(e.target.value)) {
        setService({
          ...service,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name == "service_pre_km") {
      if (validateOnlyNumber(e.target.value)) {
        setService({
          ...service,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name == "service_amount") {
      if (validateOnlyDigits(e.target.value)) {
        setService({
          ...service,
          [e.target.name]: e.target.value,
        });
      }
    } else {
      setService({
        ...service,
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
      service_truck_no: service.service_truck_no,
      service_garage: service.service_garage,
      service_km: service.service_km,
      service_pre_km: service.service_pre_km,
      service_amount: service.service_amount,
      service_remarks: service.service_remarks,
      service_status: service.service_status,
      service_count: count,
      service_sub_data: users,
    };

    setIsButtonDisabled(true);
    axios({
      url: BASE_URL + `/api/web-update-services/${decryptedId}`,
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
      navigate("/service-list");
    });
  };
  const addItem = () => {
    setUsers([...users, useTemplate]);
    setCount(count + 1);
  };
  const removeUser = (index) => {
    const filteredUsers = [...users];
    filteredUsers.splice(index, 1);
    setUsers(filteredUsers);
    setCount(count - 1);
  };
  console.log(count, "count");
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
              <span>Edit Services </span>
            </div>
            <IconArrowBack
              onClick={() => navigate("/service-list")}
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
          <div className="grid grid-cols-1  md:grid-cols-1 lg:grid-cols-4 gap-6">
            {/* date  */}
            <div>
              <FormLabel required>Date</FormLabel>
              <input
                type="date"
                required
                name="service_date"
                value={service.service_date}
                onChange={(e) => onInputChange(e)}
                className={`${inputClass}   cursor-not-allowed`}
                disabled
              />
            </div>
            {/* company  */}
            <div>
              <FormLabel required>Company</FormLabel>
              <input
                type="text"
                name="service_company"
                value={service.service_company}
                onChange={(e) => onInputChange(e)}
                className={`${inputClass}   cursor-not-allowed`}
                required
                disabled
              />
            </div>

            {/* Branch  */}
            <div>
              <FormLabel required>Branch</FormLabel>
              <input
                type="text"
                name="service_branch"
                value={service.service_branch}
                onChange={(e) => onInputChange(e)}
                className={`${inputClass}   cursor-not-allowed`}
                required
                disabled
              />
            </div>

            {/* vechile no  */}

            <div>
              <FormLabel>Vechile No</FormLabel>
              <input
                type="text"
                name="service_truck_no"
                value={service.service_truck_no}
                onChange={(e) => onInputChange(e)}
                className={`${inputClass}   cursor-not-allowed`}
                required
                disabled
              />
            </div>

            {/* Garage  */}
            <div>
              <FormLabel>Garage</FormLabel>
              <Select
                name="service_garage"
                options={vendor.map((option) => ({
                  value: option.vendor_name,
                  label: option.vendor_name,
                  name: "service_garage",
                }))}
                onChange={(e) => onInputChange(e)}
                value={
                  service.service_garage
                    ? {
                        value: service.service_garage,
                        label: service.service_garage,
                      }
                    : null
                }
                placeholder="Select Garage"
                styles={customStyles}
                isSearchable={true}
              />
            </div>

            {/* Km */}
            <div>
              <FormLabel required>KM</FormLabel>
              <input
                type="tel"
                name="service_km"
                value={service.service_km}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
                required
              />
            </div>
            {/* Toatal amount */}
            <div>
              <FormLabel required>Total Amount</FormLabel>
              <input
                type="tel"
                name="service_amount"
                value={service.service_amount}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
                required
              />
            </div>

            {/* status */}
            <div>
              <FormLabel required>Status</FormLabel>
              <select
                name="service_status"
                value={service.service_status}
                onChange={(e) => onInputChange(e)}
                required
                className={inputClassSelect}
              >
                <option value="">Select Status</option>
                {status.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.value}
                  </option>
                ))}
              </select>
            </div>
            {/* Remark  */}
            <div className=" col-span-0 lg:col-span-4">
              <FormLabel>Remarks</FormLabel>
              <input
                type="text"
                name="service_remarks"
                value={service.service_remarks}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
              />
            </div>
          </div>

          {/* service type show here with multiple add  */}
          <hr />
          {users.map((user, index) => (
            <div
              className="grid grid-cols-1  md:grid-cols-1 lg:grid-cols-4 gap-6"
              key={index}
            >
              {/* service type  */}
              <div>
                <FormLabel required>Service Type</FormLabel>
                <select
                  name="service_sub_type"
                  value={user.service_sub_type}
                  onChange={(e) => onChange(e, index)}
                  required
                  className={inputClassSelect}
                >
                  <option value="">Select service Type</option>
                  {serviceType.map((option) => (
                    <option
                      key={option.service_types}
                      value={option.service_types}
                    >
                      {option.service_types}
                    </option>
                  ))}
                </select>
              </div>
              {/* amount  */}
              <div>
                <FormLabel required>Amount</FormLabel>
                <input
                  type="text"
                  name="service_sub_amount"
                  value={user.service_sub_amount}
                  onChange={(e) => onChange(e, index)}
                  className={inputClass}
                  required
                />
              </div>

              {/* Description */}
              <div>
                <FormLabel>Description</FormLabel>
                <input
                  type="text"
                  name="service_sub_details"
                  value={user.service_sub_details}
                  onChange={(e) => onChange(e, index)}
                  className={inputClass}
                />
              </div>
              <div className="flex items-center gap-4 mt-5">
                <button
                  type="button"
                  onClick={addItem}
                  className={CreateButton}
                >
                  <IconPlus className="w-5 h-5 mr-1" />
                  Add More
                </button>
                <IconTrash
                  onClick={() => {
                    if (users.length > 1 && !user.id) {
                      removeUser(index);
                    }
                  }}
                  className={`
    cursor-pointer 
    ${
      users.length <= 1 || user.id
        ? "text-gray-300 cursor-not-allowed pointer-events-none"
        : "text-gray-500 hover:text-red-600"
    }
  `}
                />
              </div>
            </div>
          ))}

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
                navigate("/service-list");
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

export default EditServices;
