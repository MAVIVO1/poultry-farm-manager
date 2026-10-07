const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002/api";

function authHeaders() {
  const token = localStorage.getItem("farm_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function login(email, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error((await res.json()).message);
  return res.json();
}

export async function getProducts() {
  const res = await fetch(`${API_URL}/products`);
  return res.json();
}

export async function checkout(items) {
  const res = await fetch(`${API_URL}/orders/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ items }),
  });
  if (!res.ok) throw new Error((await res.json()).message);
  return res.json();
}

export async function getBatches() {
  const res = await fetch(`${API_URL}/batches`, { headers: authHeaders() });
  return res.json();
}

export async function getSalesAnalytics() {
  const res = await fetch(`${API_URL}/analytics/sales`, { headers: authHeaders() });
  return res.json();
}

export async function getFlockAnalytics() {
  const res = await fetch(`${API_URL}/analytics/flock`, { headers: authHeaders() });
  return res.json();
}
