import { useEffect, useState } from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { blue, green, orange } from "@mui/material/colors";
import { useDispatch, useSelector } from "react-redux";
import InventoryIcon from "@mui/icons-material/Inventory2Outlined";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import LayersIcon from "@mui/icons-material/Layers";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import ItemsListTable from "../../components/items/ItemsListTable";
import { selectItemsTab, setItemsTab } from "./ItemsSlice";

import ItemsLowStock from "../../components/items/ItemsLowStock";

const ItemsList = () => {
  const dispatch = useDispatch();
  const itemsTab = useSelector(selectItemsTab);
  const [itemSummary, setItemSummary] = useState({});
  useEffect(() => {
    const itemSummaryHandle = async () => {
      //@ts-ignore
      let response: any = await window.electronAPI.itemSummary();

      if (response.status !== 200) {
        // toast.error(`${response.message}`, { position: "bottom-left" });
      } else {
        setItemSummary(response?.data);
        console.log(" response?.data", response?.data);
      }
    };
    itemSummaryHandle();
  }, []);
  return (
    <Box
      // maxWidth="lg"
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
          {
            label: "Total Items",
            value: itemSummary?.total_items,
            color: blue[500],
            tab: 0,
          },
          {
            label: "Low Stocks Items",
            value: itemSummary?.low_stock_item,
            color: green[500],
            tab: 1,
          },
          // { label: "Expired Items", value: "$2,096", color: blue[700], tab: 2 },
          {
            label: "Total Stock Price",
            value: `₹${Math.round(itemSummary?.total_item_price)}`,
            color: orange[500],
            tab: 3,
          },
        ].map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              onClick={() => dispatch(setItemsTab(stat.tab))}
              elevation={0}
              sx={{
                borderLeft: `4px solid rgba(250, 160, 30, .5)`,

                background:
                  itemsTab === stat.tab
                    ? `linear-gradient(100deg, rgba(255,255,255,1) 60%, ${
                        stat.tab === 0
                          ? "rgba(250, 160, 30, .5)"
                          : stat.tab === 1
                          ? "rgba(20, 110, 150,.5)"
                          : stat.tab === 2
                          ? "rgba(255,50,50)"
                          : "rgba(50, 200, 120)"
                      } 87%)`
                    : "white",
                color: "inherit",
                height: "100%",
                boxShadow: "0px",
                borderRadius: "8px",
                border: ".1px solid lightgrey",
                display: "flex",
                alignItems: "center",
                p: 2.5,

                cursor: stat.label !== "Total Stock Price" ? "pointer" : "auto",
                transition: "box-shadow 0.5s ease-in-out", // Ensure smooth transition in both directions
                pointerEvents:
                  stat.label !== "Total Stock Price" ? "auto" : "none",
                "&:hover": {
                  boxShadow:
                    stat.label !== "Total Stock Price"
                      ? "0px 1px 2px rgba(0,0,0,.3)"
                      : "auto",
                  // "& .MuiSvgIcon-root": {

                  //   fontSize:
                  //     stat.label !== "Total Stock Price" ? "3rem" : "auto",
                  // },
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
                    stat.label === "Total Stock Price"
                      ? "rgba(50, 200, 120, .3)" // Brighter green
                      : stat.label === "Low Stocks Items"
                      ? "rgba(40, 180, 220, .3)" // Brighter blue
                      : stat.label === "Total Items"
                      ? "rgba(250, 160, 30, .3)" // Brighter orange
                      : "rgba(255, 50, 50, .3)", // Brighter red

                  borderRadius: "8px",
                  color: "white",
                  padding: 1.5,
                  transition: "background-color 0.3s ease",
                }}
              >
                {stat.label === "Total Items" ? (
                  <InventoryIcon
                    sx={{
                      fontSize: itemsTab === 0 ? "3rem" : "1.5rem",
                      color: "darkorange",

                      transition: "background-color 3s ease",
                    }}
                  />
                ) : stat.label === "Low Stocks Items" ? (
                  <LayersIcon
                    sx={{
                      fontSize: itemsTab === 1 ? "2.5rem" : "1.5rem",
                      color: "rgb(20, 110, 150)",
                      transition: "background-color 3s ease",
                    }}
                  />
                ) : stat.label === "Total Stock Price" ? (
                  <CurrencyRupeeIcon
                    sx={{
                      fontSize: itemsTab === 3 ? "2.5rem" : "1.5rem",
                      color: "rgba(50, 200, 120)",
                      transition: "background-color 3s ease",
                    }}
                  />
                ) : (
                  <EventBusyIcon
                    sx={{
                      fontSize: itemsTab === 2 ? "2.5rem" : "1.5rem",
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
      <Box sx={{ height: "100%", width: "100%" }}>
        {itemsTab === 0 ? <ItemsListTable /> : <ItemsLowStock />}
      </Box>
    </Box>
  );
};

export default ItemsList;
