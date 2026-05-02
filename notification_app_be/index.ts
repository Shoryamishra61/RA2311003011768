import express from 'express'
import cors from 'cors'
import { Log } from '../logging_middleware/index'

const app = express()
app.use(cors())
app.use(express.json())

const API = "http://20.207.122.201/evaluation-service/notifications"
const TOKEN = process.env.ACCESS_TOKEN || ""

function headers(): Record<string, string> {
  return TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}
}

function getWeight(type: string) {
  if (type === 'Placement') return 3
  if (type === 'Result') return 2
  if (type === 'Event') return 1
  return 0
}

app.get('/api/priority', async (req, res) => {
  let n = parseInt(req.query.limit as string) || 10
  Log("backend", "info", "handler", "get priority")

  try {
    let resp = await fetch(API, { headers: headers() })
    let data = await resp.json()
    let notifs = data.notifications || []

    notifs.sort((a: any, b: any) => {
      let diff = getWeight(b.Type) - getWeight(a.Type)
      if (diff !== 0) return diff
      return new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime()
    })

    let top = notifs.slice(0, n)
    Log("backend", "info", "service", "sorted ok")
    res.json({ notifications: top })
  } catch (err: any) {
    Log("backend", "error", "handler", "priority failed")
    res.status(500).json({ error: "failed" })
  }
})

app.get('/api/notifications', async (req, res) => {
  Log("backend", "info", "handler", "get notifs")

  try {
    let params = new URLSearchParams(req.query as any).toString()
    let link = params ? `${API}?${params}` : API

    let resp = await fetch(link, { headers: headers() })
    let data = await resp.json()
    Log("backend", "info", "service", "fetched ok")
    res.json(data)
  } catch (err: any) {
    Log("backend", "error", "handler", "notifs failed")
    res.status(500).json({ error: "failed" })
  }
})

app.listen(3001, () => {
  Log("backend", "info", "config", "server started")
})
