import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCustomerModal,
  selectCustomerSelectModal,
  setCustomerModal,
  setCustomerSelectModal,
} from "../../pages/BillsPage/BillsSlice";

const style = {
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

function ChildModal() {
  const dispatch = useDispatch();
  const customerModal = useSelector(selectCustomerModal);

  const handleOpen = () => {
    dispatch(setCustomerModal(true));
  };
  const handleClose = () => {
    dispatch(setCustomerModal(false));
  };

  return (
    <React.Fragment>
      <Button onClick={() => handleOpen()}>Open Child Modal</Button>
      <Modal
        open={customerModal}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: 200 }}>
          <h2 id="child-modal-title">Text in a child modal</h2>
          <p id="child-modal-description">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
          </p>
          <Button onClick={handleClose}>Close Child Modal</Button>
        </Box>
      </Modal>
    </React.Fragment>
  );
}

export default function NestedModal() {
  const dispatch = useDispatch();
  const customerSelectModal = useSelector(selectCustomerSelectModal);

  const handleClose = () => {
    dispatch(setCustomerSelectModal(false));
  };

  return (
    <div>
      <Modal
        open={customerSelectModal}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
        BackdropProps={{
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
            backdropFilter: "blur(2px)", // Blur effect
          },
        }}
      >
        <Box sx={{ ...style, width: 400 }}>
          <h2 id="parent-modal-title">Text in a modal</h2>
          <p id="parent-modal-description">
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </p>
          <ChildModal />
        </Box>
      </Modal>
    </div>
  );
}
