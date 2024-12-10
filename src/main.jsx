import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { baselightTheme } from "./utils/theme/DefaultColors.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
     
      <AuthProvider>
        <ThemeProvider theme={baselightTheme}>
          <App />
        </ThemeProvider>
        </AuthProvider>
     
    </BrowserRouter>
  </StrictMode>
);
