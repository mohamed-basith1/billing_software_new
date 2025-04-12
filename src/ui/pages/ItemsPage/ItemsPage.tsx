import Box from "@mui/material/Box";
import ItemsTabs from "./ItemsTabs";

import ItemsEntry from "./ItemsEntry";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentTab } from "./ItemsSlice";
import ItemsList from "./ItemsList";

export default function ItemsPage() {
  const currentTab = useSelector(selectCurrentTab);
  const dispatch = useDispatch();

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
      ) : null}
      {/* <CustomerEditModal />
      <DeleteModal /> */}
    </Box>
  );
}
