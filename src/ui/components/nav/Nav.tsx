import { Link, useLocation, useNavigate } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";

import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PeopleIcon from "@mui/icons-material/PeopleOutlined";
import InventoryIcon from "@mui/icons-material/Inventory2Outlined";
import ReceiptIcon from "@mui/icons-material/ReceiptOutlined";
import PaymentsIcon from "@mui/icons-material/PaymentsOutlined";
import ReportIcon from "@mui/icons-material/AssessmentOutlined";

import { useEffect } from "react";

export const drawerWidth = 240;

// Sidebar navigation items
const menuItems = [
  { text: "Bills", path: "/", icon: <ReceiptIcon /> },
  { text: "Customers", path: "/customers", icon: <PeopleIcon /> },
  { text: "Products", path: "/items", icon: <InventoryIcon /> },
  { text: "Payments", path: "/payments", icon: <PaymentsIcon /> },
  { text: "Reports", path: "/reports", icon: <ReportIcon /> },
];
const Nav = () => {
  const navigate = useNavigate();
  useEffect(() => {
    console.log("nav log", location.pathname);

    navigate("/");
  }, []);
  return (
    <>
      <CssBaseline />

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
    </>
  );
};

export default Nav;

// Custom navigation item component
const NavItem = ({ text, path, icon }: { text: any; path: any; icon: any }) => {
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
