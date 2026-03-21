import { useEffect, useMemo, useState } from "react";

const API_BASE = "https://qss-backend-arzi.onrender.com";

function priorityBadge(priority) {
  const value = String(priority || "").toUpperCase();
  if (value === "CRITICAL") return "bg-red-600/20 text-red-300 border border-red-500/30";
  if (value === "HIGH") return "bg-orange-600/20 text-orange-300 border border-orange-500/30";
  if (value === "MEDIUM") return "bg-yellow-600/20 text-yellow-300 border border-yellow-500/30";
  if (value === "LOW") return "bg-emerald-600/20 text-emerald-300 border border-emerald-500/30";
  return "bg-slate-700/40 text-slate-300 border border-white/10";
}

function statusBadge(status) {
  const value = String(status || "").toUpperCase();
  if (value === "OPEN") return "bg-blue-600/20 text-blue-300 border border-blue-500/30";
  if (value === "ACKNOWLEDGED") return "bg-cyan-600/20 text-cyan-300 border border-cyan-500/30";
  if (value === "ESCALATED") return "bg-red-600/20 text-red-300 border border-red-500/30";
  if (value === "CLOSED") return "bg-emerald-600/20 text-emerald-300 border border-emerald-500/30";
  return "bg-slate-700/40 text-slate-300 border border-white/10";
}

export default function App() {
  const [status, setStatus] = useState("Checking...");
  const [cases, setCases] = useState([]);
  const [caseCount, setCaseCount] = useState(0);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedCase, setSelectedCase] = useState(null);
  const [actionBusy, setActionBusy] = useState(false);
  const [actionMessage, setActionMessage] = useState("");

  async function loadData() {
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

  useEffect(() => {
    loadData();
  }, []);

  const filteredCases = useMemo(() => {
    return cases.filter((item) => {
      const title = String(item?.title ?? "").toLowerCase();
      const createdBy = String(item?.created_by ?? "").toLowerCase();
      const caseId = String(item?.case_id ?? "").toLowerCase();
      const priority = String(item?.priority ?? "").toUpperCase();
      const itemStatus = String(item?.status ?? "").toUpperCase();
      const q = search.trim().toLowerCase();

      const matchesSearch =
        !q || title.includes(q) || createdBy.includes(q) || caseId.includes(q);

      const matchesPriority =
        priorityFilter === "ALL" || priority === priorityFilter;

      const matchesStatus =
        statusFilter === "ALL" || itemStatus === statusFilter;

      return matchesSearch && matchesPriority && matchesStatus;
    });
  }, [cases, search, priorityFilter, statusFilter]);

  async function runCaseAction(action) {
    if (!selectedCase?.case_id) return;

    setActionBusy(true);
    setActionMessage("");

    try {
      const res = await fetch(`${API_BASE}/cases/${selectedCase.case_id}/action`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          action,
          actor: "Robert"
        })
      });

      const data = await res.json();

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "Action failed");
      }

      const updatedCase = data.case;
      setSelectedCase(updatedCase);

      setCases((prev) =>
        prev.map((c) =>
          String(c.case_id) === String(updatedCase.case_id) ? updatedCase : c
        )
      );

      setActionMessage(`${action} completed.`);
    } catch (err) {
      console.error(err);
      setActionMessage(`Action failed: ${err.message}`);
    } finally {
      setActionBusy(false);
    }
  }

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

      <section id="platform" className="relative overflow-hidden border-b border-white/10">
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
              <div className="text-sm text-slate-400">Filtered View</div>
              <div className="mt-3 text-3xl font-semibold">{filteredCases.length}</div>
              <div className="mt-2 text-sm leading-6 text-slate-300">
                Cases currently visible in the dashboard table.
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
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-orange-300">Live Cases</p>
            <h2 className="mt-2 text-3xl font-semibold">Case Management Table</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              Search, filter, and take action on live cases directly from your production dashboard.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search case ID, title, analyst..."
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
            />

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="ACKNOWLEDGED">Acknowledged</option>
              <option value="ESCALATED">Escalated</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
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
                {filteredCases.length > 0 ? (
                  filteredCases.map((item, idx) => (
                    <tr
                      key={item.case_id ?? idx}
                      onClick={() => {
                        setSelectedCase(item);
                        setActionMessage("");
                      }}
                      className="cursor-pointer border-t border-white/10 text-slate-200 transition hover:bg-white/5"
                    >
                      <td className="px-5 py-4">{item.case_id ?? "-"}</td>
                      <td className="px-5 py-4">{item.title ?? "-"}</td>
                      <td className="px-5 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityBadge(item.priority)}`}>
                          {item.priority ?? "UNKNOWN"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(item.status)}`}>
                          {item.status ?? "UNKNOWN"}
                        </span>
                      </td>
                      <td className="px-5 py-4">{item.created_by ?? "-"}</td>
                      <td className="px-5 py-4">{item.updated_at ?? "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr className="border-t border-white/10 text-slate-400">
                    <td className="px-5 py-6" colSpan="6">
                      No matching cases found for the current filters.
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
              Next we can add analyst notes, evidence links, mission launch workflows, and role-based views.
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

      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm uppercase tracking-[0.2em] text-orange-300">Case Details</div>
                <h3 className="mt-2 text-2xl font-semibold">
                  {selectedCase.title ?? "Untitled Case"}
                </h3>
              </div>

              <button
                onClick={() => setSelectedCase(null)}
                className="rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10"
              >
                Close
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Case ID</div>
                <div className="mt-2 text-base font-medium">{selectedCase.case_id ?? "-"}</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Created By</div>
                <div className="mt-2 text-base font-medium">{selectedCase.created_by ?? "-"}</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Priority</div>
                <div className="mt-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityBadge(selectedCase.priority)}`}>
                    {selectedCase.priority ?? "UNKNOWN"}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Status</div>
                <div className="mt-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(selectedCase.status)}`}>
                    {selectedCase.status ?? "UNKNOWN"}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:col-span-2">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Updated</div>
                <div className="mt-2 text-base font-medium">{selectedCase.updated_at ?? "-"}</div>
              </div>
            </div>

            <div className="mt-6">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Case Actions</div>
              <div className="mt-3 flex flex-wrap gap-3">
                <button
                  disabled={actionBusy}
                  onClick={() => runCaseAction("ACKNOWLEDGE")}
                  className="rounded-2xl border border-cyan-500/30 bg-cyan-600/20 px-4 py-2 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-600/30 disabled:opacity-50"
                >
                  Acknowledge
                </button>

                <button
                  disabled={actionBusy}
                  onClick={() => runCaseAction("ESCALATE")}
                  className="rounded-2xl border border-red-500/30 bg-red-600/20 px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-600/30 disabled:opacity-50"
                >
                  Escalate
                </button>

                <button
                  disabled={actionBusy}
                  onClick={() => runCaseAction("CLOSE")}
                  className="rounded-2xl border border-emerald-500/30 bg-emerald-600/20 px-4 py-2 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-600/30 disabled:opacity-50"
                >
                  Close
                </button>
              </div>

              {actionMessage ? (
                <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                  {actionMessage}
                </div>
              ) : null}
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Summary</div>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                This case detail modal is now wired for live case actions. The next upgrade is storing analyst notes and activity history per case.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
