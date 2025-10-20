// src/components/StudentDashboard.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import Card from "./ui/Card";
import Button from "./ui/Button";
import Select from "./ui/Select"; 
import { courseData, programData } from "../data/demoData";
import ContactForm from "./ContactForm"; 
import { useNavigate } from "react-router-dom";

const LS_KEY = "bvc.profile";

/* Minimal helpers */
function loadProfile() {
  const fallback = {
    firstName: "User",
    lastName: "Name",
    studentId: "00000",
    program: "N/A",
    status: "STUDENT",
    selectedCourses: [], 
  };
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveProfile(data) {
    try {
        localStorage.setItem(LS_KEY, JSON.stringify(data));
    } catch {}
}


function formatProgram(code) {
  const p = programData.find((x) => x.code === code);
  if (!p) return code || "—";
  const type = (p.type || "").replace(/[()]/g, "");
  return `${p.name} - ${type}`.trim();
}

const TERM_LABELS = {
  "*": "All Terms",
  winter: "Winter",
  spring: "Spring",
  summer: "Summer",
  fall: "Fall",
};
const TERM_OPTIONS = Object.keys(TERM_LABELS).map((value) => ({
  value,
  label: TERM_LABELS[value],
}));

// Helper function to get the current user's role and login status
const getAuthStatus = () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const userRole = localStorage.getItem("userRole"); 
    return { isLoggedIn, userRole };
};


function StudentDashboard() {
  const navigate = useNavigate();
  const { isLoggedIn, userRole } = getAuthStatus();

  // --- ACCESS PROTECTION LOGIC ---
  if (!isLoggedIn || userRole !== 'student') {
    // If not logged in, redirect to login after rendering the message
    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login", { replace: true });
        }
    }, [isLoggedIn, navigate]);

    // Render the access denied message
    return (
        <div style={{ padding: '50px', textAlign: 'center' }}>
            <h1>🚫 Access Denied</h1>
            <p>You must be logged in as a **Student** to view this page.</p>
            <button onClick={() => navigate('/login')}>Go to Login</button>
        </div>
    );
  }
  // --- END ACCESS PROTECTION LOGIC ---

  const profile = useMemo(() => loadProfile(), []);
  const [selected, setSelected] = useState(profile.selectedCourses || []);
  const [termFilter, setTermFilter] = useState("*");
  const [submitMessage, setSubmitMessage] = useState(null);

  const availableCourses = useMemo(() => {
    return courseData.filter((c) => {
      // 1. Filter by term
      const termMatch =
        termFilter === "*" || (c.term || "").toLowerCase() === termFilter;
      // 2. Exclude already selected courses
      const isSelected = selected.some((sc) => sc.code === c.code);

      return termMatch && !isSelected;
    });
  }, [selected, termFilter]);

  const addCourse = useCallback(
    (courseCode) => {
      const courseToAdd = courseData.find((c) => c.code === courseCode);
      if (courseToAdd) {
        setSelected((prev) => [...prev, courseToAdd]);
      }
    },
    [setSelected]
  );

  const removeCourse = useCallback(
    (courseCode) => {
      setSelected((prev) => prev.filter((c) => c.code !== courseCode));
    },
    [setSelected]
  );

  const handleSubmit = () => {
    // 1. Update the profile in local storage
    const newProfile = { ...profile, selectedCourses: selected };
    saveProfile(newProfile);
    
    // 2. Display success message
    setSubmitMessage("✅ Courses submitted successfully and saved!");

    // 3. Clear the message after a few seconds
    setTimeout(() => setSubmitMessage(null), 3000);
  };
  
  // Re-save selected courses whenever the list changes (for persistence)
  useEffect(() => {
    const newProfile = { ...profile, selectedCourses: selected };
    saveProfile(newProfile);
  }, [selected, profile]);
  

  return (
    <div className="student-dashboard">
      <Card
        className="profile-summary"
        style={{ padding: "16px 24px", marginBottom: 20 }}
      >
        <div
          className="flex"
          style={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <div className="profile-info">
            <h1>
              Welcome, {profile.firstName} {profile.lastName}
            </h1>
            <p className="muted">ID: {profile.studentId}</p>
            <p className="muted">
              Program: <strong>{formatProgram(profile.program)}</strong>
            </p>
          </div>
          <Button
            variant="btn-outline"
            onClick={() => navigate("/profile")}
          >
            Edit Profile
          </Button>
        </div>
      </Card>

      {/* Course Registration Section */}
      <Card style={{ padding: 24, marginBottom: 20 }}>
        <h2 style={{ marginBottom: 20 }}>📚 Course Registration</h2>

        {/* Filters */}
        <div
          className="flex"
          style={{
            justifyContent: "flex-start",
            gap: 20,
            marginBottom: 20,
          }}
        >
          <Select
            id="term-filter"
            label="Filter by Term"
            value={termFilter}
            onChange={(e) => setTermFilter(e.target.value)}
            options={TERM_OPTIONS}
          />
        </div>

        {/* Available Courses */}
        <section>
          <h3 style={{ borderBottom: "1px solid #eee", paddingBottom: 5 }}>
            Available Courses ({availableCourses.length})
          </h3>
          <div
            className="course-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 16,
              marginTop: 16,
            }}
          >
            {availableCourses.length > 0 ? (
                availableCourses.map((c) => (
                    <Card key={c.code} className="p-2">
                      <strong style={{ color: "var(--text-color)" }}>
                        {c.name}
                      </strong>
                      <div className="muted" style={{ marginTop: 6 }}>
                        Code: {c.code}
                      </div>
                      <div className="muted">Term: {TERM_LABELS[c.term.toLowerCase()]}</div>
                      <div className="muted">
                        Period: {c.startDate} → {c.endDate}
                      </div>
                      <div
                        className="flex"
                        style={{ justifyContent: "flex-end", marginTop: 10 }}
                      >
                        <Button variant="btn-primary" onClick={() => addCourse(c.code)}>
                          + Add Course
                        </Button>
                      </div>
                    </Card>
                  ))
            ) : (
                <p className="muted" style={{ gridColumn: '1 / -1' }}>No available courses for this term.</p>
            )}
          </div>
        </section>

        {/* Selected Courses */}
        <section style={{ marginTop: 30 }}>
          <h3 style={{ borderBottom: "1px solid #eee", paddingBottom: 5 }}>
            My Registration Cart ({selected.length})
          </h3>

          {selected.length === 0 ? (
            <p className="muted" style={{ marginTop: 16 }}>
              No courses selected yet.
            </p>
          ) : (
            <div
              className="course-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 16,
                marginTop: 16,
              }}
            >
              {selected.map((c) => (
                <Card key={c.code} className="p-2">
                  <strong style={{ color: "var(--primary-color)" }}>
                    {c.name}
                  </strong>
                  <div className="muted" style={{ marginTop: 6 }}>
                    Code: {c.code}
                  </div>
                  <div className="muted">Term: {TERM_LABELS[c.term.toLowerCase()]}</div>
                  <div className="muted">
                    Period: {c.startDate} → {c.endDate}
                  </div>
                  <div
                    className="flex"
                    style={{ justifyContent: "flex-start", marginTop: 10 }}
                  >
                    <Button
                      variant="btn-outline"
                      onClick={() => removeCourse(c.code)}
                    >
                      ✖ Remove
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Submit Action */}
        <div
          className="flex"
          style={{ justifyContent: "center", marginTop: 24, flexDirection: 'column', alignItems: 'center' }}
        >
          {submitMessage && (
            <p style={{ color: 'green', marginBottom: 12, fontWeight: 500 }}>{submitMessage}</p>
          )}
          <Button
            variant="btn-primary"
            onClick={handleSubmit}
            disabled={!selected.length}
          >
            Submit Registration
          </Button>
        </div>
      </Card>

      {/* Contact Form Section */}
      <Card style={{ padding: 24, marginBottom: 20 }}>
        <h2 style={{ marginBottom: 20 }}>✉️ Contact the Department</h2>
        <ContactForm />
      </Card>
    </div>
  );
}
export default StudentDashboard;