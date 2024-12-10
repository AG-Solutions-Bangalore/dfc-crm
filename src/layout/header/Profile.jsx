import React, { useState } from "react";
import {
  Avatar,
  Box,
  Menu,
  Button,
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import profile from "../../../public/user-1.jpg";
import { IconMail, IconUser, IconCircleX } from "@tabler/icons-react";
import Logout from "../../components/Logout";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";
import { toast } from "react-toastify";

const Profile = () => {
  const [anchorEl2, setAnchorEl2] = React.useState(null);
  const [openModal, setOpenModal] = React.useState(false);
  const handleOpenLogout = () => setOpenModal(!openModal);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialog1, setOpenDialog1] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const location = useLocation();

  // const getData = async () => {
  //   try {
  //     const res = await axios.get(`${BASE_URL}/api/fetch-profile`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     setFirstName(res.data.user.first_name || "");
  //     setPhone(res.data.user.phone || "");
  //     setEmail(res.data.user.email || "");
  //   } catch (error) {
  //     console.error("Failed to fetch profile:", error);
  //     toast.error("Failed to load profile data");
  //   }
  // };

  // const onUpdateProfile = async (e) => {
  //   e.preventDefault();
  //   if (!firstName || !phone || phone.length !== 10 || !email) {
  //     toast.error("Please fill out all fields correctly.");
  //     return;
  //   }

  //   setIsButtonDisabled(true);

  //   try {
  //     const res = await axios.post(
  //       `${BASE_URL}/api/update-profile`,
  //       { first_name: firstName, phone },
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );
  //     if (res.status === 200) {
  //       toast.success("Profile Updated Successfully!");
  //       handleClose();
  //     }
  //   } catch (error) {
  //     console.error("Profile update failed:", error);
  //     toast.error("Profile not updated");
  //   } finally {
  //     setIsButtonDisabled(false);
  //   }
  // };

  // const onChangePassword = async (e) => {
  //   e.preventDefault();
  //   if (newPassword !== confirmPassword) {
  //     toast.error("Passwords do not match");
  //     return;
  //   }
  //   if (oldPassword === newPassword) {
  //     toast.error("Old and new passwords cannot be the same");
  //     return;
  //   }

  //   try {
  //     await axios.post(
  //       `${BASE_URL}/api/change-password`,
  //       { old_password: oldPassword, password: newPassword, confirm_password: confirmPassword },
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );
  //     toast.success("Password Updated Successfully!");
  //     setOldPassword("");
  //     setNewPassword("");
  //     setConfirmPassword("");
  //     handleClose1();
  //   } catch (error) {
  //     console.error("Password change failed:", error);
  //     toast.error("Invalid old password");
  //   }
  // };

  const handleClose = () => setOpenDialog(false);
  const handleClose1 = () => setOpenDialog1(false);

  return (
    <Box>
      <IconButton
        size="large"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        onClick={(e) => setAnchorEl2(e.currentTarget)}
      >
        <Avatar src={profile} alt="profile" sx={{ width: 35, height: 35 }} />
      </IconButton>
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        open={Boolean(anchorEl2)}
        onClose={() => setAnchorEl2(null)}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        sx={{ "& .MuiMenu-paper": { width: "200px" } }}
      >
        <MenuItem onClick={() => { setOpenDialog(true); getData(); }}>
          <ListItemIcon>
            <IconUser width={20} />
          </ListItemIcon>
          <ListItemText>My Profile</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => setOpenDialog1(true)}>
          <ListItemIcon>
            <IconMail width={20} />
          </ListItemIcon>
          <ListItemText>Change Password</ListItemText>
        </MenuItem>
        <Box mt={1} py={1} px={2}>
          <Button onClick={handleOpenLogout} variant="outlined" color="primary" fullWidth>
            Logout
          </Button>
        </Box>
      </Menu>
      <Logout open={openModal} handleOpen={handleOpenLogout} />
      {/* Profile Dialog */}
      <Dialog open={openDialog} onClose={handleClose}>
        {/* Profile Form */}
      </Dialog>
      {/* Password Dialog */}
      <Dialog open={openDialog1} onClose={handleClose1}>
        {/* Password Change Form */}
      </Dialog>
    </Box>
  );
};

export default Profile;
