import { useEffect, useState } from "react";

const API_BASE = "https://qss-backend-arzi.onrender.com";

export default function App() {
  const [status, setStatus] = useState("Checking...");
  const [cases, setCases] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const res1 = await fetch(`${API_BASE}/health`);
        const res2 = await fetch(`${API_BASE}/cases/list`);

        const health = await res1.json();
        const data = await res2.json();

        setStatus(health?.ok ? "Operational" : "Online");
        setCases(Array.isArray(data?.cases) ? data.cases.length : 0);
      } catch (e) {
        console.error(e);
        setStatus("Offline");
        setCases(0);
      }
    }

    load();
  }, []);

  return (
    <div style={{ background: "#0f172a", color: "white", minHeight: "100vh", padding: "40px" }}>
      <h1>Quantum Sentinel Solutions</h1>
      <h2>Cyber Operations Platform</h2>

      <p>The Future of Cyber Operations Starts Here.</p>

      <div style={{ marginTop: "40px" }}>
        <div>System Status: <b>{status}</b></div>
        <div>Cases Available: <b>{cases}</b></div>
      </div>
    </div>
  );
}
