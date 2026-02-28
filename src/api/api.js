const BASE_URL = "http://127.0.0.1:3000";

function getToken() {
  return localStorage.getItem("token");
}

export async function apiGet(endpoint) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { "Authorization": `Bearer ${getToken()}` }
  });
  return res.json();
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
  return res.json();
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
  return res.json();
}

export async function apiDelete(endpoint) {
  return fetch(`${BASE_URL}${endpoint}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${getToken()}` }
  });
}