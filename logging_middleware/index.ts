const url = "http://20.207.122.201/evaluation-service/logs"

export async function Log(stack: string, level: string, pkg: string, message: string) {
  const token = process.env.ACCESS_TOKEN
  if (!token) return

  try {
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ stack, level, package: pkg, message }),
    })
  } catch (e) {}
}
