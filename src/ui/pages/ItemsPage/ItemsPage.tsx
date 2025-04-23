import Box from "@mui/material/Box";
import ItemsTabs from "./ItemsTabs";

import { useSelector } from "react-redux";
import ItemPurchasedHistory from "./ItemPurchasedHistory";
import ItemsEntry from "./ItemsEntry";
import ItemsList from "./ItemsList";
import { selectCurrentTab } from "./ItemsSlice";

export default function ItemsPage() {
  const currentTab = useSelector(selectCurrentTab);


  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <ItemsTabs />

      {currentTab === 0 ? (
        <ItemsList />
      ) : currentTab === 1 ? (
        <ItemsEntry />
      ) : currentTab === 2 ? (
        <ItemPurchasedHistory />
      ) : null}
    </Box>
  );
}
