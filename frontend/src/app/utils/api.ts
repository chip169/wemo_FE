export function adminFetch(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("wemo_admin_token");
  const headers: HeadersInit = {
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  
  // Set JSON Content-Type by default if body is passed and headers don't have Content-Type
  if (options.body && !(headers as Record<string, string>)["Content-Type"]) {
    (headers as Record<string, string>)["Content-Type"] = "application/json";
  }

  return fetch(url, { ...options, headers });
}
