import React, { useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import { useNavigate, useParams } from "react-router-dom";
import BASE_URL from "../../base/BaseUrl";
import axios from "axios";
import { toast } from "sonner";
import { IconArrowBack, IconInfoCircle } from "@tabler/icons-react";
import Select from "react-select";
import { BackButton, CreateButton } from "../../components/common/ButtonColors";
import { decryptId } from "../../components/common/EncryptionDecryption";

const vehicleType = [
  {
    value: "6W Truck",
    label: "6W Truck",
  },
  {
    value: "10W Truck",
    label: "10W Truck",
  },
  {
    value: "Other",
    label: "Other",
  },
];

const status = [
  {
    value: "Active",
    label: "Active",
  },
  {
    value: "Inactive",
    label: "Inactive",
  },
];

const EditVechiles = () => {
  const { id } = useParams();
  const decryptedId = decryptId(id);

  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState({
    reg_no: "",
    mfg_year: "",
    ins_due: "",
    permit_due: "",
    fc_due: "",
    vehicle_type: "",
    vehicle_company: "",
    no_of_gas_cylinder: "",
    vehicle_status: "",
    vehicle_driver: "",
    vehicle_branch: "",
    vehicle_mileage: "",
    vehicle_open_km: "",
    vehicle_hsd_open: "",
    vehicle_present_km: "",
    vehicle_present_date: "",
  });
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [branch, setBranch] = useState([]);
  const [driver, setDriver] = useState([]);
  const [company, setCompany] = useState([]);

  const fetchEditVechiles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/web-fetch-vehicles-by-id/${decryptedId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setVehicles(response.data?.vehicles);
    } catch (error) {
      console.error("Error fetching vechile edit data", error);
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
      console.error("Error fetching vechile compnay edit data", error);
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
      console.error("Error fetching vechiles braanch  edit data", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchDriver = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/web-fetch-remaing-vehicle-driver/${vehicles.reg_no}/${vehicles.vehicle_branch}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDriver(response.data?.drivers);
    } catch (error) {
      console.error("Error fetching vechile driver edit data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEditVechiles();
    fetchBranch();
    fetchCompany();
  }, []);

  useEffect(() => {
    if (
      vehicles.vehicle_branch &&
      vehicles.reg_no &&
      vehicles.vehicle_branch !== ""
    ) {
      fetchDriver();
    }
  }, [vehicles.vehicle_branch, vehicles.reg_no]);

  const validateOnlyDigits = (inputtxt) => {
    var phoneno = /^\d+$/;
    if (inputtxt.match(phoneno) || inputtxt.length == 0) {
      return true;
    } else {
      return false;
    }
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
    if (e.name == "vehicle_driver") {
      setVehicles({
        ...vehicles,
        vehicle_driver: e.value,
      });
    } else if (e.target.name == "vehicle_mileage") {
      if (validateOnlyNumber(e.target.value)) {
        setVehicles({
          ...vehicles,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name == "no_of_gas_cylinder") {
      if (validateOnlyDigits(e.target.value)) {
        setVehicles({
          ...vehicles,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name == "vehicle_hsd_open") {
      if (validateOnlyDigits(e.target.value)) {
        setVehicles({
          ...vehicles,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name == "vehicle_open_km") {
      if (validateOnlyDigits(e.target.value)) {
        setVehicles({
          ...vehicles,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name == "vehicle_present_km") {
      if (validateOnlyDigits(e.target.value)) {
        setVehicles({
          ...vehicles,
          [e.target.name]: e.target.value,
        });
      }
    } else {
      setVehicles({
        ...vehicles,
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
      reg_no: vehicles.reg_no,
      mfg_year: vehicles.mfg_year,
      ins_due: vehicles.ins_due,
      permit_due: vehicles.permit_due,
      fc_due: vehicles.fc_due,
      vehicle_type: vehicles.vehicle_type,
      vehicle_company: vehicles.vehicle_company,
      vehicle_branch: vehicles.vehicle_branch,

      bata_for_trip: vehicles.bata_for_trip,
      incentive_for_km: vehicles.incentive_for_km,
      incentive_for_trip: vehicles.incentive_for_trip,
      no_of_gas_cylinder: vehicles.no_of_gas_cylinder,
      vehicle_status: vehicles.vehicle_status,

      vehicle_driver: vehicles.vehicle_driver,
      vehicle_mileage: vehicles.vehicle_mileage,
      vehicle_open_km: vehicles.vehicle_open_km,
      vehicle_hsd_open: vehicles.vehicle_hsd_open,
      vehicle_present_km: vehicles.vehicle_present_km,
      vehicle_present_date: vehicles.vehicle_present_date,
    };

    setIsButtonDisabled(true);
    axios({
      url: BASE_URL + `/api/web-update-vehicles/${decryptedId}`,
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
      navigate("/vehicles-list");
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
              <span>Edit Vehicle </span>
            </div>
            <IconArrowBack
              onClick={() => navigate("/vehicles-list")}
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
          <div className="grid grid-cols-1  md:grid-cols-1 lg:grid-cols-5   gap-6">
            {/* Register No  */}
            <div>
              <FormLabel required>Register No</FormLabel>
              <input
                type="text"
                name="reg_no"
                value={vehicles.reg_no}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
                required
              />
            </div>

            {/* company  */}

            <div>
              <FormLabel required>Company</FormLabel>
              <select
                name="vehicle_company"
                value={vehicles.vehicle_company}
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

            {/* vechile type  */}

            <div>
              <FormLabel required>Vehicle Type</FormLabel>
              <select
                name="vehicle_type"
                value={vehicles.vehicle_type}
                onChange={(e) => onInputChange(e)}
                required
                className={inputClassSelect}
              >
                <option value="">Select Vehicle Type</option>
                {vehicleType.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.value}
                  </option>
                ))}
              </select>
            </div>

            {/* branch  */}
            <div>
              <FormLabel required>Branch</FormLabel>
              <select
                name="vehicle_branch"
                value={vehicles.vehicle_branch}
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

            {/* driver  */}
            <div>
              <FormLabel>Driver</FormLabel>
              <Select
                name="vehicle_driver"
                options={driver.map((option) => ({
                  value: option.full_name,
                  label: option.full_name,
                  name: "vehicle_driver",
                }))}
                onChange={(e) => onInputChange(e)}
                value={
                  vehicles.vehicle_driver
                    ? {
                        value: vehicles.vehicle_driver,
                        label: vehicles.vehicle_driver,
                      }
                    : null
                }
                placeholder="Select Driver"
                styles={customStyles}
                isSearchable={true}
              />
            </div>
            {/* Model year  */}
            <div>
              <FormLabel required>Model Year</FormLabel>
              <input
                type="text"
                name="mfg_year"
                value={vehicles.mfg_year}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
                required
              />
            </div>
            {/* mileage  */}
            <div>
              <FormLabel required>Mileage</FormLabel>
              <input
                type="tel"
                name="vehicle_mileage"
                value={vehicles.vehicle_mileage}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
                required
              />
            </div>
            {/* Open Km  */}
            <div>
              <FormLabel required>Open KM</FormLabel>
              <input
                type="tel"
                name="vehicle_open_km"
                value={vehicles.vehicle_open_km}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
                required
              />
            </div>
            {/* Present Km  */}
            <div>
              <FormLabel>Present KM</FormLabel>
              <input
                type="tel"
                name="vehicle_present_km"
                value={vehicles.vehicle_present_km}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
              />
            </div>
            {/* present Date  */}
            <div>
              <FormLabel>Present Km date</FormLabel>
              <input
                type="date"
                name="vehicle_present_date"
                value={vehicles.vehicle_present_date}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
              />
            </div>
            {/* Open HSD  */}
            <div>
              <FormLabel required>Open HSD</FormLabel>
              <input
                type="tel"
                name="vehicle_hsd_open"
                value={vehicles.vehicle_hsd_open}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
                required
              />
            </div>
            {/* No of Gas Cylineder  */}
            <div>
              <FormLabel>No of Gas Cylinder</FormLabel>
              <input
                type="tel"
                name="no_of_gas_cylinder"
                value={vehicles.no_of_gas_cylinder}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
              />
            </div>
            {/* Insurance due  */}
            <div>
              <FormLabel>Insurance Due</FormLabel>
              <input
                type="date"
                name="ins_due"
                value={vehicles.ins_due}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
              />
            </div>
            {/* Permit due  */}
            <div>
              <FormLabel>Permit Due</FormLabel>
              <input
                type="date"
                name="permit_due"
                value={vehicles.permit_due}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
              />
            </div>
            {/* FC due  */}
            <div>
              <FormLabel>FC Due</FormLabel>
              <input
                type="date"
                name="fc_due"
                value={vehicles.fc_due}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
              />
            </div>

            <div>
              <FormLabel required>Status</FormLabel>
              <select
                name="vehicle_status"
                value={vehicles.vehicle_status}
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
                navigate("/vehicles-list");
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

export default EditVechiles;
