const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

class ApiClient {
  async request(endpoint, options = {}) {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      ...options,
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.message || "Request failed");
    }

    return json.data;
  }

  get(url) {
    return this.request(url);
  }
  post(url, body) {
    return this.request(url, { method: "POST", body: JSON.stringify(body) });
  }
  put(url, body) {
    return this.request(url, { method: "PUT", body: JSON.stringify(body) });
  }
  patch(url, body) {
    return this.request(url, { method: "PATCH", body: JSON.stringify(body) });
  }
}

export const api = new ApiClient();
