import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, IconButton, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  removeItem,
  selectBillValue,
  selectCurrentTabValue,
  setItem,
} from "../../pages/BillsPage/BillsSlice";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
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

const BillingItems = () => {
  const selectCurrentTab = useSelector(selectCurrentTabValue);
  const selectBill = useSelector(selectBillValue);
  const dispatch = useDispatch();
  const columns: GridColDef[] = [
    {
      field: "action",
      headerName: "",
      flex: 0.5,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => {
        console.log("sysguyd", params);
        return (
          <IconButton onClick={() => dispatch(removeItem({ code: params.id }))}>
            <ClearRoundedIcon sx={{ color: "red" }} />
          </IconButton>
        );
      },
    },
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
        return params !== undefined ? `₹${params}` : " ₹0";
      },
    },
  ];
  const modifiedBill =
    selectBill
      .find((data: any) => data.bill_number === selectCurrentTab)
      ?.items.map((item: any, index: number) => ({
        ...item,
        no: index + 1, // Adding index starting from 1
      })) || [];

  const gridRef = useRef<HTMLDivElement>(null);

  const handleProcessRowUpdate = (newRow: any) => {
    if (Number(newRow.qty) === 0 || Number(newRow.qty) < 0) {
      return { ...modifiedBill[0] };
    }

    console.log(Number(newRow.qty), modifiedBill[0], "super");
    if (Number(newRow.qty) > modifiedBill[0].stock_qty) {
      toast.warning(
        `Entered quantity exceeds available stock. We only have ${modifiedBill[0].stock_qty} ${modifiedBill[0].uom} of ${modifiedBill[0].item_name}`,
        { position: "bottom-left" }
      );
      return { ...modifiedBill[0] };
    }
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
  }, [modifiedBill.length]); // Trigger scroll when new rows are added
  console.log("selectBill", selectBill);
  return (
    <Box sx={{ height: "calc(100% - 17rem)", width: "100%" }}>
      <div ref={gridRef} style={{ height: "100%", overflow: "hidden" }}>
        <DataGrid
          rows={modifiedBill}
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
