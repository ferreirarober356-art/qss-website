import { useEffect, useMemo, useState } from "react";
import {
  addNote,
  addTimelineEvent,
  caseAction,
  getCases,
  getNotes,
  getTimeline,
} from "../../lib/api";
import { launchMission as launchMissionApi } from "../../lib/missions";
import { runHunt as runHuntApi } from "../../lib/hunt";

const roleViews = ["SOC Analyst", "Incident Commander", "Threat Hunter", "Executive"];

function badgeClass(value, type = "status") {
  if (type === "priority") {
    if (value === "CRITICAL") return "badge critical";
    if (value === "HIGH") return "badge high";
    if (value === "MEDIUM") return "badge medium";
    return "badge";
  }
  if (value === "ACKNOWLEDGED") return "badge ack";
  if (value === "CLOSED") return "badge closed";
  if (value === "ESCALATED") return "badge escalated";
  return "badge open";
}

export default function SocPlatform() {
  const [role, setRole] = useState("SOC Analyst");
  const [cases, setCases] = useState([]);
  const [selectedCaseId, setSelectedCaseId] = useState("");
  const [notes, setNotes] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [search, setSearch] = useState("");
  const [noteText, setNoteText] = useState("");
  const [evidenceLink, setEvidenceLink] = useState("");
  const [missionMsg, setMissionMsg] = useState("Mission queue ready.");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [activeTab, setActiveTab] = useState("timeline");
  const [error, setError] = useState("");

  async function loadCases() {
    setLoading(true);
    setError("");
    try {
      const data = await getCases();
      const nextCases = data?.cases || [];
      setCases(nextCases);
      if (!selectedCaseId && nextCases.length) {
        setSelectedCaseId(String(nextCases[0].case_id));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadCaseContext(caseId) {
    if (!caseId) return;
    setError("");
    try {
      const [notesData, timelineData] = await Promise.all([
        getNotes(caseId).catch(() => ({ notes: [] })),
        getTimeline(caseId).catch(() => ({ timeline: [] })),
      ]);
      setNotes(notesData?.notes || []);
      setTimeline(timelineData?.timeline || []);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadCases();
  }, []);

  useEffect(() => {
    loadCaseContext(selectedCaseId);
  }, [selectedCaseId]);

  const selectedCase = useMemo(
    () => cases.find((c) => String(c.case_id) === String(selectedCaseId)),
    [cases, selectedCaseId]
  );

  const filteredCases = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return cases;
    return cases.filter((c) =>
      [
        c.case_id,
        c.title,
        c.priority,
        c.status,
        c.created_by,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [cases, search]);

  async function submitNote() {
    if (!selectedCaseId || !noteText.trim()) return;
    setBusy(true);
    setError("");
    try {
      await addNote(selectedCaseId, {
        author: "analyst",
        content: noteText.trim(),
        tags: ["triage"],
      });
      setNoteText("");
      await loadCaseContext(selectedCaseId);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function submitEvidenceLink() {
    if (!selectedCaseId || !evidenceLink.trim()) return;
    setBusy(true);
    setError("");
    try {
      await addTimelineEvent(selectedCaseId, {
        event_type: "EVIDENCE",
        description: `Evidence linked: ${evidenceLink.trim()}`,
        source: "analyst",
        metadata: { href: evidenceLink.trim() },
      });
      setEvidenceLink("");
      await loadCaseContext(selectedCaseId);
      setActiveTab("timeline");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function doAction(action) {
    if (!selectedCaseId) return;
    setBusy(true);
    setError("");
    try {
      await caseAction(selectedCaseId, action);
      await loadCases();
      await loadCaseContext(selectedCaseId);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }


  async function launchHunt() {
    if (!selectedCaseId) return;
    try {
      const result = await runHuntApi(
        selectedCaseId,
        "Investigate likely lateral movement and credential abuse",
        "ai-hunter"
      );
      setMissionMsg(`Hunt generated for case ${selectedCaseId} with ${result?.hunt?.hypotheses?.length || 0} hypotheses.`);
      await loadCaseContext(selectedCaseId);
    } catch (err) {
      setMissionMsg(`Hunt failed: ${err.message}`);
    }
  }
  async function launchMission(name) {
    if (!selectedCaseId) return;
    try {
      const result = await launchMissionApi(selectedCaseId, name, "analyst");
      setMissionMsg(`Mission queued: ${result.mission} for case ${result.case_id}.`);
      await loadCaseContext(selectedCaseId);
    } catch (err) {
      setMissionMsg(`Mission launch failed: ${err.message}`);
    }
  }

  return (
    <div className="soc-root">
      <header className="soc-hero">
        <div>
          <p className="eyebrow">Quantum Sentinel Solutions</p>
          <h1>Full SOC Interface</h1>
          <p className="sub">
            Analyst notes, evidence tracking, mission workflows, and role-based operational visibility.
          </p>
        </div>

        <div className="hero-actions">
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            {roleViews.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <button onClick={loadCases}>Refresh Platform</button>
        </div>
      </header>

      <section className="stats-grid">
        <div className="stat-card">
          <span>Open Cases</span>
          <strong>{cases.length}</strong>
        </div>
        <div className="stat-card">
          <span>Selected Case</span>
          <strong>{selectedCase ? selectedCase.case_id : "--"}</strong>
        </div>
        <div className="stat-card">
          <span>Role View</span>
          <strong>{role}</strong>
        </div>
        <div className="stat-card">
          <span>Mission Status</span>
          <strong>Ready</strong>
        </div>
      </section>

      {error ? <div className="error-box">{error}</div> : null}

      <main className="soc-grid">
        <section className="panel left-panel">
          <div className="panel-header">
            <h2>Case Queue</h2>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search cases"
            />
          </div>

          <div className="case-list">
            {loading ? (
              <div className="empty-box">Loading cases...</div>
            ) : filteredCases.length === 0 ? (
              <div className="empty-box">No cases found.</div>
            ) : (
              filteredCases.map((c) => (
                <button
                  key={c.case_id}
                  className={`case-card ${String(selectedCaseId) === String(c.case_id) ? "selected" : ""}`}
                  onClick={() => setSelectedCaseId(String(c.case_id))}
                >
                  <div className="case-card-top">
                    <div>
                      <div className="case-id">{c.case_id}</div>
                      <div className="case-title">{c.title}</div>
                    </div>
                    <span className={badgeClass(c.priority, "priority")}>{c.priority}</span>
                  </div>
                  <div className="case-meta">
                    <span className={badgeClass(c.status)}>{c.status}</span>
                    <span>{c.created_by}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </section>

        <section className="panel center-panel">
          <div className="panel-header">
            <div>
              <h2>{selectedCase?.title || "Case Detail"}</h2>
              <p className="muted">
                {selectedCase ? `${selectedCase.case_id} • ${selectedCase.created_by}` : "Select a case"}
              </p>
            </div>
            <div className="action-row">
              <button disabled={busy || !selectedCaseId} onClick={() => doAction("acknowledge")}>Acknowledge</button>
              <button disabled={busy || !selectedCaseId} onClick={() => doAction("escalate")}>Escalate</button>
              <button disabled={busy || !selectedCaseId} onClick={() => doAction("close")}>Close</button>
            </div>
          </div>

          <div className="tabs">
            <button className={activeTab === "timeline" ? "active" : ""} onClick={() => setActiveTab("timeline")}>Timeline</button>
            <button className={activeTab === "notes" ? "active" : ""} onClick={() => setActiveTab("notes")}>Analyst Notes</button>
            <button className={activeTab === "evidence" ? "active" : ""} onClick={() => setActiveTab("evidence")}>Evidence Links</button>
            <button className={activeTab === "missions" ? "active" : ""} onClick={() => setActiveTab("missions")}>Mission Launch</button>
          </div>

          {activeTab === "timeline" ? (
            <div className="tab-body">
              {timeline.length === 0 ? (
                <div className="empty-box">No timeline events yet.</div>
              ) : (
                timeline.map((item, idx) => (
                  <div key={item.event_id || idx} className="timeline-item">
                    <div className="timeline-type">{item.event_type || "EVENT"}</div>
                    <div className="timeline-content">
                      <div>{item.description}</div>
                      <small>{item.created_at || ""}</small>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : null}

          {activeTab === "notes" ? (
            <div className="tab-body">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Write analyst note"
              />
              <div className="tab-actions">
                <button disabled={busy || !selectedCaseId} onClick={submitNote}>Add Note</button>
              </div>

              <div className="stack-list">
                {notes.length === 0 ? (
                  <div className="empty-box">No notes yet.</div>
                ) : (
                  notes.map((n, idx) => (
                    <div key={n.note_id || idx} className="stack-card">
                      <div className="stack-top">
                        <strong>{n.author}</strong>
                        <small>{n.created_at || ""}</small>
                      </div>
                      <div>{n.content}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : null}

          {activeTab === "evidence" ? (
            <div className="tab-body">
              <input
                value={evidenceLink}
                onChange={(e) => setEvidenceLink(e.target.value)}
                placeholder="Paste evidence URL or object path"
              />
              <div className="tab-actions">
                <button disabled={busy || !selectedCaseId} onClick={submitEvidenceLink}>Attach Evidence</button>
              </div>
              <div className="empty-box">Evidence links are stored as timeline events until dedicated evidence storage is added.</div>
            </div>
          ) : null}

          {activeTab === "missions" ? (
            <div className="tab-body">
              <div className="mission-grid">
                <button onClick={() => launchMission("Containment Workflow")}>Launch Containment</button>
                <button onClick={() => launchMission("IOC Enrichment Workflow")}>Launch Enrichment</button>
                <button onClick={() => launchMission("Executive Reporting Workflow")}>Launch Reporting</button>
                <button onClick={() => launchMission("Threat Hunt Expansion")}>Launch Threat Hunt</button>
              </div>
              <div className="empty-box">{missionMsg}</div>
            </div>
          ) : null}
        </section>

        <section className="panel right-panel">
          <div className="panel-header">
            <h2>Role-Based View</h2>
          </div>

          <div className="stack-card">
            <strong>Current Role</strong>
            <div>{role}</div>
          </div>

          <div className="stack-card">
            <strong>Access Focus</strong>
            <div>
              {role === "Executive"
                ? "Critical incidents, business risk, reporting visibility."
                : role === "Incident Commander"
                ? "Escalation, response coordination, mission control."
                : role === "Threat Hunter"
                ? "Telemetry pivots, pattern review, deeper investigation."
                : "Case triage, notes, evidence, response actions."}
            </div>
          </div>

          <div className="stack-card">
            <strong>Mission Console</strong>
            <div>{missionMsg}</div>
          </div>
        </section>
      </main>
    </div>
  );
}
