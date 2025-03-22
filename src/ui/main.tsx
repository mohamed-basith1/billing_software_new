import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./store/Store.ts";
import { ThemeProvider } from "@mui/material";
import theme from "./assets/Theme/Theme.tsx";

createRoot(document.getElementById("root")!).render(
  
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Provider>
  
);
