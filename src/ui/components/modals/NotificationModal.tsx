import React, { useEffect, useState } from "react";

import { getTimeSlot } from "../../utils/utils";
import Modal from "@mui/material/Modal";
import { Box, Button, Typography } from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

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
const NotificationModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("");
  const [count,setCount]=useState(0)

  //   useEffect(() => {
  //     const checkAndShowModal = () => {
  //       console.log("loading...");
  //       const now = new Date();
  //       const slot = getTimeSlot();

  //       if (slot) {
  //         const key = `${now.toDateString()}-${slot}`;
  //         const alreadyShown = localStorage.getItem(key);

  //         if (!alreadyShown) {
  //           setMessage(
  //             slot === "morning" ? "Good Morning! ☀️" : "Good Evening! 🌙"
  //           );
  //           setIsOpen(true);
  //           localStorage.setItem(key, "true");
  //         }
  //       }
  //     };
  //     console.log("useffect");
  //     // Check every minute
  //     const interval = setInterval(checkAndShowModal, 60 * 1000);
  //     return () => clearInterval(interval);
  //   }, []);

  useEffect(() => {
    const checkAndShowModal = () => {
      console.log("Checking scheduled modal...");
      const slot = getTimeSlot();

      if (slot) {
        const key = `notification`;
        const alreadyShown = localStorage.getItem(key);

        if (!alreadyShown) {
          setMessage(
            slot === "morning" ? "Good Morning! ☀️" : "Good Evening! 🌙"
          );

          const fetchLowStockItemList = async () => {
            //@ts-ignore
            let response: any = await window.electronAPI.getLowStockItem();
            if (response.data.length !== 0) {
              setCount(response.data.length)
              setIsOpen(true);
            }
          };

          fetchLowStockItemList();

          localStorage.setItem(key, "true");
        }
      }
    };

    // Run once on mount (immediately)
    checkAndShowModal();

    // Then every minute
    const interval = setInterval(checkAndShowModal, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Modal
      open={isOpen}
      onClose={() => setIsOpen(false)}
      aria-labelledby="edit-modal-title"
      aria-describedby="edit-modal-description"
      BackdropProps={{
        sx: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(3px)",
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
        <h2 style={{ color: "#d32f2f", marginBottom: "12px" }}>
          ⚠️ Low Stock Alert
        </h2>
        <p style={{ fontSize: "16px", lineHeight: "1.5" }}>
          There are <strong>10 items</strong> in low stock. <br />
          To check, go to the <strong>Items</strong> tab and click the{" "}
          <strong>"Low Stock"</strong> container. <br />
          You can see the full list of low stock items there.
        </p>
        <Button onClick={() => setIsOpen(false)} sx={{px:10,mt:2}}>Close</Button>
      </Box>
    </Modal>
  );
};

export default NotificationModal;
