import Layout from "../../../layout/Layout";
import { useState, useEffect } from "react";
import BASE_URL from "../../../base/BaseUrl";
import { toast } from "react-toastify";
import axios from "axios";
import SelectInput from "../../../components/common/SelectField";
import { useNavigate } from "react-router-dom";
import { IconInfoCircle } from "@tabler/icons-react";

function VechilesDetailsReportForm() {
  const navigate = useNavigate();
  const [vendor, setVendor] = useState([]);
  const [downloadVehicle, setVehicleDownload] = useState({
    vehicle_reg_no: "",
  });

  const onInputChange = (selectedOption, action) => {
    console.log("Selected Option:", selectedOption);
    console.log("Action:", action);

    setVehicleDownload((prevState) => ({
      ...prevState,
      [action.name]: selectedOption ? selectedOption.value : "",
    }));
  };

  const VehicleReg = async () => {
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
      setVendor(response.data.vehicles || []);
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };
  useEffect(() => {
    VehicleReg();
  }, []);
  //DOWNLOAD
  const onSubmit = (e) => {
    e.preventDefault();
    let data = {
      vehicle_branch: downloadVehicle.vendor_branch,
      vehicle_company: downloadVehicle.vehicle_reg_no,
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
          link.setAttribute("download", "vehicle.csv");
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

  return (
    <Layout>
      <div className="  bg-[#FFFFFF] p-2   rounded-lg">
        <div className="sticky top-0 p-2  mb-4 border-b-2 border-red-500 rounded-lg  bg-[#E1F5FA] ">
          <h2 className=" px-5 text-[black] text-lg   flex flex-row  justify-between items-center  rounded-xl p-2 ">
            <div className="flex  items-center gap-2">
              <IconInfoCircle className="w-4 h-4" />
              <span>Vehicle Details</span>
            </div>
          </h2>
        </div>
        <hr />
        <div className="p-4">
          <form id="dowRecp" autoComplete="off">
            <div className="grid grid-cols-1  gap-4">
              <SelectInput
                label="Vendor Reg No"
                name="vehicle_reg_no"
                value={
                  downloadVehicle.vehicle_reg_no
                    ? {
                        value: downloadVehicle.vehicle_reg_no,
                        label: downloadVehicle.vehicle_reg_no,
                      }
                    : null
                }
                options={vendor.map((item) => ({
                  value: item.reg_no,
                  label: item.reg_no,
                }))}
                onChange={onInputChange}
                placeholder="Select Reg No"
                styles={customStyles}
                isSearchable={true}
              />
            </div>

            <div className="flex justify-center py-4">
              <button className=" text-center text-sm font-[400 ] cursor-pointer hover:animate-pulse w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md ml-4">
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

export default VechilesDetailsReportForm;
