import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  selectBillValue,
  selectCurrentTabValue,
  setItem,
} from "../../pages/BillsPage/BillsSlice";
import { useEffect, useRef } from "react";

export const calculateAmount = (
  uom: string,
  qty: number,
  rate: number
): number => {
  switch (uom) {
    case "Kg":
    case "liter":
    case "piece":
      return qty * rate;
    case "gram":
      return (qty / 1000) * rate; // Convert grams to Kg
    default:
      console.warn(`Unknown UOM: ${uom}`);
      return 0; // Return 0 as a fallback
  }
};

const columns: GridColDef[] = [
  { field: "no", headerName: "NO", flex: 0.5 },
  { field: "code", headerName: "CODE", flex: 1 },
  { field: "item_name", headerName: "ITEM NAME", flex: 3 },
  { field: "qty", headerName: "QUANTITY", flex: 1, editable: true },
  { field: "uom", headerName: "UOM", flex: 1 },
  {
    field: "rate",
    headerName: "RATE",
    flex: 1,
    align: "right",
    headerAlign: "right",
    valueGetter: (params) => {
      console.log("Rate Column Params:", params);
      return params !== undefined ? `₹${params}` : " ₹0";
    },
  },
  {
    field: "amount",
    headerName: "AMOUNT",
    flex: 1,
    align: "right",
    headerAlign: "right",
    valueGetter: (params) => {
      console.log("Amount Column Params:", params);
      return params !== undefined ? `₹${params}` : " ₹0";
    },
  },
];

const BillingItems = () => {
  const selectCurrentTab = useSelector(selectCurrentTabValue);
  const selectBill = useSelector(selectBillValue);
  const dispatch = useDispatch();

  const filteredBill =
    selectBill
      .find((data: any) => data.bill_number === selectCurrentTab)
      ?.items.map((item: any, index: number) => ({
        ...item,
        no: index + 1, // Adding index starting from 1
      })) || [];

  const gridRef = useRef<HTMLDivElement>(null);

  const handleProcessRowUpdate = (newRow: any) => {
    // Recalculate the amount when qty is edited
    const updatedAmount = calculateAmount(newRow.uom, newRow.qty, newRow.rate);
    const updatedRow: any = { ...newRow, amount: updatedAmount };
    dispatch(setItem({ ...updatedRow, edited: true }));
    return updatedRow;
  };

  useEffect(() => {
    const scrollToBottom = () => {
      if (gridRef.current) {
        const gridContainer = gridRef.current.querySelector(
          ".MuiDataGrid-virtualScroller"
        );
        if (gridContainer) {
          setTimeout(() => {
            gridContainer.scrollTop = gridContainer.scrollHeight;
          }, 100); // Small delay to ensure rendering is complete
        }
      }
    };

    scrollToBottom();
  }, [filteredBill.length]); // Trigger scroll when new rows are added

  return (
    <Box sx={{ height: "calc(100% - 17rem)", width: "100%" }}>
      <div ref={gridRef} style={{ height: "100%", overflow: "hidden" }}>
        <DataGrid
          rows={filteredBill}
          columns={columns}
          disableColumnMenu
          hideFooter
          processRowUpdate={handleProcessRowUpdate}
          sx={{
            "& .MuiDataGrid-columnHeader": {
              backgroundColor: "#1E1E2D !important", // Ensure each column header is colored
              color: "white",
            },
          }}
        />
      </div>
    </Box>
  );
};

export default BillingItems;
