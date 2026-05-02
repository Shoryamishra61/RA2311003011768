import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material"
import AllPage from "./pages/AllNotifications"
import PriorityPage from "./pages/PriorityNotifications"
import { Log } from "./utils/log"

const theme = createTheme({
  palette: {
    primary: { main: "#1a237e" },
    secondary: { main: "#7b1fa2" },
    background: { default: "#f5f5f5" },
  },
  typography: { fontFamily: "'Inter', sans-serif" },
  shape: { borderRadius: 8 },
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
