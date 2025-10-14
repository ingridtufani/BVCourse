// src/components/Profile.jsx
import React, { useEffect, useMemo, useState } from "react";
import Card from "./ui/Card";
import Input from "./ui/Input";
import Button from "./ui/Button";

/**
 * LocalStorage key for persisting the profile locally.
 * If Signup later stores under a different key, change only this constant.
 */
const LS_KEY = "bvc.profile";

/** Fallback profile used on first run or LS parsing errors. */
const DEMO_USER = {
  firstName: "Ingrid",
  lastName: "Tufani",
  email: "ingr.id@gmail.com",
  studentId: "SD12345",
  program: "SD-DIP",
  phone: "123-444-5566",
  birthday: "1984-07-13",
};

function loadProfile() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : DEMO_USER;
  } catch {
    return DEMO_USER;
  }
}

function saveProfile(data) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(data));
  } catch {
    // Ignore quota errors silently. UX stays responsive even on failure.
  }
}

export default function Profile() {
  const [profile, setProfile] = useState(DEMO_USER);
  const [form, setForm] = useState(DEMO_USER);
  const [editing, setEditing] = useState(false);

  /** Load persisted data once on mount. */
  useEffect(() => {
    const loaded = loadProfile();
    setProfile(loaded);
    setForm(loaded);
  }, []);

  /** Derived full name; memoized to avoid re-renders on unrelated changes. */
  const fullName = useMemo(
    () => `${profile.firstName || ""} ${profile.lastName || ""}`.trim(),
    [profile.firstName, profile.lastName]
  );

  /** Field configuration for the read-only view. Keeps markup simple and uniform. */
  const FIELDS = [
    { key: "email", label: "Email", icon: "✉️" },
    { key: "studentId", label: "Student ID", icon: "📚" },
    { key: "program", label: "Program", icon: "👤" },
    { key: "phone", label: "Phone", icon: "📞" },
    { key: "birthday", label: "Birthday", icon: "🎉" },
  ];

  // --- UI handlers ---
  const handleEdit = () => {
    setForm(profile);
    setEditing(true);
  };

  const handleCancel = () => {
    setForm(profile);
    setEditing(false);
  };

  const handleSave = (e) => {
    e?.preventDefault?.();
    const cleaned = { ...form };
    setProfile(cleaned);
    saveProfile(cleaned);
    setEditing(false);
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container" style={{ paddingTop: 24, paddingBottom: 24 }}>
      {/* Page header: title centered; actions anchored to the right. */}
      <div
        className="flex items-center"
        style={{ marginBottom: 16, position: "relative", justifyContent: "center" }}
      >
        <h2 style={{ color: "var(--primary-color)" }}>
          <span style={{ marginRight: 8 }}>👤</span> PROFILE
        </h2>

        {!editing ? (
          <Button
            variant="btn-primary"
            onClick={handleEdit}
            style={{ position: "absolute", right: 0 }}
          >
            ✏️ Edit
          </Button>
        ) : (
          <div className="flex" style={{ gap: 8, position: "absolute", right: 0 }}>
            <Button variant="btn-primary" onClick={handleSave}>
              💾 Save
            </Button>
            <Button variant="btn-outline" onClick={handleCancel}>
              ✖️ Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Content */}
      {!editing ? (
        <Card className="p-2 fade-in">
          {/* User name */}
          <div className="text-center" style={{ marginBottom: 12 }}>
            <strong style={{ color: "var(--primary-color)", fontSize: 20 }}>
              {fullName || "—"}
            </strong>
          </div>

          {/* Narrow inner column to match Figma proportions */}
          <div style={{ maxWidth: 460, margin: "0 auto" }}>
            {FIELDS.map(({ key, label, icon }) => (
              <div className="form-field" key={key}>
                {/* Pill container: uses existing .input styling to keep the pill look */}
                <div
                  className="input"
                  style={{ width: "100%", display: "flex", alignItems: "center", gap: 10 }}
                >
                  <span className="pill-icon" style={{ fontSize: 18, lineHeight: 1 }}>
                    {icon}
                  </span>
                  <div style={{ width: "100%" }}>
                    <small className="form-label" style={{ display: "block" }}>
                      {label}
                    </small>
                    <div style={{ fontSize: 16 }}>{profile[key] || ""}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <form onSubmit={handleSave}>
          <Card className="p-2 fade-in">
            <div className="form-row" style={{ display: "flex", gap: 12, marginBottom: 8 }}>
              <Input
                id="firstName"
                name="firstName"
                label="First Name"
                value={form.firstName || ""}
                onChange={onChange}
              />
              <Input
                id="lastName"
                name="lastName"
                label="Last Name"
                value={form.lastName || ""}
                onChange={onChange}
              />
            </div>

            <Input
              id="email"
              name="email"
              type="email"
              label="Email"
              value={form.email || ""}
              onChange={onChange}
            />
            <Input
              id="phone"
              name="phone"
              label="Phone"
              value={form.phone || ""}
              onChange={onChange}
            />
            <Input
              id="birthday"
              name="birthday"
              type="date"
              label="Birthday"
              value={form.birthday || ""}
              onChange={onChange}
            />

            <div className="form-row" style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <Input
                id="studentId"
                name="studentId"
                label="Student ID"
                value={form.studentId || ""}
                onChange={onChange}
              />
              <Input
                id="program"
                name="program"
                label="Program"
                value={form.program || ""}
                onChange={onChange}
              />
            </div>

            {/* Footer action buttons intentionally removed: actions live in the header while editing. */}
          </Card>
        </form>
      )}
    </div>
  );
}
