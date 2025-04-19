import { Modal, Box, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { style } from "./CustomerCreateModal";
import { useDispatch, useSelector } from "react-redux";
import {
  selectReturnBillHistoryList,
  selectReturnBillHistoryModal,
  selectSelectedBills,
  setReturnBillHistoryList,
  setReturnBillHistoryModal,
} from "../../pages/PaymentsPage/PaymentsSlice";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
const ReturnBillHistoryModal = () => {
  const columns: GridColDef[] = [
    {
      field: "action",
      headerName: "#",
      flex: 0.5,
      align: "center",
      headerAlign: "center",
    },

    { field: "item_name", headerName: "ITEM NAME", flex: 3 },
    {
      field: "qty",
      headerName: "QUANTITY",
      flex: 1,
      editable: true,
      align: "right",
      headerAlign: "right",
    },
    {
      field: "uom",
      headerName: "UOM",
      flex: 1,
      align: "right",
      headerAlign: "right",
    },
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
  const dispatch = useDispatch();
  const selectedBills = useSelector(selectSelectedBills);
  const returnBillHistoryList = useSelector(selectReturnBillHistoryList);
  const returnBillHistoryModal = useSelector(selectReturnBillHistoryModal);
  useEffect(() => {
    const fetchReturnBillHistory = async () => {
      //@ts-ignore
      let response: any = await window.electronAPI.getReturnBillsHistory(
        selectedBills.bill_number
      );
      dispatch(setReturnBillHistoryList(response.data));
    };
    if (returnBillHistoryModal) {
      fetchReturnBillHistory();
    }
  }, [returnBillHistoryModal]);

  console.log("returnBillHistoryList", returnBillHistoryList);
  return (
    <Modal
      open={returnBillHistoryModal}
      onClose={() => dispatch(setReturnBillHistoryModal(false))}
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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            pb: 2,
            borderBottom: ".1px solid lightgrey",
            width: "100%",
          }}
        >
          <Box
            sx={{ bgcolor: "rgba(247,247,254,1)", p: 1, borderRadius: "8px" }}
          >
            <HistoryOutlinedIcon />
          </Box>

          {/* Header should be fixed and not scrollable */}
          <Typography variant="h5" sx={{ fontWeight: 500 }}>
            Return Bill History
          </Typography>
        </Box>

        {/* Scrollable content */}
        <Box
          sx={{
            width: "100%",
            flex: 1, // Takes up remaining space
            overflowY: "auto", // Enables vertical scrolling,
            mt: 1,
          }}
        >
          {returnBillHistoryList
            ?.slice()
            .reverse()
            ?.map((returnBillHistoryList: any) => {
              return (
                <Box
                  sx={{
                    width: "100%",
                    bgcolor: "red",
                    my: 2,
                    borderBottom: ".1px solid lightgrey",
                  }}
                >
                  <Box sx={{ bgcolor: "white", height: "100%" }}>
                    <Box
                      sx={{
                        bgcolor: "white",

                        py: 10,

                        px: 8,
                      }}
                    >
                      <Box
                        sx={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-start",
                          }}
                        >
                          <Typography>Order Date</Typography>
                          <Typography
                            sx={{ fontSize: ".7rem", color: "grey", mt: 1 }}
                          >
                            {returnBillHistoryList?.createdAt
                              ? new Date(
                                  returnBillHistoryList.createdAt
                                ).toLocaleDateString("en-GB", {
                                  timeZone: "UTC",
                                })
                              : ""}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",

                            justifyContent: "space-between",
                            textAlign: "start",
                            alignItems: "flex-end",
                          }}
                        >
                          <Typography
                            sx={{ fontSize: "3rem", lineHeight: 1.5 }}
                          >
                            INVOICE
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: ".7rem",
                              color: "grey",
                              fontWeight: 600,
                            }}
                          >
                            BILL NUMBER - {returnBillHistoryList?.bill_number}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ mt: 5 }}>
                        <DataGrid
                          rows={
                            returnBillHistoryList?.returned_items?.map(
                              (data) => ({
                                ...data,
                                id: data.code,
                              })
                            ) || []
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
                      <Box
                        sx={{
                          width: "100%",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-end",
                          gap: "10px",
                          mt: 3,
                        }}
                      >
                        <Box
                          sx={{
                            width: "40%",
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography sx={{ fontSize: ".7rem" }}>
                            Previous Bill Amount{" "}
                          </Typography>
                          <Typography sx={{ fontSize: ".7rem" }}>
                            {returnBillHistoryList?.previous_bill_amount}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            width: "40%",
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography sx={{ fontSize: ".7rem" }}>
                            Returned Amount{" "}
                          </Typography>
                          <Typography sx={{ fontSize: ".7rem" }}>
                            {returnBillHistoryList?.returned_amount}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            width: "40%",
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography sx={{ fontSize: ".7rem" }}>
                            Returned Method{" "}
                          </Typography>
                          <Typography sx={{ fontSize: ".7rem" }}>
                            {returnBillHistoryList?.return_method}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              );
            })}
        </Box>
      </Box>
    </Modal>
  );
};

export default ReturnBillHistoryModal;
