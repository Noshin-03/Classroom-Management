const BASE_URL = "http://127.0.0.1:3000";

function getToken() {
  return localStorage.getItem("token");
}

export async function apiGet(endpoint) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { "Authorization": `Bearer ${getToken()}` }
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Request failed');
  }
  return data;
}

export async function apiPost(endpoint, data) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getToken()}`
    },
    body: JSON.stringify(data),
  });
  const responseData = await res.json();
  if (!res.ok) {
    throw new Error(responseData.message || 'Request failed');
  }
  return responseData;
}

export async function apiPut(endpoint, data) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getToken()}`
    },
    body: JSON.stringify(data),
  });
  const responseData = await res.json();
  if (!res.ok) {
    throw new Error(responseData.message || 'Request failed');
  }
  return responseData;
}

export async function apiDelete(endpoint) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${getToken()}` }
  });
  const responseData = await res.json();
  if (!res.ok) {
    throw new Error(responseData.message || 'Request failed');
  }
  return responseData;
}