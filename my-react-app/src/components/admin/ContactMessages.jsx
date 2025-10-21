import React from 'react';

const ContactMessages = ({ messages }) => (
    <div className="message-list">
        {messages.map(msg => (
            <div key={msg.id} className="message-item">
                <span className="icon-placeholder">✉️</span>
                <div className="message-details">
                    <p className="message-sender">{msg.sender}</p>
                    {/* NEW: Display Student ID and Email */}
                    <p>
                        ID: **{msg.studentId}** | Email: **{msg.studentEmail}**
                    </p>
                    {/* Keep existing info */}
                    <p>Program: {msg.program} | Subject: {msg.subject}</p>
                    <p className="message-date">{msg.date}</p>
                </div>
                <div className="message-actions">
                    <button className="action-reply">↩️</button>
                    <button className="action-delete">🗑️</button>
                </div>
            </div>
        ))}
    </div>
);
export default ContactMessages;