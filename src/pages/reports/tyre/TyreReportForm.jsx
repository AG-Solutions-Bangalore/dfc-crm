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
  ReportTyreDetailsDownload,
  ReportTyreDetailsView,
  ReportTyreDownload,
  ReportTyreView,
} from "../../../components/buttonIndex/ButtonComponents";

function TyreReportForm() {
  const navigate = useNavigate();
  const [branch, setBranch] = useState([]);
  const todayback = moment().format("YYYY-MM-DD");
  const firstdate = moment().startOf("month").format("YYYY-MM-DD");
  const [vendor, setVendor] = useState([]);
  const [company, setCompany] = useState([]);

  const [downloadTyre, setDownloadTyre] = useState({
    tyre_from_date: firstdate,
    tyre_to_date: todayback,
    tyre_count: "",
    tyre_company: "",
    tyre_branch: "",
    tyre_supplier: "",
  });

  const validateOnlyNumber = (inputtxt) => {
    var phoneno = /^\d*\.?\d*$/;
    if (inputtxt.match(phoneno) || inputtxt.length == 0) {
      return true;
    } else {
      return false;
    }
  };

  const onInputChange = (input, actionOrEvent) => {
    if (actionOrEvent.target) {
      const { name, value } = actionOrEvent.target;

      if (name == "tyre_count") {
        if (validateOnlyNumber(value)) {
          setDownloadTyre((prevState) => ({
            ...prevState,
            [name]: value,
          }));
        } else {
          console.log("Invalid input: Only numbers are allowed.");
        }
      } else {
        setDownloadTyre((prevState) => ({
          ...prevState,
          [name]: value,
        }));
      }
    } else {
      setDownloadTyre((prevState) => ({
        ...prevState,
        [actionOrEvent.name]: input ? input.value : "",
      }));
    }
  };

  const onInputChange1 = (e) => {
    setDownloadTyre({
      ...downloadTyre,
      [e.target.name]: e.target.value,
    });
  };
  const fetchVendors = async () => {
    try {
      const theLoginToken = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/web-fetch-vendors/Tyre/${downloadTyre.tyre_branch}`,
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
  useEffect(() => {
    fetchBranches();
    // fetchVendors();
    fetchCompany();
  }, [downloadTyre.tyre_branch]);
  useEffect(() => {
    // fetchBranches();
    fetchVendors();
    // fetchCompany();
  }, [downloadTyre.tyre_branch]);
  //DOWNLOAD
  const onSubmit = (e) => {
    e.preventDefault();
    let data = {
      tyre_from_date: downloadTyre.tyre_from_date,
      tyre_to_date: downloadTyre.tyre_to_date,
      tyre_supplier: downloadTyre.tyre_supplier,
      tyre_count: downloadTyre.tyre_count,
      tyre_company: downloadTyre.tyre_company,
      tyre_branch: downloadTyre.tyre_branch,
    };
    var v = document.getElementById("dowRecp").checkValidity();
    var v = document.getElementById("dowRecp").reportValidity();

    if (v) {
      axios({
        url: BASE_URL + "/api/download-tyre-report",
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
          link.setAttribute("download", "tyre.csv");
          document.body.appendChild(link);
          link.click();
          toast.success("Tyre Report  is Downloaded Successfully");
        })
        .catch((err) => {
          toast.error("Tyre Report  is Not Downloaded");
        });
    }
  };

  const onDetailSubmit = (e) => {
    e.preventDefault();
    let data = {
      tyre_from_date: downloadTyre.tyre_from_date,
      tyre_to_date: downloadTyre.tyre_to_date,
      tyre_supplier: downloadTyre.tyre_supplier,
      tyre_count: downloadTyre.tyre_count,
      tyre_company: downloadTyre.tyre_company,
      tyre_branch: downloadTyre.tyre_branch,
    };
    var v = document.getElementById("dowRecp").checkValidity();
    var v = document.getElementById("dowRecp").reportValidity();
    e.preventDefault();

    if (v) {
      axios({
        url: BASE_URL + "/api/download-tyre-details-report",
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
          link.setAttribute("download", "tyreDetails.csv");
          document.body.appendChild(link);
          link.click();
          toast.success("Report is Downloaded Successfully");
        })
        .catch((err) => {
          toast.error("Report is Not Downloaded");
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
    navigate("/report-tyre-form/view");
    localStorage.setItem("tyre_from_date", downloadTyre.tyre_from_date);
    localStorage.setItem("tyre_to_date", downloadTyre.tyre_to_date);
    localStorage.setItem("tyre_supplier", downloadTyre.tyre_supplier);
    localStorage.setItem("tyre_count", downloadTyre.tyre_count);
    localStorage.setItem("tyre_company", downloadTyre.tyre_company);
    localStorage.setItem("tyre_branch", downloadTyre.tyre_branch);
  };
  const handleDetailview = () => {
    navigate("/report-tyre-form/details/view");
    localStorage.setItem("tyre_from_date", downloadTyre.tyre_from_date);
    localStorage.setItem("tyre_to_date", downloadTyre.tyre_to_date);
    localStorage.setItem("tyre_supplier", downloadTyre.tyre_supplier);
    localStorage.setItem("tyre_count", downloadTyre.tyre_count);
    localStorage.setItem("tyre_company", downloadTyre.tyre_company);
    localStorage.setItem("tyre_branch", downloadTyre.tyre_branch);
  };
  return (
    <Layout>
      <div className="  bg-[#FFFFFF] p-2   rounded-lg">
        <div className="sticky top-0 p-2  mb-4 border-b-2 border-red-500 rounded-lg  bg-[#E1F5FA] ">
          <h2 className=" px-5 text-[black] text-lg   flex flex-row  justify-between items-center  rounded-xl p-2 ">
            <div className="flex  items-center gap-2">
              <IconInfoCircle className="w-4 h-4" />
              <span>Tyre</span>
            </div>
          </h2>
        </div>
        <hr />
        <div className="p-4">
          <form id="dowRecp" autoComplete="off">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4">
              <div>
                <FormLabel required>From Date</FormLabel>
                <input
                  type="date"
                  name="tyre_from_date"
                  value={downloadTyre.tyre_from_date}
                  onChange={onInputChange1}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <FormLabel required>To Date</FormLabel>
                <input
                  type="date"
                  name="tyre_to_date"
                  value={downloadTyre.tyre_to_date}
                  onChange={onInputChange1}
                  className={inputClass}
                  required
                />
              </div>

              <SelectInput
                label="Company"
                name="tyre_company"
                value={
                  downloadTyre.tyre_company
                    ? {
                        value: downloadTyre.tyre_company,
                        label: downloadTyre.tyre_company,
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
                name="tyre_branch"
                value={
                  downloadTyre.tyre_branch
                    ? {
                        value: downloadTyre.tyre_branch,
                        label: downloadTyre.tyre_branch,
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
                label="Supplier"
                name="tyre_supplier"
                value={
                  downloadTyre.tyre_supplier
                    ? {
                        value: downloadTyre.tyre_supplier,
                        label: downloadTyre.tyre_supplier,
                      }
                    : null
                }
                options={vendor.map((item) => ({
                  value: item.vendor_name,
                  label: item.vendor_name,
                }))}
                onChange={onInputChange}
                placeholder="Supplier"
                styles={customStyles}
                isSearchable={true}
              />
              <div>
                <FormLabel>No of Tyres</FormLabel>
                <input
                  type="text"
                  name="tyre_count"
                  value={downloadTyre.tyre_count}
                  onChange={(e) => onInputChange(null, e)}
                  className={inputClass}
                />
              </div>
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
                onClick={handleDetailview}
              >
                Details View
              </button>
            </div> */}
            <div className="flex flex-wrap justify-center gap-4 py-4">
              <ReportTyreDownload
                className="text-center text-sm font-medium cursor-pointer hover:animate-pulse w-full sm:w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
                onClick={onSubmit}
              ></ReportTyreDownload>
              <ReportTyreView
                className="text-center text-sm font-medium cursor-pointer hover:animate-pulse w-full sm:w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
                onClick={handleview}
              ></ReportTyreView>
              <ReportTyreDetailsDownload
                className="text-center text-sm font-medium cursor-pointer hover:animate-pulse w-full sm:w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
                onClick={onDetailSubmit}
              ></ReportTyreDetailsDownload>
              <ReportTyreDetailsView
                className="text-center text-sm font-medium cursor-pointer hover:animate-pulse w-full sm:w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
                onClick={handleDetailview}
              ></ReportTyreDetailsView>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default TyreReportForm;
