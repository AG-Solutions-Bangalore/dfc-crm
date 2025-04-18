import React, { useState } from "react";
import Layout from "../../../layout/Layout";
import { IconArrowBack, IconInfoCircle } from "@tabler/icons-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../../base/BaseUrl";
import axios from "axios";

const CreateServiceType = () => {
  const navigate = useNavigate();
  const [serviceTypes, setServiceTypes] = useState({
    service_types: "",
  });
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const onInputChange = (e) => {
    setServiceTypes({
      ...serviceTypes,
      [e.target.name]: e.target.value,
    });
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
      service_types: serviceTypes.service_types,
    };

    setIsButtonDisabled(true);
    axios({
      url: BASE_URL + "/api/web-create-service-types",
      method: "POST",
      data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      if (res.data.code == 200) {
        toast.success(res.data.msg);
      } else if (res.data.code == 400) {
        toast.error(res.data.msg);
      }
      navigate("/master/servicetype-list");
      setServiceTypes({
        service_types: "",
      });
    });
  };

  const FormLabel = ({ children, required }) => (
    <label className="block text-sm font-semibold text-black mb-1 ">
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );

  const inputClass =
    "w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500 border-blue-500";
  return (
    <Layout>
      <div className=" bg-[#FFFFFF] p-2  rounded-lg  ">
        <div className="sticky top-0 p-2  mb-4 border-b-2 border-red-500 rounded-lg  bg-[#E1F5FA] ">
          <h2 className=" px-5 text-[black] text-lg   flex flex-row  justify-between items-center  rounded-xl p-2 ">
            <div className="flex  items-center gap-2">
              <IconInfoCircle className="w-4 h-4" />
              <span>Add Service Type</span>
            </div>
            <IconArrowBack
              onClick={() => navigate("/master/servicetype-list")}
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
          <div className="grid grid-cols-1  md:grid-cols-1 lg:grid-cols-1 gap-6">
            <div>
              <FormLabel required>Service Type</FormLabel>
              <input
                type="text"
                name="service_types"
                value={serviceTypes.service_types}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
                required
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
              {isButtonDisabled ? "Sumbitting..." : "Sumbit"}
            </button>

            <button
              type="button"
              className="text-center text-sm font-[400] cursor-pointer  w-36 text-white bg-red-600 hover:bg-red-400 p-2 rounded-lg shadow-md"
              onClick={() => {
                navigate("/master/servicetype-list");
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

export default CreateServiceType;
