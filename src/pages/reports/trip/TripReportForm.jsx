import Layout from "../../../layout/Layout";
import { useState, useEffect } from "react";
import BASE_URL from "../../../base/BaseUrl";
import { toast } from "sonner";
import axios from "axios";
import SelectInput from "../../../components/common/SelectField";
import { useNavigate } from "react-router-dom";
import { IconInfoCircle } from "@tabler/icons-react";
import moment from "moment";
import {
  ReportTripRDetailsDownload,
  ReportTripRDetailsView,
  ReportTripRDownload,
  ReportTripRView,
} from "../../../components/buttonIndex/ButtonComponents";
import { CreateButton } from "../../../components/common/ButtonColors";
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
    value: "Car",
    label: "Car",
  },
];

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
function TripReportForm() {
  const navigate = useNavigate();
  const [branch, setBranch] = useState([]);
  const todayback = moment().format("YYYY-MM-DD");
  const firstdate = moment().startOf("month").format("YYYY-MM-DD");
  const [vendor, setVendor] = useState([]);
  const [company, setCompany] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [vehiclesNew, setVehiclesNew] = useState([]);
  const [driver, setDriver] = useState([]);
  const [agency, setAgency] = useState([]);

  const [downloadTrip, setTripDownload] = useState({
    trip_date_from: firstdate,
    trip_date_to: todayback,
    trip_company: "",
    trip_branch: "",
    trip_vehicle: "",
    trip_full_vehicle: "",
    trip_vehicle_type: "",
    trip_driver: "",
    trip_agency: "",
    trip_supplier: "",
    trip_status: "",
  });

  const onInputChange = (selectedOption, action) => {
    console.log("Selected Option:", selectedOption);
    console.log("Action:", action);

    setTripDownload((prevState) => ({
      ...prevState,
      [action.name]: selectedOption ? selectedOption.value : "",
    }));
  };

  const onInputChange1 = (e) => {
    setTripDownload({
      ...downloadTrip,
      [e.target.name]: e.target.value,
    });
  };

  //DOWNLOAD

  const fetchData = async (url, setState, key = null) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data, `Response from ${url}`);
      setState(key ? response.data[key] || [] : response.data || []);
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
    }
  };
  useEffect(() => {
    fetchData(`${BASE_URL}/api/web-fetch-company`, setCompany, "company");
    fetchData(`${BASE_URL}/api/web-fetch-branch`, setBranch, "branch");
    fetchData(
      `${BASE_URL}/api/web-fetch-report-vehicle`,
      setVehicles,
      "vehicles"
    );

    if (downloadTrip.trip_branch) {
      fetchData(
        `${BASE_URL}/api/web-fetch-assigning-tripdriver/${downloadTrip.trip_branch}`,
        setDriver,
        "drivers"
      );
      fetchData(
        `${BASE_URL}/api/web-fetch-vendors/Diesel/${downloadTrip.trip_branch}`,
        setVendor,
        "vendor"
      );
      fetchData(
        `${BASE_URL}/api/web-fetch-agencies/${downloadTrip.trip_branch}`,
        setAgency,
        "agencies"
      );
    }

    if (downloadTrip.trip_company && downloadTrip.trip_branch) {
      fetchData(
        `${BASE_URL}/api/web-fetch-vehicles/${downloadTrip.trip_company}/${downloadTrip.trip_branch}`,
        setVehiclesNew,
        "vehicles"
      );
    }
  }, [downloadTrip.trip_branch, downloadTrip.trip_company]);

  const onSubmit = (e) => {
    e.preventDefault();
    let data = {
      trip_date_from: downloadTrip.trip_date_from,
      trip_date_to: downloadTrip.trip_date_to,
      trip_company: downloadTrip.trip_company,
      trip_branch: downloadTrip.trip_branch,
      trip_vehicle: downloadTrip.trip_vehicle,
      trip_full_vehicle: downloadTrip.trip_full_vehicle,
      trip_vehicle_type: downloadTrip.trip_vehicle_type,
      trip_driver: downloadTrip.trip_driver,
      trip_agency: downloadTrip.trip_agency,
      trip_supplier: downloadTrip.trip_supplier,
      trip_status: downloadTrip.trip_status,
    };
    var v = document.getElementById("dowRecp").checkValidity();
    var v = document.getElementById("dowRecp").reportValidity();

    if (v) {
      axios({
        url: BASE_URL + "/api/download-trip-report",
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
          link.setAttribute("download", "Trip.csv");
          document.body.appendChild(link);
          link.click();
          toast.success("Trip Report  is Downloaded Successfully");
        })
        .catch((err) => {
          toast.error("Trip Report  is Not Downloaded");
        });
    }
  };

  const onDetailSubmit = (e) => {
    e.preventDefault();
    let data = {
      trip_date_from: downloadTrip.trip_date_from,
      trip_date_to: downloadTrip.trip_date_to,
      trip_company: downloadTrip.trip_company,
      trip_branch: downloadTrip.trip_branch,
      trip_vehicle: downloadTrip.trip_vehicle,
      trip_vehicle_type: downloadTrip.trip_vehicle_type,
      trip_driver: downloadTrip.trip_driver,
      trip_agency: downloadTrip.trip_agency,
      trip_supplier: downloadTrip.trip_supplier,
      trip_status: downloadTrip.trip_status,
      trip_full_vehicle: downloadTrip.trip_full_vehicle,
    };
    var v = document.getElementById("dowRecp").checkValidity();
    var v = document.getElementById("dowRecp").reportValidity();
    e.preventDefault();

    if (v) {
      axios({
        url: BASE_URL + "/api/download-trip-multiple-report",
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
          link.setAttribute("download", "Trip.csv");
          document.body.appendChild(link);
          link.click();
          toast.success("Details Trip Report  is Downloaded Successfully");
        })
        .catch((err) => {
          toast.error("Details Trip is Not Downloaded");
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
    navigate("/report-trip-form/view");
    localStorage.setItem("trip_date_from", downloadTrip.trip_date_from);
    localStorage.setItem("trip_date_to", downloadTrip.trip_date_to);
    localStorage.setItem("trip_company", downloadTrip.trip_company);
    localStorage.setItem("trip_branch", downloadTrip.trip_branch);
    localStorage.setItem("trip_vehicle", downloadTrip.trip_vehicle);
    localStorage.setItem("trip_full_vehicle", downloadTrip.trip_full_vehicle);
    localStorage.setItem("trip_vehicle_type", downloadTrip.trip_vehicle_type);
    localStorage.setItem("trip_driver", downloadTrip.trip_driver);
    localStorage.setItem("trip_agency", downloadTrip.trip_agency);
    localStorage.setItem("trip_supplier", downloadTrip.trip_supplier);
    localStorage.setItem("trip_status", downloadTrip.trip_status);
  };
  const handleview1 = () => {
    navigate("/report-trip-form/multiple/view");
    localStorage.setItem("trip_date_from", downloadTrip.trip_date_from);
    localStorage.setItem("trip_date_to", downloadTrip.trip_date_to);
    localStorage.setItem("trip_company", downloadTrip.trip_company);
    localStorage.setItem("trip_branch", downloadTrip.trip_branch);
    localStorage.setItem("trip_vehicle", downloadTrip.trip_vehicle);
    localStorage.setItem("trip_full_vehicle", downloadTrip.trip_full_vehicle);
    localStorage.setItem("trip_vehicle_type", downloadTrip.trip_vehicle_type);
    localStorage.setItem("trip_driver", downloadTrip.trip_driver);
    localStorage.setItem("trip_agency", downloadTrip.trip_agency);
    localStorage.setItem("trip_supplier", downloadTrip.trip_supplier);
    localStorage.setItem("trip_status", downloadTrip.trip_status);
  };
  return (
    <Layout>
      <div className="  bg-[#FFFFFF] p-2   rounded-lg">
        <div className="sticky top-0 p-2  mb-4 border-b-2 border-red-500 rounded-lg  bg-[#E1F5FA] ">
          <h2 className=" px-5 text-[black] text-lg   flex flex-row  justify-between items-center  rounded-xl p-2 ">
            <div className="flex  items-center gap-2">
              <IconInfoCircle className="w-4 h-4" />
              <span>Trip</span>
            </div>
          </h2>
        </div>
        <hr />
        <div className="p-4">
          <form id="dowRecp" autoComplete="off">
            <div className="grid grid-cols-1  lg:grid-cols-3  gap-4">
              <div>
                <FormLabel required>From Date</FormLabel>
                <input
                  type="date"
                  name="trip_date_from"
                  value={downloadTrip.trip_date_from}
                  onChange={onInputChange1}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <FormLabel required>To Date</FormLabel>
                <input
                  type="date"
                  name="trip_date_to"
                  value={downloadTrip.trip_date_to}
                  onChange={onInputChange1}
                  className={inputClass}
                  required
                />
              </div>

              <SelectInput
                label="Direct Vehicle No"
                name="trip_full_vehicle"
                value={
                  downloadTrip.trip_full_vehicle
                    ? {
                        value: downloadTrip.trip_full_vehicle,
                        label: downloadTrip.trip_full_vehicle,
                      }
                    : null
                }
                options={vehicles.map((item) => ({
                  value: item.reg_no,
                  label: item.reg_no,
                }))}
                onChange={onInputChange}
                placeholder="Select Vehicle No"
                styles={customStyles}
                isSearchable={true}
              />
            </div>

            <div className="grid grid-cols-1  lg:grid-cols-4  gap-4 mt-4">
              <SelectInput
                label="Company"
                name="trip_company"
                value={
                  downloadTrip.trip_company
                    ? {
                        value: downloadTrip.trip_company,
                        label: downloadTrip.trip_company,
                      }
                    : null
                }
                options={company.map((item) => ({
                  value: item.company_name,
                  label: item.company_name,
                }))}
                onChange={onInputChange}
                placeholder="Select Company"
                styles={customStyles}
                isSearchable={true}
              />
              <SelectInput
                label="Branch"
                name="trip_branch"
                value={
                  downloadTrip.trip_branch
                    ? {
                        value: downloadTrip.trip_branch,
                        label: downloadTrip.trip_branch,
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
              <SelectInput
                label="Vehicle No"
                name="trip_vehicle"
                value={
                  downloadTrip.trip_vehicle
                    ? {
                        value: downloadTrip.trip_vehicle,
                        label: downloadTrip.trip_vehicle,
                      }
                    : null
                }
                options={vehiclesNew.map((item) => ({
                  value: item.reg_no,
                  label: item.reg_no,
                }))}
                onChange={onInputChange}
                placeholder="Select Vehicle No"
                styles={customStyles}
                isSearchable={true}
              />
              <SelectInput
                label="Vehicle Type"
                name="trip_vehicle_type"
                value={
                  downloadTrip.trip_vehicle_type
                    ? {
                        value: downloadTrip.trip_vehicle_type,
                        label: downloadTrip.trip_vehicle_type,
                      }
                    : null
                }
                options={vehicleType.map((item) => ({
                  value: item.value,
                  label: item.value,
                }))}
                onChange={onInputChange}
                placeholder="Select Vehicle Type"
                styles={customStyles}
                isSearchable={true}
              />
              <SelectInput
                label="Driver"
                name="trip_driver"
                value={
                  downloadTrip.trip_driver
                    ? {
                        value: downloadTrip.trip_driver,
                        label: downloadTrip.trip_driver,
                      }
                    : null
                }
                options={driver.map((item) => ({
                  value: item.full_name,
                  label: item.full_name,
                }))}
                onChange={onInputChange}
                placeholder="Select Driver"
                styles={customStyles}
                isSearchable={true}
              />
              <SelectInput
                label="Supplier"
                name="trip_supplier"
                value={
                  downloadTrip.trip_supplier
                    ? {
                        value: downloadTrip.trip_supplier,
                        label: downloadTrip.trip_supplier,
                      }
                    : null
                }
                options={vendor.map((item) => ({
                  value: item.vendor_name,
                  label: item.vendor_name,
                }))}
                onChange={onInputChange}
                placeholder="Select Supplier"
                styles={customStyles}
                isSearchable={true}
              />
              <SelectInput
                label="Agencies"
                name="trip_agency"
                value={
                  downloadTrip.trip_agency
                    ? {
                        value: downloadTrip.trip_agency,
                        label: downloadTrip.trip_agency,
                      }
                    : null
                }
                options={agency.map((item) => ({
                  value: item.agency_name,
                  label: item.agency_name,
                }))}
                onChange={onInputChange}
                placeholder="Select Agencies"
                styles={customStyles}
                isSearchable={true}
              />
              <SelectInput
                label="Status"
                name="trip_status"
                value={
                  downloadTrip.trip_status
                    ? {
                        value: downloadTrip.trip_status,
                        label: downloadTrip.trip_status,
                      }
                    : null
                }
                options={status.map((item) => ({
                  value: item.value,
                  label: item.label,
                }))}
                onChange={onInputChange}
                placeholder="Select Status"
                styles={customStyles}
                isSearchable={true}
              />
            </div>

            <div className="flex flex-wrap justify-center gap-4 mt-4">
              <ReportTripRDownload
                className={`${CreateButton} mx-4 `}
                onClick={onSubmit}
              >
                Download
              </ReportTripRDownload>
              <ReportTripRView
                className={`${CreateButton} `}
                onClick={handleview}
              >
                View
              </ReportTripRView>
              <ReportTripRDetailsDownload
                className={`${CreateButton} mx-4 w-40`}
                onClick={onDetailSubmit}
              >
                Details Download
              </ReportTripRDetailsDownload>
              <ReportTripRDetailsView
                className={`${CreateButton} `}
                onClick={handleview1}
              >
                Details View
              </ReportTripRDetailsView>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default TripReportForm;
