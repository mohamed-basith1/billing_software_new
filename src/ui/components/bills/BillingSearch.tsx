import { useEffect, useCallback, useRef } from "react";
import {
  Box,
  TextField,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import debounce from "lodash.debounce";
import {
  setBillingField,
  selectBillValue,
  selectCurrentTabValue,
} from "../../pages/BillsPage/BillsSlice";

const itemSuggestions = [
  "Apple",
  "Banana",
  "Cherry",
  "Date",
  "Eggplant",
  "Fig",
  "Grapes",
  "Honeydew",
  "Iceberg Lettuce",
  "Jackfruit",
  "Kiwi",
  "Lemon",
  "Mango",
];

const BillingSearch = ({ billingSearchItem }: any) => {
  const dispatch = useDispatch();
  const currentTab = useSelector(selectCurrentTabValue);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const billingSearch =
    useSelector(selectBillValue).find(
      (bill: any) => bill.bill_number === currentTab
    ) || {
      itemsearch: "",
      code: "",
      uom: "",
      qty: "",
      rate: "",
      amount: "",
      showSuggestions: false,
      filteredItems: [],
    };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const debouncedFilter = useCallback(
    debounce((value: string) => {
      const filtered =
        value.length > 0
          ? itemSuggestions.filter((item) =>
              item.toLowerCase().includes(value.toLowerCase())
            )
          : [];

      dispatch(
        setBillingField({
          bill_number: billingSearch.bill_number,
          field: "filteredItems",
          value: filtered,
        })
      );
      dispatch(
        setBillingField({
          bill_number: billingSearch.bill_number,
          field: "showSuggestions",
          value: filtered.length > 0,
        })
      );
    }, 300),
    [dispatch, billingSearch.bill_number]
  );

  const handleItemChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    dispatch(
      setBillingField({
        bill_number: billingSearch.bill_number,
        field: "itemsearch",
        value,
      })
    );
    debouncedFilter(value);
  };

  const handleOtherFieldChange = (field: string, value: string) => {
    dispatch(
      setBillingField({
        bill_number: billingSearch.bill_number,
        field,
        value,
      })
    );
  };

  const handleSelectItem = (selectedItem: string) => {
    dispatch(
      setBillingField({
        bill_number: billingSearch.bill_number,
        field: "itemsearch",
        value: selectedItem,
      })
    );
    dispatch(
      setBillingField({
        bill_number: billingSearch.bill_number,
        field: "showSuggestions",
        value: false,
      })
    );
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (document.activeElement !== inputRef.current) {
      const isOtherFieldsEmpty =
        !billingSearch.code &&
        !billingSearch.uom &&
        !billingSearch.qty &&
        !billingSearch.rate &&
        !billingSearch.amount;

      if (isOtherFieldsEmpty) {
        event.preventDefault();
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.value += event.key; // Append the keypress to input
          handleItemChange({
            target: inputRef.current,
          } as React.ChangeEvent<HTMLInputElement>);
        }
      }
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
      onKeyDown={handleKeyDown}
    >
      <TextField
        label="Item Name"
        id="item-name-field"
        size="small"
        sx={{ width: "30%" }}
        value={billingSearch.itemsearch || ""}
        onChange={handleItemChange}
        inputRef={inputRef} // Auto-focus reference
      />
      {billingSearch.showSuggestions && (
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
            {billingSearch.filteredItems?.map((item: string) => (
              <ListItem
                component="div"
                key={item}
                onClick={() => handleSelectItem(item)}
              >
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
      {["code", "uom", "qty", "rate", "amount"].map((field) => (
        <TextField
          key={field}
          label={field.toUpperCase()}
          type="number"
          size="small"
          sx={{ width: "17.5%" }}
          value={billingSearch[field] || ""}
          onChange={(e) => handleOtherFieldChange(field, e.target.value)}
        />
      ))}
    </Box>
  );
};

export default BillingSearch;
