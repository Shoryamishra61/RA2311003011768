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
import StarIcon from "@mui/icons-material/Star";

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

const TYPE_COLORS: Record<string, "primary" | "secondary" | "success"> = {
  Placement: "primary",
  Result: "secondary",
  Event: "success",
};

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
      <AppBar position="static" sx={{ mb: 3, background: "linear-gradient(135deg, #e65100 0%, #ff6d00 100%)" }}>
        <Toolbar>
          <StarIcon sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Priority Inbox
          </Typography>
          <Chip
            label="All"
            variant="outlined"
            sx={{ mr: 1, color: "#fff", borderColor: "#fff", cursor: "pointer" }}
            onClick={() => navigate("/")}
          />
          <Chip
            label="Priority"
            variant="filled"
            sx={{ color: "#fff", fontWeight: 600 }}
            color="warning"
          />
        </Toolbar>
      </AppBar>

      <Container maxWidth="md">
        <Box sx={{ mb: 3, display: "flex", gap: 3, alignItems: "center", flexWrap: "wrap" }}>
          <Box sx={{ minWidth: 200 }}>
            <Typography variant="body2" gutterBottom>
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
              color="warning"
            />
          </Box>
          <FormControl size="small" sx={{ minWidth: 180 }}>
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
            <CircularProgress color="warning" />
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
                  borderLeft: `4px solid ${n.Type === "Placement" ? "#1565c0" : n.Type === "Result" ? "#7b1fa2" : "#2e7d32"}`,
                  background: isNew ? "linear-gradient(90deg, #fff3e0 0%, #fff 20%)" : "#fff",
                  transition: "all 0.3s ease",
                  "&:hover": { transform: "translateY(-2px)", boxShadow: 4 },
                }}
              >
                <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: "#757575" }}>
                        #{i + 1}
                      </Typography>
                      <Chip label={n.Type} size="small" color={TYPE_COLORS[n.Type] || "default"} />
                      <Typography variant="caption" color="text.secondary">
                        {WEIGHT_LABELS[n.Type]}
                      </Typography>
                      {isNew && <Chip label="NEW" size="small" color="error" variant="outlined" />}
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.5 }}>
                      {n.Message}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: "nowrap", ml: 2 }}>
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
