const API_URL = 'http://localhost:3000/api'

export async function apiRequest (endpoint, method = 'GET', body) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        }
    }
    if (body) options.body = JSON.stringify(body);

    const res = await fetch(`${API_URL}/${endpoint}`, options);
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || 'Request failed');
    }
    return data;
   
}
