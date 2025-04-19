import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import { useDispatch } from "react-redux";
import { Grid, TextField, Typography } from "@mui/material";
import {
  clearCustomerDetails,
  selectCustomerDetails,
  selectCustomerEditModal,
  setCustomerDetails,
  setCustomerEditModal,
  setSelectedCustomer,
} from "../../pages/CustomersPage/CustomersSlice";

import { toast } from "react-toastify";
import {
  selectEditSelectedItemModal,
  selectSelectedItem,
  selectSelectedItemName,
  setEditItemModal,
  setEditSelectItem,
  setSelectedItem,
  updateItemList,
} from "../../pages/ItemsPage/ItemsSlice";

export const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  // boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const EditSelectedItemModal = () => {
  const dispatch = useDispatch();

  const selectedItem = useSelector(selectSelectedItem);
  const editSelectedItemModal = useSelector(selectEditSelectedItemModal);
  const selectedItemName = useSelector(selectSelectedItemName);
  const [error, setError] = React.useState(false);

  const handleCloseCustomerEditModal = () => {
    dispatch(setEditItemModal(false));
    dispatch(setSelectedItem({}));
  };

  const handleChange = (field: any, value: any) => {
    setError(false);
    //@ts-ignore
    dispatch(setEditSelectItem({ field, value }));
  };
  console.log(
    "selectedItem.item_name",
    selectedItem.item_name,
    "selectedItemName",
    selectedItemName
  );
  const handleEditSubmit = async () => {
    try {
      const normalizeString = (str: string) =>
        str.replace(/\s+/g, "").toLowerCase();
      if (
        normalizeString(selectedItemName) ===
        normalizeString(selectedItem.item_name)
      ) {
        console.log("value for updation", selectedItem);
        // @ts-ignore
        const response: any = await window.electronAPI.editItemDetails(
          selectedItem
        );

        console.log("tesyer", response.data);
        dispatch(updateItemList(response.data));
        toast.success(response.message, { position: "bottom-left" });
        handleCloseCustomerEditModal();
      } else {
        // @ts-ignore
        const validationResponse = await window.electronAPI.existItemValidate(
          selectedItem
        );
        if (validationResponse.status !== 200) {
          toast.error(validationResponse.message, { position: "bottom-left" });
          return;
        }

        // @ts-ignore
        const response: any = await window.electronAPI.editItemDetails(
          selectedItem
        );

        console.log("response response", response.data);

        dispatch(updateItemList(response.data));
        toast.success(response.message, { position: "bottom-left" });
        handleCloseCustomerEditModal();
      }
    } catch (error: any) {
      toast.error("An error occurred while editing the item.", {
        position: "bottom-left",
      });
      console.error("Edit item error:", error);
    }
  };

  console.log("selectedItem", selectedItem);
  return (
    <React.Fragment>
      <Modal
        open={editSelectedItemModal}
        onClose={handleCloseCustomerEditModal}
        aria-labelledby="edit-modal-title"
        aria-describedby="edit-modal-description"
        BackdropProps={{
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
            backdropFilter: "blur(3px)", // Slight blur effect
          },
        }}
      >
        <Box
          sx={{
            ...style,
            width: 500,
            p: 4,
            borderRadius: "12px",
            bgcolor: "white",
            boxShadow: 5,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            id="edit-modal-title"
            sx={{
              fontSize: "1.4rem",
              fontWeight: 500,
              color: "#1E1E2D",
              textAlign: "center",
              mb: 5,
              width: "100%",

              textAlignLast: "start",
            }}
          >
            Edit Item Details
          </Typography>

          <Grid container spacing={2}>
            {[
              { label: "Item Name", key: "item_name" },
              { label: "Item Code", key: "code" },
              {
                label: "Item Low Stock Remainder",
                key: "low_stock_remainder",
                type: "number",
              },
              {
                label: "Item purchased Rate",
                key: "purchased_rate",
                type: "number",
                disable: true,
              },
              {
                label: "Item Selling Rate",
                key: "rate",
                type: "number",
                disable: true,
              },
              {
                label: "Item Margin",
                key: "margin",
                type: "number",
                disable: true,
              },

              {
                label: "Item Stock Holding",
                key: "stock_qty",
                type: "number",
                disable: true,
              },
            ].map(({ label, key, type, disable }) => (
              <Grid item xs={12} sm={6} key={key}>
                <TextField
                  fullWidth
                  label={label}
                  variant="outlined"
                  type={type || "text"}
                  value={selectedItem[key] || ""}
                  disabled={disable}
                  onChange={(e) => {
                    const { value } = e.target;
                    if (type === "number") {
                      const sanitizedValue = value.replace(/\D/g, "");

                      handleChange(key, sanitizedValue);
                    } else {
                      handleChange(key, value);
                    }
                  }}
                  error={error && key === "customerName"}
                  helperText={
                    error && key === "customerName"
                      ? "Customer Name is required"
                      : ""
                  }
                />
              </Grid>
            ))}
          </Grid>

          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}
          >
            <Button
              variant="outlined"
              onClick={handleCloseCustomerEditModal}
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
              onClick={handleEditSubmit}
              sx={{
                height: "2.5rem",
                width: "100px",
              }}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </React.Fragment>
  );
};

export default EditSelectedItemModal;
