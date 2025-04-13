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
import { AnimatedCounter } from "../ReportPage/Dashboard";

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
        // border: ".1px solid lightgrey",
        borderRadius: "8px",
        p: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        mt: 2,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          minHeight: "8rem",
        }}
      >
        {[
          {
            name: "Total Items",
            value: itemSummary?.total_items,
            icon: <InventoryIcon fontSize="large" />,
            tab: 0,
            bgColor: "rgba(246, 173, 85, 0.2)", // Amber
            color: "#f6ad55",
            description: "Total number of different items in your inventory",
          },
          {
            name: "Low Stocks Items",
            value: itemSummary?.low_stock_item,
            icon: <LayersIcon fontSize="large" />,
            tab: 1,
            bgColor: "rgba(66, 153, 225, 0.2)", // Blue
            color: "#4299e1",
            description: "Total number items are running low in stock",
          },

          {
            name: "Total Stock Price",
            value: Math.round(itemSummary?.total_item_price),
            icon: <CurrencyRupeeIcon fontSize="large" />,
            tab: 2,

            bgColor: "rgba(34, 179, 120, 0.2)", // Green
            color: "#22b378",

            description: "Total value of all items in your inventory",
          },
        ].map((item) => (
          <Box
            onClick={() => {
              if (item.tab !== 2) {
                return dispatch(setItemsTab(item.tab));
              }
            }}
            key={item.tab}
            sx={{
              flex: "1 1 200px",
              bgcolor: item.bgColor,
              p: 3,
              borderRadius: 2,
              maxWidth: "28%",
              height: "8rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "flex-start",
              borderLeft: `4px solid ${item.color}`,
              transition: "box-shadow 0.5s ease-in-out",
              cursor: item.tab !== 2 ? "pointer" : "auto",
              boxShadow:
                item.tab === itemsTab ? `0 1px 10px ${item.color}` : "",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                justifyContent: "flex-start",
              }}
            >
              <Box
                sx={{
                  bgcolor: item.color,
                  color: "white",
                  p: 1,
                  borderRadius: "50%",
                  display: "flex",
                }}
              >
                {item.icon}
              </Box>
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography variant="subtitle2" color="text.secondary">
                  {item.name}
                </Typography>
                <AnimatedCounter
                  value={item.value}
                  isCurrency={item.name.includes("Total Stock Price")}
                />
              </Box>
            </Box>
            <Typography variant="caption" color="text.secondary">
              {item.description}
            </Typography>
          </Box>
        ))}
      </Box>
      <Box sx={{ height: "100%", width: "100%" }}>
        {itemsTab === 0 ? <ItemsListTable /> : <ItemsLowStock />}
      </Box>
    </Box>
  );
};

export default ItemsList;
