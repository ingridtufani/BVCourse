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

//creating Student ID
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

// const generateStudentId = (programCode) => {
//   const year = new Date().getFullYear();
//   const prefix = buildIdPrefix(programCode, year);
//   const users = getUsers();
//   const seq = nextSequenceFor(users, prefix);
//   return `${prefix}-${pad4(seq)}`;
// };

// -----------------------------------

export default function Signup() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [usernameError, setUsernameError] = useState("");
  const [studentId, setStudentId] = useState("");
  const navigate = useNavigate();

  //student id generated
  useEffect(() => {
    if (form.program) {
      setStudentId(previewStudentId(form.program));
    } else {
      setStudentId("");
    }
  }, [form.program]);

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

    //it will depend on the program to generate the Student Id here
    if (!studentId) e.studentId = "Choose a Program";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    //get users from local storage
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    const exists = users.some(
      (u) =>
        u.username.trim().toLowerCase() === form.username.trim().toLowerCase()
    );
    if (exists) {
      setUsernameError("Username already taken");
      setErrors((err) => ({ ...err, username: " Username already taken" }));
      return;
    }

    //calculating the ID for next prefix
    const { prefix, next } = computeNextSeqForPrefix(form.program);

    let seq = next;
    let candidate = `${prefix}-${pad4(seq)}`;

    //check if username already exists
    while (users.some((u) => u?.profile?.studentId === candidate)) {
      seq += 1;
      candidate = `${prefix}-${pad4(seq)}`;
    }

    const finalStudentId = candidate;

    const newUser = {
      id:
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : Date.now().toString(),
      username: form.username.trim().toLowerCase(),
      password: form.password,
      role: "student",
      profile: {
        studentId: finalStudentId,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        birthday: form.birthday.trim(),
        department: form.department.trim(),
        program: form.program.trim(),
      },
    };

    const updatedUsers = [...users, newUser];
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    localStorage.setItem(
      "bvc.profile",
      JSON.stringify({
        firstName: newUser.profile.firstName,
        lastName: newUser.profile.lastName,
        studentId: newUser.profile.studentId,
        program: newUser.profile.program,
        status: "STUDENT",
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
        <h2 className="signup-title">Sign Up</h2>

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

          <Input
            id="studentId"
            name="studentId"
            label="Student ID"
            value={studentId}
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
