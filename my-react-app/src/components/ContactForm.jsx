import React, { useMemo, useState } from "react";
import Card from "./ui/Card";
import Button from "./ui/Button";
import { addMessage } from "../data/messageStore";

const LS_PROFILE = "bvc.profile";

export default function ContactForm() {
  //getting the student's info from the message
  const profile = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem(LS_PROFILE) || "{}");
    } catch {
      return {};
    }
  }, []);

  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const s = subject.trim();
    const b = body.trim();

    if (!s || !b) {
      setError("Fill subject and body message");
      return;
    }

    const payload = {
      subject: s,
      message: b,
      createdAt: new Date().toISOString(),
      read: false,
      resolved: false,
      student: {
        id: profile?.studentId || "Unknown",
        name:
          `${profile?.firstName || ""} ${profile?.lastName || ""}`.trim() ||
          "Student",
        program: profile?.program || "",
      },
    };

    addMessage(payload);
    setSent(true);
    setSubject("");
    setBody("");
  };

  return (
    <div className="container" style={{ paddingTop: 24, paddingBottom: 24 }}>
      <Card className="p-2">
        <div className="flex items-center" style={{ gap: 8, marginBottom: 12 }}>
          <span>📨</span>
          <h2
            className="page-title"
            style={{ color: "var(--primary-color)", margin: 0 }}
          >
            Contact Page
          </h2>
        </div>

        {sent && (
          <div className="success" style={{ marginBottom: 12 }}>
            Message sent Successfully!
          </div>
        )}
        {error && (
          <div className="error" style={{ marginBottom: 12 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <small className="form-label">Subject:</small>
          <div className="form-field">
            <div className="input">
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject"
                style={{
                  width: "100%",
                  background: "transparent",
                  outline: "none",
                  borer: "none",
                }}
              />
            </div>
          </div>

          <small className="form-label">Message</small>
          <div className="form-field">
            <div className="input">
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Type your message"
                rows={6}
                style={{
                  width: "100%",
                  background: "transparent",
                  outline: "none",
                  border: "none",
                  resize: "vertical",
                }}
              />
            </div>
          </div>

          <div
            className="flex"
            style={{ justifyContent: "center", marginTop: 12 }}
          >
            <Button type="submit" variant="btn-primary">
              Send Message
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
