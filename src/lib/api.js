const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiRequest(endpoint, method = "GET", body) {
  const headers = { "Content-Type": "application/json" };

  const options = {
    method,
    headers,
    credentials: "include",
  };

  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${API_URL}/${endpoint}`, options);
  const data = await res.json();

  if (!res.ok) throw new Error(data.message || "Request failed");

  return data;
}

