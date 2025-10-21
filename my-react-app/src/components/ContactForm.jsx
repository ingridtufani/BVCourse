// src/components/ContactForm.jsx
import React, { useState } from "react";
// Assuming these are correct paths for data/messageStore and UI components:
import { addMessage, deleteMessage, updateMessage } from "../data/messageStore"; 
import Button from "./ui/Button"; 
// Note: Card is not imported, assuming styles are inline or inherited

// Helper to get the current student's profile for pre-filling the sender form
const getCurrentStudentProfile = () => {
    try {
        const raw = localStorage.getItem("bvc.profile");
        // Ensure student ID/email is available from the saved profile
        return raw ? JSON.parse(raw) : { firstName: "", lastName: "", email: "", program: "" };
    } catch {
        return { firstName: "", lastName: "", email: "", program: "" };
    }
}

const formatDate = (isoString) => {
    if (!isoString) return 'Unknown Date';
    return new Date(isoString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

/**
 * Dual-purpose component:
 * 1. If 'messages' prop is provided (Admin View): Renders message list with student info.
 * 2. If 'messages' prop is NOT provided (Student View): Renders a message submission form.
 */
const ContactForm = ({ messages, onRefresh }) => {
    
    // ==========================================================
    // ADMIN MESSAGE LIST LOGIC (If 'messages' prop is passed)
    // ==========================================================
    if (messages) {
        const [openId, setOpenId] = useState(null);
    
        if (!messages.length) {
          return <p className="muted">No messages</p>;
        }
    
        const handleDelete = (id) => {
          deleteMessage(id);
          onRefresh?.();
          setOpenId(null); // Close the message after deleting
        };
    
        const handleToggleOpen = (id) => {
          setOpenId(openId === id ? null : id);
          const message = messages.find(m => m.id === id);
          if (message && !message.read) {
              updateMessage(id, { read: true });
              onRefresh?.();
          }
        };
    
        return (
          <div
            className="messages-list"
            style={{ display: "flex", flexDirection: "column", gap: 12 }}
          >
            {messages
              .slice()
              .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort newest first
              .map((msg) => {
                const isOpened = openId === msg.id;
                
                return (
                  <div
                    key={msg.id}
                    className={`message-item ${isOpened ? "is-open" : ""} ${msg.read ? 'is-read' : 'is-unread'}`}
                    onClick={() => handleToggleOpen(msg.id)}
                    style={{
                      border: `1px solid ${msg.read ? "#eee" : "var(--primary-light)"}`,
                      padding: 15,
                      borderRadius: 8,
                      cursor: "pointer",
                      transition: "all 0.1s ease",
                      background: msg.read ? "#fff" : "var(--primary-light)",
                    }}
                  >
                    <div
                      className="message-summary"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      {/* --- FIX 1: Display Student Information --- */}
                      <div className="message-header-details">
                          <p style={{ fontWeight: 600 }}>
                              {msg.sender} 
                              <span className="muted" style={{ fontWeight: 400, marginLeft: 10, color: 'var(--text-light)', fontSize: 13 }}>
                                  (ID: {msg.studentId || 'N/A'})
                              </span>
                          </p>
                          <p className="muted" style={{ fontSize: 13, marginTop: 4, color: 'var(--text-light)' }}>
                              Email: {msg.studentEmail || 'N/A'} | Program: {msg.program} | Subject: {msg.subject}
                          </p>
                      </div>
                      {/* --- END FIX 1 --- */}
    
                      <div
                        className="message-actions"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 15,
                          whiteSpace: "nowrap",
                        }}
                      >
                        <span style={{ fontSize: 12, color: "var(--text-light)" }}>
                          {formatDate(msg.date)}
                        </span>
                        
                        <div
                          style={{ marginLeft: 5 }}
                          onClick={(e) => e.stopPropagation()} // Prevent closing when deleting
                        >
                          <button
                            onClick={() => handleDelete(msg.id)}
                            title="Delete Message"
                            style={{
                              border: "none",
                              background: "transparent",
                              cursor: "pointer",
                              fontSize: 18,
                            }}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
    
                    {/* body - now displays full message */}
                    {isOpened && (
                      <div
                        className="message-body"
                        style={{
                          marginTop: 10,
                          padding: 12,
                          background: "#fff",
                          border: "1px solid #eee",
                          borderRadius: 6,
                          whiteSpace: "pre-wrap",
                          fontSize: 14,
                          lineHeight: 1.5,
                          borderLeft: '4px solid var(--primary-color)'
                        }}
                      >
                        <strong style={{ display: 'block', marginBottom: 5 }}>Message:</strong>
                        {msg.message || "No message body provided."}
                      </div>
                    )}
                  </div>
                );
            })}
        </div>
      );
    }
    
    // ==========================================================
    // STUDENT MESSAGE SENDER FORM LOGIC (If 'messages' prop is NOT passed)
    // ==========================================================
    
    const studentProfile = getCurrentStudentProfile();
    const [formData, setFormData] = useState({
        subject: '',
        message: '',
        sender: `${studentProfile.firstName} ${studentProfile.lastName}`.trim(),
        program: studentProfile.program,
        email: studentProfile.email,
    });
    const [statusMessage, setStatusMessage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.sender || !formData.message || !formData.subject) {
            setStatusMessage({ type: 'error', text: 'Please fill in the subject and message fields.' });
            return;
        }

        setIsSubmitting(true);
        setStatusMessage(null);

        // Add the message to the store
        addMessage({
            sender: formData.sender,
            program: formData.program,
            subject: formData.subject,
            message: formData.message,
            date: new Date().toISOString(),
            read: false, 
        });

        // Reset form and show success
        setFormData(prev => ({ ...prev, subject: '', message: '' }));
        setStatusMessage({ type: 'success', text: 'Message sent successfully! The administration will respond to your student email shortly.' });
        setIsSubmitting(false);

        // Clear status message after a delay
        setTimeout(() => setStatusMessage(null), 5000);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // --- FIX 2: Student Message Sender Form ---
    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
            <div style={{ display: 'flex', gap: 15 }}>
                {/* Read-only sender name */}
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: 5, fontWeight: 600 }}>From (Your Name):</label>
                    <input 
                        type="text" 
                        value={formData.sender || 'N/A'}
                        readOnly
                        style={{ padding: 10, width: '100%', border: '1px solid #ddd', borderRadius: 4, background: '#f5f5f5' }}
                    />
                </div>
                {/* Read-only program */}
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: 5, fontWeight: 600 }}>Program:</label>
                    <input 
                        type="text" 
                        value={formData.program || 'N/A'}
                        readOnly
                        style={{ padding: 10, width: '100%', border: '1px solid #ddd', borderRadius: 4, background: '#f5f5f5' }}
                    />
                </div>
            </div>

            {/* Subject Field */}
            <div>
                <label htmlFor="subject" style={{ display: 'block', marginBottom: 5, fontWeight: 600 }}>Subject (Required):</label>
                <input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    style={{ padding: 10, width: '100%', border: '1px solid #ddd', borderRadius: 4 }}
                />
            </div>
            
            {/* Message Field */}
            <div>
                <label htmlFor="message" style={{ display: 'block', marginBottom: 5, fontWeight: 600 }}>Message (Required):</label>
                <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    style={{ padding: 10, width: '100%', border: '1px solid #ddd', borderRadius: 4, resize: 'vertical' }}
                ></textarea>
            </div>

            {/* Status Message */}
            {statusMessage && (
                <p 
                    style={{ 
                        color: statusMessage.type === 'success' ? 'var(--success-color)' : 'var(--error-color)', 
                        fontWeight: 600 
                    }}
                >
                    {statusMessage.text}
                </p>
            )}

            {/* Submit Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                <Button 
                    type="submit" 
                    variant="btn-primary" 
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
            </div>
        </form>
    );
};

export default ContactForm;