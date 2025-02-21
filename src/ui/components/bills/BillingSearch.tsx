import { useEffect, useRef, useState } from "react";
import {
  Box,
  TextField,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  setBillingField,
  selectBillValue,
  selectCurrentTabValue,
} from "../../pages/BillsPage/BillsSlice";

const BillingSearch = () => {
  const dispatch = useDispatch();
  const currentTab = useSelector(selectCurrentTabValue);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [suggestions, setSuggestions] = useState<[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const billingSearch = useSelector(selectBillValue).find(
    (bill: any) => bill.bill_number === currentTab
  ) || {
    bill_number: currentTab, // Ensuring bill_number is present
    itemsearch: "",
    code: 0,
    uom: "",
    qty: 0,
    rate: 0,
    amount: 0,
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentTab]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (
        document.activeElement &&
        (document.activeElement as HTMLElement).tagName === "INPUT"
      ) {
        return; // Ignore if the user is already typing in an input
      }

      const isAlphabet = /^[a-zA-Z]$/.test(event.key); // Check if the key is a letter
      const isAnyFieldEmpty =
        !billingSearch.code ||
        !billingSearch.uom ||
        !billingSearch.qty ||
        !billingSearch.rate ||
        !billingSearch.amount;

      if (isAlphabet && isAnyFieldEmpty) {
        dispatch(
          setBillingField({
            bill_number: billingSearch.bill_number,
            field: "itemsearch",
            value: (prevState: string) => prevState + event.key, // Use functional update
          })
        );
        inputRef.current?.focus(); // Auto-focus the item search field
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [billingSearch, dispatch]);

  const handleItemChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;

    dispatch(
      setBillingField({
        bill_number: billingSearch.bill_number,
        field: "itemsearch",
        value,
      })
    );

    if (value.length > 0) {
      try {
        const sanitizedData = JSON.parse(JSON.stringify(value));
        console.log("sanitizedData", sanitizedData);
        //@ts-ignore
        const results = await window.electronAPI.searchItem(sanitizedData);
        // const results = await

        setSuggestions(results);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectItem = (selectedItem: {
    item_name: string;
    code: string;
    uom: string;
    qty: number;
    rate: number;
    amount: number;
  }) => {
    dispatch(
      setBillingField({
        bill_number: billingSearch.bill_number,
        field: "itemsearch",
        value: selectedItem.item_name,
      })
    );
    dispatch(
      setBillingField({
        bill_number: billingSearch.bill_number,
        field: "code",
        value: selectedItem.code,
      })
    );
    dispatch(
      setBillingField({
        bill_number: billingSearch.bill_number,
        field: "uom",
        value: selectedItem.uom,
      })
    );
    dispatch(
      setBillingField({
        bill_number: billingSearch.bill_number,
        field: "qty",
        value: selectedItem.qty,
      })
    );
    dispatch(
      setBillingField({
        bill_number: billingSearch.bill_number,
        field: "rate",
        value: selectedItem.rate,
      })
    );
    dispatch(
      setBillingField({
        bill_number: billingSearch.bill_number,
        field: "amount",
        value: selectedItem.amount,
      })
    );

    setSuggestions([]);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault(); // Prevent default scrolling behavior
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault(); // Prevent default scrolling behavior
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (event.key === "Enter" && selectedIndex >= 0) {
      event.preventDefault();
      handleSelectItem(suggestions[selectedIndex]);
      setSelectedIndex(-1); // Reset selection after choosing an item
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        height: "2.5rem",
        mt: 1,
        gap: "10px",
        position: "relative",
      }}
    >
      <TextField
        label="Item Name or Code"
        id="item-name-field"
        size="small"
        sx={{ width: "30%" }}
        value={billingSearch.itemsearch || ""}
        onChange={handleItemChange}
        onKeyDown={handleKeyDown}
        inputRef={inputRef}
      />
      {suggestions.length > 0 && (
        <Paper
          sx={{
            position: "absolute",
            top: "100%",
            left: 0,
            width: "100%",
            zIndex: 10,
          }}
        >
          <List>
            {suggestions.map((item: any, index: number) => (
              <ListItem
                component="div"
                key={item.code}
                onClick={() => handleSelectItem(item)}
                sx={{
                  borderBottom: ".5px solid lightgray",
                  backgroundColor:
                    selectedIndex === index ? "#b3d4fc" : "white",
                  cursor: "pointer",
                }}
              >
                <ListItemText
                  primary={`${item.item_name}`}
                  sx={{ width: "30%" }}
                />
                <ListItemText
                  primary={`${item.code}`}
                  sx={{ width: "17.5%" }}
                />
                <ListItemText primary={`${item.qty}`} sx={{ width: "17.5%" }} />
                <ListItemText primary={`${item.uom}`} sx={{ width: "17.5%" }} />
                <ListItemText
                  primary={`${item.rate}`}
                  sx={{ width: "17.5%" }}
                />
                <ListItemText
                  primary={`${item.amount}`}
                  sx={{ width: "17.5%" }}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
      {["code", "qty", "uom", "rate", "amount"].map((field: any) => (
        <TextField
          key={field}
          label={field.toUpperCase()}
          type={
            ["code", "qty", "rate", "amount"].includes(field)
              ? "number"
              : "text"
          }
          size="small"
          sx={{
            width: "17.5%",
            pointerEvents: field === "qty" ? "auto" : "none",
          }}
          value={billingSearch[field] || ""}
          onChange={(e) =>
            dispatch(
              setBillingField({
                bill_number: billingSearch.bill_number,
                field,
                value: ["code", "qty", "rate", "amount"].includes(field)
                  ? parseFloat(e.target.value) || 0
                  : e.target.value,
              })
            )
          }
        />
      ))}
    </Box>
  );
};

export default BillingSearch;
