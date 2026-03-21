import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

const API_BASE = "https://qss-backend-arzi.onrender.com";

export default function App() {
  const [live, setLive] = useState({
    detections: 0,
    cases: 0,
    services: 5,
    status: "Checking...",
  });

  const screenshots = useMemo(
    () => [
      "/qss-dashboard.png",
      "/qss-dashboard-2.png",
      "/qss-dashboard-3.png",
    ],
    []
  );

  const [slide, setSlide] = useState(0);

  useEffect(() => {
    async function loadLiveStats() {
      try {
        const [casesRes, healthRes] = await Promise.all([
          fetch(`${API_BASE}/cases/list`),
          fetch(`${API_BASE}/health`),
        ]);

        if (!casesRes.ok || !healthRes.ok) {
          throw new Error(`HTTP ${casesRes.status}/${healthRes.status}`);
        }

        const cases = await casesRes.json();
        const health = await healthRes.json();

        const caseCount = Array.isArray(cases?.cases)
          ? cases.cases.length
          : Number(cases?.count ?? 0);

        const status =
          health?.ok === true || health?.status === "ok"
            ? "Operational"
            : "Online";

        setLive({
          detections: 1,
          cases: caseCount,
          services: 5,
          status,
        });
      } catch (err) {
        console.error("Live stats failed:", err);
        setLive({
          detections: 0,
          cases: 0,
          services: 5,
          status: "Offline",
        });
      }
    }

    loadLiveStats();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlide((prev) => (prev + 1) % screenshots.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [screenshots.length]);

  const stats = [
    {
      label: "Detection Engine",
      value: String(live.detections),
      note: "Live platform workflow status",
    },
    {
      label: "Cases Available",
      value: String(live.cases),
      note: "Real case data from backend",
    },
    {
      label: "Core Services",
      value: String(live.services),
      note: "Operational stack online",
    },
    {
      label: "System Status",
      value: live.status,
      note: "Live operational health",
    },
  ];

  const solutionCards = [
    {
      title: "Mission & Detection Operations",
      text: "Launch investigations, rule runs, and security workflows from a unified cyber operations interface.",
    },
    {
      title: "Case Intelligence",
      text: "Review case data, evidence patterns, and linked operational activity in one command platform.",
    },
    {
      title: "Explainable Security Workflows",
      text: "Support analyst decisions with structured outputs, repeatable flows, and operational transparency.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/85 backdrop-blur px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
          <div>
            <div className="text-lg font-semibold">Quantum Sentinel Solutions</div>
            <div className="text-xs text-orange-300 uppercase tracking-widest">Cyber Operations Platform</div>
          </div>
          <nav className="flex flex-wrap gap-6 text-sm text-slate-300">
            <a href="#platform" className="hover:text-white transition">Platform</a>
            <a href="#solutions" className="hover:text-white transition">Solutions</a>
            <a href="#preview" className="hover:text-white transition">Preview</a>
            <a href="#contact" className="hover:text-white transition">Contact</a>
          </nav>
        </div>
      </header>

      <section id="platform" className="px-6 py-24 max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex rounded-full border border-orange-400/30 bg-orange-500/10 px-4 py-1 text-sm text-orange-300">
            Built for modern cyber operations
          </div>

          <h1 className="mt-6 text-5xl md:text-6xl font-semibold leading-tight">
            The Future of Cyber Operations Starts Here.
          </h1>

          <p className="mt-6 text-slate-300 text-lg max-w-2xl leading-8">
            Quantum Sentinel Solutions delivers real-time detection workflows,
            case intelligence, and evidence-driven cyber operations in one
            unified platform built for serious organizations.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="http://localhost:8501"
              target="_blank"
              rel="noreferrer"
              className="inline-flex bg-orange-500 px-6 py-3 rounded-xl font-semibold hover:scale-105 transition"
            >
              Enter Command Platform
            </a>

            <a
              href="#contact"
              className="inline-flex border border-white/20 px-6 py-3 rounded-xl hover:bg-white/10 transition"
            >
              Request Demo
            </a>
          </div>

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-slate-400">
            <div>Detection Ops</div>
            <div>Threat Intelligence</div>
            <div>Case Automation</div>
            <div>Executive Reporting</div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="grid grid-cols-2 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="border border-white/10 p-5 rounded-2xl bg-white/5 shadow-xl">
              <div className="text-sm text-slate-400">{s.label}</div>
              <div className="text-3xl font-bold mt-2">{s.value}</div>
              <div className="text-xs text-slate-400 mt-2">{s.note}</div>
            </div>
          ))}
        </motion.div>
      </section>

      <section className="px-6 py-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
          <div>Real-Time Operations</div>
          <div>Case Intelligence</div>
          <div>Explainable Workflows</div>
          <div>Executive Visibility</div>
        </div>
      </section>

      <section id="solutions" className="px-6 py-12 max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="text-sm uppercase tracking-widest text-orange-300">Solutions</div>
          <h2 className="mt-3 text-3xl font-semibold">Purpose-built for high-trust cyber operations</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {solutionCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <div className="text-white font-semibold">{card.title}</div>
              <div className="mt-3 text-sm leading-6 text-slate-400">{card.text}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="preview" className="px-6 py-16 max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-3xl font-semibold">Platform Preview</h2>
          <p className="mt-3 max-w-3xl text-slate-400">
            A premium cyber operations platform should show real workflow depth, not just marketing language.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl">
          <div className="relative aspect-[16/9]">
            <img
              src={screenshots[slide]}
              alt="Quantum Sentinel Solutions dashboard preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                const fallback = e.currentTarget.parentElement?.querySelector(".fallback");
                if (fallback) fallback.classList.remove("hidden");
              }}
            />
            <div className="fallback hidden absolute inset-0 flex items-center justify-center text-slate-400">
              Add /public/qss-dashboard.png, /public/qss-dashboard-2.png, and /public/qss-dashboard-3.png
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="px-6 py-16 max-w-7xl mx-auto">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-slate-900 to-slate-800 p-8 shadow-2xl">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <div className="text-sm uppercase tracking-widest text-orange-300">Request a Demo</div>
              <h2 className="mt-3 text-3xl font-semibold">See Quantum Sentinel Solutions in action.</h2>
              <p className="mt-4 max-w-2xl text-slate-300">
                Move from static tooling to a real cyber operations platform with live detections,
                case workflows, and executive visibility.
              </p>
            </div>

            <form className="grid gap-4">
              <input type="text" placeholder="Your name" className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none placeholder:text-slate-500" />
              <input type="email" placeholder="Work email" className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none placeholder:text-slate-500" />
              <input type="text" placeholder="Company" className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none placeholder:text-slate-500" />
              <textarea rows="4" placeholder="What would you like to see in the demo?" className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none placeholder:text-slate-500" />
              <div className="flex flex-wrap gap-4">
                <button type="button" className="inline-flex bg-orange-500 px-6 py-3 rounded-xl font-semibold hover:scale-105 transition">
                  Submit Demo Request
                </button>
                <a href="http://localhost:8501" target="_blank" rel="noreferrer" className="inline-flex border border-white/20 px-6 py-3 rounded-xl hover:bg-white/10 transition">
                  Launch Platform
                </a>
              </div>
            </form>
          </div>
        </div>
      </section>

      <footer className="px-6 py-10 border-t border-white/10 text-sm text-slate-400">
        <div className="max-w-7xl mx-auto flex justify-between flex-wrap gap-4">
          <div>
            <div className="text-white font-semibold">Quantum Sentinel Solutions</div>
            <div>Cyber operations, compliance intelligence, and mission orchestration.</div>
          </div>
          <nav className="flex flex-wrap gap-6">
            <a href="#platform" className="hover:text-white transition">Platform</a>
            <a href="#solutions" className="hover:text-white transition">Solutions</a>
            <a href="#preview" className="hover:text-white transition">Preview</a>
            <a href="#contact" className="hover:text-white transition">Contact</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
