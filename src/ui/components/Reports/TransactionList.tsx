import { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import CallReceivedOutlinedIcon from "@mui/icons-material/CallReceivedOutlined";
import CallMadeOutlinedIcon from "@mui/icons-material/CallMadeOutlined";
import {
  selectTransactionData,
  selectTransactionHistoryTab,
  setTransactionData,
} from "../../pages/ReportPage/ReportsSlice";
import { useDispatch, useSelector } from "react-redux";
const columns = [
  {
    field: "status",
    headerName: "TYPE",
    flex: 0.5,
    renderCell: (params) => {
      return (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            height: "100%",
            justifyContent: "flex-start",

            // bgcolor:"red",
          }}
        >
          <Box
            sx={{
              height: "2rem",
              width: "2rem",

              bgcolor:
                params.value === "Increased"
                  ? "rgba(34, 179, 120, 0.2)"
                  : "rgba(255, 0, 0,.2)",
              borderRadius: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {params.value === "Increased" ? (
              <CallReceivedOutlinedIcon
                sx={{
                  fontSize: "1rem",
                  color: "green",
                }}
              />
            ) : (
              <CallMadeOutlinedIcon
                sx={{
                  fontSize: "1rem",
                  color: "red",
                }}
              />
            )}
          </Box>
        </Box>
      );
    },
    align: "left",
    headerAlign: "left",
  },
  {
    field: "createdAt",
    headerName: "DATE",
    flex: 1,
    align: "left",
    headerAlign: "left",
    renderCell: (params) => (
      <span style={{ fontWeight: 500 }}>{params.value}</span>
    ),
  },
  {
    field: "bill_no",
    headerName: "BILL NO",
    flex: 1,
    align: "left",
    headerAlign: "left",
  },
  {
    field: "customer",
    headerName: "CUSTOMER",
    flex: 1,
    align: "left",
    headerAlign: "left",
  },

  {
    field: "method",
    headerName: "METHOD",
    flex: 1,
    align: "left",
    headerAlign: "left",
  },
  {
    field: "handler",
    headerName: "HANDLER",
    flex: 1,
    align: "left",
    headerAlign: "left",
  },
  {
    field: "reason",
    headerName: "REASON",
    flex: 1,
    align: "left",
    headerAlign: "left",
  },

  {
    field: "amount",
    headerName: "Amount",
    flex: 1,
    align: "left",
    headerAlign: "left",
    renderCell: (params) => {
      const isNegative = params?.value.startsWith("-");
      const color = isNegative ? "#f44336" : "green";
      return <span style={{ color: color }}>{params.value}</span>;
    },
  },
];

const columnsSalary = [
  {
    field: "status",
    headerName: "TYPE",
    flex: 0.5,
    renderCell: (params) => {
      return (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            height: "100%",
            justifyContent: "flex-start",

            // bgcolor:"red",
          }}
        >
          <Box
            sx={{
              height: "2rem",
              width: "2rem",

              bgcolor:
                params.value === "Increased"
                  ? "rgba(34, 179, 120, 0.2)"
                  : "rgba(255, 0, 0,.2)",
              borderRadius: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {params.value === "Increased" ? (
              <CallReceivedOutlinedIcon
                sx={{
                  fontSize: "1rem",
                  color: "green",
                }}
              />
            ) : (
              <CallMadeOutlinedIcon
                sx={{
                  fontSize: "1rem",
                  color: "red",
                }}
              />
            )}
          </Box>
        </Box>
      );
    },
    align: "left",
    headerAlign: "left",
  },
  {
    field: "createdAt",
    headerName: "DATE",
    flex: 1,
    align: "left",
    headerAlign: "left",
    renderCell: (params) => (
      <span style={{ fontWeight: 500 }}>{params.value}</span>
    ),
  },

  {
    field: "employee",
    headerName: "EMPLOYEE",
    flex: 1,
    align: "left",
    headerAlign: "left",
  },

  {
    field: "method",
    headerName: "METHOD",
    flex: 1,
    align: "left",
    headerAlign: "left",
  },
  {
    field: "handler",
    headerName: "HANDLER",
    flex: 1,
    align: "left",
    headerAlign: "left",
  },
  {
    field: "reason",
    headerName: "REASON",
    flex: 1,
    align: "left",
    headerAlign: "left",
  },

  {
    field: "amount",
    headerName: "Amount",
    flex: 1,
    align: "left",
    headerAlign: "left",
    renderCell: (params) => {
      const isNegative = params?.value.startsWith("-");
      const color = isNegative ? "#f44336" : "green";
      return <span style={{ color: color }}>{params.value}</span>;
    },
  },
];
const TransactionList = ({}: any) => {
  const dispatch = useDispatch();
  const transactionData = useSelector(selectTransactionData);
  const transactionHistoryTab = useSelector(selectTransactionHistoryTab);
  const getLastTenTransaction = async () => {
    //@ts-ignore
    let response: any = await window.electronAPI.getLast10TransactionHistory();
    console.log("getLastTenTransaction", response.data);
    dispatch(setTransactionData(response.data));
  };
  useEffect(() => {
    getLastTenTransaction();
  }, []);

  return (
    <Box
      sx={{
        borderRadius: 1,
        height: "calc(100vh - 20rem)",
        mt: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <DataGrid
        rows={
          transactionData.length === 0
            ? []
            : transactionHistoryTab === 1
            ? transactionData
                .filter((data) => data.reason === "Salary")
                .map((item, index) => ({ ...item, id: index })) // Add unique id
            : transactionData
                .filter((data) => data.reason !== "Salary")
                .map((item, index) => ({ ...item, id: index })) // Add unique id
        }
        getRowId={(row) => row._id || row.id} // Use _id if exists, otherwise fallback to id
        columns={transactionHistoryTab === 0 ? columns : columnsSalary}
        disableColumnMenu
        hideFooter
        disableSelectionOnClick
        disableColumnFilter
        disableColumnSelector
        sx={{
          "& .MuiDataGrid-scrollbarFiller": {
            borderBottom: "none",
          },

          "& .MuiDataGrid-row--borderBottom": {
            borderBottom: "none !important",
          },
          border: "none !important",
          "& .MuiDataGrid-columnSeparator": {
            display: "none",
          },
          "& .MuiDataGrid-columnHeader": {
            maxHeight: "50px",
            backgroundColor: "white !important",
            color: "rgba(0,0,0,.4)",
            border: "none",
          },
          "& .MuiDataGrid-row": {
            border: "none !important",
            borderBottom: "none !important",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none !important",
          },
          "& .MuiDataGrid-columnHeaders": {
            border: "none",
            backgroundColor: "white",
            fontSize: ".8rem",
            fontWeight: 800,
            borderBottom: "none",
          },
          "& .MuiDataGrid-cell": {
            border: "none",
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.02)",
          },
        }}
      />
    </Box>
  );
};

export default TransactionList;
