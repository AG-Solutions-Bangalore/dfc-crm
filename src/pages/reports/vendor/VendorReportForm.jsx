import Layout from "../../../layout/Layout";
import { useState, useEffect } from "react";
import BASE_URL from "../../../base/BaseUrl";
import { toast } from "sonner";
import axios from "axios";
import SelectInput from "../../../components/common/SelectField";
import { useNavigate } from "react-router-dom";
import { IconInfoCircle } from "@tabler/icons-react";
import {
  ReportVendorDownload,
  ReportVendorView,
} from "../../../components/buttonIndex/ButtonComponents";
const VType = [
  {
    value: "Trip",
    label: "Trip",
  },
  {
    value: "Garage",
    label: "Garage",
  },
  {
    value: "Tyre",
    label: "Tyre",
  },
  {
    value: "Truck",
    label: "Truck",
  },
  {
    value: "Oil",
    label: "Oil",
  },
  {
    value: "Diesel",
    label: "Diesel",
  },
  {
    value: "Spare Parts",
    label: "Spare Parts",
  },
];

function VendorReportForm() {
  const navigate = useNavigate();
  const [vendor, setVendor] = useState([]);
  const [downloadVendor, setVendorDownload] = useState({
    vendor_branch: "",
    vendor_type: "",
  });

  const onInputChange = (selectedOption, action) => {
    console.log("Selected Option:", selectedOption);
    console.log("Action:", action);

    setVendorDownload((prevState) => ({
      ...prevState,
      [action.name]: selectedOption ? selectedOption.value : "",
    }));
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
      setVendor(response.data.branch || []);
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };
  useEffect(() => {
    fetchBranches();
  }, []);
  //DOWNLOAD
  const onSubmit = (e) => {
    e.preventDefault();
    let data = {
      vehicle_branch: downloadVendor.vendor_branch,
      vendor_type: downloadVendor.vendor_type,
    };
    var v = document.getElementById("dowRecp").checkValidity();
    var v = document.getElementById("dowRecp").reportValidity();

    if (v) {
      axios({
        url: BASE_URL + "/api/download-vendor-report",
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
          link.setAttribute("download", "vendor.csv");
          document.body.appendChild(link);
          link.click();
          toast.success("Vendor is Downloaded Successfully");
        })
        .catch((err) => {
          toast.error("Vendor is Not Downloaded");
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
    navigate("/report-vendor-form/view");
    localStorage.setItem("vendor_branch", downloadVendor.vendor_branch);
    localStorage.setItem("vendor_type", downloadVendor.vendor_type);
  };
  // vendor_branch: "",
  // vendor_type: "",
  return (
    <Layout>
      <div className="  bg-[#FFFFFF] p-2   rounded-lg">
        <div className="sticky top-0 p-2  mb-4 border-b-2 border-red-500 rounded-lg  bg-[#E1F5FA] ">
          <h2 className=" px-5 text-[black] text-lg   flex flex-row  justify-between items-center  rounded-xl p-2 ">
            <div className="flex  items-center gap-2">
              <IconInfoCircle className="w-4 h-4" />
              <span>Vendor</span>
            </div>
          </h2>
        </div>
        <hr />
        <div className="p-4">
          <form id="dowRecp" autoComplete="off">
            <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
              <SelectInput
                label="Vendor Type"
                name="vendor_type"
                value={
                  downloadVendor.vendor_type
                    ? {
                        value: downloadVendor.vendor_type,
                        label: downloadVendor.vendor_type,
                      }
                    : null
                }
                options={VType}
                onChange={onInputChange}
                placeholder="Select Vendor Type"
                styles={customStyles}
                isSearchable={true}
              />

              <SelectInput
                label="Branch"
                name="vendor_branch"
                value={
                  downloadVendor.vendor_branch
                    ? {
                        value: downloadVendor.vendor_branch,
                        label: downloadVendor.vendor_branch,
                      }
                    : null
                }
                options={vendor.map((item) => ({
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
            <div className="flex justify-center py-4">
              <ReportVendorDownload
                className=" text-center text-sm font-[400 ] cursor-pointer hover:animate-pulse w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
                onClick={onSubmit}
              >
                {" "}
              </ReportVendorDownload>
              <ReportVendorView
                className=" text-center text-sm font-[400 ] cursor-pointer hover:animate-pulse w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md ml-4"
                onClick={handleview}
              >
                {" "}
                View
              </ReportVendorView>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default VendorReportForm;
