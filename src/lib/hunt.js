const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "https://qss-backend-arzi.onrender.com";

export async function getHunt(caseId) {
  const res = await fetch(`${API_BASE}/cases/${caseId}/hunt`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.detail || data?.error || `GET hunt failed: ${res.status}`);
  return data;
}

export async function runHunt(caseId, objective, actor = "ai-hunter") {
  const res = await fetch(`${API_BASE}/cases/${caseId}/hunt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ objective, actor }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.detail || data?.error || `POST hunt failed: ${res.status}`);
  return data;
}
