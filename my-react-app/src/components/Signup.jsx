import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Signup.css";
import Input from "./ui/Input";
import Select from "./ui/Select";
import { programData } from "../data/demoData"; //This will be replaced with data from backend later

// dropdown options
const PROGRAMS = [
  { value: "", label: "Select..." },
  ...programData.map((prog) => ({
    value: prog.code, //save the code
    label: `${prog.code} - ${prog.name}`, //show code and name
  })),
];

const DEPARTMENTS = [
  { value: "", label: "Select..." },
  ...Array.from(new Set(programData.map((prog) => prog.department))).map(
    (dept) => ({
      value: dept,
      label: dept,
    })
  ),
];

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  birthday: "",
  department: "",
  program: "",
  username: "",
  password: "",
};

// ===================================================================
// START: Student ID Generation Logic (Re-added)
// ===================================================================
const getUsers = () => JSON.parse(localStorage.getItem("users") || "[]");
const pad4 = (n) => String(n).padStart(4, "0");
const buildIdPrefix = (programCode, year) =>
  `BVC-${year}-${(programCode || "GEN")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")}`;

const computeNextSeqForPrefix = (programCode) => {
  const year = new Date().getFullYear();
  const prefix = buildIdPrefix(programCode, year);
  const users = getUsers();

  let maxSeq = 0;
  users.forEach((u) => {
    const id = u?.profile?.studentId || "";
    if (id.startsWith(prefix + "-")) {
      const tail = id.split("-").pop();
      const num = parseInt(tail, 10);
      if (!Number.isNaN(num)) maxSeq = Math.max(maxSeq, num);
    }
  });

  return { prefix, next: maxSeq + 1 };
};

const previewStudentId = (programCode) => {
  const { prefix, next } = computeNextSeqForPrefix(programCode);
  return `${prefix}-${pad4(next)}`;
};
// ===================================================================
// END: Student ID Generation Logic
// ===================================================================


export default function Signup() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [usernameError, setUsernameError] = useState("");
  const [studentId, setStudentId] = useState(""); // State for generated ID
  const navigate = useNavigate();
  
  // ===================================================================
  // START: useEffect to generate Student ID (Re-added)
  // ===================================================================
  useEffect(() => {
    if (form.program) {
      setStudentId(previewStudentId(form.program));
    } else {
      setStudentId("");
    }
  }, [form.program]);
  // ===================================================================
  // END: useEffect to generate Student ID
  // ===================================================================


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));

    //clear specific field error on change
    if (name === "username") setUsernameError("");
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = " Required";

    if (!form.lastName.trim()) e.lastName = " Required";

    if (!form.email.trim()) e.email = " Required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = " Invalid email";

    if (!form.phone.trim()) e.phone = " Required";
    else if (!/^\d{10}$/.test(form.phone)) e.phone = " Invalid phone number";

    if (!form.birthday.trim()) e.birthday = " Required";

    if (!form.department.trim()) e.department = " Required";

    if (!form.program.trim() || form.program === "Select...")
      e.program = " Required";

    if (!form.username.trim()) e.username = " Required";

    if (!form.password.trim()) e.password = " Required";
    else if (form.password.length < 6)
      e.password = " Password must be at least 6 characters long";
      
    // Include validation for studentId generation
    if (!studentId && form.program) e.studentId = "Error generating ID"; 
    
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (!studentId) return; // Stop if ID wasn't generated properly

    //get users from local storage
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    //check if username already exists
    const exists = users.some(
      (u) =>
        u.username.trim().toLowerCase() === form.username.trim().toLowerCase()
    );
    if (exists) {
      setUsernameError("Username already taken");
      setErrors((err) => ({ ...err, username: " Username already taken" }));
      return;
    }

    // Re-check ID uniqueness in case another user signed up since last render
    let finalStudentId = studentId;
    const { prefix, next } = computeNextSeqForPrefix(form.program);
    if (!finalStudentId.startsWith(prefix) || parseInt(finalStudentId.split('-').pop()) < next) {
        // If the ID is outdated, generate the next unique one
        let seq = next;
        let candidate = `${prefix}-${pad4(seq)}`;
        while (users.some((u) => u?.profile?.studentId === candidate)) {
          seq += 1;
          candidate = `${prefix}-${pad4(seq)}`;
        }
        finalStudentId = candidate;
    }


    // ===================================================================
    // START: CORRECT PROFILE SAVING
    // The profile object now correctly includes all form fields AND the generated studentId.
    // ===================================================================
    const newUser = {
      id:
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : Date.now().toString(),
      username: form.username.trim().toLowerCase(),
      password: form.password,
      role: "student",
      profile: {
          studentId: finalStudentId, // Crucial: Add generated ID
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        birthday: form.birthday.trim(),
        department: form.department.trim(),
        program: form.program.trim(),
        selectedCourses: [], // Initialize for StudentDashboard
      },
    };
    // ===================================================================
    // END: CORRECT PROFILE SAVING
    // ===================================================================


    const updatedUSers = [...users, newUser];
    localStorage.setItem("users", JSON.stringify(updatedUSers));

    // After signup, we need to create the 'bvc.profile' key used by Profile.jsx
    // This makes the profile fields available immediately upon login.
    localStorage.setItem(
      "bvc.profile",
      JSON.stringify({
        ...newUser.profile, // Spread all the newly saved profile data
        status: "STUDENT", // Add the status field Profile.jsx expects
      })
    );


    alert("Signup successful! Please log in.");
    setForm(initialForm);
    setErrors({});
    setUsernameError("");
    navigate("/login"); //redirect to login page
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2 className="signup-title">Student Sign Up</h2>

        <form onSubmit={onSubmit} noValidate className="form">
          <div className="form-row">
            <Input
              id="firstName"
              name="firstName"
              label="First Name"
              value={form.firstName}
              onChange={handleChange}
              error={errors.firstName}
            />
            <Input
              id="lastName"
              name="lastName"
              label="Last Name"
              value={form.lastName}
              onChange={handleChange}
              error={errors.lastName}
            />
          </div>

          <Input
            id="email"
            name="email"
            label="Email"
            type="email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
          />

          <Input
            id="phone"
            name="phone"
            label="Phone Number"
            placeholder="1234567890"
            value={form.phone}
            onChange={handleChange}
            error={errors.phone}
          />

          <Input
            id="birthday"
            name="birthday"
            label="Birthday"
            type="date"
            value={form.birthday}
            onChange={handleChange}
            error={errors.birthday}
          />

          <div className="form-row">
            <Select
              id="department"
              name="department"
              label="Department"
              value={form.department}
              onChange={handleChange}
              error={errors.department}
              options={DEPARTMENTS}
            />

            <Select
              id="program"
              name="program"
              label="Program"
              value={form.program}
              onChange={handleChange}
              error={errors.program}
              options={PROGRAMS}
            />
          </div>
          
          {/* Student ID display field */}
          <Input
            id="studentId"
            name="studentId"
            label="Student ID"
            value={form.program ? studentId : 'Select a Program to generate ID'}
            readOnly
            placeholder=" "
            error={errors.studentId}
          />


          <Input
            id="username"
            name="username"
            label="Username"
            value={form.username}
            onChange={handleChange}
            error={errors.username || usernameError}
          />

          <Input
            id="password"
            name="password"
            label="Password"
            type="password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
          />

          <button type="submit" className="submit-button">
            {" "}
            ✨ Sign Up{" "}
          </button>
        </form>
      </div>
    </div>
  );
}