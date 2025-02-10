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
  ReportSalaryMultipleDownload,
  ReportSalaryMultipleView,
  ReportSalarySingleDownload,
  ReportSalarySingleView,
} from "../../../components/buttonIndex/ButtonComponents";
import { CreateButton } from "../../../components/common/ButtonColors";

function SalaryReportForm() {
  const navigate = useNavigate();
  const [branch, setBranch] = useState([]);
  const previousMonthStart = moment()
    .subtract(1, "month")
    .startOf("month")
    .format("YYYY-MM-DD");
  const previousMonthEnd = moment()
    .subtract(1, "month")
    .endOf("month")
    .format("YYYY-MM-DD");

  console.log("Previous Month Start:", previousMonthStart);
  console.log("Previous Month End:", previousMonthEnd);
  const [company, setCompany] = useState([]);
  const [driver, setDriver] = useState([]);

  const [downloadSalary, setSalaryDownload] = useState({
    trip_date_from: previousMonthStart,
    trip_date_to: previousMonthEnd,
    trip_company: "",
    trip_branch: "",
    trip_driver: "",
  });
  const onInputChange = (selectedOption, action) => {
    console.log("Selected Option:", selectedOption);
    console.log("Action:", action);

    setSalaryDownload((prevState) => ({
      ...prevState,
      [action.name]: selectedOption ? selectedOption.value : "",
    }));
  };

  const onInputChange1 = (e) => {
    setSalaryDownload({
      ...downloadSalary,
      [e.target.name]: e.target.value,
    });
  };

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

    if (downloadSalary.trip_branch) {
      fetchData(
        `${BASE_URL}/api/web-fetch-assigning-tripdriver/${downloadSalary.trip_branch}`,
        setDriver,
        "drivers"
      );
    }
  }, [downloadSalary.trip_branch]);

  const onSubmit = (e) => {
    e.preventDefault();
    let data = {
      trip_date_from: downloadSalary.trip_date_from,
      trip_date_to: downloadSalary.trip_date_to,
      trip_company: downloadSalary.trip_company,
      trip_branch: downloadSalary.trip_branch,
      trip_driver: downloadSalary.trip_driver,
    };
    var v = document.getElementById("dowRecp").checkValidity();
    var v = document.getElementById("dowRecp").reportValidity();

    if (v) {
      axios({
        url: BASE_URL + "/api/download-salary-report",
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
          link.setAttribute("download", "salary.csv");
          document.body.appendChild(link);
          link.click();
          toast.success("Report is Downloaded Successfully");
        })
        .catch((err) => {
          toast.error("Report is Not Downloaded");
        });
    }
  };

  const onDetailSubmit = (e) => {
    e.preventDefault();
    let data = {
      trip_date_from: downloadSalary.trip_date_from,
      trip_date_to: downloadSalary.trip_date_to,
      trip_company: downloadSalary.trip_company,
      trip_branch: downloadSalary.trip_branch,
      trip_driver: downloadSalary.trip_driver,
    };
    var v = document.getElementById("dowRecp").checkValidity();
    var v = document.getElementById("dowRecp").reportValidity();
    e.preventDefault();

    if (v) {
      axios({
        url: BASE_URL + "/api/download-salary-multiple-report",
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
          link.setAttribute("download", "salary.csv");
          document.body.appendChild(link);
          link.click();
          toast.success("Salary is Downloaded Successfully");
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

  const handleMultipleview = () => {
    navigate("/report-salary-form/multiple/view");
    localStorage.setItem("trip_date_from", downloadSalary.trip_date_from);
    localStorage.setItem("trip_date_to", downloadSalary.trip_date_to);
    localStorage.setItem("trip_company", downloadSalary.trip_company);
    localStorage.setItem("trip_branch", downloadSalary.trip_branch);
    localStorage.setItem("trip_driver", downloadSalary.trip_driver);
  };
  const handleview = () => {
    navigate("/report-salary-form/view");
    localStorage.setItem("trip_date_from", downloadSalary.trip_date_from);
    localStorage.setItem("trip_date_to", downloadSalary.trip_date_to);
    localStorage.setItem("trip_company", downloadSalary.trip_company);
    localStorage.setItem("trip_branch", downloadSalary.trip_branch);
    localStorage.setItem("trip_driver", downloadSalary.trip_driver);
  };
  return (
    <Layout>
      <div className="  bg-[#FFFFFF] p-2   rounded-lg">
        <div className="sticky top-0 p-2  mb-4 border-b-2 border-red-500 rounded-lg  bg-[#E1F5FA] ">
          <h2 className=" px-5 text-[black] text-lg   flex flex-row  justify-between items-center  rounded-xl p-2 ">
            <div className="flex  items-center gap-2">
              <IconInfoCircle className="w-4 h-4" />
              <span>Salary</span>
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
                  name="trip_date_from"
                  value={downloadSalary.trip_date_from}
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
                  value={downloadSalary.trip_date_to}
                  onChange={onInputChange1}
                  className={inputClass}
                  required
                />
              </div>

              <SelectInput
                label="Company"
                name="trip_company"
                value={
                  downloadSalary.trip_company
                    ? {
                        value: downloadSalary.trip_company,
                        label: downloadSalary.trip_company,
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
                  downloadSalary.trip_branch
                    ? {
                        value: downloadSalary.trip_branch,
                        label: downloadSalary.trip_branch,
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
                label="Driver"
                name="trip_driver"
                value={
                  downloadSalary.trip_driver
                    ? {
                        value: downloadSalary.trip_driver,
                        label: downloadSalary.trip_driver,
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
            </div>

            {/* <div className="flex flex-wrap justify-center gap-4 py-4">
              <button
                className="text-center text-sm font-medium cursor-pointer hover:animate-pulse w-full sm:w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
                onClick={onSubmit}
              >
                Single Download
              </button>
              <button
                className="text-center text-sm font-medium cursor-pointer hover:animate-pulse w-full sm:w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
                onClick={handleview}
              >
                Single View
              </button>
              <button
                className="text-center text-sm font-medium cursor-pointer hover:animate-pulse w-full sm:w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
                onClick={onDetailSubmit}
              >
                Multiple Download
              </button>
              <button
                className="text-center text-sm font-medium cursor-pointer hover:animate-pulse w-full sm:w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
                onClick={handleMultipleview}
              >
                Multiple View
              </button>
            </div> */}
            <div className="flex flex-wrap justify-center gap-4 py-4">
              <ReportSalarySingleDownload
                className={`${CreateButton} mx-4 w-[190px]`}
                onClick={onSubmit}
              ></ReportSalarySingleDownload>
              <ReportSalarySingleView
                className={`${CreateButton} `}
                onClick={handleview}
              ></ReportSalarySingleView>
              <ReportSalaryMultipleDownload
                className={`${CreateButton} mx-4 w-[190px]`}
                onClick={onDetailSubmit}
              ></ReportSalaryMultipleDownload>
              <ReportSalaryMultipleView
                className={`${CreateButton} `}
                onClick={handleMultipleview}
              ></ReportSalaryMultipleView>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default SalaryReportForm;
