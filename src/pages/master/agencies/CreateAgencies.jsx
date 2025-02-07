import React, { useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../base/BaseUrl";
import { toast } from "sonner";
import { IconArrowBack, IconInfoCircle } from "@tabler/icons-react";
import {
  BackButton,
  CreateButton,
} from "../../../components/common/ButtonColors";

const CreateAgencies = () => {
  const navigate = useNavigate();
  const [agency, setAgency] = useState({
    agency_short: "",
    agency_name: "",
    agency_contact_person: "",
    agency_mobile: "",
    agency_email: "",
    agency_rt_km: "",
    agency_city: "",
    agency_state: "",
    agency_branch: "",
    agency_bata_for_trip_6W: "",
    agency_bata_for_trip_10W: "",
    agency_hmali: "",
    agency_hmali_10W: "",
    agency_mileage_for_trip_6W: "",
    agency_mileage_for_trip_10W: "",
  });
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState([]);
  const [branch, setBranch] = useState([]);
  const fetchState = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/web-fetch-state`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setState(response.data?.state);
    } catch (error) {
      console.error("Error fetching  Agesncy crete state data", error);
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
      console.error("Error fetching  create agency branch data", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchState();
    fetchBranch();
  }, []);
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
    if (e.target.name == "agency_mobile") {
      if (validateOnlyDigits(e.target.value)) {
        setAgency({
          ...agency,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name == "agency_hmali") {
      if (validateOnlyDigits(e.target.value)) {
        setAgency({
          ...agency,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name == "agency_hmali_10W") {
      if (validateOnlyDigits(e.target.value)) {
        setAgency({
          ...agency,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name == "agency_bata_for_trip_6W") {
      if (validateOnlyNumber(e.target.value)) {
        setAgency({
          ...agency,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name == "agency_bata_for_trip_10W") {
      if (validateOnlyNumber(e.target.value)) {
        setAgency({
          ...agency,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name == "agency_rt_km") {
      if (validateOnlyDigits(e.target.value)) {
        setAgency({
          ...agency,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name == "agency_mileage_for_trip_6W") {
      if (validateOnlyDigits(e.target.value)) {
        setAgency({
          ...agency,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name == "agency_mileage_for_trip_10W") {
      if (validateOnlyDigits(e.target.value)) {
        setAgency({
          ...agency,
          [e.target.name]: e.target.value,
        });
      }
    } else {
      setAgency({
        ...agency,
        [e.target.name]: e.target.value,
      });
    }
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
      agency_short: agency.agency_short,
      agency_name: agency.agency_name,
      agency_contact_person: agency.agency_contact_person,
      agency_mobile: agency.agency_mobile,
      agency_email: agency.agency_email,
      agency_rt_km: agency.agency_rt_km,
      agency_city: agency.agency_city,
      agency_state: agency.agency_state,
      agency_branch: agency.agency_branch,
      agency_bata_for_trip_6W: agency.agency_bata_for_trip_6W,
      agency_bata_for_trip_10W: agency.agency_bata_for_trip_10W,
      agency_hmali: agency.agency_hmali,
      agency_hmali_10W: agency.agency_hmali_10W,
      agency_mileage_for_trip_6W: agency.agency_mileage_for_trip_6W,
      agency_mileage_for_trip_10W: agency.agency_mileage_for_trip_10W,
    };

    setIsButtonDisabled(true);
    axios({
      url: BASE_URL + "/api/web-create-agencies",
      method: "POST",
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
      navigate("/master/agencies-list");
      setAgency({
        agency_short: "",
        agency_name: "",
        agency_contact_person: "",
        agency_mobile: "",
        agency_email: "",
        agency_rt_km: "",
        agency_city: "",
        agency_state: "",
        agency_branch: "",
        agency_bata_for_trip_6W: "",
        agency_bata_for_trip_10W: "",
        agency_hmali: "",
        agency_hmali_10W: "",
        agency_mileage_for_trip_6W: "",
        agency_mileage_for_trip_10W: "",
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
              <span>Add Agency </span>
            </div>
            <IconArrowBack
              onClick={() => navigate("/master/agencies-list")}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Brand ( HP/IOC )  */}
            <div>
              <FormLabel required>Brand ( HP/IOC )</FormLabel>
              <input
                type="text"
                name="agency_short"
                value={agency.agency_short}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
                required
              />
            </div>

            {/* Agency Name  */}
            <div className="md:col-span-2">
              <FormLabel required>Agency Name</FormLabel>
              <input
                type="text"
                name="agency_name"
                value={agency.agency_name}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1  md:grid-cols-1 lg:grid-cols-4   gap-6">
            {/* Contact Name  */}
            <div>
              <FormLabel required>Contact Name</FormLabel>
              <input
                type="text"
                name="agency_contact_person"
                value={agency.agency_contact_person}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
                required
              />
            </div>
            {/* Contact Mobile  */}
            <div>
              <FormLabel>Contact Mobile</FormLabel>
              <input
                type="tel"
                name="agency_mobile"
                value={agency.agency_mobile}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
                maxLength={10}
              />
            </div>
            {/* Contact Email  */}
            <div>
              <FormLabel>Contact Email</FormLabel>
              <input
                type="email"
                name="agency_email"
                value={agency.agency_email}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
              />
            </div>

            {/* Branch  */}
            <div>
              <FormLabel required>Branch</FormLabel>
              <select
                name="agency_branch"
                value={agency.agency_branch}
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
            {/* RT KM  */}
            <div>
              <FormLabel>RT KM</FormLabel>
              <input
                type="tel"
                name="agency_rt_km"
                value={agency.agency_rt_km}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
              />
            </div>
            {/* Bata for Trip 6W  */}
            <div>
              <FormLabel>Bata for Trip 6W</FormLabel>
              <input
                type="tel"
                name="agency_bata_for_trip_6W"
                value={agency.agency_bata_for_trip_6W}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
              />
            </div>
            {/* Bata for Trip 10W  */}
            <div>
              <FormLabel>Bata for Trip 10W</FormLabel>
              <input
                type="tel"
                name="agency_bata_for_trip_10W"
                value={agency.agency_bata_for_trip_10W}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
              />
            </div>
            {/* Hamali for 6W  */}
            <div>
              <FormLabel>Hamali for 6W</FormLabel>
              <input
                type="tel"
                name="agency_hmali"
                value={agency.agency_hmali}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
              />
            </div>
            {/*Hamali for 10W */}
            <div>
              <FormLabel>Hamali for 10W</FormLabel>
              <input
                type="tel"
                name="agency_hmali_10W"
                value={agency.agency_hmali_10W}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
              />
            </div>

            {/* City  */}
            <div>
              <FormLabel>City</FormLabel>
              <input
                type="text"
                name="agency_city"
                value={agency.agency_city}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
              />
            </div>

            {/* State  */}
            <div>
              <FormLabel>State</FormLabel>
              <select
                name="agency_state"
                value={agency.agency_state}
                onChange={(e) => onInputChange(e)}
                className={inputClassSelect}
              >
                <option value="">Select State</option>
                {state.map((option) => (
                  <option key={option.state} value={option.state}>
                    {option.state}
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
              {isButtonDisabled ? "Sumbitting..." : "Sumbit"}
            </button>

            <button
              type="button"
              className={BackButton}
              onClick={() => {
                navigate("/master/agencies-list");
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

export default CreateAgencies;
