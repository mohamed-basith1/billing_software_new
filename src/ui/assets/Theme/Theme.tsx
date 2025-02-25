import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: `"Poppins", "Helvetica", "Arial", sans-serif`,
    fontSize: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: "#1E1E2D", // Default background color
          color: "#fff", // Default text color
          height: "3rem",
          boxShadow: "none",
          border: ".1px solid lightgrey",
          borderRadius: "8px",
          "&:hover": {
            backgroundColor: "#1E1E2D", // Darker shade on hover
            boxShadow: "none",
          },
          "&:focus, &:focus-visible, &.Mui-focusVisible": {
            outline: "none", // Removes focus outline
            boxShadow: "none", // Removes any default Material-UI focus styles
          },
        },
      },
      variants: [
        {
          props: { variant: "outlined" },
          style: {
            backgroundColor: "transparent", // No fill for outlined buttons
            color: "#1E1E2D", // Text color
            boxShadow: "none",
            border: ".1px solid  #1E1E2D",
            borderRadius: "8px",
            "&:hover": {
              backgroundColor: "transparent", // Light background on hover
              border: ".1px solid #1E1E2D",
            },
            "&:focus, &:focus-visible, &.Mui-focusVisible": {
              outline: "none", // Removes focus outline
              boxShadow: "none", // Removes any default Material-UI focus styles
            },
          },
        },
      ],
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-notchedOutline": {
            // borderColor: "red", // Default border color
            border: ".1px solid lightgrey",
            borderRadius: "8px",
          },

          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            border: "1px solid #1E1E2D",
            borderRadius: "8px",
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          "&.Mui-focused": {
            color: "#1E1E2D",
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: "#1E1E2D",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            color: "#1E1E2D",
          },
          "&:focus, &:focus-visible": {
            outline: "none",
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          "&:hover": {
            "& .MuiListItemText-primary": {
              color: "rgba(34, 179, 120)",
            },
            "& .MuiListItemIcon-root": {
              color: "rgba(34, 179, 120)",
            },
          },
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          borderRadius: "8px", // Set rounded corners
          overflow: "hidden", // Prevents content overflow
          border: ".1px solid lightgrey",
        },
        columnHeaders: {
          backgroundColor: "#1E1E2D", // Header background color
          color: "white",
        },
      },
    },
  },
});

export default theme;
