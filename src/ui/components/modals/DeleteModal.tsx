import { Modal, Box, Typography, Button } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearCustomerDetails,
  resetSelectedCustomerAfterDeletion,
  selectCustomerDeleteModal,
  selectCustomerDetails,
  setCustomerDeleteModal,
  setSelectedCustomer,
} from "../../pages/CustomersPage/CustomersSlice";

import PersonRemoveRoundedIcon from "@mui/icons-material/PersonRemoveRounded";
import { toast } from "react-toastify";
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
const DeleteModal = () => {
  const customerDeleteModal = useSelector(selectCustomerDeleteModal);
  const customerDetails = useSelector(selectCustomerDetails);
  const dispatch = useDispatch();
  const handleCloseDeleteModal = () => {
    dispatch(setCustomerDeleteModal(false));
  };
  const handleCustomerDelete = async () => {
    //@ts-ignore
    let response: any = await window.electronAPI.deleteCustomer(
      customerDetails.id
    );
    if (response.status !== 200) {
      toast.error(`${response.message}`, { position: "bottom-left" });
    } else {
      dispatch(clearCustomerDetails());
      toast.success(`${response.message}`, { position: "bottom-left" });
      handleCloseDeleteModal();
      dispatch(resetSelectedCustomerAfterDeletion(customerDetails.id));
    }
  };
  return (
    <div>
      <Modal
        open={customerDeleteModal}
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
            width: 320,
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
          <PersonRemoveRoundedIcon
            sx={{ fontSize: "4rem", color: "rgb(193,9,21)", mb: 1 }}
          />
          <Typography
            id="delete-modal-title"
            sx={{ fontSize: "1.3rem", fontWeight: 500, color: "#1E1E2D" }}
          >
            Confirm Deletion
          </Typography>
          <Typography
            id="delete-modal-description"
            sx={{ fontSize: "0.95rem", color: "#555", mt: 1, mb: 3 }}
          >
            Are you sure you want to delete this customer? <br />
            This action cannot be undone.
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              width: "100%",
              justifyContent: "center",
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

export default DeleteModal;
