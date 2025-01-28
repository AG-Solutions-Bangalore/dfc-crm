import React, { useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";
import { IconArrowBack, IconInfoCircle } from "@tabler/icons-react";
import Select from "react-select";

const status = [
  {
    value: "Pending",
    label: "Pending",
  },
  {
    value: "Accept",
    label: "Accept",
  },
  {
    value: "Reached",
    label: "Reached",
  },
  {
    value: "Return",
    label: "Return",
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
const EditTrip = () => {
  const { id } = useParams();

  const navigate = useNavigate();
  const [trip, setTrip] = useState({
    trip_date: "",
    trip_branch: "",
    trip_company: "",
    trip_vehicle: "",
    trip_reference: "",
    trip_driver_no: "",
    trip_agency: "",
    trip_km: "",
    trip_hsd: "",
    trip_advance: "",
    trip_hsd_supplied: "",
    trip_supplier: "",
    trip_remarks: "",
    trip_status: "",
    trip_driver: "",
  });
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  //vechile no
  const [vehicles, setVehicles] = useState([]);
  const [driver, setDriver] = useState([]);

  const [vehiclesOtherData, setvehiclesOtherData] = useState([]); //
  const [vendor, setVendor] = useState([]); //
  const [agency, setAgency] = useState([]); //
  const [agenciesRT, setAgenciesRT] = useState([]); //
  const fetchEditTrip = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/web-fetch-trip-by-id/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTrip(response.data?.trip);
      setVehicles(response.data?.vehicles);
      setDriver(response.data?.drivers);
    } catch (error) {
      console.error("Error fetching  trip edit data", error);
    } finally {
      setLoading(false);
    }
  };
  //
  const fetchVechileOtherData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/web-fetch-vehicles-other-data/${trip.trip_vehicle}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setvehiclesOtherData(response.data?.vehiclesOtherData);
    } catch (error) {
      console.error("Error fetching setvechile other  data", error);
    } finally {
      setLoading(false);
    }
  };
  //
  const fetchVendor = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/web-fetch-vendors/Diesel/${trip.trip_branch}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setVendor(response.data?.vendor);
    } catch (error) {
      console.error("Error fetching trip data", error);
    } finally {
      setLoading(false);
    }
  };
  //
  const fetchAgency = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/web-fetch-agencies/${trip.trip_branch}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAgency(response.data?.agencies);
    } catch (error) {
      console.error("Error fetching trip agency data", error);
    } finally {
      setLoading(false);
    }
  };
  //
  const fetchAgencyRt = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/web-fetch-agencies-sh-rt/${trip.trip_agency}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAgenciesRT(response.data?.agenciesRT);
    } catch (error) {
      console.error("Error fetching agency rt data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEditTrip();
  }, []);
  //
  useEffect(() => {
    if (trip.trip_vehicle && trip.trip_vehicle !== "") {
      fetchVechileOtherData();
    }
  }, [trip.trip_vehicle]);

  useEffect(() => {
    if (trip.trip_branch && trip.trip_branch !== "") {
      fetchVendor();
      fetchAgency();
    }
  }, [vehiclesOtherData.vehicle_branch]);
  useEffect(() => {
    if (trip.trip_agency && trip.trip_agency !== "") {
      fetchAgencyRt();
    }
  }, [trip.trip_agency]);

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

  // const onInputChange = (e) => {
  //   if (e.target.name == "trip_km") {
  //     if (validateOnlyNumber(e.target.value)) {
  //       setTrip({
  //         ...trip,
  //         [e.target.name]: e.target.value,
  //       });
  //     }
  //   } else if (e.target.name == "trip_hsd") {
  //     if (validateOnlyDigits(e.target.value)) {
  //       setTrip({
  //         ...trip,
  //         [e.target.name]: e.target.value,
  //       });
  //     }
  //   } else if (e.target.name == "trip_advance") {
  //     if (validateOnlyDigits(e.target.value)) {
  //       setTrip({
  //         ...trip,
  //         [e.target.name]: e.target.value,
  //       });
  //     }
  //   } else {
  //     setTrip({
  //       ...trip,
  //       [e.target.name]: e.target.value,
  //     });
  //   }
  // };

  const onInputChange = (e) => {
    if (e.name == "trip_vehicle") {
      setTrip({
        ...trip,
        trip_vehicle: e.value,
      });
    } else if (e.name == "trip_agency") {
      setTrip({
        ...trip,
        trip_agency: e.value,
      });
    } else if (e.name == "trip_driver") {
      setTrip({
        ...trip,
        trip_driver: e.value,
      });
    } else if (e.name == "trip_supplier") {
      setTrip({
        ...trip,
        trip_supplier: e.value,
      });
    } else if (e.target.name == "trip_hsd") {
      if (validateOnlyDigits(e.target.value)) {
        setTrip({
          ...trip,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name == "trip_advance") {
      if (validateOnlyDigits(e.target.value)) {
        setTrip({
          ...trip,
          [e.target.name]: e.target.value,
        });
      }
    } else {
      setTrip({
        ...trip,
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
      trip_reference: trip.trip_reference,
      trip_driver_no: trip.trip_driver_no,
      trip_date: trip.trip_date,
      trip_agency: trip.trip_agency,
      trip_km: trip.trip_km,
      trip_hsd: Math.round(
        agenciesRT.agency_rt_km / vehiclesOtherData.vehicle_mileage
      ),
      trip_advance: trip.trip_advance,
      trip_hsd_supplied: trip.trip_hsd_supplied,
      trip_supplier: trip.trip_supplier,
      trip_remarks: trip.trip_remarks,
      trip_status: trip.trip_status,

      trip_vehicle: trip.trip_vehicle,
      trip_driver: trip.trip_driver,
    };

    setIsButtonDisabled(true);
    axios({
      url: BASE_URL + `/api/web-update-trip/${id}`,
      method: "PUT",
      data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      toast.success("Trip Updated Sucessfully");
      navigate(-1);
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
              <span>Edit Trip </span>
            </div>
            <IconArrowBack
              onClick={() => navigate("/trip-list")}
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
                name="trip_date"
                value={trip.trip_date}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
              />
            </div>
            {/* company  */}
            <div>
              <FormLabel required>Company</FormLabel>
              <input
                type="text"
                name="trip_company"
                value={trip.trip_company}
                onChange={(e) => onInputChange(e)}
                className={`${inputClass} cursor-not-allowed opacity-50`}
                required
                disabled
              />
            </div>
            {/* Branch  */}
            <div>
              <FormLabel required>Branch</FormLabel>
              <input
                type="text"
                name="trip_branch"
                value={trip.trip_branch}
                onChange={(e) => onInputChange(e)}
                className={`${inputClass} cursor-not-allowed opacity-50`}
                required
                disabled
              />
            </div>
            {/* Vechile No  */}

            <div>
              <FormLabel required>Vechile No</FormLabel>
              <Select
                name="trip_vehicle"
                options={vehicles.map((option) => ({
                  value: option.reg_no,
                  label: option.reg_no,
                  name: "trip_vehicle",
                }))}
                onChange={(e) => onInputChange(e)}
                value={
                  trip.trip_vehicle
                    ? {
                        value: trip.trip_vehicle,
                        label: trip.trip_vehicle,
                      }
                    : null
                }
                placeholder="Select Vechile No"
                styles={customStyles}
                isSearchable={true}
              />
            </div>

            {/* Vechile Driver  */}
            <div>
              <FormLabel required>Driver</FormLabel>
              <Select
                name="trip_driver"
                options={driver.map((option) => ({
                  value: option.full_name,
                  label: option.full_name,
                  name: "trip_driver",
                }))}
                onChange={(e) => onInputChange(e)}
                value={
                  trip.trip_vehicle
                    ? {
                        value: trip.trip_driver,
                        label: trip.trip_driver,
                      }
                    : null
                }
                required
                placeholder="Select Driver"
                styles={customStyles}
                isSearchable={true}
              />
            </div>

            {/* Driver No  */}
            <div>
              <FormLabel required>Driver No</FormLabel>
              <input
                type="text"
                name="trip_driver_no"
                value={trip.trip_driver_no}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
                required
              />
            </div>
            {/* Agencies  */}
            <div>
              <FormLabel required>Agencies</FormLabel>
              <Select
                name="trip_agency"
                options={agency.map((option) => ({
                  value: option.agency_name,
                  label: option.agency_name,
                  name: "trip_agency",
                }))}
                onChange={(e) => onInputChange(e)}
                value={
                  trip.trip_agency
                    ? {
                        value: trip.trip_agency,
                        label: trip.trip_agency,
                      }
                    : null
                }
                required
                placeholder="Select Agencies"
                styles={customStyles}
                isSearchable={true}
              />
            </div>
            {/* Supplier  */}
            <div>
              <FormLabel required>Supplier</FormLabel>
              <Select
                name="trip_supplier"
                options={vendor.map((option) => ({
                  value: option.vendor_name,
                  label: option.vendor_name,
                  name: "trip_supplier",
                }))}
                onChange={(e) => onInputChange(e)}
                value={
                  trip.trip_supplier
                    ? {
                        value: trip.trip_supplier,
                        label: trip.trip_supplier,
                      }
                    : null
                }
                required
                placeholder="Select Supplier"
                styles={customStyles}
                isSearchable={true}
              />
            </div>

            {/* RT Km  */}
            <div>
              <FormLabel required>RT KM</FormLabel>
              <input
                type="text"
                name="trip_km"
                value={agenciesRT.agency_rt_km}
                onChange={(e) => onInputChange(e)}
                className={`${inputClass} cursor-not-allowed opacity-50`}
                required
                disabled
              />
            </div>
            {/* Fixed HSD  */}
            <div>
              <FormLabel required>Fixed HSD</FormLabel>
              <input
                type="text"
                name="trip_hsd"
                value={
                  Math.round(
                    agenciesRT.agency_rt_km / vehiclesOtherData.vehicle_mileage
                  ) || ""
                }
                onChange={(e) => onInputChange(e)}
                className={`${inputClass} cursor-not-allowed opacity-50`}
                required
                disabled
              />
            </div>
            {/* Mileage  */}
            <div>
              <FormLabel required>Mileage</FormLabel>
              <input
                type="text"
                name="trip_mileage"
                value={vehiclesOtherData.vehicle_mileage}
                onChange={(e) => onInputChange(e)}
                className={`${inputClass} cursor-not-allowed opacity-50`}
                required
                disabled
              />
            </div>

            {/* HSD Supplied  */}
            <div>
              <FormLabel>HSD Supplied</FormLabel>
              <input
                type="text"
                name="trip_hsd_supplied"
                value={trip.trip_hsd_supplied}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
              />
            </div>
            {/* Advance  */}
            <div>
              <FormLabel>Advance</FormLabel>
              <input
                type="text"
                name="trip_advance"
                value={trip.trip_advance}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
              />
            </div>

            {/* status  */}
            <div>
              <FormLabel>Status</FormLabel>
              <select
                name="trip_status"
                value={trip.trip_status}
                onChange={(e) => onInputChange(e)}
                className={inputClassSelect}
              >
                <option value="">Select Status</option>
                {status.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            {/* Remark  */}
            <div className=" col-span-0 lg:col-span-2">
              <FormLabel>Remarks</FormLabel>
              <textarea
                type="text"
                name="trip_remarks"
                value={trip.trip_remarks}
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
              className="text-center text-sm font-[400] cursor-pointer  w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
              disabled={isButtonDisabled}
            >
              {isButtonDisabled ? "Updatting..." : "Update"}
            </button>

            <button
              type="button"
              className="text-center text-sm font-[400] cursor-pointer  w-36 text-white bg-red-600 hover:bg-red-400 p-2 rounded-lg shadow-md"
              onClick={() => {
                navigate(-1);
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

export default EditTrip;
