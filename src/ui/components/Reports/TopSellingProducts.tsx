import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents"; // Crown icon

const columns = [
  {
    field: "rank",
    headerName: "NO",
    flex: 1,
    renderCell: (params) => {
      let iconColor = "";
      if (params.value === 1) iconColor = "#FFD700"; // Gold for 1st
      else if (params.value === 2) iconColor = "#C0C0C0"; // Silver for 2nd
      else if (params.value === 3) iconColor = "#CD7F32"; // Bronze for 3rd

      return (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            height: "100%",
            justifyContent: "center",
          }}
        >
          {params.value <= 3 ? (
            <Box
              sx={{
                position: "relative",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "1.6rem",
                height: "1.6rem",
              }}
            >
              <EmojiEventsIcon
                sx={{
                  color: iconColor,
                  fontSize: "1.6rem",
                }}
              />
              <Typography
                sx={{
                  position: "absolute",
                  fontSize: "0.75rem",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                {params.value}
              </Typography>
            </Box>
          ) : (
            <Typography variant="body2">{params.value}</Typography>
          )}
        </Box>
      );
    },
  },
  {
    field: "name",
    headerName: "PRODUCT",
    flex: 2,
    renderCell: (params) => (
      <span style={{ fontWeight: 500 }}>{params.value}</span>
    ),
  },
  {
    field: "sales",
    headerName: "SOLD",
    flex: 1,
    align: "right",
    headerAlign: "right",
  },
  {
    field: "revenue",
    headerName: "REVENUE",
    flex: 2,
    align: "right",
    headerAlign: "right",
    valueFormatter: (params) => {
      return `₹${params}`;
    },
  },
];

const TopSellingProducts = ({ topsellingproduct }: any) => {
  return (
    <DataGrid
      rows={topsellingproduct}
      columns={columns}
      disableColumnMenu
      hideFooter
      disableSelectionOnClick
      disableColumnFilter
      disableColumnSelector
      sx={{
        // mt: 2,
        // border: "none",
        mr:.1,
        "& .MuiDataGrid-columnSeparator": {
          display: "none", // Removes the column separators
        },

        "& .MuiDataGrid-virtualScroller": {
          overflowX: "hidden", // Optional: hides horizontal scrollbar if not needed
        },

        "& .MuiDataGrid-columnHeader": {
          maxHeight: "50px",
          backgroundColor: "white !important",
          color: "black",
          fontWeight: 600,
          border: "none",
        },

        "& .MuiDataGrid-columnHeaders": {
          border: "none", // Removes header bottom border
          backgroundColor: "white",
          maxHeight: "50px",
          fontSize: ".8rem",
          fontWeight: 800,
        },

        "& .MuiDataGrid-cell": {
          border: "none", // Removes cell borders
        },
        "& .MuiDataGrid-row": {
          border: "none", // Removes row borders
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.02)", // Keep subtle hover effect
          },
        },
        "& .MuiDataGrid-virtualScroller": {
          overflowX: "hidden", // Cleaner scrollbar
        },
      }}
    />
  );
};

export default TopSellingProducts;
