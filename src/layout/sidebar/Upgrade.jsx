import { Box } from "@mui/material";


export const Upgrade = ({ isCollapsed }) => {
  return (
    <>
      {!isCollapsed ? (
        <Box display={"flex"} alignItems="center" gap={2} sx={{ m: 3  }}>
          <>
            <h2 className="text-xs  text-red-600/80 border-b-2 border-dashed border-blue-600/80">
              Updated On: 10-03-2025
            </h2>
         
          </>
        </Box>
      ) : (
        ""
      )}
    </>
  );
};
