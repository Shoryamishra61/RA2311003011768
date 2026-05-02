const TOKEN = process.env.REACT_APP_ACCESS_TOKEN || ""

export async function Log(stack: string, level: string, pkg: string, message: string) {
  if (!TOKEN) return

  try {
    await fetch("http://20.207.122.201/evaluation-service/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({ stack, level, package: pkg, message }),
    })
  } catch (e) {}
}
