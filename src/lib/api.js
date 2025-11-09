import useAuthStore from "@/store/useAuthStore";

const API_URL = "http://localhost:3000/api"

export async function apiRequest (endpoint, method = 'GET', body) {
    const token = useAuthStore.getState().token;
    const headers = {
            'Content-Type': 'application/json',
        }
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const options = {
        headers,
        method,
    }

    if (body) options.body = JSON.stringify(body);

    const res = await fetch(`${API_URL}/${endpoint}`, options);
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || 'Request failed');
    }
    return data;
   
}
