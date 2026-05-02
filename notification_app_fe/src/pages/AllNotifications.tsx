import React, { useEffect, useState, useCallback } from "react"
import {
  Container, Typography, Card, CardContent, Chip, Box,
  CircularProgress, Alert, Pagination, FormControl,
  InputLabel, Select, MenuItem, SelectChangeEvent,
  AppBar, Toolbar
} from "@mui/material"
import { useNavigate } from "react-router-dom"
import { getNotifs, Notif } from "../utils/api"
import { Log } from "../utils/log"

const SEEN_KEY = "seen_notifs"

function getSeen(): Set<string> {
  let raw = localStorage.getItem(SEEN_KEY)
  return raw ? new Set(JSON.parse(raw)) : new Set()
}

function markSeen(ids: string[]) {
  let seen = getSeen()
  ids.forEach(id => seen.add(id))
  localStorage.setItem(SEEN_KEY, JSON.stringify(Array.from(seen)))
}

export default function AllPage() {
  let [notifs, setNotifs] = useState<Notif[]>([])
  let [loading, setLoading] = useState(true)
  let [err, setErr] = useState("")
  let [pg, setPg] = useState(1)
  let [filter, setFilter] = useState("")
  let [seen, setSeen] = useState<Set<string>>(getSeen())
  let nav = useNavigate()

  let load = useCallback(async () => {
    setLoading(true)
    setErr("")
    Log("frontend", "info", "api", "fetching")
    try {
      let p: any = { page: pg, limit: 10 }
      if (filter) p.notification_type = filter
      let data = await getNotifs(p)
      setNotifs(data)
      markSeen(data.map(n => n.ID))
      setSeen(getSeen())
      Log("frontend", "info", "component", "loaded")
    } catch (e: any) {
      setErr(e.message)
      Log("frontend", "error", "api", "fetch failed")
    } finally {
      setLoading(false)
    }
  }, [pg, filter])

  useEffect(() => { load() }, [load])
  useEffect(() => { Log("frontend", "info", "page", "all page") }, [])

  let newCount = notifs.filter(n => !seen.has(n.ID)).length

  return (
    <>
      <AppBar position="static" elevation={0} sx={{ mb: 4, background: "#111827", borderBottom: "1px solid #1f2937" }}>
        <Toolbar sx={{ minHeight: 72, px: { xs: 2, sm: 3 } }}>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 650 }}>
            Campus Notifications
          </Typography>
          <Chip label="All" sx={{ mr: 1, color: "#111827", bgcolor: "#f9fafb", fontWeight: 600, borderRadius: "6px" }} />
          <Chip label="Priority" variant="outlined"
            sx={{ color: "#f9fafb", borderColor: "#9ca3af", cursor: "pointer", borderRadius: "6px", "&:hover": { bgcolor: "#1f2937" } }}
            onClick={() => nav("/priority")} />
          {newCount > 0 && (
            <Chip label={`${newCount} New`} sx={{ ml: 1, color: "#111827", bgcolor: "#e5e7eb", fontWeight: 600, borderRadius: "6px" }} />
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ pb: 4 }}>
        <Box sx={{ mb: 3, display: "flex", alignItems: "center" }}>
          <FormControl size="small" sx={{
            minWidth: 220,
            bgcolor: "#fff",
            "& .MuiOutlinedInput-root": {
              borderRadius: "6px",
              "& fieldset": { borderColor: "#d1d5db" },
              "&:hover fieldset": { borderColor: "#9ca3af" },
              "&.Mui-focused fieldset": { borderColor: "#374151", borderWidth: 1 },
            },
          }}>
            <InputLabel>Filter by Type</InputLabel>
            <Select value={filter} label="Filter by Type"
              onChange={(e: SelectChangeEvent) => {
                setFilter(e.target.value)
                setPg(1)
                Log("frontend", "info", "component", "filter changed")
              }}>
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Placement">Placement</MenuItem>
              <MenuItem value="Result">Result</MenuItem>
              <MenuItem value="Event">Event</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {loading && <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}><CircularProgress sx={{ color: "#374151" }} /></Box>}
        {err && <Alert severity="error" sx={{ mb: 2 }}>{err}</Alert>}

        {!loading && notifs.map(n => {
          let isNew = !seen.has(n.ID)
          return (
            <Card key={n.ID} sx={{
              mb: 2,
              border: "1px solid #e5e7eb",
              bgcolor: "#fff",
              boxShadow: "0 1px 2px rgba(17, 24, 39, 0.04)",
            }}>
              <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, px: 3, py: 2.5, "&:last-child": { pb: 2.5 } }}>
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                    <Chip label={n.Type} size="small" sx={{ bgcolor: "#f3f4f6", color: "#374151", border: "1px solid #d1d5db", fontWeight: 600, borderRadius: "5px" }} />
                    {isNew && <Chip label="New" size="small" variant="outlined" sx={{ borderColor: "#9ca3af", color: "#374151", borderRadius: "5px" }} />}
                  </Box>
                  <Typography variant="body1" sx={{ fontWeight: 650, mt: 0.5 }}>{n.Message}</Typography>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: "nowrap", ml: 2, fontSize: 13 }}>
                  {new Date(n.Timestamp).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          )
        })}

        <Box sx={{ display: "flex", justifyContent: "center", mt: 3, mb: 4 }}>
          <Pagination count={10} page={pg} color="primary"
            onChange={(_, v) => { setPg(v); Log("frontend", "info", "component", "page change") }} />
        </Box>
      </Container>
    </>
  )
}
