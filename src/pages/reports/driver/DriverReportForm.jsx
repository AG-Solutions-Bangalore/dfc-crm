import Layout from "../../../layout/Layout";
import { useState, useEffect } from "react";
import BASE_URL from "../../../base/BaseUrl";
import { toast } from "sonner";
import axios from "axios";
import SelectInput from "../../../components/common/SelectField";
import { useNavigate } from "react-router-dom";
import { IconInfoCircle } from "@tabler/icons-react";

function DriverReportForm() {
  const navigate = useNavigate();
  const [driver, setDriver] = useState([]);
  const [company, setCompany] = useState([]);
  const [downloadDriver, setDoenloadDriver] = useState({
    agency_branch: "",
    user_company: "",
  });

  const onInputChange = (selectedOption, action) => {
    console.log("Selected Option:", selectedOption);
    console.log("Action:", action);

    setDoenloadDriver((prevState) => ({
      ...prevState,
      [action.name]: selectedOption ? selectedOption.value : "",
    }));
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
  const fetchBranches = async () => {
    try {
      const theLoginToken = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/web-fetch-branch`, {
        headers: {
          Authorization: `Bearer ${theLoginToken}`,
        },
      });

      console.log(response.data, "response");
      setDriver(response.data.branch || []);
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };
  useEffect(() => {
    fetchBranches();
    fetchCompany();
  }, []);
  //DOWNLOAD
  const onSubmit = (e) => {
    e.preventDefault();
    let data = {
      agency_branch: downloadDriver.agency_branch,
      user_company: downloadDriver.user_company,
    };
    var v = document.getElementById("dowRecp").checkValidity();
    var v = document.getElementById("dowRecp").reportValidity();

    if (v) {
      axios({
        url: BASE_URL + "/api/download-driver-report",
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
          link.setAttribute("download", "driver.csv");
          document.body.appendChild(link);
          link.click();
          toast.success("Driver is Downloaded Successfully");
        })
        .catch((err) => {
          toast.error("Driver is Not Downloaded");
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
    navigate("/report-driver-form/view");
    localStorage.setItem("agency_branch", downloadDriver.agency_branch);
    localStorage.setItem("user_company", downloadDriver.user_company);
  };
  return (
    <Layout>
      <div className="  bg-[#FFFFFF] p-2   rounded-lg">
        <div className="sticky top-0 p-2  mb-4 border-b-2 border-red-500 rounded-lg  bg-[#E1F5FA] ">
          <h2 className=" px-5 text-[black] text-lg   flex flex-row  justify-between items-center  rounded-xl p-2 ">
            <div className="flex  items-center gap-2">
              <IconInfoCircle className="w-4 h-4" />
              <span>Driver</span>
            </div>
          </h2>
        </div>
        <hr />
        <div className="p-4">
          <form id="dowRecp" autoComplete="off">
            <div className="grid grid-cols-1 md:grid-cols-2   gap-4">
              <SelectInput
                label="Branch"
                name="agency_branch"
                value={
                  downloadDriver.agency_branch
                    ? {
                        value: downloadDriver.agency_branch,
                        label: downloadDriver.agency_branch,
                      }
                    : null
                }
                options={driver.map((item) => ({
                  value: item.branch_name,
                  label: item.branch_name,
                }))}
                onChange={onInputChange}
                placeholder="Select Branch"
                styles={customStyles}
                isSearchable={true}
              />
              <SelectInput
                label="Company"
                name="user_company"
                value={
                  downloadDriver.user_company
                    ? {
                        value: downloadDriver.user_company,
                        label: downloadDriver.user_company,
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
            </div>

            <div className="flex justify-center py-4">
              <button
                className=" text-center text-sm font-[400 ] cursor-pointer hover:animate-pulse w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
                onClick={onSubmit}
              >
                {" "}
                Download
              </button>
              <button
                className=" text-center text-sm font-[400 ] cursor-pointer hover:animate-pulse w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md ml-4"
                onClick={handleview}
              >
                {" "}
                View
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default DriverReportForm;
