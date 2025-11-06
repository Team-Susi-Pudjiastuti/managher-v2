const API_URL = process.env.NEXT_PUBLIC_API_URL

console.log('haloAPI_URL', API_URL)

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

    console.log(API_URL)

    if (!res.ok) {
        throw new Error(data.message || 'Request failed');
    }
    return data;
   
}
