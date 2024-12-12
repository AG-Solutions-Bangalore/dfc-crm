import React, { useEffect, useState } from 'react'
import Layout from '../../../layout/Layout'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../../../base/BaseUrl';
import { toast } from 'react-toastify';
import { IconArrowBack, IconInfoCircle } from '@tabler/icons-react';

const AddBranchPayment = () => {

    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
  
    //   today = mm + "/" + dd + "/" + yyyy;
    const todayback = yyyy + "-" + mm + "-" + dd;
    const navigate = useNavigate();
    const [payment, setPayment] = useState({
        payment_date: todayback,
        payment_branch: "",
        payment_amount: "",
    });
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [branch, setBranch] = useState([]);
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
        console.error("Error fetching Todo Branch data", error);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchBranch();
    }, []);

    const validateOnlyDigits = (inputtxt) => {
        var phoneno = /^\d+$/;
        if(inputtxt.match(phoneno) || inputtxt.length==0){
            return true;
        }else{
            return false;
        }
    }
  
    const onInputChange = (e) => {
        if(e.target.name=="payment_amount"){
             if(validateOnlyDigits(e.target.value)){
                 setPayment({
                   ...payment,
                   [e.target.name]: e.target.value,
                 });
             }
         }else{
             setPayment({
                 ...payment,
                 [e.target.name]: e.target.value,
             });
         }
         
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
        payment_date : payment.payment_date,
        payment_branch: payment.payment_branch,
        payment_amount: payment.payment_amount,
      };
  
      setIsButtonDisabled(true);
      axios({
        url: BASE_URL + "/api/web-create-payment",
        method: "POST",
        data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then((res) => {
        toast.success("Branch Created Sucessfully");
       
        navigate('/payment/branch-list')
        setPayment({
            payment_date: todayback,
            payment_branch: "",
            payment_amount: "",
        });
      });
    };
  
    const FormLabel = ({ children, required }) => (
      <label className="block text-sm font-semibold text-black mb-1 ">
        {children}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    );
  
    const inputClassSelect =
      "w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 border-blue-500";
    const inputClass =
      "w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500 border-blue-500";
  return (
  <Layout>
      <div className=" bg-[#FFFFFF] p-2  rounded-lg  ">
        <div className="sticky top-0 p-2  mb-4 border-b-2 border-red-500 rounded-lg  bg-[#E1F5FA] ">
          <h2 className=" px-5 text-[black] text-lg   flex flex-row  justify-between items-center  rounded-xl p-2 ">
            <div className="flex  items-center gap-2">
              <IconInfoCircle className="w-4 h-4" />
              <span>Add Branch Payment </span>
            </div>
            <IconArrowBack
              onClick={() => navigate("/payment/branch-list")}
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
          <div className="grid grid-cols-1  md:grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
              <FormLabel required>Date</FormLabel>
              <input
                type="date"
                required
                name="payment_date"
                value={payment.payment_date}
                onChange={(e) => onInputChange(e)}
                className={inputClass}
              />
            </div>
            <div>
              <FormLabel required>Branch</FormLabel>
              <select
                name="payment_branch"
                value={payment.payment_branch}
                onChange={(e) => onInputChange(e)}
                required
                className={inputClassSelect}
              >
                <option value="">Select Branch</option>
                {branch.map((option) => (
                  <option key={option.branch_name} value={option.branch_name}>
                    {option.branch_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <FormLabel required>Amount</FormLabel>
              <input
                type="tel"
                name="payment_amount"
                value={payment.payment_amount}
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
                navigate("/payment/branch-list");
              }}
            >
              Back
            </button>
          </div>
        </form>
      </div>
  </Layout>
  )
}

export default AddBranchPayment