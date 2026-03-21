import { useEffect, useState } from "react";

const API_BASE = "https://qss-backend-arzi.onrender.com";

export default function App() {
  const [status, setStatus] = useState("Checking...");
  const [cases, setCases] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_BASE}/health`);
        const health = await res.json();

        if (health?.ok) {
          setStatus("Operational");
        } else {
          setStatus("Online");
        }

        try {
          const c = await fetch(`${API_BASE}/cases/list`);
          const data = await c.json();
          setCases(Number(data?.count ?? 0));
        } catch {
          setCases(0);
        }
      } catch {
        setStatus("Offline");
        setCases(0);
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
            <a href="#solutions" className="hover:text-white">Solutions</a>
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
                href="#contact"
                className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
              >
                Request Demo
              </a>
            </div>

            <div className="mt-10 grid max-w-2xl grid-cols-2 gap-4 text-sm text-slate-400 sm:grid-cols-4">
              <div>Detection Ops</div>
              <div>Threat Intelligence</div>
              <div>Case Automation</div>
              <div>Executive Reporting</div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
              <div className="text-sm text-slate-400">System Status</div>
              <div className="mt-3 text-3xl font-semibold">{status}</div>
              <div className="mt-2 text-sm leading-6 text-slate-300">
                Live operational health from the public backend.
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
              <div className="text-sm text-slate-400">Cases Available</div>
              <div className="mt-3 text-3xl font-semibold">{cases}</div>
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

      <section className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
        <div className="grid gap-3 rounded-[2rem] border border-white/10 bg-white/5 p-5 text-center text-sm text-slate-300 md:grid-cols-4">
          <div>Production frontend online</div>
          <div>Production backend reachable</div>
          <div>Stable health monitoring</div>
          <div>Ready for real case data</div>
        </div>
      </section>

      <section id="solutions" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-orange-300">Solutions</p>
            <h2 className="mt-2 text-3xl font-semibold">Purpose-built for high-trust cyber operations</h2>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-slate-400">
            Position QSS as a premium cyber operations and compliance platform with a strong operational story and scalable architecture.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-xl">
            <h3 className="text-lg font-semibold">Mission & Detection Operations</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Launch investigations, rule runs, and security workflows from a unified cyber operations interface.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-xl">
            <h3 className="text-lg font-semibold">Case Intelligence</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Review case data, evidence patterns, and linked operational activity in one command platform.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-xl">
            <h3 className="text-lg font-semibold">Explainable Security Workflows</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Support analyst decisions with structured outputs, repeatable flows, and operational transparency.
            </p>
          </div>
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-8 rounded-[2rem] border border-white/10 bg-gradient-to-r from-slate-900 to-slate-950 p-8 shadow-2xl lg:grid-cols-[1fr_0.8fr] lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-orange-300">Next Step</p>
            <h2 className="mt-2 text-3xl font-semibold">Make this a real command platform.</h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
              The infrastructure is now stable. The next phase is adding live cases,
              mission launch workflows, dashboard previews, and enterprise-grade UI polish.
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

      <footer className="border-t border-white/10 px-6 py-8 text-sm text-slate-400 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="font-medium text-slate-200">Quantum Sentinel Solutions</div>
            <div>Cyber operations, compliance intelligence, and mission orchestration.</div>
          </div>
          <div className="flex gap-6">
            <span>Platform</span>
            <span>Solutions</span>
            <span>Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
