import { Route, Routes } from "react-router-dom";
import Home from "./pages/dashboard/Home";
import SignIn from "./pages/auth/SignIn";
import SIgnUp from "./pages/auth/SIgnUp";
import Maintenance from "./pages/maintenance/Maintenance";
import ForgetPassword from "./pages/auth/ForgetPassword";
import Profile from "./pages/profile/Profile";
import ChangePassword from "./pages/profile/ChangePassword";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const App = () => {
  return (
    <>
    
      <ToastContainer />
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/register" element={<SIgnUp />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/home" element={<Home />} />
        <Route path="/maintenance" element={<Maintenance />} />
        {/* school  */}
        <Route path="/profile" element={<Profile />} />
        {/* //Master */}
        <Route
          path="/change-password"
          element={<ChangePassword />}
        />
      
      </Routes>
    </>
  );
};

export default App;
