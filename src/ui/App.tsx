import { Routes, Route, Link, useLocation } from "react-router-dom";
import { HashRouter, BrowserRouter } from "react-router-dom";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/HomeOutlined";
import PeopleIcon from "@mui/icons-material/PeopleOutlined";
import InventoryIcon from "@mui/icons-material/Inventory2Outlined";
import ReceiptIcon from "@mui/icons-material/ReceiptOutlined";
import PaymentsIcon from "@mui/icons-material/PaymentsOutlined";
import ReportIcon from "@mui/icons-material/AssessmentOutlined";
import ItemsPage from "./pages/ItemPage.jsx";
import BillsPage from "./pages/BillsPage.jsx";
const Router =
  import.meta.env.MODE === "development" ? BrowserRouter : HashRouter;
const drawerWidth = 240;

// Dummy pages for routing
const HomePage = () => <Typography variant="h4">Home Page</Typography>;
const CustomersPage = () => (
  <Typography variant="h4">Customers Page</Typography>
);

const InvoicesPage = () => <Typography variant="h4">Invoices Page</Typography>;
const PaymentsPage = () => <Typography variant="h4">Payments Page</Typography>;
const ReportsPage = () => <Typography variant="h4">Reports Page</Typography>;

// Sidebar navigation items
const menuItems = [
  { text: "Bills", path: "/", icon: <HomeIcon /> },
  { text: "Customers", path: "/customers", icon: <PeopleIcon /> },
  { text: "Items", path: "/items", icon: <InventoryIcon /> },
  { text: "Invoices", path: "/invoices", icon: <ReceiptIcon /> },
  { text: "Payments", path: "/payments", icon: <PaymentsIcon /> },
  { text: "Reports", path: "/reports", icon: <ReportIcon /> },
];

export default function CustomSidebar() {
  return (
    <Router>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />

        {/* App Bar */}
        <AppBar
          position="fixed"
          sx={{
            width: `calc(100% - ${drawerWidth}px)`,
            ml: `${drawerWidth}px`,
            bgcolor: "#fff",
            color: "#333",
          }}
          elevation={1}
        >
          <Toolbar>
            <Typography variant="h6" noWrap></Typography>
          </Toolbar>
        </AppBar>

        {/* Sidebar */}
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              bgcolor: "#1E1E2D", // Dark background
              color: "#fff",
            },
          }}
          variant="permanent"
          anchor="left"
        >
          <Toolbar>
            <Typography variant="h6" sx={{ color: "#fff", ml: 2 }}>
              Invoice App
            </Typography>
          </Toolbar>
          <Divider sx={{ borderColor: "#444" }} />

          <List>
            {menuItems.map((item) => (
              <NavItem key={item.text} {...item} />
            ))}
          </List>
        </Drawer>

        {/* Main Content */}
        <Box
          component="main"
          sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
        >
          <Toolbar />
          <Routes>
            <Route path="/" element={<BillsPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/items" element={<ItemsPage />} />
            <Route path="/invoices" element={<InvoicesPage />} />
            <Route path="/payments" element={<PaymentsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

// Custom navigation item component
const NavItem = ({ text, path, icon }) => {
  const location = useLocation();

  return (
    <ListItem>
      <ListItemButton
        component={Link}
        to={path}
        sx={{
          backgroundColor:
            location.pathname === path ? "#22b378" : "transparent",
          borderRadius: "8px",
        }}
      >
        <ListItemIcon sx={{ color: "#fff" }}>{icon}</ListItemIcon>
        <ListItemText primary={text} />
      </ListItemButton>
    </ListItem>
  );
};
