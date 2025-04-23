import { Box, Button, Modal, Typography } from "@mui/material";
import { style } from "./CustomerCreateModal";
import { useDispatch, useSelector } from "react-redux";
import {
  selectDealerHistoryselected, selectPayDealerAmountHistoryModel,
  setDeleteDealerPaymentHistory, setPayDealerAmountHistoryModel
} from "../../pages/ItemsPage/ItemsSlice";
import { DataGrid } from "@mui/x-data-grid";
import { selectUserName } from "../../pages/LoginPage/LoginSlice";
const DealerAmountHistoryModal = () => {
  const username = useSelector(selectUserName);
  const handleDeleteAmount = async (data) => {
  
    //@ts-ignore
    let response = await window.electronAPI.deleteDealerPaymentHistory(data);

    if (response.status === 200) {

      let TransactionPayload = {
        status: "Decreased",
        bill_no: "None",
        customer: "None",
        employee: "None",
        method: data.paymentMethod,
        reason:
          "When paying the amount to the dealer, a wrong payment method or incorrect amount was chosen.",
        amount: Number(data.amount),
        handler: username,
        billtransactionhistory: true,
        password: "",
      };

      //@ts-ignore
      let responsess = await window.electronAPI.addTransactionHistory(
        TransactionPayload
      );
      dispatch(
        setDeleteDealerPaymentHistory({ data, response: response.data })
      );
      dispatch(setPayDealerAmountHistoryModel(false));
    }
  };
  const columns: GridColDef[] = [
    {
      field: "createdAt",
      headerName: "Date",
      flex: 1,
      align: "left",
      headerAlign: "left",
      renderCell: (params) => {
        try {
          return (
            <span style={{ fontWeight: 500 }}>
              {new Date(params.value).toLocaleDateString("en-GB", {
                timeZone: "UTC",
              })}
            </span>
          );
        } catch (err) {
          return <span>Error</span>;
        }
      },
    },

    {
      field: "paymentMethod",
      headerName: "PAYMENT METHOD",
      flex: 1,
      align: "center",
      headerAlign: "center",
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

    {
      field: "_id",
      headerName: "ACTION",
      flex: 1,
      align: "right",
      headerAlign: "right",
      renderCell: (params) => {
        return (
          <Button
            variant="error"
            disabled={dealerHistoryselected.history.length <= 1}
            sx={{
              height: "2rem",
              bgcolor:
                dealerHistoryselected.history.length <= 1 ? "lightgrey" : "red",
              opacity: dealerHistoryselected.history.length <= 1 ? ".5" : "1",
              pointerEvents:
                dealerHistoryselected.history.length <= 1 ? "none" : "auto",
            }}
            onClick={() => {
              if (dealerHistoryselected.history.length > 1) {
                handleDeleteAmount(params.row);
              }
            }}
          >
            Delete
          </Button>
        );
      },
    },
  ];
  const payDealerAmountHistoryModel = useSelector(
    selectPayDealerAmountHistoryModel
  );

  const dealerHistoryselected = useSelector(selectDealerHistoryselected);

  const dispatch = useDispatch();


  return (
    <Modal
      open={payDealerAmountHistoryModel}
      onClose={() => dispatch(setPayDealerAmountHistoryModel(false))}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
      BackdropProps={{
        sx: {
          backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
          backdropFilter: "blur(2px)", // Blur effect
        },
      }}
    >
      <Box
        sx={{
          ...style,
          width: "50%",
          height: "80vh",
          borderRadius: "8px",
          border: "0px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          p: 3,
          bgcolor: "white", // Ensures visibility
        }}
      >
        <Typography sx={{ fontSize: "1.5rem", mb: 2 }}>
          Given Amount History
        </Typography>
        <Box sx={{ flex: 1, width: "100%", height: "60%" }}>
          <DataGrid
            rows={
              Array.isArray(dealerHistoryselected?.history)
                ? dealerHistoryselected.history.map((data) => ({
                    ...data,
                    id: data._id,
                  }))
                : []
            }
            columns={columns}
            disableColumnMenu
            hideFooter
            sx={{
              borderRadius: 0,
              "& .MuiDataGrid-columnSeparator": {
                display: "none",
              },
              "& .MuiDataGrid-columnHeader": {
                backgroundColor: "#1E1E2D !important",
                color: "white",
                maxHeight: "50px",
                border: "none",
              },
              "& .MuiDataGrid-cell": {
                border: "none",
              },
            }}
          />
        </Box>
      </Box>
    </Modal>
  );
};

export default DealerAmountHistoryModal;
