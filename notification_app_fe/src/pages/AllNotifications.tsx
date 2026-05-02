import React, { useEffect, useState, useCallback } from "react"
import {
  Container, Typography, Card, CardContent, Chip, Box,
  CircularProgress, Alert, Pagination, FormControl,
  InputLabel, Select, MenuItem, SelectChangeEvent,
  AppBar, Toolbar, Badge, IconButton
} from "@mui/material"
import NotificationsIcon from "@mui/icons-material/Notifications"
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

const colors: Record<string, "primary" | "secondary" | "success"> = {
  Placement: "primary",
  Result: "secondary",
  Event: "success",
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
      <AppBar position="static" sx={{ mb: 3, background: "linear-gradient(135deg, #1a237e, #0d47a1)" }}>
        <Toolbar>
          <NotificationsIcon sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Campus Notifications
          </Typography>
          <Chip label="All" color="primary" sx={{ mr: 1, color: "#fff", fontWeight: 600 }} />
          <Chip label="Priority" variant="outlined"
            sx={{ color: "#fff", borderColor: "#fff", cursor: "pointer" }}
            onClick={() => nav("/priority")} />
          {newCount > 0 && (
            <Badge badgeContent={newCount} color="error" sx={{ ml: 2 }}>
              <IconButton color="inherit" size="small"><NotificationsIcon /></IconButton>
            </Badge>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="md">
        <Box sx={{ mb: 3 }}>
          <FormControl size="small" sx={{ minWidth: 180 }}>
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

        {loading && <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}><CircularProgress /></Box>}
        {err && <Alert severity="error" sx={{ mb: 2 }}>{err}</Alert>}

        {!loading && notifs.map(n => {
          let isNew = !seen.has(n.ID)
          return (
            <Card key={n.ID} sx={{
              mb: 2,
              borderLeft: isNew ? "4px solid #f44336" : "4px solid transparent",
              background: isNew ? "linear-gradient(90deg, #fff3e0, #fff 20%)" : "#fff",
              transition: "all 0.3s",
              "&:hover": { transform: "translateY(-2px)", boxShadow: 4 },
            }}>
              <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                    <Chip label={n.Type} size="small" color={colors[n.Type] || "default"} />
                    {isNew && <Chip label="NEW" size="small" color="error" variant="outlined" />}
                  </Box>
                  <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.5 }}>{n.Message}</Typography>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: "nowrap", ml: 2 }}>
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
