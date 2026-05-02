const API_BASE = "http://20.207.122.201/evaluation-service";
const BEARER_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzbTcwNzhAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwMDAwMiwiaWF0IjoxNzc3Njk5MTAyLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiOWJhMzIwMzUtNDJmMC00NDVhLTlkNTItYmZkYmM1YTdjY2JmIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoic2hvcnlha3VtYXIgbWlzaHJhIiwic3ViIjoiMjljYzgyZWMtZTc1OS00NzYyLWI2YzItYzMyNzg3MTBhNTJjIn0sImVtYWlsIjoic203MDc4QHNybWlzdC5lZHUuaW4iLCJuYW1lIjoic2hvcnlha3VtYXIgbWlzaHJhIiwicm9sbE5vIjoicmEyMzExMDAzMDExNzY4IiwiYWNjZXNzQ29kZSI6IlFrYnB4SCIsImNsaWVudElEIjoiMjljYzgyZWMtZTc1OS00NzYyLWI2YzItYzMyNzg3MTBhNTJjIiwiY2xpZW50U2VjcmV0IjoiVHlQQUdqTXBSd0VWVFZxWCJ9.MBIZZ6-Q7GFTt5m_VHyh2z-5Azae5yFZDjZcVEd3L74";

export interface Notification {
  ID: string;
  Type: "Placement" | "Result" | "Event";
  Message: string;
  Timestamp: string;
}

interface NotificationsResponse {
  notifications: Notification[];
}

export async function fetchNotifications(params?: {
  limit?: number;
  page?: number;
  notification_type?: string;
}): Promise<Notification[]> {
  const url = new URL(`${API_BASE}/notifications`);
  if (params?.limit) url.searchParams.set("limit", String(params.limit));
  if (params?.page) url.searchParams.set("page", String(params.page));
  if (params?.notification_type) url.searchParams.set("notification_type", params.notification_type);

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${BEARER_TOKEN}` },
  });

  if (!res.ok) throw new Error(`API error: ${res.status}`);

  const data: NotificationsResponse = await res.json();
  return data.notifications || [];
}

// priority sort helper
const WEIGHT: Record<string, number> = { Placement: 3, Result: 2, Event: 1 };

export function sortByPriority(notifications: Notification[]): Notification[] {
  return [...notifications].sort((a, b) => {
    const wDiff = (WEIGHT[b.Type] || 0) - (WEIGHT[a.Type] || 0);
    if (wDiff !== 0) return wDiff;
    return new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime();
  });
}
