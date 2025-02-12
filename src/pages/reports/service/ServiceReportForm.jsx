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
  ReportServicesDetailsDownload,
  ReportServicesDetailsView,
  ReportServicesDownload,
  ReportServicesView,
} from "../../../components/buttonIndex/ButtonComponents";
import { CreateButton } from "../../../components/common/ButtonColors";

function ServiceReportForm() {
  const navigate = useNavigate();
  const [branch, setBranch] = useState([]);
  const todayback = moment().format("YYYY-MM-DD");
  const firstdate = moment().startOf("month").format("YYYY-MM-DD");
  const [vendor, setVendor] = useState([]);
  const [company, setCompany] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  const [downloadServices, setServicesDownload] = useState({
    service_date_from: firstdate,
    service_date_to: todayback,
    service_garage: "",
    service_company: "",
    service_branch: "",
    service_truck_no: "",
  });

  const onInputChange = (selectedOption, action) => {
    console.log("Selected Option:", selectedOption);
    console.log("Action:", action);

    setServicesDownload((prevState) => ({
      ...prevState,
      [action.name]: selectedOption ? selectedOption.value : "",
    }));
  };

  const fetchVendors = async () => {
    try {
      const theLoginToken = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/web-fetch-vendors/Tyre/${downloadServices.service_branch}`,
        {
          headers: {
            Authorization: `Bearer ${theLoginToken}`,
          },
        }
      );

      console.log(response.data, "response");
      setVendor(response.data.vendor || []);
    } catch (error) {
      console.error("Error fetching company:", error);
    }
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
  const fetchCompany = async () => {
    try {
      const theLoginToken = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/web-fetch-company`, {
        headers: {
          Authorization: `Bearer ${theLoginToken}`,
        },
      });

      console.log(response.data, "response");
      setCompany(response.data.company || []);
    } catch (error) {
      console.error("Error fetching company:", error);
    }
  };
  const fetchVehicle = async () => {
    try {
      const theLoginToken = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/web-fetch-vehicles-report`,
        {
          headers: {
            Authorization: `Bearer ${theLoginToken}`,
          },
        }
      );

      console.log(response.data, "response");
      setVehicles(response.data.vehicles || []);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };
  useEffect(() => {
    fetchBranches();
    fetchVehicle();
    fetchCompany();
  }, []);
  useEffect(() => {
    fetchVendors();
  }, [downloadServices.service_branch]);
  //DOWNLOAD
  const onSubmit = (e) => {
    e.preventDefault();
    let data = {
      service_date_from: downloadServices.service_date_from,
      service_date_to: downloadServices.service_date_to,
      service_garage: downloadServices.service_garage,
      service_truck_no: downloadServices.service_truck_no,
      service_company: downloadServices.service_company,
      service_branch: downloadServices.service_branch,
    };
    var v = document.getElementById("dowRecp").checkValidity();
    var v = document.getElementById("dowRecp").reportValidity();

    if (v) {
      axios({
        url: BASE_URL + "/api/download-services-report",
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
          link.setAttribute("download", "Services.csv");
          document.body.appendChild(link);
          link.click();
          toast.success("Services Report  is Downloaded Successfully");
        })
        .catch((err) => {
          toast.error("Services Report  is Not Downloaded");
        });
    }
  };

  const onDetailSubmit = (e) => {
    e.preventDefault();
    let data = {
      service_date_from: downloadServices.service_date_from,
      service_date_to: downloadServices.service_date_to,
      service_garage: downloadServices.service_garage,
      service_truck_no: downloadServices.service_truck_no,
      service_company: downloadServices.service_company,
      service_branch: downloadServices.service_branch,
    };
    var v = document.getElementById("dowRecp").checkValidity();
    var v = document.getElementById("dowRecp").reportValidity();
    e.preventDefault();

    if (v) {
      axios({
        url: BASE_URL + "/api/download-services-details-report",
        method: "POST",
        data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        // .then((res) => {
        //   console.log("data : ", res.data);
        //   const url = window.URL.createObjectURL(new Blob([res.data]));
        //   const link = document.createElement("a");
        //   link.href = url;
        //   link.setAttribute("download", "servicesDetails.csv");
        //   document.body.appendChild(link);
        //   link.click();
        //   toast.success("servicesDetails is Downloaded Successfully");
        //   setIsButtonDisabled(false);
        // })
        // .catch((err) => {
        //   toast.error("servicesDetails is Not Downloaded");
        // });
        .then((res) => {
          console.log("data : ", res.data);
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "Services.csv");
          document.body.appendChild(link);
          link.click();
          toast.success("servicesDetails is Downloaded Successfully");
        })
        .catch((err) => {
          toast.error("servicesDetails is Not Downloaded");
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
  const handleview = () => {
    navigate("/report-services-form/view");
    localStorage.setItem(
      "service_date_from",
      downloadServices.service_date_from
    );
    localStorage.setItem("service_date_to", downloadServices.service_date_to);
    localStorage.setItem("service_garage", downloadServices.service_garage);
    localStorage.setItem("service_truck_no", downloadServices.service_truck_no);
    localStorage.setItem("service_company", downloadServices.service_company);
    localStorage.setItem("service_branch", downloadServices.service_branch);
  };
  const handleview1 = () => {
    navigate("/report-services-form/details/view");
    localStorage.setItem(
      "service_date_from",
      downloadServices.service_date_from
    );
    localStorage.setItem("service_date_to", downloadServices.service_date_to);
    localStorage.setItem("service_garage", downloadServices.service_garage);
    localStorage.setItem("service_truck_no", downloadServices.service_truck_no);
    localStorage.setItem("service_company", downloadServices.service_company);
    localStorage.setItem("service_branch", downloadServices.service_branch);
  };
  return (
    <Layout>
      <div className="  bg-[#FFFFFF] p-2   rounded-lg">
        <div className="sticky top-0 p-2  mb-4 border-b-2 border-red-500 rounded-lg  bg-[#E1F5FA] ">
          <h2 className=" px-5 text-[black] text-lg   flex flex-row  justify-between items-center  rounded-xl p-2 ">
            <div className="flex  items-center gap-2">
              <IconInfoCircle className="w-4 h-4" />
              <span>Services</span>
            </div>
          </h2>
        </div>
        <hr />
        <div className="p-4">
          <form id="dowRecp" autoComplete="off">
            <div className="grid grid-cols-1 md:grid-cols-2   gap-4">
              <SelectInput
                label="Vehicle No"
                name="service_truck_no"
                value={
                  downloadServices.service_truck_no
                    ? {
                        value: downloadServices.service_truck_no,
                        label: downloadServices.service_truck_no,
                      }
                    : null
                }
                options={vehicles.map((item) => ({
                  value: item.reg_no,
                  label: item.reg_no,
                }))}
                onChange={onInputChange}
                placeholder="Vehicle No"
                styles={customStyles}
                isSearchable={true}
              />
              <SelectInput
                label="Company"
                name="service_company"
                value={
                  downloadServices.service_company
                    ? {
                        value: downloadServices.service_company,
                        label: downloadServices.service_company,
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
                name="service_branch"
                value={
                  downloadServices.service_branch
                    ? {
                        value: downloadServices.service_branch,
                        label: downloadServices.service_branch,
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
                label="Garage"
                name="service_garage"
                value={
                  downloadServices.service_garage
                    ? {
                        value: downloadServices.service_garage,
                        label: downloadServices.service_garage,
                      }
                    : null
                }
                options={vendor.map((item) => ({
                  value: item.vendor_name,
                  label: item.vendor_name,
                }))}
                onChange={onInputChange}
                placeholder="Garage"
                styles={customStyles}
                isSearchable={true}
              />
            </div>

            {/* <div className="flex flex-wrap justify-center gap-4 py-4">
              <button
                className="text-center text-sm font-medium cursor-pointer hover:animate-pulse w-full sm:w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
                onClick={onSubmit}
              >
                Download
              </button>
              <button
                className="text-center text-sm font-medium cursor-pointer hover:animate-pulse w-full sm:w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
                onClick={handleview}
              >
                View
              </button>
              <button
                className="text-center text-sm font-medium cursor-pointer hover:animate-pulse w-full sm:w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
                onClick={onDetailSubmit}
              >
                Details Download
              </button>
              <button
                className="text-center text-sm font-medium cursor-pointer hover:animate-pulse w-full sm:w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
                onClick={handleview1}
              >
                Details View
              </button>
            </div> */}
            <div className="flex flex-wrap justify-center gap-4 py-4">
              <ReportServicesDownload
                className={`${CreateButton} mx-4`}
                onClick={onSubmit}
              ></ReportServicesDownload>
              <ReportServicesView
                className={`${CreateButton} `}
                onClick={handleview}
              ></ReportServicesView>
              <ReportServicesDetailsDownload
                className={`${CreateButton} mx-4 w-[200px]`}
                onClick={onDetailSubmit}
              ></ReportServicesDetailsDownload>
              <ReportServicesDetailsView
                className={`${CreateButton} `}
                onClick={handleview1}
              ></ReportServicesDetailsView>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default ServiceReportForm;
