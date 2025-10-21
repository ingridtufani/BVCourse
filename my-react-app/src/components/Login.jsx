import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "./ui/Card";
import "../styles/Login.css";

const getUsers = () => JSON.parse(localStorage.getItem("users") || "[]");

function LoginForm() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const users = getUsers();
    let loggedUser = null;

    // Check for the mock admin user
    if (userName.trim().toLowerCase() === "admin" && password === "admin123") {
      loggedUser = { 
          id: 999, 
          username: "admin", 
          role: "admin",
          profile: { firstName: "Admin", lastName: "User" } 
      };
    } else {
      // Check registered users
      loggedUser = users.find(
        (user) => user.username === userName && user.password === password
      );
    }

    if (loggedUser) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("currentUser", JSON.stringify(loggedUser));
      localStorage.setItem("userRole", loggedUser.role);
      
      // Save student profile data for bvc.profile key used by StudentDashboard/Profile
      if (loggedUser.role === "student") {
        localStorage.setItem(
          "bvc.profile",
          JSON.stringify({
            // Existing fields
            firstName: loggedUser.profile.firstName || "",
            lastName: loggedUser.profile.lastName || "",
            studentId: loggedUser.profile.studentId || "",
            program: loggedUser.profile.program || "",
            status: "STUDENT",
            selectedCourses: loggedUser.profile.selectedCourses || [],
            // --- FIX: ADD MISSING PROFILE FIELDS ---
            email: loggedUser.profile.email || "",
            phone: loggedUser.profile.phone || "",
            birthday: loggedUser.profile.birthday || "",
            department: loggedUser.profile.department || "",
            // --- END FIX ---
          })
        );
      }

      window.dispatchEvent(new Event("auth-changed"));

      const dest =
        loggedUser.role === "student" ? "/studentDashboard" : "/adminDashboard";
      navigate(dest);
    } else {
      setError("Invalid Credentials");
    }
  }

  return (
    <Card className="login-card">
      <div className="login-container">
        <h1 className="login-title">LOGIN</h1>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit} className="login-form">
          <label className="login-label">USERNAME</label>
          <input
            className="login-input"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />

          <label className="login-label">PASSWORD</label>
          <input
            className="login-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </Card>
  );
}
export default LoginForm;