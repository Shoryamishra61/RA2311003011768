import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material"
import AllPage from "./pages/AllNotifications"
import PriorityPage from "./pages/PriorityNotifications"
import { Log } from "./utils/log"

const theme = createTheme({
  palette: {
    primary: { main: "#111827" },
    secondary: { main: "#374151" },
    background: { default: "#f7f7f8" },
    text: { primary: "#111827", secondary: "#4b5563" },
  },
  typography: {
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    h6: { fontWeight: 650, letterSpacing: 0 },
    body1: { letterSpacing: 0 },
    body2: { letterSpacing: 0 },
  },
  shape: { borderRadius: 6 },
})

function App() {
  React.useEffect(() => {
    Log("frontend", "info", "config", "app loaded")
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AllPage />} />
          <Route path="/priority" element={<PriorityPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
