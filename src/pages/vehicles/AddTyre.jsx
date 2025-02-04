import React, { useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../base/BaseUrl";
import axios from "axios";
import { toast } from "sonner";
import { IconArrowBack, IconInfoCircle } from "@tabler/icons-react";
import Select from "react-select";

const AddTyre = () => {
  const navigate = useNavigate();
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();
  const todayback = yyyy + "-" + mm + "-" + dd;
  const [vehicles, setVehicles] = useState({
    reg_no: "",
    mfg_year: "",
    ins_due: "",
    permit_due: "",
    vehicle_branch: "",
    fc_due: "",
    vehicle_type: "",
    vehicle_company: "",
    bata_for_km: "",
    bata_for_trip: "",
    incentive_for_km: "",
    incentive_for_trip: "",
    no_of_gas_cylinder: "",
    vehicle_agency_short: "",
    vehicle_driver: "",
    vehicle_hsd: "",
    vehicle_open_km: "",
    tyre_assign_1_front_left_no: "",
    tyre_assign_1_front_left_date: todayback,
    tyre_assign_1_front_left_km: "",
    tyre_assign_2_front_right_no: "",
    tyre_assign_2_front_right_date: todayback,
    tyre_assign_2_front_right_km: "",
    tyre_assign_3_back_left_no: "",
    tyre_assign_3_back_left_date: todayback,
    tyre_assign_3_back_left_km: "",
    tyre_assign_4_back_left_no: "",
    tyre_assign_4_back_left_date: todayback,
    tyre_assign_4_back_left_km: "",
    tyre_assign_5_back_right_no: "",
    tyre_assign_5_back_right_date: todayback,
    tyre_assign_5_back_right_km: "",
    tyre_assign_6_back_right_no: "",
    tyre_assign_6_back_right_date: todayback,
    tyre_assign_6_back_right_km: "",
    tyre_assign_3_back_housing_left_no: "",
    tyre_assign_3_back_housing_left_date: todayback,
    tyre_assign_3_back_housing_left_km: "",
    tyre_assign_4_back_housing_left_no: "",
    tyre_assign_4_back_housing_left_date: todayback,
    tyre_assign_4_back_housing_left_km: "",
    tyre_assign_5_back_dummy_left_no: "",
    tyre_assign_5_back_dummy_left_date: todayback,
    tyre_assign_5_back_dummy_left_km: "",
    tyre_assign_6_back_dummy_left_no: "",
    tyre_assign_6_back_dummy_left_date: todayback,
    tyre_assign_6_back_dummy_left_km: "",
    tyre_assign_7_back_housing_right_no: "",
    tyre_assign_7_back_housing_right_date: todayback,
    tyre_assign_7_back_housing_right_km: "",
    tyre_assign_8_back_housing_right_no: "",
    tyre_assign_8_back_housing_right_date: todayback,
    tyre_assign_8_back_housing_right_km: "",
    tyre_assign_9_back_dummy_right_no: "",
    tyre_assign_9_back_dummy_right_date: todayback,
    tyre_assign_9_back_dummy_right_km: "",
    tyre_assign_10_back_dummy_right_no: "",
    tyre_assign_10_back_dummy_right_date: "",
    tyre_assign_10_back_dummy_right_km: "",
  });
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [vehiclesReg, setVehiclesReg] = useState([]);
  const [tyre, setTyre] = useState([]);
  const fetchRegistorno = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/web-fetch-vehicles-tyre-data`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setVehiclesReg(response.data?.vehiclesReg);
    } catch (error) {
      console.error("Error fetching vechile tyre regsitor no data", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchVechilesDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/web-fetch-vehicles-data/${vehicles.reg_no}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setVehicles(response.data?.vehiclesData);
    } catch (error) {
      console.error("Error fetching vechile details data", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchTyre = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/web-fetch-tyre-by-branch/${vehicles.vehicle_branch}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTyre(response.data?.tyre);
    } catch (error) {
      console.error("Error fetching vechiles tyre data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistorno();
  }, []);

  useEffect(() => {
    if (vehicles.reg_no && vehicles.reg_no !== "") {
      fetchVechilesDetails();
    }
  }, [vehicles.reg_no]);
  useEffect(() => {
    if (vehicles.vehicle_branch && vehicles.vehicle_branch !== "") {
      fetchTyre();
    }
  }, [vehicles.vehicle_branch]);

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
    } else if (e.name == "reg_no") {
      setVehicles({
        ...vehicles,
        [e.name]: e.value,
      });
    } else if (e.name == "tyre_assign_1_front_left_no") {
      setVehicles({
        ...vehicles,
        [e.name]: e.value,
      });
    } else if (e.name == "tyre_assign_2_front_right_no") {
      setVehicles({
        ...vehicles,
        [e.name]: e.value,
      });
    } else if (e.name == "tyre_assign_3_back_left_no") {
      setVehicles({
        ...vehicles,
        [e.name]: e.value,
      });
    } else if (e.name == "tyre_assign_4_back_left_no") {
      setVehicles({
        ...vehicles,
        [e.name]: e.value,
      });
    } else if (e.name == "tyre_assign_5_back_right_no") {
      setVehicles({
        ...vehicles,
        [e.name]: e.value,
      });
    } else if (e.name == "tyre_assign_6_back_right_no") {
      setVehicles({
        ...vehicles,
        [e.name]: e.value,
      });
    } else if (e.name == "tyre_assign_3_back_housing_left_no") {
      setVehicles({
        ...vehicles,
        [e.name]: e.value,
      });
    } else if (e.name == "tyre_assign_4_back_housing_left_no") {
      setVehicles({
        ...vehicles,
        [e.name]: e.value,
      });
    } else if (e.name == "tyre_assign_5_back_dummy_left_no") {
      setVehicles({
        ...vehicles,
        [e.name]: e.value,
      });
    } else if (e.name == "tyre_assign_6_back_dummy_left_no") {
      setVehicles({
        ...vehicles,
        [e.name]: e.value,
      });
    } else if (e.name == "tyre_assign_7_back_housing_right_no") {
      setVehicles({
        ...vehicles,
        [e.name]: e.value,
      });
    } else if (e.name == "tyre_assign_8_back_housing_right_no") {
      setVehicles({
        ...vehicles,
        [e.name]: e.value,
      });
    } else if (e.name == "tyre_assign_9_back_dummy_right_no") {
      setVehicles({
        ...vehicles,
        [e.name]: e.value,
      });
    } else if (e.name == "tyre_assign_10_back_dummy_right_no") {
      setVehicles({
        ...vehicles,
        [e.name]: e.value,
      });
    } else if (e.target.name == "bata_for_km") {
      if (validateOnlyNumber(e.target.value)) {
        setVehicles({
          ...vehicles,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name == "bata_for_trip") {
      if (validateOnlyNumber(e.target.value)) {
        setVehicles({
          ...vehicles,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name == "vehicle_hsd") {
      if (validateOnlyNumber(e.target.value)) {
        setVehicles({
          ...vehicles,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name == "incentive_for_km") {
      if (validateOnlyNumber(e.target.value)) {
        setVehicles({
          ...vehicles,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name == "incentive_for_trip") {
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
    } else if (e.target.name == "vehicle_open_km") {
      if (validateOnlyDigits(e.target.value)) {
        setVehicles({
          ...vehicles,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name == "tyre_assign_1_front_left_km") {
      if (validateOnlyDigits(e.target.value)) {
        setVehicles({
          ...vehicles,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name == "tyre_assign_2_front_right_km") {
      if (validateOnlyDigits(e.target.value)) {
        setVehicles({
          ...vehicles,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name == "tyre_assign_3_back_left_km") {
      if (validateOnlyDigits(e.target.value)) {
        setVehicles({
          ...vehicles,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name == "tyre_assign_4_back_left_km") {
      if (validateOnlyDigits(e.target.value)) {
        setVehicles({
          ...vehicles,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name == "tyre_assign_5_back_right_km") {
      if (validateOnlyDigits(e.target.value)) {
        setVehicles({
          ...vehicles,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name == "tyre_assign_6_back_right_km") {
      if (validateOnlyDigits(e.target.value)) {
        setVehicles({
          ...vehicles,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name == "tyre_assign_3_back_housing_left_km") {
      if (validateOnlyDigits(e.target.value)) {
        setVehicles({
          ...vehicles,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name == "tyre_assign_4_back_housing_left_km") {
      if (validateOnlyDigits(e.target.value)) {
        setVehicles({
          ...vehicles,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name == "tyre_assign_5_back_dummy_left_km") {
      if (validateOnlyDigits(e.target.value)) {
        setVehicles({
          ...vehicles,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name == "tyre_assign_6_back_dummy_left_km") {
      if (validateOnlyDigits(e.target.value)) {
        setVehicles({
          ...vehicles,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name == "tyre_assign_7_back_housing_right_km") {
      if (validateOnlyDigits(e.target.value)) {
        setVehicles({
          ...vehicles,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name == "tyre_assign_8_back_housing_right_km") {
      if (validateOnlyDigits(e.target.value)) {
        setVehicles({
          ...vehicles,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name == "tyre_assign_9_back_dummy_right_km") {
      if (validateOnlyDigits(e.target.value)) {
        setVehicles({
          ...vehicles,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name == "tyre_assign_10_back_dummy_right_km") {
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
      vehicle_branch: vehicles.vehicle_branch,
      vehicle_company: vehicles.vehicle_company,
      bata_for_km: vehicles.bata_for_km,
      bata_for_trip: vehicles.bata_for_trip,
      incentive_for_km: vehicles.incentive_for_km,
      incentive_for_trip: vehicles.incentive_for_trip,
      no_of_gas_cylinder: vehicles.no_of_gas_cylinder,
      vehicle_agency_short: vehicles.vehicle_agency_short,
      vehicle_driver: vehicles.vehicle_driver,
      vehicle_hsd: vehicles.vehicle_hsd,
      vehicle_open_km: vehicles.vehicle_open_km,
      tyre_assign_1_front_left_no: vehicles.tyre_assign_1_front_left_no,
      tyre_assign_1_front_left_date: vehicles.tyre_assign_1_front_left_date,
      tyre_assign_1_front_left_km: vehicles.tyre_assign_1_front_left_km,
      tyre_assign_2_front_right_no: vehicles.tyre_assign_2_front_right_no,
      tyre_assign_2_front_right_date: vehicles.tyre_assign_2_front_right_date,
      tyre_assign_2_front_right_km: vehicles.tyre_assign_2_front_right_km,
      tyre_assign_3_back_left_no: vehicles.tyre_assign_3_back_left_no,
      tyre_assign_3_back_left_date: vehicles.tyre_assign_3_back_left_date,
      tyre_assign_3_back_left_km: vehicles.tyre_assign_3_back_left_km,
      tyre_assign_4_back_left_no: vehicles.tyre_assign_4_back_left_no,
      tyre_assign_4_back_left_date: vehicles.tyre_assign_4_back_left_date,
      tyre_assign_4_back_left_km: vehicles.tyre_assign_4_back_left_km,
      tyre_assign_5_back_right_no: vehicles.tyre_assign_5_back_right_no,
      tyre_assign_5_back_right_date: vehicles.tyre_assign_5_back_right_date,
      tyre_assign_5_back_right_km: vehicles.tyre_assign_5_back_right_km,
      tyre_assign_6_back_right_no: vehicles.tyre_assign_6_back_right_no,
      tyre_assign_6_back_right_date: vehicles.tyre_assign_6_back_right_date,
      tyre_assign_6_back_right_km: vehicles.tyre_assign_6_back_right_km,
      tyre_assign_3_back_housing_left_no:
        vehicles.tyre_assign_3_back_housing_left_no,
      tyre_assign_3_back_housing_left_date:
        vehicles.tyre_assign_3_back_housing_left_date,
      tyre_assign_3_back_housing_left_km:
        vehicles.tyre_assign_3_back_housing_left_km,
      tyre_assign_4_back_housing_left_no:
        vehicles.tyre_assign_4_back_housing_left_no,
      tyre_assign_4_back_housing_left_date:
        vehicles.tyre_assign_4_back_housing_left_date,
      tyre_assign_4_back_housing_left_km:
        vehicles.tyre_assign_4_back_housing_left_km,
      tyre_assign_5_back_dummy_left_no:
        vehicles.tyre_assign_5_back_dummy_left_no,
      tyre_assign_5_back_dummy_left_date:
        vehicles.tyre_assign_5_back_dummy_left_date,
      tyre_assign_5_back_dummy_left_km:
        vehicles.tyre_assign_5_back_dummy_left_km,
      tyre_assign_6_back_dummy_left_no:
        vehicles.tyre_assign_6_back_dummy_left_no,
      tyre_assign_6_back_dummy_left_date:
        vehicles.tyre_assign_6_back_dummy_left_date,
      tyre_assign_6_back_dummy_left_km:
        vehicles.tyre_assign_6_back_dummy_left_km,
      tyre_assign_7_back_housing_right_no:
        vehicles.tyre_assign_7_back_housing_right_no,
      tyre_assign_7_back_housing_right_date:
        vehicles.tyre_assign_7_back_housing_right_date,
      tyre_assign_7_back_housing_right_km:
        vehicles.tyre_assign_7_back_housing_right_km,
      tyre_assign_8_back_housing_right_no:
        vehicles.tyre_assign_8_back_housing_right_no,
      tyre_assign_8_back_housing_right_date:
        vehicles.tyre_assign_8_back_housing_right_date,
      tyre_assign_8_back_housing_right_km:
        vehicles.tyre_assign_8_back_housing_right_km,
      tyre_assign_9_back_dummy_right_no:
        vehicles.tyre_assign_9_back_dummy_right_no,
      tyre_assign_9_back_dummy_right_date:
        vehicles.tyre_assign_9_back_dummy_right_date,
      tyre_assign_9_back_dummy_right_km:
        vehicles.tyre_assign_9_back_dummy_right_km,
      tyre_assign_10_back_dummy_right_no:
        vehicles.tyre_assign_10_back_dummy_right_no,
      tyre_assign_10_back_dummy_right_date:
        vehicles.tyre_assign_10_back_dummy_right_date,
      tyre_assign_10_back_dummy_right_km:
        vehicles.tyre_assign_10_back_dummy_right_km,
    };

    setIsButtonDisabled(true);
    axios({
      url: BASE_URL + "/api/web-create-vehicles-tyre-assign",
      method: "POST",
      data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      toast.success("Vechile Tyre Created Sucessfully");

      navigate("/vehicles-list");
      setVehicles({
        reg_no: "",
        mfg_year: "",
        ins_due: "",
        permit_due: "",
        vehicle_branch: "",
        fc_due: "",
        vehicle_type: "",
        vehicle_company: "",
        bata_for_km: "",
        bata_for_trip: "",
        incentive_for_km: "",
        incentive_for_trip: "",
        no_of_gas_cylinder: "",
        vehicle_agency_short: "",
        vehicle_driver: "",
        vehicle_hsd: "",
        vehicle_open_km: "",
        tyre_assign_1_front_left_no: "",
        tyre_assign_1_front_left_date: todayback,
        tyre_assign_1_front_left_km: "",
        tyre_assign_2_front_right_no: "",
        tyre_assign_2_front_right_date: todayback,
        tyre_assign_2_front_right_km: "",
        tyre_assign_3_back_left_no: "",
        tyre_assign_3_back_left_date: todayback,
        tyre_assign_3_back_left_km: "",
        tyre_assign_4_back_left_no: "",
        tyre_assign_4_back_left_date: todayback,
        tyre_assign_4_back_left_km: "",
        tyre_assign_5_back_right_no: "",
        tyre_assign_5_back_right_date: todayback,
        tyre_assign_5_back_right_km: "",
        tyre_assign_6_back_right_no: "",
        tyre_assign_6_back_right_date: todayback,
        tyre_assign_6_back_right_km: "",
        tyre_assign_3_back_housing_left_no: "",
        tyre_assign_3_back_housing_left_date: todayback,
        tyre_assign_3_back_housing_left_km: "",
        tyre_assign_4_back_housing_left_no: "",
        tyre_assign_4_back_housing_left_date: todayback,
        tyre_assign_4_back_housing_left_km: "",
        tyre_assign_5_back_dummy_left_no: "",
        tyre_assign_5_back_dummy_left_date: todayback,
        tyre_assign_5_back_dummy_left_km: "",
        tyre_assign_6_back_dummy_left_no: "",
        tyre_assign_6_back_dummy_left_date: todayback,
        tyre_assign_6_back_dummy_left_km: "",
        tyre_assign_7_back_housing_right_no: "",
        tyre_assign_7_back_housing_right_date: todayback,
        tyre_assign_7_back_housing_right_km: "",
        tyre_assign_8_back_housing_right_no: "",
        tyre_assign_8_back_housing_right_date: todayback,
        tyre_assign_8_back_housing_right_km: "",
        tyre_assign_9_back_dummy_right_no: "",
        tyre_assign_9_back_dummy_right_date: todayback,
        tyre_assign_9_back_dummy_right_km: "",
        tyre_assign_10_back_dummy_right_no: "",
        tyre_assign_10_back_dummy_right_date: "",
        tyre_assign_10_back_dummy_right_km: "",
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

  const TyreAssignmentBlock = ({ label, noName, dateName, kmName }) => (
    <div className="col-span-full grid grid-cols-3 gap-4 mb-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <Select
          name={noName}
          options={tyre.map((option) => ({
            value: option.tyre_sub_no,
            label: option.tyre_sub_no,
            name: noName,
          }))}
          onChange={(e) => onInputChange(e)}
          value={
            vehicles[noName]
              ? {
                  value: vehicles[noName],
                  label: vehicles[noName],
                }
              : null
          }
          placeholder="Select Tyre"
          styles={customStyles}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Date</label>
        <input
          type="date"
          name={dateName}
          value={vehicles[dateName]}
          onChange={(e) => onInputChange(e)}
          className={inputClass}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">KM</label>
        <input
          type="number"
          name={kmName}
          value={vehicles[kmName]}
          onChange={(e) => onInputChange(e)}
          className={inputClass}
        />
      </div>
    </div>
  );
  return (
    <Layout>
      <div className=" bg-[#FFFFFF] p-2  rounded-lg  ">
        <div className="sticky top-0 p-2  mb-4 border-b-2 border-red-500 rounded-lg  bg-[#E1F5FA] ">
          <h2 className=" px-5 text-[black] text-lg   flex flex-row  justify-between items-center  rounded-xl p-2 ">
            <div className="flex  items-center gap-2">
              <IconInfoCircle className="w-4 h-4" />
              <span>Add Tyre </span>
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
              <FormLabel>Register No</FormLabel>
              <Select
                name="reg_no"
                options={vehiclesReg.map((option) => ({
                  value: option.reg_no,
                  label: option.reg_no,
                  name: "reg_no",
                }))}
                onChange={(e) => onInputChange(e)}
                value={
                  vehicles.reg_no
                    ? {
                        value: vehicles.reg_no,
                        label: vehicles.reg_no,
                      }
                    : null
                }
                placeholder="Select Registor No"
                styles={customStyles}
                isSearchable={true}
              />
            </div>

            {/* company  */}

            <div>
              <FormLabel required>Company</FormLabel>
              <input
                type="text"
                name="vehicle_company"
                value={vehicles.vehicle_company}
                onChange={(e) => onInputChange(e)}
                className={`${inputClass} cursor-not-allowed opacity-50`}
                required
                disabled
              />
            </div>
            {/* Brand(Hp/Ioc)  */}

            <div>
              <FormLabel>Brand(Hp/Ioc)</FormLabel>
              <input
                type="text"
                name="vehicle_agency_short"
                value={vehicles.vehicle_agency_short}
                onChange={(e) => onInputChange(e)}
                className={`${inputClass} cursor-not-allowed opacity-50`}
                disabled
              />
            </div>

            {/* vechile type  */}

            <div>
              <FormLabel required>Vechile Type</FormLabel>
              <input
                type="text"
                name="vehicle_type"
                value={vehicles.vehicle_type}
                onChange={(e) => onInputChange(e)}
                className={`${inputClass} cursor-not-allowed opacity-50`}
                required
                disabled
              />
            </div>

            {/* branch  */}
            <div>
              <FormLabel required>Branch</FormLabel>
              <input
                type="text"
                name="vehicle_branch"
                value={vehicles.vehicle_branch}
                onChange={(e) => onInputChange(e)}
                className={`${inputClass} cursor-not-allowed opacity-50`}
                required
                disabled
              />
            </div>

            {/* driver  */}
            <div>
              <FormLabel>Driver</FormLabel>
              <input
                type="text"
                name="vehicle_driver"
                value={vehicles.vehicle_driver}
                onChange={(e) => onInputChange(e)}
                className={`${inputClass} cursor-not-allowed opacity-50`}
                disabled
              />
            </div>
            {/* modal year  */}
            <div>
              <FormLabel required>Modal Year</FormLabel>
              <input
                type="text"
                name="mfg_year"
                value={vehicles.mfg_year}
                onChange={(e) => onInputChange(e)}
                className={`${inputClass} cursor-not-allowed opacity-50`}
                required
                disabled
              />
            </div>
            {/* Fixed HSD  */}
            <div>
              <FormLabel>Fixed HSD</FormLabel>
              <input
                type="tel"
                name="vehicle_hsd"
                value={vehicles.vehicle_hsd}
                onChange={(e) => onInputChange(e)}
                className={`${inputClass} cursor-not-allowed opacity-50`}
                disabled
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
                className={`${inputClass} cursor-not-allowed opacity-50`}
                required
                disabled
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
                className={`${inputClass} cursor-not-allowed opacity-50`}
                disabled
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
                disabled
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
                className={`${inputClass} cursor-not-allowed opacity-50`}
                disabled
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
                className={`${inputClass} cursor-not-allowed opacity-50`}
                disabled
              />
            </div>
          </div>

          <div className="hidden">
            {/* bata for km  */}
            <div>
              <FormLabel>Bata For KM</FormLabel>
              <input
                type="tel"
                name="bata_for_km"
                value={vehicles.bata_for_km}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
              />
            </div>
            {/* Bata For Trip  */}
            <div>
              <FormLabel>Bata For Trip</FormLabel>
              <input
                type="tel"
                name="bata_for_trip"
                value={vehicles.bata_for_trip}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
              />
            </div>
            {/*Incentive For KM  */}
            <div>
              <FormLabel>Incentive For KM</FormLabel>
              <input
                type="tel"
                name="incentive_for_km"
                value={vehicles.incentive_for_km}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
              />
            </div>
            {/* Incentive For Trip  */}
            <div>
              <FormLabel>Incentive For Trip</FormLabel>
              <input
                type="tel"
                name="incentive_for_trip"
                value={vehicles.incentive_for_trip}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
              />
            </div>
          </div>

          {vehicles.vehicle_type !== "Other" && (
            <div className="col-span-full">
              {/* 1.front left */}
              <div className="col-span-full grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    1. Front Left 
                  </label>
                  <Select
                    name="tyre_assign_1_front_left_no"
                    options={tyre.map((option) => ({
                      value: option.tyre_sub_no,
                      label: option.tyre_sub_no,
                      name: "tyre_assign_1_front_left_no",
                    }))}
                    onChange={(e) => onInputChange(e)}
                    value={
                      vehicles.tyre_assign_1_front_left_no
                        ? {
                            value: vehicles.tyre_assign_1_front_left_no,
                            label: vehicles.tyre_assign_1_front_left_no,
                          }
                        : null
                    }
                    placeholder="Select Tyre"
                    styles={customStyles}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date
                  </label>
                  <input
                    type="date"
                    name="tyre_assign_1_front_left_date"
                    value={vehicles.tyre_assign_1_front_left_date}
                    onChange={(e) => onInputChange(e)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    KM
                  </label>
                  <input
                    type="tel"
                    name="tyre_assign_1_front_left_km"
                    value={vehicles.tyre_assign_1_front_left_km}
                    onChange={(e) => onInputChange(e)}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* 2 front right  */}
              <div className="col-span-full grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    2. Front Right
                  </label>
                  <Select
                    name="tyre_assign_2_front_right_no"
                    options={tyre.map((option) => ({
                      value: option.tyre_sub_no,
                      label: option.tyre_sub_no,
                      name: "tyre_assign_2_front_right_no",
                    }))}
                    onChange={(e) => onInputChange(e)}
                    value={
                      vehicles.tyre_assign_2_front_right_no
                        ? {
                            value: vehicles.tyre_assign_2_front_right_no,
                            label: vehicles.tyre_assign_2_front_right_no,
                          }
                        : null
                    }
                    placeholder="Select Tyre"
                    styles={customStyles}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date
                  </label>
                  <input
                    type="date"
                    name="tyre_assign_2_front_right_date"
                    value={vehicles.tyre_assign_2_front_right_date}
                    onChange={(e) => onInputChange(e)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    KM
                  </label>
                  <input
                    type="tel"
                    name="tyre_assign_2_front_right_km"
                    value={vehicles.tyre_assign_2_front_right_km}
                    onChange={(e) => onInputChange(e)}
                    className={inputClass}
                  />
                </div>
              </div>
              {/* Front Tyres - Always shown
              <TyreAssignmentBlock
                label="1. Front Left"
                noName="tyre_assign_1_front_left_no"
                dateName="tyre_assign_1_front_left_date"
                kmName="tyre_assign_1_front_left_km"
              />
              <TyreAssignmentBlock
                label="2. Front Right"
                noName="tyre_assign_2_front_right_no"
                dateName="tyre_assign_2_front_right_date"
                kmName="tyre_assign_2_front_right_km"
              /> */}

              {/* 6W Truck Back Tyres */}
              {vehicles.vehicle_type === "6W Truck" && (
                <>
                  {/* <TyreAssignmentBlock
                    label="3. Back Left"
                    noName="tyre_assign_3_back_left_no"
                    dateName="tyre_assign_3_back_left_date"
                    kmName="tyre_assign_3_back_left_km"
                  /> */}
                  <div className="col-span-full grid grid-cols-3 gap-4">
    <div>
      <label className="block text-sm font-medium text-gray-700">3. Back Left</label>
      <Select
        name="tyre_assign_3_back_left_no"
        options={tyre.map((option) => ({
          value: option.tyre_sub_no,
          label: option.tyre_sub_no,
          name: "tyre_assign_3_back_left_no",
        }))}
        onChange={(e) => onInputChange(e)}
        value={vehicles.tyre_assign_3_back_left_no ? {
          value: vehicles.tyre_assign_3_back_left_no,
          label: vehicles.tyre_assign_3_back_left_no
        } : null}
        placeholder="Select Tyre"
        styles={customStyles}
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">Date</label>
      <input
        type="date"
        name="tyre_assign_3_back_left_date"
        value={vehicles.tyre_assign_3_back_left_date}
        onChange={(e) => onInputChange(e)}
        className={inputClass}
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">KM</label>
      <input
        type="tel"
        name="tyre_assign_3_back_left_km"
        value={vehicles.tyre_assign_3_back_left_km}
        onChange={(e) => onInputChange(e)}
        className={inputClass}
      />
    </div>
  </div>
                  {/* <TyreAssignmentBlock
                    label="4. Back Left"
                    noName="tyre_assign_4_back_left_no"
                    dateName="tyre_assign_4_back_left_date"
                    kmName="tyre_assign_4_back_left_km"
                  /> */}
                    <div className="col-span-full grid grid-cols-3 gap-4">
    <div>
      <label className="block text-sm font-medium text-gray-700">4. Back Left</label>
      <Select
        name="tyre_assign_4_back_left_no"
        options={tyre.map((option) => ({
          value: option.tyre_sub_no,
          label: option.tyre_sub_no,
          name: "tyre_assign_4_back_left_no",
        }))}
        onChange={(e) => onInputChange(e)}
        value={vehicles.tyre_assign_4_back_left_no ? {
          value: vehicles.tyre_assign_4_back_left_no,
          label: vehicles.tyre_assign_4_back_left_no
        } : null}
        placeholder="Select Tyre"
        styles={customStyles}
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">Date</label>
      <input
        type="date"
        name="tyre_assign_4_back_left_date"
        value={vehicles.tyre_assign_4_back_left_date}
        onChange={(e) => onInputChange(e)}
        className={inputClass}
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">KM</label>
      <input
        type="tel"
        name="tyre_assign_4_back_left_km"
        value={vehicles.tyre_assign_4_back_left_km}
        onChange={(e) => onInputChange(e)}
        className={inputClass}
      />
    </div>
  </div>
                  {/* <TyreAssignmentBlock
                    label="5. Back Right"
                    noName="tyre_assign_5_back_right_no"
                    dateName="tyre_assign_5_back_right_date"
                    kmName="tyre_assign_5_back_right_km"
                  /> */}
                  <div className="col-span-full grid grid-cols-3 gap-4">
    <div>
      <label className="block text-sm font-medium text-gray-700">5. Back Right</label>
      <Select
        name="tyre_assign_5_back_right_no"
        options={tyre.map((option) => ({
          value: option.tyre_sub_no,
          label: option.tyre_sub_no,
          name: "tyre_assign_5_back_right_no",
        }))}
        onChange={(e) => onInputChange(e)}
        value={vehicles.tyre_assign_5_back_right_no ? {
          value: vehicles.tyre_assign_5_back_right_no,
          label: vehicles.tyre_assign_5_back_right_no
        } : null}
        placeholder="Select Tyre"
        styles={customStyles}
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">Date</label>
      <input
        type="date"
        name="tyre_assign_5_back_right_date"
        value={vehicles.tyre_assign_5_back_right_date}
        onChange={(e) => onInputChange(e)}
        className={inputClass}
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">KM</label>
      <input
        type="tel"
        name="tyre_assign_5_back_right_km"
        value={vehicles.tyre_assign_5_back_right_km}
        onChange={(e) => onInputChange(e)}
        className={inputClass}
      />
    </div>
  </div>
                  {/* <TyreAssignmentBlock
                    label="6. Back Right"
                    noName="tyre_assign_6_back_right_no"
                    dateName="tyre_assign_6_back_right_date"
                    kmName="tyre_assign_6_back_right_km"
                  /> */}
                    <div className="col-span-full grid grid-cols-3 gap-4">
    <div>
      <label className="block text-sm font-medium text-gray-700">6. Back Right</label>
      <Select
        name="tyre_assign_6_back_right_no"
        options={tyre.map((option) => ({
          value: option.tyre_sub_no,
          label: option.tyre_sub_no,
          name: "tyre_assign_6_back_right_no",
        }))}
        onChange={(e) => onInputChange(e)}
        value={vehicles.tyre_assign_6_back_right_no ? {
          value: vehicles.tyre_assign_6_back_right_no,
          label: vehicles.tyre_assign_6_back_right_no
        } : null}
        placeholder="Select Tyre"
        styles={customStyles}
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">Date</label>
      <input
        type="date"
        name="tyre_assign_6_back_right_date"
        value={vehicles.tyre_assign_6_back_right_date}
        onChange={(e) => onInputChange(e)}
        className={inputClass}
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">KM</label>
      <input
        type="tel"
        name="tyre_assign_6_back_right_km"
        value={vehicles.tyre_assign_6_back_right_km}
        onChange={(e) => onInputChange(e)}
        className={inputClass}
      />
    </div>
  </div>
                </>
              )}

              {/* 10W Truck Back Tyres */}
              {vehicles.vehicle_type === "10W Truck" && (
                <>
                  {/* <TyreAssignmentBlock
                    label="3. Back Housing Left"
                    noName="tyre_assign_3_back_housing_left_no"
                    dateName="tyre_assign_3_back_housing_left_date"
                    kmName="tyre_assign_3_back_housing_left_km"
                  /> */}
                    <div className="col-span-full grid grid-cols-3 gap-4">
    <div>
      <label className="block text-sm font-medium text-gray-700">3. Back Housing Left</label>
      <Select
        name="tyre_assign_3_back_housing_left_no"
        options={tyre.map((option) => ({
          value: option.tyre_sub_no,
          label: option.tyre_sub_no,
          name: "tyre_assign_3_back_housing_left_no",
        }))}
        onChange={(e) => onInputChange(e)}
        value={vehicles.tyre_assign_3_back_housing_left_no ? {
          value: vehicles.tyre_assign_3_back_housing_left_no,
          label: vehicles.tyre_assign_3_back_housing_left_no
        } : null}
        placeholder="Select Tyre"
        styles={customStyles}
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">Date</label>
      <input
        type="date"
        name="tyre_assign_3_back_housing_left_date"
        value={vehicles.tyre_assign_3_back_housing_left_date}
        onChange={(e) => onInputChange(e)}
        className={inputClass}
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">KM</label>
      <input
        type="tel"
        name="tyre_assign_3_back_housing_left_km"
        value={vehicles.tyre_assign_3_back_housing_left_km}
        onChange={(e) => onInputChange(e)}
        className={inputClass}
      />
    </div>
  </div>
                  {/* <TyreAssignmentBlock
                    label="4. Back Housing Left"
                    noName="tyre_assign_4_back_housing_left_no"
                    dateName="tyre_assign_4_back_housing_left_date"
                    kmName="tyre_assign_4_back_housing_left_km"
                  /> */}
                    <div className="col-span-full grid grid-cols-3 gap-4">
    <div>
      <label className="block text-sm font-medium text-gray-700">4. Back Housing Left</label>
      <Select
        name="tyre_assign_4_back_housing_left_no"
        options={tyre.map((option) => ({
          value: option.tyre_sub_no,
          label: option.tyre_sub_no,
          name: "tyre_assign_4_back_housing_left_no",
        }))}
        onChange={(e) => onInputChange(e)}
        value={vehicles.tyre_assign_4_back_housing_left_no ? {
          value: vehicles.tyre_assign_4_back_housing_left_no,
          label: vehicles.tyre_assign_4_back_housing_left_no
        } : null}
        placeholder="Select Tyre"
        styles={customStyles}
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">Date</label>
      <input
        type="date"
        name="tyre_assign_4_back_housing_left_date"
        value={vehicles.tyre_assign_4_back_housing_left_date}
        onChange={(e) => onInputChange(e)}
        className={inputClass}
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">KM</label>
      <input
        type="tel"
        name="tyre_assign_4_back_housing_left_km"
        value={vehicles.tyre_assign_4_back_housing_left_km}
        onChange={(e) => onInputChange(e)}
        className={inputClass}
      />
    </div>
  </div>
                  {/* <TyreAssignmentBlock
                    label="5. Back Dummy Left"
                    noName="tyre_assign_5_back_dummy_left_no"
                    dateName="tyre_assign_5_back_dummy_left_date"
                    kmName="tyre_assign_5_back_dummy_left_km"
                  /> */}
                    <div className="col-span-full grid grid-cols-3 gap-4">
    <div>
      <label className="block text-sm font-medium text-gray-700">5. Back Dummy Left</label>
      <Select
        name="tyre_assign_5_back_dummy_left_no"
        options={tyre.map((option) => ({
          value: option.tyre_sub_no,
          label: option.tyre_sub_no,
          name: "tyre_assign_5_back_dummy_left_no",
        }))}
        onChange={(e) => onInputChange(e)}
        value={vehicles.tyre_assign_5_back_dummy_left_no ? {
          value: vehicles.tyre_assign_5_back_dummy_left_no,
          label: vehicles.tyre_assign_5_back_dummy_left_no
        } : null}
        placeholder="Select Tyre"
        styles={customStyles}
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">Date</label>
      <input
        type="date"
        name="tyre_assign_5_back_dummy_left_date"
        value={vehicles.tyre_assign_5_back_dummy_left_date}
        onChange={(e) => onInputChange(e)}
        className={inputClass}
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">KM</label>
      <input
        type="tel"
        name="tyre_assign_5_back_dummy_left_km"
        value={vehicles.tyre_assign_5_back_dummy_left_km}
        onChange={(e) => onInputChange(e)}
        className={inputClass}
      />
    </div>
  </div>
                  {/* <TyreAssignmentBlock
                    label="6. Back Dummy Left"
                    noName="tyre_assign_6_back_dummy_left_no"
                    dateName="tyre_assign_6_back_dummy_left_date"
                    kmName="tyre_assign_6_back_dummy_left_km"
                  /> */}
                    <div className="col-span-full grid grid-cols-3 gap-4">
    <div>
      <label className="block text-sm font-medium text-gray-700">6. Back Dummy Left</label>
      <Select
        name="tyre_assign_6_back_dummy_left_no"
        options={tyre.map((option) => ({
          value: option.tyre_sub_no,
          label: option.tyre_sub_no,
          name: "tyre_assign_6_back_dummy_left_no",
        }))}
        onChange={(e) => onInputChange(e)}
        value={vehicles.tyre_assign_6_back_dummy_left_no ? {
          value: vehicles.tyre_assign_6_back_dummy_left_no,
          label: vehicles.tyre_assign_6_back_dummy_left_no
        } : null}
        placeholder="Select Tyre"
        styles={customStyles}
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">Date</label>
      <input
        type="date"
        name="tyre_assign_6_back_dummy_left_date"
        value={vehicles.tyre_assign_6_back_dummy_left_date}
        onChange={(e) => onInputChange(e)}
        className={inputClass}
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">KM</label>
      <input
        type="tel"
        name="tyre_assign_6_back_dummy_left_km"
        value={vehicles.tyre_assign_6_back_dummy_left_km}
        onChange={(e) => onInputChange(e)}
        className={inputClass}
      />
    </div>
  </div>
                  {/* <TyreAssignmentBlock
                    label="7. Back Housing Right"
                    noName="tyre_assign_7_back_housing_right_no"
                    dateName="tyre_assign_7_back_housing_right_date"
                    kmName="tyre_assign_7_back_housing_right_km"
                  /> */}
                    <div className="col-span-full grid grid-cols-3 gap-4">
    <div>
      <label className="block text-sm font-medium text-gray-700">7. Back Housing Right</label>
      <Select
        name="tyre_assign_7_back_housing_right_no"
        options={tyre.map((option) => ({
          value: option.tyre_sub_no,
          label: option.tyre_sub_no,
          name: "tyre_assign_7_back_housing_right_no",
        }))}
        onChange={(e) => onInputChange(e)}
        value={vehicles.tyre_assign_7_back_housing_right_no ? {
          value: vehicles.tyre_assign_7_back_housing_right_no,
          label: vehicles.tyre_assign_7_back_housing_right_no
        } : null}
        placeholder="Select Tyre"
        styles={customStyles}
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">Date</label>
      <input
        type="date"
        name="tyre_assign_7_back_housing_right_date"
        value={vehicles.tyre_assign_7_back_housing_right_date}
        onChange={(e) => onInputChange(e)}
        className={inputClass}
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">KM</label>
      <input
        type="tel"
        name="tyre_assign_7_back_housing_right_km"
        value={vehicles.tyre_assign_7_back_housing_right_km}
        onChange={(e) => onInputChange(e)}
        className={inputClass}
      />
    </div>
  </div>
                  {/* <TyreAssignmentBlock
                    label="8. Back Housing Right"
                    noName="tyre_assign_8_back_housing_right_no"
                    dateName="tyre_assign_8_back_housing_right_date"
                    kmName="tyre_assign_8_back_housing_right_km"
                  /> */}
                    <div className="col-span-full grid grid-cols-3 gap-4">
    <div>
      <label className="block text-sm font-medium text-gray-700">8. Back Housing Right</label>
      <Select
        name="tyre_assign_8_back_housing_right_no"
        options={tyre.map((option) => ({
          value: option.tyre_sub_no,
          label: option.tyre_sub_no,
          name: "tyre_assign_8_back_housing_right_no",
        }))}
        onChange={(e) => onInputChange(e)}
        value={vehicles.tyre_assign_8_back_housing_right_no ? {
          value: vehicles.tyre_assign_8_back_housing_right_no,
          label: vehicles.tyre_assign_8_back_housing_right_no
        } : null}
        placeholder="Select Tyre"
        styles={customStyles}
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">Date</label>
      <input
        type="date"
        name="tyre_assign_8_back_housing_right_date"
        value={vehicles.tyre_assign_8_back_housing_right_date}
        onChange={(e) => onInputChange(e)}
        className={inputClass}
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">KM</label>
      <input
        type="tel"
        name="tyre_assign_8_back_housing_right_km"
        value={vehicles.tyre_assign_8_back_housing_right_km}
        onChange={(e) => onInputChange(e)}
        className={inputClass}
      />
    </div>
  </div>
                  {/* <TyreAssignmentBlock
                    label="9. Back Dummy Right"
                    noName="tyre_assign_9_back_dummy_right_no"
                    dateName="tyre_assign_9_back_dummy_right_date"
                    kmName="tyre_assign_9_back_dummy_right_km"
                  /> */}
                    <div className="col-span-full grid grid-cols-3 gap-4">
    <div>
      <label className="block text-sm font-medium text-gray-700">9. Back Dummy Right</label>
      <Select
        name="tyre_assign_9_back_dummy_right_no"
        options={tyre.map((option) => ({
          value: option.tyre_sub_no,
          label: option.tyre_sub_no,
          name: "tyre_assign_9_back_dummy_right_no",
        }))}
        onChange={(e) => onInputChange(e)}
        value={vehicles.tyre_assign_9_back_dummy_right_no ? {
          value: vehicles.tyre_assign_9_back_dummy_right_no,
          label: vehicles.tyre_assign_9_back_dummy_right_no
        } : null}
        placeholder="Select Tyre"
        styles={customStyles}
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">Date</label>
      <input
        type="date"
        name="tyre_assign_9_back_dummy_right_date"
        value={vehicles.tyre_assign_9_back_dummy_right_date}
        onChange={(e) => onInputChange(e)}
        className={inputClass}
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">KM</label>
      <input
        type="tel"
        name="tyre_assign_9_back_dummy_right_km"
        value={vehicles.tyre_assign_9_back_dummy_right_km}
        onChange={(e) => onInputChange(e)}
        className={inputClass}
      />
    </div>
  </div>
                  {/* <TyreAssignmentBlock
                    label="10. Back Dummy Right"
                    noName="tyre_assign_10_back_dummy_right_no"
                    dateName="tyre_assign_10_back_dummy_right_date"
                    kmName="tyre_assign_10_back_dummy_right_km"
                  /> */}
                    <div className="col-span-full grid grid-cols-3 gap-4">
    <div>
      <label className="block text-sm font-medium text-gray-700">10. Back Dummy Right</label>
      <Select
        name="tyre_assign_10_back_dummy_right_no"
        options={tyre.map((option) => ({
          value: option.tyre_sub_no,
          label: option.tyre_sub_no,
          name: "tyre_assign_10_back_dummy_right_no",
        }))}
        onChange={(e) => onInputChange(e)}
        value={vehicles.tyre_assign_10_back_dummy_right_no ? {
          value: vehicles.tyre_assign_10_back_dummy_right_no,
          label: vehicles.tyre_assign_10_back_dummy_right_no
        } : null}
        placeholder="Select Tyre"
        styles={customStyles}
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">Date</label>
      <input
        type="date"
        name="tyre_assign_10_back_dummy_right_date"
        value={vehicles.tyre_assign_10_back_dummy_right_date}
        onChange={(e) => onInputChange(e)}
        className={inputClass}
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">KM</label>
      <input
        type="tel"
        name="tyre_assign_10_back_dummy_right_km"
        value={vehicles.tyre_assign_10_back_dummy_right_km}
        onChange={(e) => onInputChange(e)}
        className={inputClass}
      />
    </div>
  </div>
                </>
              )}
            </div>
          )}

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

export default AddTyre;
