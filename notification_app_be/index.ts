import express from 'express';
import cors from 'cors';
import { Log } from '../logging_middleware/index';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const EVAL_API_URL = "http://20.207.122.201/evaluation-service/notifications";
const BEARER_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzbTcwNzhAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwMDAwMiwiaWF0IjoxNzc3Njk5MTAyLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiOWJhMzIwMzUtNDJmMC00NDVhLTlkNTItYmZkYmM1YTdjY2JmIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoic2hvcnlha3VtYXIgbWlzaHJhIiwic3ViIjoiMjljYzgyZWMtZTc1OS00NzYyLWI2YzItYzMyNzg3MTBhNTJjIn0sImVtYWlsIjoic203MDc4QHNybWlzdC5lZHUuaW4iLCJuYW1lIjoic2hvcnlha3VtYXIgbWlzaHJhIiwicm9sbE5vIjoicmEyMzExMDAzMDExNzY4IiwiYWNjZXNzQ29kZSI6IlFrYnB4SCIsImNsaWVudElEIjoiMjljYzgyZWMtZTc1OS00NzYyLWI2YzItYzMyNzg3MTBhNTJjIiwiY2xpZW50U2VjcmV0IjoiVHlQQUdqTXBSd0VWVFZxWCJ9.MBIZZ6-Q7GFTt5m_VHyh2z-5Azae5yFZDjZcVEd3L74";

interface Notification {
    ID: string;
    Type: string;
    Message: string;
    Timestamp: string;
}

// priority weight: placement > result > event
const getWeight = (type: string): number => {
    switch (type.toLowerCase()) {
        case 'placement': return 3;
        case 'result': return 2;
        case 'event': return 1;
        default: return 0;
    }
};

// GET /api/priority?limit=10
app.get('/api/priority', async (req, res) => {
    const limit = parseInt(req.query.limit as string) || 10;
    Log("backend", "info", "handler", `get priority limit=${limit}`);

    try {
        const response = await fetch(EVAL_API_URL, {
            headers: { "Authorization": `Bearer ${BEARER_TOKEN}` }
        });

        if (!response.ok) {
            Log("backend", "error", "handler", `upstream err ${response.status}`);
            throw new Error(`upstream ${response.status}`);
        }

        const data = await response.json();
        const notifications: Notification[] = data.notifications || data;

        // sort by weight desc, then timestamp desc
        notifications.sort((a, b) => {
            const wDiff = getWeight(b.Type) - getWeight(a.Type);
            if (wDiff !== 0) return wDiff;
            return new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime();
        });

        const topN = notifications.slice(0, limit);

        Log("backend", "info", "service", `returned top ${limit} sorted`);
        res.json({ notifications: topN });
    } catch (error: any) {
        Log("backend", "error", "handler", `priority fail: ${error.message}`);
        res.status(500).json({ error: "failed to fetch" });
    }
});

// GET /api/notifications?limit=&page=&notification_type=
app.get('/api/notifications', async (req, res) => {
    Log("backend", "info", "handler", "get notifications");

    try {
        const queryParams = new URLSearchParams(req.query as Record<string, string>).toString();
        const url = queryParams ? `${EVAL_API_URL}?${queryParams}` : EVAL_API_URL;

        const response = await fetch(url, {
            headers: { "Authorization": `Bearer ${BEARER_TOKEN}` }
        });

        if (!response.ok) {
            Log("backend", "error", "handler", `upstream err ${response.status}`);
            throw new Error(`upstream ${response.status}`);
        }

        const data = await response.json();
        Log("backend", "info", "service", "notifications fetched ok");
        res.json(data);
    } catch (error: any) {
        Log("backend", "error", "handler", `notif fail: ${error.message}`);
        res.status(500).json({ error: "failed to fetch" });
    }
});

app.listen(PORT, () => {
    Log("backend", "info", "config", `server on port ${PORT}`);
    console.log(`server running on http://localhost:${PORT}`);
});
