import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: `"Poppins", "Helvetica", "Arial", sans-serif`,
    fontSize: 12,
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#1E1E2D",
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
          backgroundColor: "#1E1E2D", // Active tab underline color
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            color: "#1E1E2D", // Active tab text color
          },
          "&:focus, &:focus-visible": {
            outline: "none", // Removes default focus outline
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          "&:hover": {
            // backgroundColor: "rgba(34, 179, 120)", // Changes background to red on hover
            "& .MuiListItemText-primary": {
              color: "rgba(34, 179, 120)", // Ensures text is visible on red background
            },
            "& .MuiListItemIcon-root": {
              color: "rgba(34, 179, 120)", // Ensures icon is visible on red background
            },
          },
        },
      },
    },
  },
});

export default theme;
