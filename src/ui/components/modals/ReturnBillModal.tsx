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
const ReturnBillHistoryModal = () => {
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
      open={true}
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
            width:"100%"
          }}
        >
          <Box sx={{ bgcolor: "rgba(247,247,254,1)", p: 1, borderRadius: "8px" }}>
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
            mt:1
          
          }}
        >
          <Box sx={{ width: "100%", bgcolor: "red",my:2 }}>
            Content goes here
          </Box>
          
        </Box>
      </Box>
    </Modal>
  );
};

export default ReturnBillHistoryModal;
