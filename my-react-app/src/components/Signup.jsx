import React , { useState} from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Signup.css';


//This will be replaced with data from backend later
import { programData } from "../data/demoData";


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
     ...Array.from(new Set(programData.map((prog) => prog.department))).map((dept) => ({
        value: dept,
        label: dept,
        })),
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


export default function Signup() {
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [usernameError, setUsernameError] = useState("");
    const navigate = useNavigate();
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));

        //clear specific field error on change
        if (name === "username") setUsernameError("");
    };

    const validate = () => {
        const e= {};
        if (!form.firstName.trim()) 
            e.firstName =" Required";

        if (!form.lastName.trim()) 
            e.lastName = " Required";

        if (!form.email.trim()) e.email = " Required";
        else if (!/\S+@\S+\.\S+/.test(form.email)) 
            e.email = " Invalid email";


        if (!form.phone.trim()) e.phone = " Required";
        else if (!/^\d{10}$/.test(form.phone))
            e.phone = " Invalid phone number";

        if (!form.birthday.trim()) 
            e.birthday = " Required";
        
        if (!form.department.trim()) 
            e.department = " Required";

        if (!form.program.trim() || form.program === "Select...") 
            e.program = " Required";

        if (!form.username.trim()) 
            e.username = " Required";

        if (!form.password.trim()) 
            e.password = " Required";
        else if(form.password.length < 6) e.password = " Password must be at least 6 characters long";

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;


        //get users from local storage
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    //check if username already exists
    const exists = users.some(
            (u) => u.username.trim().toLowerCase() === form.username.trim().toLowerCase()
        
        );
        if (exists) {
            setUsernameError("Username already taken");
            setErrors((err) => ({ ...err, username: " Username already taken" }));
            return;
        }

    const newUser = { 
        id: 
            typeof crypto !== 'undefined' && crypto.randomUUID
             ? crypto.randomUUID() 
             : Date.now().toString(),
        username: form.username.trim().toLowerCase(),
        password: form.password,
        role: "student",
           profile: {
                firstName: form.firstName.trim(),
                lastName: form.lastName.trim(),
                email: form.email.trim(),
                phone: form.phone.trim(),
                birthday: form.birthday.trim(),
                department: form.department.trim(),
                program: form.program.trim(),
            },
        };

    
    const updatedUSers = [...users, newUser];
    localStorage.setItem("users", JSON.stringify(updatedUSers));


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

                <form onSubmit={onSubmit} noValidate>
                    <div className="row">
                        <div className="field">
                            <label htmlFor="firstName">First Name</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={form.firstName}
                                onChange={handleChange}
                                />
                            {errors.firstName && <small className="error">{errors.firstName}</small>}
                        </div>

                <div className="field">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                    />
                    {errors.lastName && <small className="error">{errors.lastName}</small>}
                </div>
            </div>

            <div className="field">
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                />
                {errors.email && <small className="error">{errors.email}</small>}
            </div>

            <div className="field">
                <label htmlFor="phone">Phone Number</label>
                <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="1234567890"
                    value={form.phone}
                    onChange={handleChange}
                />
                {errors.phone && <small className="error">{errors.phone}</small>}
            </div>

            <div className="field">
                <label htmlFor="birthday">Birthday</label>
                <input
                    type="date"
                    id="birthday"
                    name="birthday"
                    value={form.birthday}
                    onChange={handleChange}
                />
                {errors.birthday && <small className="error">{errors.birthday}</small>}
            </div>

            <div className="row">
                <div className="field">
                    <label htmlFor="department">Department</label>
                    <select
                        id="department"
                        name="department"
                        value={form.department}
                        onChange={handleChange}
                    >
                     {DEPARTMENTS.map((opt) => (
                  <option key={opt.value || "blank"} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
                    </select>
                    {errors.department &&  (
                        <small className="error">{errors.department}</small>
                    )}
                </div>

             <div className="field">
              <label htmlFor="program">Program</label>
              <select
                id="program"
                name="program"
                value={form.program}
                onChange={handleChange}
              >
                {PROGRAMS.map((opt) => (
                  <option key={opt.value || "blank"} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {errors.program && (
                <small className="error">{errors.program}</small>
              )}
            </div>
          </div>

            <div className="row">
                <div className="field">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                    />

                    {(errors.username || usernameError) &&                  
                    ( <small className="error">{errors.username}</small>)}
                </div>
            </div>

            <div className="field">
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                />
                {errors.password && <small className="error">{errors.password}</small>}
            </div> 

            <button type="submit" className="submit-button">
                ✨ Sign Up
            </button>
        </form>
    </div>
</div>
    );
}
        
