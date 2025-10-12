import React , {useState} from "react";
import '../styles/Signup.css';



const DEPARTMENTS = [
    "Computer Science",
    "Information Technology",
    "Software Engineering",
    "Cyber Security",
];

const PROGRAMS = [
    "Select...",
    "SODV1210 - Web Development",
    "SODV1211 - Mobile App Development",
    "SODV1212 - Backend Development",
    "SODV1213 - Frontend Development",
    "SODV1214 - Full Stack Development",
    "SODV1215 - Database Management",
    "SODV1216 - Cloud Computing",
    "SODV1217 - DevOps",
    "SODV1218 - Cyber Security",
    "SODV1219 - Software Testing",
    "SODV1220 - Agile Methodologies",
    "SODV1221 - Project Management",
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
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

        //submit the form
            console.log("Submitting signup Form", form);
        //clean it
            alert("Signup successful!");
            setForm(initialForm);
            setErrors({});
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
                        {DEPARTMENTS.map((dept) => (
                            <option key={dept} value={dept}>
                                {dept}
                            </option>
                        ))}
                    </select>
                    {errors.department && <small className="error">{errors.department}</small>}
                </div>

                <div className="field">
                    <label htmlFor="program">Program</label>
                    <select
                        id="program"
                        name="program"
                        value={form.program}
                        onChange={handleChange}
                    >
                        {PROGRAMS.map((prog) => (
                            <option key={prog} value={prog}>
                                {prog}
                            </option>
                        ))}
                    </select>
                    {errors.program && <small className="error">{errors.program}</small>}
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
                    {errors.username && <small className="error">{errors.username}</small>}
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
        
