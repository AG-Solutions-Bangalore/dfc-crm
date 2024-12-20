import { useMediaQuery, Box, Drawer } from "@mui/material";
import SidebarItems from "./SidebarItems";
import { Upgrade } from "./Upgrade";
import Logo from "../shared/logo/Logo";
import { useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";

const Sidebar = ({
  isMobileSidebarOpen,
  onSidebarClose,
  isSidebarOpen,
  isCollapsed,
}) => {
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));

  // const sidebarWidth = "270px";
  const sidebarWidth = isCollapsed ? "100px" : "220px";

  const sidebarWidthMobile = "270px";

  if (lgUp) {
    return (
      <Box
        sx={{
          width: sidebarWidth,
          flexShrink: 0,
          borderRadius: "13px",
        }}
      >
        {/* ------------------------------------------- */}
        {/* Sidebar for desktop */}
        {/* ------------------------------------------- */}
        <Drawer
          anchor="left"
          open={isSidebarOpen}
          variant="permanent"
          PaperProps={{
            sx: {
              boxShadow: "0 9px 17.5px rgb(0,0,0,0.05)",
              width: sidebarWidth,
              boxSizing: "border-box",
              borderRight: 0,
              top: 10,
              left: 10,
              bottom: 10,
              borderRadius: "13px",
              height: "calc(100% - 25px)",
            },
          }}
          className="custom-scroll"
        >
          {/* ------------------------------------------- */}
          {/* Sidebar Box */}
          {/* ------------------------------------------- */}
          <Box
            className="custom-scroll"
            sx={{
              overflowY: "auto",
              height: "calc(100vh - 70px)",
            }}
          >
            {/* ------------------------------------------- */}
            {/* Logo */}
            {/* ------------------------------------------- */}
            <Box px={2} pt={2}>
              <Logo isCollapsed={isCollapsed} />
            </Box>
            <Box>
              {/* ------------------------------------------- */}
              {/* Sidebar Items */}
              {/* ------------------------------------------- */}
              <SidebarItems isCollapsed={isCollapsed} />
              <Upgrade isCollapsed={isCollapsed} />
            </Box>
          </Box>
        </Drawer>
      </Box>
    );
  }

  return (
    <Drawer
      anchor="left"
      open={isMobileSidebarOpen}
      onClose={onSidebarClose}
      variant="temporary"
      PaperProps={{
        sx: {
          width: sidebarWidthMobile,
          boxShadow: (theme) => theme.shadows[8],
        },
      }}
    >
      {/* ------------------------------------------- */}
      {/* Logo */}
      {/* ------------------------------------------- */}
      <Box px={2} py={2}>
        <Logo />
      </Box>
      {/* ------------------------------------------- */}
      {/* Sidebar For Mobile */}
      {/* ------------------------------------------- */}
      <SidebarItems />
      <Upgrade />
    </Drawer>
  );
};

export default Sidebar;
