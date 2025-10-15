// src/components/StudentDashboard.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import Card from "./ui/Card";
import Button from "./ui/Button";
import { courseData, programData } from "../data/demoData";

const LS_KEY = "bvc.profile";

/* Minimal helpers */

function loadProfile() {
  const fallback = {
    firstName: "Ingrid",
    lastName: "Tufani",
    studentId: "SD12345",
    program: "SD-DIP",
    status: "STUDENT",
  };
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function formatProgram(code) {
  const p = programData.find((x) => x.code === code);
  if (!p) return code || "—";
  const type = (p.type || "").replace(/[()]/g, "");
  return `${p.name} - ${type}`.trim();
}

const TERM_LABELS = { "*": "All Terms", winter: "Winter", spring: "Spring", summer: "Summer", fall: "Fall" };
const TERM_ORDER = ["*", "winter", "spring", "summer", "fall"];
const normalizeTerm = (t = "") => t.toLowerCase().replace(/\s*\(.*?\)/g, "").trim();

export default function StudentDashboard() {
  const [profile, setProfile] = useState(loadProfile());
  const [termKey, setTermKey] = useState("");
  const [registered, setRegistered] = useState([]);  
  const [selected, setSelected] = useState([]);      
  const [query, setQuery] = useState("");

  useEffect(() => setProfile(loadProfile()), []);

  const fullName = useMemo(
    () => `${profile.firstName || ""} ${profile.lastName || ""}`.trim(),
    [profile.firstName, profile.lastName]
  );

  const availableTerms = useMemo(() => {
    const keys = new Set(courseData.map((c) => normalizeTerm(c.term)));
    return ["*", ...Array.from(keys)].sort((a, b) => TERM_ORDER.indexOf(a) - TERM_ORDER.indexOf(b));
  }, []);

  const loadByTermKey = useCallback((key) => {
    if (!key) return setRegistered([]);
    const list =
      key === "*" ? [...courseData] : courseData.filter((c) => normalizeTerm(c.term) === key);

    list.sort((a, b) => {
      const ta = TERM_ORDER.indexOf(normalizeTerm(a.term));
      const tb = TERM_ORDER.indexOf(normalizeTerm(b.term));
      return ta !== tb ? ta - tb : a.code.localeCompare(b.code);
    });
    setRegistered(list);
  }, []);

  const onChangeTerm = (e) => {
    const key = e.target.value;
    setTermKey(key);
    setQuery("");
    setSelected([]);
    loadByTermKey(key);
  };

  const visibleRegistered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return registered;
    return registered.filter(
      (c) => c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)
    );
  }, [registered, query]);

  const addCourse = (course) =>
    setSelected((prev) => (prev.find((c) => c.code === course.code) ? prev : [...prev, course]));

  const removeCourse = (code) =>
    setSelected((prev) => prev.filter((c) => c.code !== code));

  // placeholders
  const handleContactHistory = () => alert("Contact History (placeholder)");
  const handleViewMessages = () => alert("View Messages (placeholder)");
  const handleContactAdmin = () => alert("Contact Admin (placeholder)");
  const handleSubmit = () => alert("Submit selected courses (placeholder)");

  const isPlaceholder = termKey === "";

  return (
    <div className="container" style={{ paddingTop: 24, paddingBottom: 24 }}>
      <Card className="p-2 fade-in">
        {/* Title */}
        <div className="flex items-center" style={{ marginBottom: 16, gap: 8 }}>
          <span role="img" aria-label="student">👩‍🎓</span>
          <h2 className="page-title" style={{ color: "var(--primary-color)", margin: 0 }}>
            STUDENT DASHBOARD
          </h2>
        </div>

        {/* Student Info */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", gap: 72, alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 280px", minWidth: 280 }}>
              <small className="form-label">STUDENT ID:</small>
              <div>{profile.studentId || "—"}</div>
            </div>
            <div style={{ flex: "1 1 280px", minWidth: 280 }}>
              <small className="form-label">STATUS:</small>
              <div>{profile.status || "STUDENT"}</div>
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <small className="form-label">Name:</small>
            <div>{fullName || "—"}</div>
          </div>

          <div style={{ marginTop: 10 }}>
            <small className="form-label">Program:</small>
            <div>{formatProgram(profile.program)}</div>
          </div>
        </div>

        {/* My Messages */}
        <section style={{ marginTop: 12 }}>
          <div className="flex items-center" style={{ gap: 8, marginBottom: 8 }}>
            <span role="img" aria-label="messages">💬</span>
            <h3 className="section-title" style={{ color: "var(--primary-color)", margin: 0 }}>
              My Messages
            </h3>
          </div>
          <div className="input" style={{ display: "flex", alignItems: "center", gap: 12, padding: 8 }}>
            <Button variant="btn-outline" onClick={handleContactHistory}>Contact History</Button>
            <Button variant="btn-light" onClick={handleViewMessages}>🔔 View Messages</Button>
            <Button variant="btn-primary" onClick={handleContactAdmin}>📨 Contact Admin</Button>
          </div>
        </section>

        {/* Select a Term */}
        <section style={{ marginTop: 20 }}>
          <div className="flex items-center" style={{ gap: 8, marginBottom: 8 }}>
            <span role="img" aria-label="book">📖</span>
            <h3 className="section-title" style={{ color: "var(--primary-color)", margin: 0 }}>
              Select a Term
            </h3>
          </div>

          <small className="form-label">Term</small>
          <div className="form-field">
            <div className="input">
              <select
                value={termKey}
                onChange={onChangeTerm}
                style={{
                  width: "100%",
                  background: "transparent",
                  outline: "none",
                  border: "none",
                  color: isPlaceholder ? "var(--text-light)" : "inherit",
                }}
              >
                {isPlaceholder && (
                  <option value="" disabled>
                    Select a Term
                  </option>
                )}
                {availableTerms.map((k) => (
                  <option key={k} value={k}>
                    {TERM_LABELS[k] || k}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Registered Courses */}
        <section style={{ marginTop: 16 }}>
          <div className="flex items-center" style={{ gap: 8, marginBottom: 8 }}>
            <span role="img" aria-label="inbox">📥</span>
            <h3 className="section-title" style={{ color: "var(--primary-color)", margin: 0 }}>
              Registered Courses
            </h3>
          </div>

          <small className="form-label">Search Courses</small>
          <div className="form-field">
            <div className="input">
              <input
                placeholder="Search by name or code"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={!termKey}
                style={{ width: "100%", background: "transparent", outline: "none", border: "none" }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 16 }}>
            {visibleRegistered.map((c) => (
              <Card key={c.code} className="p-2">
                <strong style={{ color: "var(--primary-color)" }}>{c.name}</strong>
                <div className="muted" style={{ marginTop: 6 }}>Code: {c.code}</div>
                <div className="muted">Term: {c.term}</div>
                <div className="muted">Period: {c.startDate} → {c.endDate}</div>
                {c.description && <div className="muted" style={{ marginTop: 6 }}>{c.description}</div>}
                <div className="flex" style={{ justifyContent: "flex-start", marginTop: 10 }}>
                  <Button variant="btn-light" onClick={() => addCourse(c)}>＋ Add</Button>
                </div>
              </Card>
            ))}
            {termKey && !visibleRegistered.length && (
              <div className="muted">No courses found for the selected term.</div>
            )}
          </div>
        </section>

        {/* Selected Courses */}
        <section style={{ marginTop: 20 }}>
          <div className="flex items-center" style={{ gap: 8, marginBottom: 8 }}>
            <span role="img" aria-label="cap">🎓</span>
            <h3 className="section-title" style={{ color: "var(--primary-color)", margin: 0 }}>
              Selected Courses
            </h3>
          </div>

          {!selected.length ? (
            <p className="muted">No courses selected.</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 16 }}>
              {selected.map((c) => (
                <Card key={c.code} className="p-2">
                  <strong style={{ color: "var(--primary-color)" }}>{c.name}</strong>
                  <div className="muted" style={{ marginTop: 6 }}>Code: {c.code}</div>
                  <div className="muted">Term: {c.term}</div>
                  <div className="muted">Period: {c.startDate} → {c.endDate}</div>
                  <div className="flex" style={{ justifyContent: "flex-start", marginTop: 10 }}>
                    <Button variant="btn-outline" onClick={() => removeCourse(c.code)}>✖ Remove</Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        <div className="flex" style={{ justifyContent: "center", marginTop: 24 }}>
          <Button variant="btn-primary" onClick={handleSubmit} disabled={!selected.length}>
            Submit
          </Button>
        </div>
      </Card>
    </div>
  );
}
