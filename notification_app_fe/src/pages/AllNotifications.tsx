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
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  AppBar,
  Toolbar,
  IconButton,
  Badge,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useNavigate } from "react-router-dom";
import { fetchNotifications, Notification } from "../utils/api";
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

export default function AllNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [viewed, setViewed] = useState<Set<string>>(getViewed());
  const navigate = useNavigate();

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    Log("frontend", "info", "api", `fetch page=${page} filter=${filter}`);
    try {
      const params: any = { page, limit: 10 };
      if (filter) params.notification_type = filter;
      const data = await fetchNotifications(params);
      setNotifications(data);

      // mark as viewed
      const ids = data.map((n) => n.ID);
      markViewed(ids);
      setViewed(getViewed());

      Log("frontend", "info", "component", `loaded ${data.length} notifs`);
    } catch (err: any) {
      setError(err.message);
      Log("frontend", "error", "api", `fetch fail: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [page, filter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    Log("frontend", "info", "page", "all notifications mounted");
  }, []);

  const handleFilterChange = (e: SelectChangeEvent) => {
    setFilter(e.target.value);
    setPage(1);
    Log("frontend", "info", "component", `filter changed: ${e.target.value}`);
  };

  const newCount = notifications.filter((n) => !viewed.has(n.ID)).length;

  return (
    <>
      <AppBar position="static" sx={{ mb: 3, background: "linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)" }}>
        <Toolbar>
          <NotificationsIcon sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Campus Notifications
          </Typography>
          <Chip
            label="All"
            variant="filled"
            sx={{ mr: 1, color: "#fff", borderColor: "#fff", fontWeight: 600 }}
            color="primary"
          />
          <Chip
            label="Priority"
            variant="outlined"
            sx={{ color: "#fff", borderColor: "#fff", cursor: "pointer" }}
            onClick={() => navigate("/priority")}
          />
          {newCount > 0 && (
            <Badge badgeContent={newCount} color="error" sx={{ ml: 2 }}>
              <IconButton color="inherit" size="small">
                <NotificationsIcon />
              </IconButton>
            </Badge>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="md">
        <Box sx={{ mb: 3, display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
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
            <CircularProgress />
          </Box>
        )}

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {!loading &&
          notifications.map((n) => {
            const isNew = !viewed.has(n.ID);
            return (
              <Card
                key={n.ID}
                sx={{
                  mb: 2,
                  borderLeft: isNew ? "4px solid #f44336" : "4px solid transparent",
                  background: isNew ? "linear-gradient(90deg, #fff3e0 0%, #fff 20%)" : "#fff",
                  transition: "all 0.3s ease",
                  "&:hover": { transform: "translateY(-2px)", boxShadow: 4 },
                }}
              >
                <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                      <Chip label={n.Type} size="small" color={TYPE_COLORS[n.Type] || "default"} />
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

        <Box sx={{ display: "flex", justifyContent: "center", mt: 3, mb: 4 }}>
          <Pagination
            count={10}
            page={page}
            onChange={(_, v) => {
              setPage(v);
              Log("frontend", "info", "component", `page changed to ${v}`);
            }}
            color="primary"
          />
        </Box>
      </Container>
    </>
  );
}
