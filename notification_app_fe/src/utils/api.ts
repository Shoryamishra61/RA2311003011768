const BASE = "http://20.207.122.201/evaluation-service"
const TOKEN = process.env.REACT_APP_ACCESS_TOKEN || ""

export interface Notif {
  ID: string
  Type: "Placement" | "Result" | "Event"
  Message: string
  Timestamp: string
}

export async function getNotifs(params?: { limit?: number; page?: number; notification_type?: string }) {
  let link = new URL(`${BASE}/notifications`)
  if (params?.limit) link.searchParams.set("limit", String(params.limit))
  if (params?.page) link.searchParams.set("page", String(params.page))
  if (params?.notification_type) link.searchParams.set("notification_type", params.notification_type)

  let res = await fetch(link.toString(), {
    headers: TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {},
  })
  if (!res.ok) throw new Error(`err ${res.status}`)
  let data = await res.json()
  return (data.notifications || []) as Notif[]
}

const W: Record<string, number> = { Placement: 3, Result: 2, Event: 1 }

export function sortPriority(arr: Notif[]) {
  return [...arr].sort((a, b) => {
    let d = (W[b.Type] || 0) - (W[a.Type] || 0)
    if (d !== 0) return d
    return new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime()
  })
}

export type Notification = Notif
export const fetchNotifications = getNotifs
export const sortByPriority = sortPriority
