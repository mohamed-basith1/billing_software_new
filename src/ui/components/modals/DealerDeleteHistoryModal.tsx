import { Modal, Box, Typography, Button } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCustomerDetails,
  setCustomerDeleteModal,
} from "../../pages/CustomersPage/CustomersSlice";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

import { toast } from "react-toastify";
import {
  selectDealerHistoryselected,
  selectDealerPurchasedDeleteModel,
  setDealerHistorySummary,
  setDealerPurchasedDeleteModel,
  setDeleteDealerBill,
} from "../../pages/ItemsPage/ItemsSlice";
export const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};
const DealerDeleteHistoryModal = () => {
  const dealerPurchasedDeleteModel = useSelector(
    selectDealerPurchasedDeleteModel
  );
  const dealerHistoryselected = useSelector(selectDealerHistoryselected);
  const dispatch = useDispatch();
  const handleCloseDeleteModal = () => {
    dispatch(setDealerPurchasedDeleteModel(false));
  };

  console.log("dealerHistoryselected", dealerHistoryselected);
  const handleCustomerDelete = async () => {
    //@ts-ignore
    let response: any = await window.electronAPI.deleteDealerBillHistory(
      dealerHistoryselected
    );
    if (response.status !== 200) {
      toast.error(`${response.message}`, { position: "bottom-left" });
    } else {
      dispatch(setDeleteDealerBill(dealerHistoryselected));
      toast.success(`${response.message}`, { position: "bottom-left" });
      const getDealerBillSummaryHandler = async () => {
        //@ts-ignore
        let response = await window.electronAPI.getDealerBillSummary();

        dispatch(setDealerHistorySummary(response.data));
      };
      getDealerBillSummaryHandler();
      handleCloseDeleteModal();
    }
  };
  return (
    <div>
      <Modal
        open={dealerPurchasedDeleteModel}
        onClose={handleCloseDeleteModal}
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-description"
        BackdropProps={{
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
            backdropFilter: "blur(2px)", // Subtle blur effect
          },
        }}
      >
        <Box
          sx={{
            ...style,
            width: 520,
            p: 3,
            borderRadius: "12px",
            bgcolor: "white",
            boxShadow: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Box sx={{ display: "flex", gap: "10px" }}>
            <Box
              sx={{
                bgcolor: "rgb(193,9,21)",
                height: "2.5rem",
                width: "2.5rem",
                borderRadius: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <WarningAmberRoundedIcon
                sx={{ fontSize: "1.5rem", color: "white", mb: 1 }}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <Typography
                id="delete-modal-title"
                sx={{
                  fontSize: "1.3rem",
                  fontWeight: 500,
                  color: "#1E1E2D",
                  textAlign: "start",
                }}
              >
                Are you absolutely sure?
              </Typography>
              <Typography
                id="delete-modal-description"
                sx={{
                  fontSize: "0.8rem",
                  color: "#555",
                  textAlign: "start",
                  mt: 1,
                }}
              >
                This action can not be undone. This will permanently delete
                dealer history and added items.
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              width: "100%",
              justifyContent: "flex-end",
            }}
          >
            <Button
              variant="outlined"
              onClick={handleCloseDeleteModal}
              sx={{
                height: "2.5rem",
                width: "100px",
                borderRadius: "8px",
                color: "#555",
                borderColor: "#bbb",
                "&:hover": { bgcolor: "#f5f5f5" },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleCustomerDelete}
              sx={{
                height: "2.5rem",
                width: "100px",
                borderRadius: "8px",
                bgcolor: "rgb(193,9,21)",
                color: "white",
                "&:hover": { bgcolor: "rgb(170, 7, 19)" },
              }}
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default DealerDeleteHistoryModal;
