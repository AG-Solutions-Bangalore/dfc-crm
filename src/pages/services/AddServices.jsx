import React, { useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import {
  IconArrowBack,
  IconInfoCircle,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";
import Select from "react-select";
import moment from "moment";
import { Button } from "@material-tailwind/react";
import { toast } from "sonner";

const AddServices = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();
  const todayback = yyyy + "-" + mm + "-" + dd;
  const navigate = useNavigate();
  const [service, setService] = useState({
    service_date: todayback,
    service_year: "2023-24",
    service_company: "",
    service_branch: "",
    service_truck_no: "",
    service_garage: "",
    service_km: "",
    service_pre_km: "",
    service_amount: "",
    service_remarks: "",
    service_count: "",
    service_sub_data: "",
  });
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [fabric_inward_count, setCount] = useState(1);
  const useTemplate = {
    service_sub_type: "",
    service_sub_amount: "",
    service_sub_details: "",
  };

  const [users, setUsers] = useState([useTemplate]);
  const [loading, setLoading] = useState(false);
  // vechile no state
  const [vehicles, setVehicles] = useState([]);
  // company and branch
  const [vehiclesOtherData, setvehiclesOtherData] = useState([]);
  // data shows as view of previous details
  const [serviceSub, setServiceSub] = useState([]);
  //garage
  const [vendor, setVendor] = useState([]);
  //service type
  const [serviceType, setServicesType] = useState([]);

  const fetchVechiles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/web-fetch-vehicles-report`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setVehicles(response.data?.vehicles);
    } catch (error) {
      console.error("Error fetching service vechile data", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchVechilesOtherData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/web-fetch-vehicles-other-data/${service.service_truck_no}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setvehiclesOtherData(response.data?.vehiclesOtherData);
    } catch (error) {
      console.error(
        "Error fetching vechile other (service branch and company) data",
        error
      );
    } finally {
      setLoading(false);
    }
  };
  const fetchServiceDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/web-fetch-services-by-vehicle/${service.service_truck_no}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setServiceSub(response.data?.servicesSub);
    } catch (error) {
      console.error("Error fetching Service details data", error);
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
    fetchVechiles();
  }, []);

  useEffect(() => {
    if (service.service_truck_no && service.service_truck_no !== "") {
      fetchVechilesOtherData();
    }
  }, [service.service_truck_no]);

  useEffect(() => {
    if (service.service_truck_no && service.service_truck_no !== "") {
      fetchServiceDetails();
    }
  }, [service.service_truck_no]);

  useEffect(() => {
    fetchGarage();
  }, [vehiclesOtherData.vehicle_branch]);

 
  useEffect(() => {
    fetchServiceType();
  }, []);

  const addItem = () => {
    setUsers([...users, useTemplate]);
    setCount(fabric_inward_count + 1);
  };

  const onChange = (e, index) => {
    const updatedUsers = users.map((user, i) =>
      index == i
        ? Object.assign(user, { [e.target.name]: e.target.value })
        : user
    );
    setUsers(updatedUsers);
  };

  const removeUser = (index) => {
    const filteredUsers = [...users];
    filteredUsers.splice(index, 1);
    setUsers(filteredUsers);
    setCount(fabric_inward_count - 1);
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
      service_date: service.service_date,
      service_year: "2023-24",
      service_company: vehiclesOtherData.vehicle_company,
      service_branch: vehiclesOtherData.vehicle_branch,
      service_truck_no: service.service_truck_no,
      service_garage: service.service_garage,
      service_km: service.service_km,
      service_pre_km: service.service_pre_km,
      service_amount: service.service_amount,
      service_remarks: service.service_remarks,
      service_count: fabric_inward_count,
      service_sub_data: users,
    };

    setIsButtonDisabled(true);
    axios({
      url: BASE_URL + "/api/web-create-services",
      method: "POST",
      data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      toast.success("Services Created Sucessfully");

      navigate("/service-list");
      setService({
        service_date: todayback,
        service_year: "2023-24",
        service_company: "",
        service_branch: "",
        service_truck_no: "",
        service_garage: "",
        service_km: "",
        service_pre_km: "",
        service_amount: "",
        service_remarks: "",
        service_count: "",
        service_sub_data: "",
      });
    });
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
              <span>Create Services </span>
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
          <div className="grid grid-cols-1  md:grid-cols-1 lg:grid-cols-3 gap-6">
            {/* date  */}
            <div>
              <FormLabel required>Date</FormLabel>
              <input
                type="date"
                required
                name="service_date"
                value={service.service_date}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
              />
            </div>
            {/* vechile no  */}

            <div>
              <FormLabel>Vechile No</FormLabel>
              <Select
                name="service_truck_no"
                options={vehicles.map((option) => ({
                  value: option.reg_no,
                  label: option.reg_no,
                  name: "service_truck_no",
                }))}
                onChange={(e) => onInputChange(e)}
                value={
                  service.service_truck_no
                    ? {
                        value: service.service_truck_no,
                        label: service.service_truck_no,
                      }
                    : null
                }
                placeholder="Select Vechile No"
                styles={customStyles}
                isSearchable={true}
              />
            </div>
            {/* company  */}
            <div>
              <FormLabel required>Company</FormLabel>
              <input
                type="text"
                name="service_company"
                value={vehiclesOtherData.vehicle_company}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
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
                value={vehiclesOtherData.vehicle_branch}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
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

            {/* Remark  */}
            <div className=" col-span-0 lg:col-span-2 ">
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
          {/* service details show here  */}

          {serviceSub.length > 0 && (
            <>
              <hr />
              <div className="overflow-x-auto ">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {serviceSub.map((dataSumm, index) => (
                    <div
                      key={index}
                      className="border border-blue-400 rounded-lg p-1 text-center shadow-sm hover:shadow-md transition-shadow duration-300"
                    >
                      <div className="font-[500] text-xs">
                        <p className="mb-1">{dataSumm.service_sub_type}</p>
                        <p className="text-gray-600 mb-1">
                          {moment(dataSumm.service_sub_date).format(
                            "DD-MM-YYYY"
                          )}
                        </p>
                        <p className="text-blue-600 font-semibold">
                          {dataSumm.service_sub_km}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

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
                <FormLabel required>Description</FormLabel>
                <input
                  type="text"
                  name="service_sub_details"
                  value={user.service_sub_details}
                  onChange={(e) => onChange(e, index)}
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <IconTrash
                  onClick={() => removeUser(index)}
                  className="cursor-pointer  translate-y-0 lg:translate-y-7  hover:text-red-600"
                />
              </div>
            </div>
          ))}
          <div>
            <Button
              className="text-center text-sm font-[400] cursor-pointer   flex items-center gap-1  text-white bg-blue-600 hover:bg-red-700 p-2 rounded-lg shadow-md"
              onClick={(e) => addItem(e)}
            >
              <IconPlus className="w-5 h-5" /> Add More
            </Button>
          </div>
          {/* Form Actions */}
          <div className="flex flex-wrap gap-4 justify-start">
            <button
              type="submit"
              className="text-center text-sm font-[400] cursor-pointer  w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
              disabled={isButtonDisabled}
            >
              {isButtonDisabled ? "Sumbitting..." : "Sumbit"}
            </button>

            <button
              type="button"
              className="text-center text-sm font-[400] cursor-pointer  w-36 text-white bg-red-600 hover:bg-red-400 p-2 rounded-lg shadow-md"
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

export default AddServices;
