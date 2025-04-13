import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Box from "@mui/material/Box";
import { lazy, Suspense, useEffect } from "react";
import Nav, { drawerWidth } from "./components/nav/Nav.js";
import { useSelector } from "react-redux";
import "./assets/fonts/fonts.css";
import { CircularProgress } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import { selectAuthenticate } from "./pages/LoginPage/LoginSlice.js";
import { addData, sampleData } from "./utils/utils.js";

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
  const storeData = useSelector((state) => state);

  let isAuthenticated = useSelector(selectAuthenticate);
  // addData(sampleData);
  return (
    <Router>
      <Box sx={{ display: "flex", fontFamily: "Poppins !important" }}>
        {isAuthenticated && <Nav />} {/* Show Nav only if authenticated */}
        <Box component="main" sx={{ bgcolor: "background.default" }}>
          <ToastContainer />
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
                  </>
                )}
              </Routes>
            </Suspense>
          </Box>
        </Box>
      </Box>
    </Router>
  );
}
