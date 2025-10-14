import React from "react";

export default function Button({
  as = "button",
  variant = "btn-ghost", // use suas classes: "btn-primary" | "btn-outline" | "btn-ghost"
  className = "",
  children,
  ...props
}) {
  const Comp = as;
  return (
    <Comp className={`btn ${variant} ${className}`} {...props}>
      {children}
    </Comp>
  );
}
