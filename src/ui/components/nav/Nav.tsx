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
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import React, { useEffect } from "react";
import { Tooltip, IconButton, Menu, MenuItem, Box } from "@mui/material";
import { Logout } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  logoutAction,
  selectUserName,
  selectUserRole,
} from "../../pages/LoginPage/LoginSlice";

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
  const dispatch = useDispatch();
  const userName = useSelector(selectUserName);
  const role = useSelector(selectUserRole);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleLogout = () => {
    dispatch(logoutAction());
    navigate("/login");
  };
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  useEffect(() => {
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
            // bgcolor: "#1E1E2D", // Dark background
            bgcolor: "white", // Light background
            color: "#fff",
            // boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            border: ".1px solid lightgrey",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            width: "100%",
            gap: "10px",
          }}
        >
          <Tooltip title="Account settings">
            <IconButton
              onClick={handleClick}
              size="small"
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              sx={{ p: 0 }}
            >
              <AccountCircleIcon
                sx={{ width: 30, height: 30, color: "#1E1E2D" }}
              />
            </IconButton>
          </Tooltip>
          <Box
            sx={{
              height: "100%",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Tooltip title={userName} arrow>
              <Typography
                noWrap
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: "150px", // Adjust width as needed
                  textTransform: "capitalize", // Capitalize first letter
                  color: "#1E1E2D",
                }}
              >
                {userName}
              </Typography>
            </Tooltip>
            <Typography
              sx={{
                fontSize: ".6rem",
                textTransform: "capitalize",
                color: "#1E1E2D",
              }}
            >
              {role}
            </Typography>
          </Box>

          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            slotProps={{
              paper: {
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&::before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    left: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              },
            }}
            transformOrigin={{ horizontal: "left", vertical: "top" }}
            anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
          >
            <MenuItem onClick={() => handleLogout()}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>

        {/* <Divider sx={{ borderColor: "#444" }} /> */}

        <List>
          {role === "employee"
            ? menuItems
                .filter((data: any) => data.text !== "Reports")
                .map((item) => <NavItem key={item.text} {...item} />)
            : menuItems.map((item) => <NavItem key={item.text} {...item} />)}
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
            // location.pathname === path ? "#22b378" : "transparent",
            location.pathname === path ? "#1E1E2D" : "transparent",

          borderRadius: "8px",
        }}
      >
        <ListItemIcon
          sx={{
            color: location.pathname === path ? "#22b378" : "#1E1E2D",
            fontSize: "1.5rem",
          }}
        >
          {icon}
        </ListItemIcon>
        <ListItemText
          primary={text}
          sx={{ color: location.pathname === path ? "#fff" : "#1E1E2D" }}
        />
      </ListItemButton>
    </ListItem>
  );
};
