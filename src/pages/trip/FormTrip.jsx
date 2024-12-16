import React, { useEffect, useState } from 'react'
import Layout from '../../layout/Layout'
import Select from "react-select";
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';
import BASE_URL from '../../base/BaseUrl';
import { toast } from 'sonner';
import { IconInfoCircle } from '@tabler/icons-react';

const FormTrip = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    const todayback = yyyy + "-" + mm + "-" + dd;
    const firstdate = moment().startOf('month').format('YYYY-MM-DD');
    const navigate = useNavigate();
    const [trip, setTrip] = useState({
        trip_from_date: firstdate,
        trip_to_date: todayback,
        trip_branch: "",
        trip_driver: "",
    });
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [fabric_inward_count, setCount] = useState(1);
    const useTemplate = {tyre_sub_no:"", tyre_sub_type:"", tyre_sub_make:""};
  
    const [users, setUsers] = useState([useTemplate]);
    const [loading, setLoading] = useState(false);
    const [branch, setBranch] = useState([]); //
  
    const [driver, setDriver] = useState([]); //
    const [vendor, setVendor] = useState([]); //
    const [company, setCompany] = useState([]); //
    const fetchBranch = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BASE_URL}/api/web-fetch-branch`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        setBranch(response.data?.branch);
      } catch (error) {
        console.error("Error fetching filter trip data", error);
      } finally {
        setLoading(false);
      }
    };
    const fetchDriver = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BASE_URL}/api/web-fetch-assigning-tripdriver/${trip.trip_branch}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        setDriver(response.data?.drivers);
      } catch (error) {
        console.error("Error fetching Driver data", error);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchBranch();
     
    }, []);
  
    useEffect(() => {
        if(trip.trip_branch && trip.trip_branch !== ""){
            fetchDriver();
        }
    }, [trip.trip_branch]);
  
    const onInputChange = (e) => {
        if(e.name=="trip_branch"){
            setTrip({
                ...trip,
                trip_branch: e.value,
            });
        }else if(e.name=="trip_driver"){
            setTrip({
              ...trip,
              trip_driver: e.value,
            });
          }else{
            setTrip({
                ...trip,
                [e.target.name]: e.target.value,
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
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const form = document.getElementById("addIndiv");
      if (!form.checkValidity()) {
        toast.error("Fill all required");
        setIsButtonDisabled(false);
  
        return;
      }
      localStorage.setItem('trip_date_from',trip.trip_from_date);
      localStorage.setItem('trip_date_to',trip.trip_to_date);
      localStorage.setItem('trip_branch',trip.trip_branch);
      localStorage.setItem('trip_driver',trip.trip_driver);
      navigate('/trip-list')
  
      
    };

    const onClear = (e)=>{
        e.preventDefault()
        const form = document.getElementById("addIndiv");
        if (!form.checkValidity()) {
          toast.error("Fill all required");
          setIsButtonDisabled(false);
    
          return;
        }

        localStorage.removeItem("trip_date_from");
        localStorage.removeItem("trip_date_to");
        localStorage.removeItem("trip_branch");
        localStorage.removeItem("trip_driver");
        toast.success("Filter is Cleared Sucessfully");
    }
  
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
              <span>Filter Trip </span>
            </div>
           
          </h2>
        </div>
        <hr />
        <form
          onSubmit={handleSubmit}
          id="addIndiv"
          className="w-full max-w-7xl  rounded-lg mx-auto p-4 space-y-6 "
        >
          <div className="grid grid-cols-1  md:grid-cols-1 lg:grid-cols-4 gap-6">
            {/* date 1 */}
            <div>
              <FormLabel required>From Date</FormLabel>
              <input
                type="date"
                required
                name="trip_from_date"
                value={trip.trip_from_date}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
              />
            </div>
            {/* date 2 */}
            <div>
              <FormLabel required>To Date</FormLabel>
              <input
                type="date"
                required
                name="trip_to_date"
                value={trip.trip_to_date}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
              />
            </div>

            {/* Branch  */}
            <div>
              <FormLabel>Branch</FormLabel>
              <Select
                name="trip_branch"
                options={branch.map((option) => ({
                  value: option.branch_name,
                  label: option.branch_name,
                  name: "trip_branch",
                }))}
                onChange={(e) => onInputChange(e)}
                value={
                    trip.trip_branch
                    ? {
                        value: trip.trip_branch,
                        label: trip.trip_branch,
                      }
                    : null
                }
                placeholder="Select Branch"
                styles={customStyles}
                isSearchable={true}
              />
            </div>
            {/* Driver  */}
            <div>
              <FormLabel>Driver</FormLabel>
              <Select
                name="trip_driver"
                options={driver.map((option) => ({
                  value: option.full_name,
                  label: option.full_name,
                  name: "trip_driver",
                }))}
                onChange={(e) => onInputChange(e)}
                value={
                    trip.trip_driver
                    ? {
                        value: trip.trip_driver,
                        label: trip.trip_driver,
                      }
                    : null
                }
                placeholder="Select Driver"
                styles={customStyles}
                isSearchable={true}
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
              onClick={(e) => onClear(e)}
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}

export default FormTrip