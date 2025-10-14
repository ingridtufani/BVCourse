import React from "react";

export default function Select({
  id,
  label,
  options = [],
  error,
  className = "",
  ...props
}) {
  const describedBy = error ? `${id}-error` : undefined;
  return (
    <div className="form-field">
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`select ${error ? "is-error" : ""} ${className}`}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value ?? "blank"} value={opt.value ?? ""}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <small id={describedBy} className="form-error">
          {error}
        </small>
      )}
    </div>
  );
}
