import React, { useEffect, useState, useCallback } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  Box,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  AppBar,
  Toolbar,
  Slider,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import { fetchNotifications, Notification, sortByPriority } from "../utils/api";
import { Log } from "../utils/log";

const VIEWED_KEY = "viewed_notifications";

function getViewed(): Set<string> {
  const raw = localStorage.getItem(VIEWED_KEY);
  return raw ? new Set(JSON.parse(raw)) : new Set();
}

function markViewed(ids: string[]) {
  const viewed = getViewed();
  ids.forEach((id) => viewed.add(id));
  localStorage.setItem(VIEWED_KEY, JSON.stringify(Array.from(viewed)));
}

const WEIGHT_LABELS: Record<string, string> = {
  Placement: "High",
  Result: "Medium",
  Event: "Low",
};

export default function PriorityNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [topN, setTopN] = useState(10);
  const [filter, setFilter] = useState("");
  const [viewed, setViewed] = useState<Set<string>>(getViewed());
  const navigate = useNavigate();

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    Log("frontend", "info", "api", `fetch priority n=${topN}`);
    try {
      const params: any = {};
      if (filter) params.notification_type = filter;
      const data = await fetchNotifications(params);
      const sorted = sortByPriority(data);
      const sliced = sorted.slice(0, topN);
      setNotifications(sliced);

      const ids = sliced.map((n) => n.ID);
      markViewed(ids);
      setViewed(getViewed());

      Log("frontend", "info", "component", `priority loaded ${sliced.length}`);
    } catch (err: any) {
      setError(err.message);
      Log("frontend", "error", "api", `priority fail: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [topN, filter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    Log("frontend", "info", "page", "priority page mounted");
  }, []);

  const handleFilterChange = (e: SelectChangeEvent) => {
    setFilter(e.target.value);
    Log("frontend", "info", "component", `prio filter: ${e.target.value}`);
  };

  return (
    <>
      <AppBar position="static" elevation={0} sx={{ mb: 4, background: "#111827", borderBottom: "1px solid #1f2937" }}>
        <Toolbar sx={{ minHeight: 72, px: { xs: 2, sm: 3 } }}>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Priority Inbox
          </Typography>
          <Chip
            label="All"
            variant="outlined"
            sx={{ mr: 1, color: "#f9fafb", borderColor: "#9ca3af", cursor: "pointer", borderRadius: "6px", "&:hover": { bgcolor: "#1f2937" } }}
            onClick={() => navigate("/")}
          />
          <Chip
            label="Priority"
            variant="filled"
            sx={{ color: "#111827", bgcolor: "#f9fafb", fontWeight: 600, borderRadius: "6px" }}
          />
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ pb: 4 }}>
        <Box sx={{ mb: 3, display: "flex", gap: 3, alignItems: "center", flexWrap: "wrap" }}>
          <Box sx={{ minWidth: 200 }}>
            <Typography variant="body2" gutterBottom sx={{ color: "#374151", fontWeight: 500 }}>
              Top N: <strong>{topN}</strong>
            </Typography>
            <Slider
              value={topN}
              min={5}
              max={50}
              step={5}
              onChange={(_, v) => {
                setTopN(v as number);
                Log("frontend", "info", "component", `topN set to ${v}`);
              }}
              valueLabelDisplay="auto"
              sx={{
                color: "#374151",
                "& .MuiSlider-rail": { bgcolor: "#d1d5db" },
                "& .MuiSlider-thumb": { boxShadow: "none" },
              }}
            />
          </Box>
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
            <Select value={filter} label="Filter by Type" onChange={handleFilterChange}>
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Placement">Placement</MenuItem>
              <MenuItem value="Result">Result</MenuItem>
              <MenuItem value="Event">Event</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress sx={{ color: "#374151" }} />
          </Box>
        )}

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {!loading &&
          notifications.map((n, i) => {
            const isNew = !viewed.has(n.ID);
            return (
              <Card
                key={n.ID}
                sx={{
                  mb: 2,
                  border: "1px solid #e5e7eb",
                  bgcolor: "#fff",
                  boxShadow: "0 1px 2px rgba(17, 24, 39, 0.04)",
                }}
              >
                <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, px: 3, py: 2.5, "&:last-child": { pb: 2.5 } }}>
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: "#6b7280", minWidth: 28 }}>
                        #{i + 1}
                      </Typography>
                      <Chip label={n.Type} size="small" sx={{ bgcolor: "#f3f4f6", color: "#374151", border: "1px solid #d1d5db", fontWeight: 600, borderRadius: "5px" }} />
                      <Typography variant="caption" color="text.secondary">
                        {WEIGHT_LABELS[n.Type]}
                      </Typography>
                      {isNew && <Chip label="New" size="small" variant="outlined" sx={{ borderColor: "#9ca3af", color: "#374151", borderRadius: "5px" }} />}
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: 650, mt: 0.5 }}>
                      {n.Message}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: "nowrap", ml: 2, fontSize: 13 }}>
                    {new Date(n.Timestamp).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            );
          })}
      </Container>
    </>
  );
}
