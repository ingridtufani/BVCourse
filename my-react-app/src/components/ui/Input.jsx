import React from "react";

export default function Input({ id, label, error, className = "", ...props }) {
  const describedBy = error ? `${id}-error` : undefined;
  return (
    <div className="form-field">
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`input ${error ? "is-error" : ""} ${className}`}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        {...props}
      />
      {error && (
        <small id={describedBy} className="form-error">
          {error}
        </small>
      )}
    </div>
  );
}
