import { CircularProgress } from "@mui/material";
import Box from "@mui/material/Box";
import { Suspense, lazy, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./assets/fonts/fonts.css";
import Nav, { drawerWidth } from "./components/nav/Nav.js";
import LicenseKeyInput from "./pages/LicenseKeyPage/LicenseKeyPage.js";
import {
  selectAuthenticate,
  selectLicenseAuth,
  setLicenseAuth,
} from "./pages/LoginPage/LoginSlice.js";

// Lazy load components
const BillsPage = lazy(() => import("./pages/BillsPage/BillsPage.js"));
const ItemsPage = lazy(() => import("./pages/ItemsPage/ItemsPage.js"));
const ReportsPage = lazy(() => import("./pages/ReportPage/ReportsPage.js"));
const PaymentsPage = lazy(() => import("./pages/PaymentsPage/PaymentsPage.js"));
const CustomersPage = lazy(
  () => import("./pages/CustomersPage/CustomersPage.js")
);
const LoginPage = lazy(() => import("./pages/LoginPage/LoginPage.js")); // Import Login Page

export default function CustomSidebar() {
  let isAuthenticated = useSelector(selectAuthenticate);
  let licenseAuth = useSelector(selectLicenseAuth);
  const dispatch = useDispatch();
  useEffect(() => {
    const isLicensed = JSON.parse(localStorage.getItem("isLicensed"));
    if (isLicensed?.key.toLowerCase() === "activated") {
      dispatch(setLicenseAuth(true));
    }
  }, []);

  return (
    <Router>
      <Box
        sx={{
          display: "flex",
          fontFamily: "Poppins !important",
          bgcolor: "background.default",
        }}
      >
        <ToastContainer />
        {licenseAuth === false ? (
          <LicenseKeyInput />
        ) : (
          <>
            {isAuthenticated && <Nav />}
            <Box component="main" sx={{ bgcolor: "background.default" }}>
              <Box
                sx={{
                  width: isAuthenticated
                    ? `calc(100vw - ${drawerWidth}px)`
                    : `100vw`,
                  height: "100vh",
                  p: isAuthenticated ? 2 : 0,
                  overflow: "auto",
                  bgcolor: "#F7F7FE",
                }}
              >
                <Suspense
                  fallback={
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                        width: "100%",
                      }}
                    >
                      <CircularProgress sx={{ color: "#1E1E2D" }} />
                    </Box>
                  }
                >
                  <Routes>
                    {!isAuthenticated ? (
                      <>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="*" element={<Navigate to="/login" />} />
                      </>
                    ) : (
                      <>
                        <Route path="/" element={<BillsPage />} />
                        <Route path="/customers" element={<CustomersPage />} />
                        <Route path="/items" element={<ItemsPage />} />
                        <Route path="/payments" element={<PaymentsPage />} />
                        <Route path="/reports" element={<ReportsPage />} />
                        {/* <Route path="/reports" element={<Box>hi</Box>} /> */}
                      </>
                    )}
                  </Routes>
                </Suspense>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Router>
  );
}
