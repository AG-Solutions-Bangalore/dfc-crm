import Layout from "../../../layout/Layout";
import { useState, useEffect } from "react";
import BASE_URL from "../../../base/BaseUrl";
import { toast } from "sonner";
import axios from "axios";
import SelectInput from "../../../components/common/SelectField";
import { useNavigate } from "react-router-dom";
import { IconInfoCircle } from "@tabler/icons-react";
import {
  ReportAgenciesDownload,
  ReportAgenciesView,
} from "../../../components/buttonIndex/ButtonComponents";

function AgenciesReportForm() {
  const navigate = useNavigate();
  const [agencies, setAgencies] = useState([]);
  const [downloadAgencies, setAgenciesDownload] = useState({
    agency_branch: "",
  });

  const onInputChange = (selectedOption) => {
    console.log(selectedOption);
    setAgenciesDownload({
      ...downloadAgencies,
      agency_branch: selectedOption ? selectedOption.value : "",
    });
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
      setAgencies(response.data.branch || []);
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };
  useEffect(() => {
    fetchBranches();
  }, []);
  const onSubmit = (e) => {
    e.preventDefault();
    let data = {
      agency_branch: downloadAgencies.agency_branch,
    };
    var v = document.getElementById("dowRecp").checkValidity();
    var v = document.getElementById("dowRecp").reportValidity();

    if (v) {
      axios({
        url: BASE_URL + "/api/download-agencies-report",
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
          link.setAttribute("download", "agencies.csv");
          document.body.appendChild(link);
          link.click();
          toast.success("Agencies is Downloaded Successfully");
        })
        .catch((err) => {
          toast.error("Agencies is Not Downloaded");
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
    navigate("/report-agencies-form/view");
    localStorage.setItem("agency_branch", downloadAgencies.agency_branch);
  };
  return (
    <Layout>
      <div className="  bg-[#FFFFFF] p-2   rounded-lg">
        <div className="sticky top-0 p-2  mb-4 border-b-2 border-red-500 rounded-lg  bg-[#E1F5FA] ">
          <h2 className=" px-5 text-[black] text-lg   flex flex-row  justify-between items-center  rounded-xl p-2 ">
            <div className="flex  items-center gap-2">
              <IconInfoCircle className="w-4 h-4" />
              <span>Agencies </span>
            </div>
          </h2>
        </div>
        <hr />
        <div className="p-4">
          <form id="dowRecp" autoComplete="off">
            <div className="grid grid-cols-1 md:grid-cols-4  gap-4">
              <div className="col-span-2">
                <SelectInput
                  label="Branch"
                  name="agency_branch"
                  value={
                    downloadAgencies.agency_branch
                      ? {
                          value: downloadAgencies.agency_branch,
                          label: downloadAgencies.agency_branch,
                        }
                      : null
                  }
                  options={agencies.map((item) => ({
                    value: item.branch_name,
                    label: item.branch_name,
                  }))}
                  onChange={onInputChange}
                  placeholder="Select Branch"
                  styles={customStyles}
                  isSearchable={true}
                />
              </div>
              {/* 
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
              </div> */}

              <div className="flex justify-center py-4 mt-2">
                <ReportAgenciesDownload
                  className=" text-center text-sm font-[400 ] cursor-pointer hover:animate-pulse w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
                  onClick={onSubmit}
                >
                  {" "}
                  Download
                </ReportAgenciesDownload>
                <ReportAgenciesView
                  className=" text-center text-sm font-[400 ] cursor-pointer hover:animate-pulse w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md ml-4"
                  onClick={handleview}
                >
                  {" "}
                  View
                </ReportAgenciesView>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default AgenciesReportForm;
