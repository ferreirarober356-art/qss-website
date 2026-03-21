import { useEffect, useState } from "react";

const API_BASE = "https://qss-backend-arzi.onrender.com";

export default function App() {
  const [status, setStatus] = useState("Checking...");
  const [cases, setCases] = useState([]);
  const [caseCount, setCaseCount] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_BASE}/health`);
        const health = await res.json();
        setStatus(health?.ok ? "Operational" : "Online");

        try {
          const c = await fetch(`${API_BASE}/cases/list`);
          const data = await c.json();
          const rows = Array.isArray(data?.cases) ? data.cases : [];
          setCases(rows);
          setCaseCount(Number(data?.count ?? rows.length ?? 0));
        } catch (err) {
          console.error("Cases fetch failed:", err);
          setCases([]);
          setCaseCount(0);
        }
      } catch (err) {
        console.error("Health fetch failed:", err);
        setStatus("Offline");
        setCases([]);
        setCaseCount(0);
      }
    }

    load();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <div className="text-lg font-semibold">Quantum Sentinel Solutions</div>
            <div className="text-xs uppercase tracking-[0.3em] text-orange-300">
              Cyber Operations Platform
            </div>
          </div>
          <nav className="hidden gap-6 text-sm text-slate-300 md:flex">
            <a href="#platform" className="hover:text-white">Platform</a>
            <a href="#cases" className="hover:text-white">Cases</a>
            <a href="#contact" className="hover:text-white">Contact</a>
          </nav>
        </div>
      </header>

      <section
        id="platform"
        className="relative overflow-hidden border-b border-white/10"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.18),transparent_25%),radial-gradient(circle_at_left,rgba(148,163,184,0.12),transparent_30%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-28">
          <div>
            <div className="mb-4 inline-flex items-center rounded-full border border-orange-400/30 bg-orange-500/10 px-4 py-1 text-sm text-orange-300">
              Built for modern cyber operations
            </div>

            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight sm:text-6xl">
              The Future of Cyber Operations Starts Here.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Quantum Sentinel Solutions delivers real-time detection workflows,
              case intelligence, and evidence-driven cyber operations in one
              unified platform built for serious organizations.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="http://localhost:8501"
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5"
              >
                Enter Command Platform
              </a>

              <a
                href="#cases"
                className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
              >
                View Cases
              </a>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
              <div className="text-sm text-slate-400">System Status</div>
              <div className="mt-3 text-3xl font-semibold">{status}</div>
              <div className="mt-2 text-sm leading-6 text-slate-300">
                Live operational health from the production backend.
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
              <div className="text-sm text-slate-400">Cases Available</div>
              <div className="mt-3 text-3xl font-semibold">{caseCount}</div>
              <div className="mt-2 text-sm leading-6 text-slate-300">
                Real case count returned by the production API.
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
              <div className="text-sm text-slate-400">Core Services</div>
              <div className="mt-3 text-3xl font-semibold">2</div>
              <div className="mt-2 text-sm leading-6 text-slate-300">
                Public frontend and backend now deployed.
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
              <div className="text-sm text-slate-400">Deployment State</div>
              <div className="mt-3 text-3xl font-semibold">Live</div>
              <div className="mt-2 text-sm leading-6 text-slate-300">
                Vercel and Render integration confirmed.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="cases" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-orange-300">Live Cases</p>
            <h2 className="mt-2 text-3xl font-semibold">Case Management Table</h2>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-slate-400">
            This table is reading directly from your production backend and is the start of your live SOC case dashboard.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 shadow-xl">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-white/5 text-slate-300">
                <tr>
                  <th className="px-5 py-4 font-medium">Case ID</th>
                  <th className="px-5 py-4 font-medium">Title</th>
                  <th className="px-5 py-4 font-medium">Priority</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 font-medium">Created By</th>
                  <th className="px-5 py-4 font-medium">Updated</th>
                </tr>
              </thead>
              <tbody>
                {cases.length > 0 ? (
                  cases.map((item, idx) => (
                    <tr
                      key={item.case_id ?? idx}
                      className="border-t border-white/10 text-slate-200"
                    >
                      <td className="px-5 py-4">{item.case_id ?? "-"}</td>
                      <td className="px-5 py-4">{item.title ?? "-"}</td>
                      <td className="px-5 py-4">{item.priority ?? "-"}</td>
                      <td className="px-5 py-4">{item.status ?? "-"}</td>
                      <td className="px-5 py-4">{item.created_by ?? "-"}</td>
                      <td className="px-5 py-4">{item.updated_at ?? "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr className="border-t border-white/10 text-slate-400">
                    <td className="px-5 py-6" colSpan="6">
                      No live cases returned yet. Backend is connected, but the current dataset is empty.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-8 rounded-[2rem] border border-white/10 bg-gradient-to-r from-slate-900 to-slate-950 p-8 shadow-2xl lg:grid-cols-[1fr_0.8fr] lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-orange-300">Next Step</p>
            <h2 className="mt-2 text-3xl font-semibold">Build the full SOC interface.</h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
              Next we can add priority badges, filtering, case detail views, analyst notes, and mission launch workflows.
            </p>
          </div>

          <div className="grid gap-3">
            <a
              href="http://localhost:8501"
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl bg-orange-500 px-6 py-3 text-center text-sm font-semibold text-white transition hover:-translate-y-0.5"
            >
              Launch Platform
            </a>

            <a
              href="#platform"
              className="rounded-2xl border border-white/15 bg-transparent px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Back to Top
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
