const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiRequest(endpoint, method = "GET", body) {
  const headers = {};

  const options = {
    method,
    headers,
    credentials: "include",
  };

  if (body instanceof FormData) {
    options.body = body;
  } else if (body) {
    headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }

  const res = await fetch(`${API_URL}/${endpoint}`, options);
  const data = await res.json();

  if (!res.ok) throw new Error(data.message || "Request failed");

  return data;
}

