import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentTabValue,
  setItem,
} from "../../pages/BillsPage/BillsSlice";

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 2,
  maxHeight: "80vh",
  display: "flex",
  flexDirection: "column",
};

interface Item {
  _id: string;
  code: string;
  item_name: string;
  qty: number;
  uom: string;
  rate: number;
  amount: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  data: Item[];
}

const ItemSelectionModal: React.FC<Props> = ({ open, onClose, data }) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const currentTab = useSelector(selectCurrentTabValue);
  const dispatch = useDispatch();
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;

      if (e.key === "ArrowUp") {
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "ArrowDown") {
        setSelectedIndex((prev) => Math.min(prev + 1, data.length - 1));
      } else if (e.key === "Enter") {
       

        let selectedData: any = data[selectedIndex];
        let payload: any = {
          bill_number: currentTab,
          code: selectedData.code,
          uom: selectedData.uom,
          qty: selectedData.qty,
          rate: selectedData.rate,
          amount: selectedData.amount,
          item_name: selectedData.item_name,
          createdAt: selectedData.createdAt,
          purchased_rate: selectedData.purchased_rate,
          stock_qty: selectedData.stock_qty,
          unique_id: selectedData.unique_id,
        };
        dispatch(setItem(payload));
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, selectedIndex, data, onClose]);

  const handleRowClick = (index: number) => {
    setSelectedIndex(index);

    let selectedData: any = data[index];
    let payload: any = {
      bill_number: currentTab,
      code: selectedData.code,
      uom: selectedData.uom,
      qty: selectedData.qty,
      rate: selectedData.rate,
      amount: selectedData.amount,
      item_name: selectedData.item_name,
      createdAt: selectedData.createdAt,
      purchased_rate: selectedData.purchased_rate,
      stock_qty: selectedData.stock_qty,
      unique_id: selectedData.unique_id,
    };
    dispatch(setItem(payload));

    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" mb={2}>
          Select an Item
        </Typography>
        <Box sx={{ flex: 1, overflowY: "auto" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>CODE</TableCell>
                <TableCell>ITEM NAME</TableCell>
                <TableCell>QUANTITY</TableCell>
                <TableCell>UOM</TableCell>
                <TableCell>RATE</TableCell>
                <TableCell>AMOUNT</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item, index) => (
                <TableRow
                  key={item._id}
                  hover
                  selected={selectedIndex === index}
                  onClick={() => handleRowClick(index)}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell>{item.code}</TableCell>
                  <TableCell>{item.item_name}</TableCell>
                  <TableCell>{item.qty}</TableCell>
                  <TableCell>{item.uom}</TableCell>
                  <TableCell>{item.rate}</TableCell>
                  <TableCell>{item.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Box>
    </Modal>
  );
};

export default ItemSelectionModal;
