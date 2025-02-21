import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Box from "@mui/material/Box";
import { lazy, Suspense } from "react";
import Nav, { drawerWidth } from "./components/nav/Nav.js";
import { useSelector } from "react-redux";
import { sampleData } from "./sampleData.js";

// Lazy load components
const BillsPage = lazy(() => import("./pages/BillsPage/BillsPage.js"));
const ItemsPage = lazy(() => import("./pages/ItemsPage/ItemsPage.js"));
const ReportsPage = lazy(() => import("./pages/ReportPage/ReportsPage.js"));
const PaymentsPage = lazy(() => import("./pages/PaymentsPage/PaymentsPage.js"));
const CustomersPage = lazy(
  () => import("./pages/CustomersPage/CustomersPage.js")
);

export default function CustomSidebar() {
  const storeData = useSelector((state: any) => state);

  console.log("storeData", storeData);

  // addData(sampleData)
  return (
    <Router>
      <Box sx={{ display: "flex" }}>
        <Nav />
        {/* Main Content */}
        <Box
          component="main"
          sx={{
            bgcolor: "background.default",
          }}
        >
          {/* <Toolbar sx={{ height: "65px" }} /> */}
          <Box
            sx={{
              width: `calc(100vw - ${drawerWidth}px)`,
              // height: `calc(100vh - 65px)`,
              height: `calc(100vh)`,

              p: 1,
              overflow: "auto",
              bgcolor: "#F7F7FE",
            }}
          >
            {/* Wrap the entire Routes component inside Suspense */}
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/" element={<BillsPage />} />
                <Route path="/customers" element={<CustomersPage />} />
                <Route path="/items" element={<ItemsPage />} />
                <Route path="/payments" element={<PaymentsPage />} />
                <Route path="/reports" element={<ReportsPage />} />
              </Routes>
            </Suspense>
          </Box>
        </Box>
      </Box>
    </Router>
  );
}

async function addData(itemData: any) {
  console.log("Adding item:", itemData);

  const sanitizedData = JSON.parse(JSON.stringify(itemData)); // Removes undefined & BigInt

  try {
    //@ts-ignore
    await window.electronAPI.insertItem(sanitizedData);
    console.log("Item added successfully!");
  } catch (error) {
    console.error("Error inserting item:", error);
  }
}
