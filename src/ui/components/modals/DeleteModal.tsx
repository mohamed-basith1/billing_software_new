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
  bgcolor: "background.paper",
  border: "2px solid #000",
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
            width: "25%",
            height: "27%",
            borderRadius: "8px",
            border: "0px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <PersonRemoveRoundedIcon sx={{ fontSize: "3rem" }} />
          <Typography sx={{ fontSize: "1.2rem", fontWeight: 400 }}>
            Are you sure you want to <br /> delete this customer ?{" "}
          </Typography>
          <Box
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <Button
              variant="outlined"
              sx={{ height: "2.2rem" }}
              onClick={() => handleCloseDeleteModal()}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => handleCustomerDelete()}
              sx={{
                height: "2.2rem",
                bgcolor: "rgb(193,9,21)",
                "&:hover": {
                  bgcolor: "rgb(193,9,21)",
                  outline: "red", // Removes focus outline,
                  border: "0px",
                },
                "&:focus, &:focus-visible, &.Mui-focusVisible": {
                  outline: "red", // Removes focus outline
                  border: "0px",
                },
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
