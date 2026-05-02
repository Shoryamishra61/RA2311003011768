const LOG_API_URL = "http://20.207.122.201/evaluation-service/logs";
const BEARER_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzbTcwNzhAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwMDAwMiwiaWF0IjoxNzc3Njk5MTAyLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiOWJhMzIwMzUtNDJmMC00NDVhLTlkNTItYmZkYmM1YTdjY2JmIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoic2hvcnlha3VtYXIgbWlzaHJhIiwic3ViIjoiMjljYzgyZWMtZTc1OS00NzYyLWI2YzItYzMyNzg3MTBhNTJjIn0sImVtYWlsIjoic203MDc4QHNybWlzdC5lZHUuaW4iLCJuYW1lIjoic2hvcnlha3VtYXIgbWlzaHJhIiwicm9sbE5vIjoicmEyMzExMDAzMDExNzY4IiwiYWNjZXNzQ29kZSI6IlFrYnB4SCIsImNsaWVudElEIjoiMjljYzgyZWMtZTc1OS00NzYyLWI2YzItYzMyNzg3MTBhNTJjIiwiY2xpZW50U2VjcmV0IjoiVHlQQUdqTXBSd0VWVFZxWCJ9.MBIZZ6-Q7GFTt5m_VHyh2z-5Azae5yFZDjZcVEd3L74";

export async function Log(
  stack: string,
  level: string,
  pkg: string,
  message: string
): Promise<void> {
  try {
    await fetch(LOG_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
      body: JSON.stringify({ stack, level, package: pkg, message }),
    });
  } catch (error) {
    // silently fail in frontend to not break UX
  }
}
