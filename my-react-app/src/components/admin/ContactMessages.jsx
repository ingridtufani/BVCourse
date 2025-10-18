import React, { useState } from "react";
import { deleteMessage, updateMessage } from "../../data/messageStore";

const ContactMessages = ({ messages = [], onRefresh }) => {
  const [openId, setOpenId] = useState(null);

  if (!messages.length) {
    return <p className="muted">No messages</p>;
  }

  const handleDelete = (id) => {
    deleteMessage(id);
    onRefresh?.();
  };

  const handleToggleOpen = (id) => {
    setOpenId(openId === id ? null : id);
    updateMessage(id, { read: true });
    onRefresh?.();
  };

  return (
    <div
      className="messages-list"
      style={{ display: "flex", flexDirection: "column", gap: 12 }}
    >
      {messages
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map((msg) => (
          <div
            key={msg.id}
            className="message-item"
            style={{
              display: "flex",
              flexDirection: "column",
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: 12,
              background: msg.read ? "#fafafa" : "#fff",
            }}
          >
            {/* header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span className="icon-placeholder">✉️</span>
                <div className="message-details">
                  <p
                    className="message-sender"
                    style={{ margin: 0, fontWeight: 600 }}
                  >
                    {msg?.student?.name || "Student"} ({msg?.student?.id || "-"}
                    )
                  </p>

                  <p style={{ margin: 0, fontSize: 13 }}>
                    Program: {msg?.student?.program || "-"}{" "}
                    <strong>{msg.subject}</strong>
                  </p>

                  <p
                    className="message-date"
                    style={{ fontSize: 12, color: "#888" }}
                  >
                    {new Date(msg.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div
                className="message-actions"
                style={{ display: "flex", gap: 6 }}
              >
                <button
                  className="action-reply"
                  title="View Details"
                  onClick={() => handleToggleOpen(msg.id)}
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                  }}
                >
                  {openId === msg.id ? "👁️" : "↩️"}
                </button>
                <button
                  className="action-delete"
                  title="Delete"
                  onClick={() => handleDelete(msg.id)}
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                  }}
                >
                  🗑️
                </button>
              </div>
            </div>

            {/* body */}
            {openId === msg.id && (
              <div
                className="message-body"
                style={{
                  marginTop: 10,
                  padding: 8,
                  background: "#f5f5f5",
                  borderRadius: 6,
                  whiteSpace: "pre-wrap",
                  fontSize: 14,
                }}
              >
                {msg.message}
              </div>
            )}
          </div>
        ))}
    </div>
  );
};

//   <div className="message-list">
//     {messages.map((msg) => (
//       <div key={msg.id} className="message-item">
//         <span className="icon-placeholder">✉️</span>
//         <div className="message-details">
//           <p className="message-sender">{msg.sender}</p>
//           <p>
//             Program: {msg.program} | Subject: {msg.subject}
//           </p>
//           <p className="message-date">{msg.date}</p>
//         </div>
//         <div className="message-actions">
//           <button className="action-reply">↩️</button>
//           <button className="action-delete">🗑️</button>
//         </div>
//       </div>
//     ))}
//   </div>
// );
export default ContactMessages;
