import { Modal, Box, Typography, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  clearCustomerDetails,
  resetSelectedCustomerAfterDeletion,
  selectCustomerDeleteModal,
  selectCustomerDetails,
  setCustomerDeleteModal,
} from "../../pages/CustomersPage/CustomersSlice";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

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
const DeleteModal = ({ bill, handleDeleteBill, credit, itemDelete }: any) => {
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
                {bill === true || credit === true
                  ? "This action cannot be undone. It will permanently delete the bill record."
                  : itemDelete === true
                  ? "This action cannot be undone. It will permanently delete the item in the records."
                  : "This action cannot be undone. It will permanently delete the customer."}
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
              onClick={
                bill === true || credit === true || itemDelete === true
                  ? handleDeleteBill
                  : handleCustomerDelete
              }
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
