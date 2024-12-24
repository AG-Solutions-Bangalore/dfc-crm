import { Input, Button, Typography } from "@material-tailwind/react";
import toast, { Toaster } from "react-hot-toast";
import BASE_URL from "../../base/BaseUrl";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FormLabel } from "@mui/material";
import logo from "../../assets/Companylogo/dfc.png";
import logo1 from "../../assets/Companylogo/logo1.jpg";

const ForgetPassword = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const onResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${BASE_URL}/api/send-password?username=${username}&email=${email}`,
        { method: "POST" }
      );
      const data = await response.json();
      if (response.ok) {
        toast.success("New Password Sent to your Email");
      } else {
        toast.error("Email not sent. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred.");
    }
  };

  const inputClass =
    "w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 border-green-500";

  return (
    <>
      <Toaster
        toastOptions={{
          success: { style: { background: "green" } },
          error: { style: { background: "red" } },
        }}
        position="top-right"
        reverseOrder={false}
      />
      <div className="w-full bg-white shadow-lg rounded-lg overflow-hidden min-h-screen">
        <div className="flex flex-col lg:flex-row min-h-screen">
          {/* Left Side - Image */}
          <div className="lg:w-[75%] hidden lg:block">
            <img
              src={logo1}
              alt="Reset Password"
              className="object-cover min-h-80vh w-full"
            />
          </div>

          {/* Right Side - Form */}
          <div className="flex-1 p-8 flex flex-col justify-center min-h-screen">
            <div className="flex items-center justify-center mb-8">
              <img src={logo} alt="Company Logo" className="w-32 h-35" />
            </div>
            <Typography
              variant="h4"
              className="text-center font-bold mb-6 text-blue-gray-800"
            >
              Reset Password
            </Typography>
            <form onSubmit={onResetPassword} className="space-y-6">
              <div>
                <FormLabel required>Username</FormLabel>
                <input
                  type="text"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <FormLabel required>Email</FormLabel>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
              <div className="flex justify-center">
                <button
                  className="text-center text-sm font-[400] cursor-pointer hover:animate-pulse w-36 text-white bg-blue-600 hover:bg-green-700 p-2 rounded-lg shadow-md"
                  type="submit"
                >
                  Reset Password
                </button>
              </div>
            </form>
            <div className="text-end mt-4" onClick={() => navigate("/")}>
              <Link className="text-sm text-gray-700 hover:text-blue-600">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgetPassword;
