import { Box, Modal, Typography } from "@mui/material";
import { style } from "./CustomerCreateModal";
import ItemsNewEntry from "../items/ItemsNewEntry";
import { useDispatch, useSelector } from "react-redux";
import { selectNewItemEntryModel, setNewItemEntryModel } from "../../pages/ItemsPage/ItemsSlice";
const NewItemEntryModel = () => {
    const newItemEntryModel =useSelector(selectNewItemEntryModel)
    const dispatch=useDispatch()
  return (
    <Modal
      open={newItemEntryModel}
      onClose={() => dispatch(setNewItemEntryModel(false))}
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
          Create New Item
        </Typography>
        <ItemsNewEntry />
      </Box>
    </Modal>
  );
};

export default NewItemEntryModel;
