import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { lazy, Suspense } from "react";
import Nav, { drawerWidth } from "./components/nav/Nav.js";

// Lazy load components
const BillsPage = lazy(() => import("./pages/BillsPage/BillsPage.js"));
const ItemsPage = lazy(() => import("./pages/ItemsPage/ItemsPage.js"));
const ReportsPage = lazy(() => import("./pages/ReportPage/ReportsPage.js"));
const PaymentsPage = lazy(() => import("./pages/PaymentsPage/PaymentsPage.js"));
const CustomersPage = lazy(
  () => import("./pages/CustomersPage/CustomersPage.js")
);

export default function CustomSidebar() {
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
          <Toolbar sx={{ height: "65px" }} />
          <Box
            sx={{
              width: `calc(100vw - ${drawerWidth}px)`,
              height: `calc(100vh - 65px)`,
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

// const [data, setData] = React.useState<Item[]>([]);
// const [input, setInput] = React.useState("");

// React.useEffect(() => {
//   loadData();
// }, []);
// //@ts-ignore
// console.log("electronAPI:", window.electronAPI);
// //@ts-ignore

// if (!window.electronAPI) {
//   console.error("Electron API is not available! Check preload script.");
// }

// async function loadData() {
//   //@ts-ignore

//   const result = await window.electronAPI.getData();
//   setData(result);
// }

// async function addData() {
//   //@ts-ignore
//   console.log("logs", input);

//   // await window.electronAPI.insertData({ name: input });
//   const sanitizedData = JSON.parse(JSON.stringify({ name: input })); // Removes undefined & BigInt
//   //@ts-ignore
//   await window.electronAPI.insertData(sanitizedData);
//   setInput("");
//   loadData();
// }

// async function deleteItem(id: string) {
//   //@ts-ignore

//   await window.electronAPI.deleteData(id);
//   loadData();
// }
