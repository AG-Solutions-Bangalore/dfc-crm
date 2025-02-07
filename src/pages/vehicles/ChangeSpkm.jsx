import React, { useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import { useNavigate, useParams } from "react-router-dom";
import BASE_URL from "../../base/BaseUrl";
import axios from "axios";
import { toast } from "sonner";
import { IconArrowBack, IconInfoCircle } from "@tabler/icons-react";
import moment from "moment/moment";
import { CreateButton } from "../../components/common/ButtonColors";

const ChangeSpkm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tyre, setTyre] = useState({});
  const [vehicles, setVehicles] = useState({
    service_sub_pre_km: "",
  });
  const [loader, setLoader] = useState(true);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const spkmId = localStorage.getItem("spkmId");
  const validateOnlyDigits = (inputtxt) => {
    var phoneno = /^\d+$/;
    if (inputtxt.match(phoneno) || inputtxt.length == 0) {
      return true;
    } else {
      return false;
    }
  };

  const onInputChange = (e) => {
    if (e.target.name == "service_sub_pre_km") {
      if (validateOnlyDigits(e.target.value)) {
        setVehicles({
          ...vehicles,
          [e.target.name]: e.target.value,
        });
      }
    } else {
      setVehicles({
        ...vehicles,
        [e.target.name]: e.target.value,
      });
    }
  };

  // Fetch spkm Details

  useEffect(() => {
    const fetchSpkmDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/fetch-vehicle-serviceSub-id/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setTyre(response.data.serviceSub);
        setLoader(false);
      } catch (error) {
        console.error("Error fetching spkm details:", error);
        setLoader(false);
      }
    };

    fetchSpkmDetails();
  }, [id]);

  // Update Tyre Details
  const onUpdate = async (e) => {
    e.preventDefault();
    const form = document.getElementById("addIndiv");
    if (!form.checkValidity()) {
      toast.error("Fill all required");
      setIsButtonDisabled(false);

      return;
    }
    const data = {
      service_sub_pre_km: vehicles.service_sub_pre_km,
    };

    try {
      setIsButtonDisabled(true);

      const response = await axios.put(
        `${BASE_URL}/api/web-update-service-pkm/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.code == "200") {
        toast.success("Service Present Km Updated Successfully");
        navigate(`/truckdetails-viewall/${spkmId}`);
      } else {
        toast.error("Duplicate Entry");
      }
    } catch (error) {
      console.error("Error spkm ", error);
      toast.error("Error spkm ");
    } finally {
      setIsButtonDisabled(false);
    }
  };

  const FormLabel = ({ children, required }) => (
    <label className="block text-sm font-semibold text-black mb-1 ">
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );

  const inputClass =
    "w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500 border-blue-500";
  // Loader Component
  const Loader = () => (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  );
  return (
    <Layout>
      <div className="bg-[#FFFFFF] p-2  rounded-lg ">
        {loader ? (
          <Loader />
        ) : (
          <div className="bg-[#FFFFFF] p-2  rounded-lg ">
            <div className="sticky top-0 p-2  mb-4 border-b-2 border-red-500 rounded-lg  bg-[#E1F5FA] ">
              <h2 className=" px-5 text-[black] text-lg   flex flex-row  justify-between items-center  rounded-xl p-2 ">
                <div className="flex  items-center gap-2">
                  <IconInfoCircle className="w-4 h-4" />
                  <span> Change Service Present Km</span>
                </div>
                <IconArrowBack
                  onClick={() => navigate(`/truckdetails-viewall/${spkmId}`)}
                  className="cursor-pointer hover:text-red-600"
                />
              </h2>
            </div>

            {/* Tyre Details Table */}
            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2">Services</th>
                    <th className="border p-2">Date</th>
                    <th className="border p-2">KM</th>
                    <th className="border p-2">Present KM</th>
                    <th className="border p-2">Difference KM</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-orange-300">
                    <td className="border p-2 text-center">
                      {tyre.service_sub_type}
                    </td>
                    <td className="border p-2 text-center">
                      {tyre.service_sub_date
                        ? moment(tyre.service_sub_date).format("DD-MMM-YYYY")
                        : ""}
                    </td>
                    <td className="border p-2 text-center">
                      {tyre.service_sub_km}
                    </td>
                    <td className="border p-2 text-center">
                      {tyre.service_sub_pre_km}
                    </td>
                    <td className="border p-2 text-center">
                      {tyre.service_sub_pre_km - tyre.service_sub_km}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Update Form */}
            <form id="addIndiv" onSubmit={onUpdate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Present KM Input */}
                <div>
                  <FormLabel required>Present KM</FormLabel>
                  <input
                    type="text"
                    name="service_sub_pre_km"
                    value={vehicles.service_sub_pre_km}
                    onChange={onInputChange}
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center mt-6">
                <button
                  type="submit"
                  disabled={isButtonDisabled}
                  className={`
                    ${CreateButton} px-6 py-2 rounded-lg text-white transition-colors duration-300 w-52
                    ${
                      isButtonDisabled
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600"
                    }
                  `}
                >
                  Update Present Km
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ChangeSpkm;
