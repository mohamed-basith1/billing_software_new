import React from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Button,
} from "@mui/material";
import { Box } from "@mui/system";
import { blue, green, orange } from "@mui/material/colors";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { getGreeting } from "../../utils/utils";
import { useDispatch, useSelector } from "react-redux";
import { selectUserName } from "../LoginPage/LoginSlice";
import InventoryIcon from "@mui/icons-material/Inventory2Outlined";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import LayersIcon from "@mui/icons-material/Layers";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import ItemsListTable from "../../components/items/ItemsListTable";
import {
  selectCurrentTab,
  selectItemsTab,
  setCurrentTab,
  setItemsTab,
} from "./ItemsSlice";

const orders = [
  {
    id: "#QN0067",
    date: "NOV 26, 2023",
    customer: "Maulana",
    service: "Delivery",
    item: "American Style Burger",
    qty: 1,
    status: "NEW",
    total: "$75.00",
  },
  {
    id: "#QN0068",
    date: "NOV 25, 2023",
    customer: "Hanifa",
    service: "Take Away",
    item: "Sushi Platter",
    qty: 2,
    status: "NEW",
    total: "$175.00",
  },
  {
    id: "#QN0069",
    date: "NOV 24, 2023",
    customer: "Annisa",
    service: "Delivery",
    item: "Chicken Curry Katsu",
    qty: 4,
    status: "ON PROCESS",
    total: "$375.00",
  },
  {
    id: "#QN0070",
    date: "NOV 23, 2023",
    customer: "Iwan",
    service: "Take Away",
    item: "American Style Burger",
    qty: 1,
    status: "DONE",
    total: "$85.00",
  },
  {
    id: "#QN0071",
    date: "NOV 22, 2023",
    customer: "Dwi",
    service: "Take Away",
    item: "Sushi Platter",
    qty: 4,
    status: "NEW",
    total: "$125.00",
  },
  {
    id: "#QN0072",
    date: "NOV 21, 2023",
    customer: "Wahyu",
    service: "Delivery",
    item: "American Style Burger",
    qty: 2,
    status: "DONE",
    total: "$60.00",
  },
];

const ItemsList = () => {
  const dispatch = useDispatch();
  const userName = useSelector(selectUserName);

  const itemsTab = useSelector(selectItemsTab);
  return (
    <Container
      maxWidth="lg"
      sx={{
        height: "calc(100% - 3.5rem)",
        width: "100%",
        background: "white",
        border: ".1px solid lightgrey",
        borderRadius: "8px",
        p: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        mt: 3,
        overflow: "hidden",
      }}
    >
      <Grid container spacing={1.5} sx={{ my: 1 }}>
        {[
          { label: "Total Items", value: 134, color: blue[500], tab: 0 },
          { label: "Low Stocks Items", value: 113, color: green[500], tab: 1 },
          { label: "Expired Items", value: "$2,096", color: blue[700], tab: 2 },
          {
            label: "Total Items Price",
            value: "₹2,096",
            color: orange[500],
            tab: 3,
          },
        ].map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              onClick={() => dispatch(setItemsTab(stat.tab))}
              elevation={0}
              sx={{
                backgroundColor: "white",
                color: "inherit",
                height: "100%",
                boxShadow: "0px",
                borderRadius: "8px",
                border: ".1px solid lightgrey",
                display: "flex",
                alignItems: "center",
                p: 2.5,
                cursor: stat.label !== "Total Items Price" ? "pointer" : "auto",
                transition: "box-shadow 0.5s ease-in-out", // Ensure smooth transition in both directions

                "&:hover": {
                  boxShadow:
                    stat.label !== "Total Items Price"
                      ? "0px 1px 2px rgba(0,0,0,.3)"
                      : "auto",
                  "& .MuiSvgIcon-root": {
                    // color:"rgb(30, 120, 80)" "#22b378",
                    fontSize:
                      stat.label !== "Total Items Price" ? "2.5rem" : "auto",
                  },
                },

                "& .MuiSvgIcon-root": {
                  transition:
                    "color 0.5s ease-in-out, font-size 0.5s ease-in-out", // Smooth animation both ways
                },
              }}
            >
              <CardContent
                sx={{
                  bgcolor:
                    stat.label === "Total Items Price"
                      ? "rgba(50, 200, 120, .3)" // Brighter green
                      : stat.label === "Low Stocks Items"
                      ? "rgba(40, 180, 220, .3)" // Brighter blue
                      : stat.label === "Total Items"
                      ? "rgba(250, 160, 30, .3)" // Brighter orange
                      : "rgba(255, 50, 50, .3)", // Brighter red

                  borderRadius: "8px",
                  color: "white",
                  transition: "background-color 0.3s ease",
                }}
              >
                {stat.label === "Total Items" ? (
                  <InventoryIcon
                    sx={{
                      fontSize: itemsTab === 0 ? "2.5rem" : "1rem",
                      color: "darkorange",

                      transition: "background-color 3s ease",
                    }}
                  />
                ) : stat.label === "Low Stocks Items" ? (
                  <LayersIcon
                    sx={{
                      fontSize: itemsTab === 1 ? "2.5rem" : "1rem",
                      color: "rgb(20, 110, 150)",
                      transition: "background-color 3s ease",
                    }}
                  />
                ) : stat.label === "Total Items Price" ? (
                  <CurrencyRupeeIcon
                    sx={{
                      fontSize: itemsTab === 3 ? "2.5rem" : "1rem",
                      color: "rgba(50, 200, 120)",
                      transition: "background-color 3s ease",
                    }}
                  />
                ) : (
                  <EventBusyIcon
                    sx={{
                      fontSize: itemsTab === 2 ? "2.5rem" : "1rem",
                      color: "rgba(255,50,50)",
                      transition: "background-color 3s ease",
                    }}
                  />
                )}
              </CardContent>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2">{stat.label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        my={3}
      >
        {itemsTab === 0 ? (
          <Typography sx={{ fontSize: "1.5rem", fontWeight: 500 }}>
            Items List
          </Typography>
        ) : itemsTab === 1 ? (
          <Typography sx={{ fontSize: "1.5rem", fontWeight: 500 }}>
            Low Stock List
          </Typography>
        ) : itemsTab === 2 ? (
          <Typography sx={{ fontSize: "1.5rem", fontWeight: 500 }}>
            Expired Item List
          </Typography>
        ) : (
          <Typography sx={{ fontSize: "1.5rem", fontWeight: 500 }}>
            Expired Item List
          </Typography>
        )}
      </Box>

      <ItemsListTable />
    </Container>
  );
};

export default ItemsList;
