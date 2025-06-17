import { Modal, Box, Typography, Button, Stack } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  selectReturnAmountModel,
  setReturnAmountModel,
} from "../../pages/PaymentsPage/PaymentsSlice";

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

export default function ReturnAmountModal({ finalBillHanlder }: any) {
  const returnAmountModel = useSelector(selectReturnAmountModel);
  const dispatch = useDispatch();


  return (
    <Modal
      open={returnAmountModel}
      onClose={() => dispatch(setReturnAmountModel(false))}
    >
      <Box sx={style}>
        <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
          Select Return Type
        </Typography>

        <Stack spacing={2}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => finalBillHanlder("UPI Paid")}
            sx={{ bgcolor: "#4caf50", "&:hover": { bgcolor: "#388e3c" } }}
          >
            UPI Return
          </Button>

          <Button
            variant="contained"
            fullWidth
            onClick={() => finalBillHanlder("Cash Paid")}
            sx={{ bgcolor: "#2196f3", "&:hover": { bgcolor: "#1976d2" } }}
          >
            Cash Return
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}
