import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import AllNotifications from "./pages/AllNotifications";
import PriorityNotifications from "./pages/PriorityNotifications";
import { Log } from "./utils/log";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1a237e" },
    secondary: { main: "#7b1fa2" },
    warning: { main: "#e65100" },
    background: { default: "#f5f5f5" },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', sans-serif",
  },
  shape: { borderRadius: 10 },
});

function App() {
  React.useEffect(() => {
    Log("frontend", "info", "config", "app initialized");
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AllNotifications />} />
          <Route path="/priority" element={<PriorityNotifications />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
