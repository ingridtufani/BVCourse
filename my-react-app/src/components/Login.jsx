import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "./ui/Card";
import "../styles/Login.css";

// Helper to load registered student and admin data
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

    // 1. Check for the mock admin user
    if (userName.trim().toLowerCase() === "admin" && password === "admin123") {
      loggedUser = { 
          id: 999, 
          username: "admin", 
          role: "admin",
          profile: { firstName: "Admin", lastName: "User" } 
      };
    } else {
      // 2. Check registered users
      loggedUser = users.find(
        (user) => user.username === userName && user.password === password
      );
    }

    if (loggedUser) {
      // --- AUTHENTICATION SUCCESS ---
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("currentUser", JSON.stringify(loggedUser));
      
      // FIX: Set the user role explicitly for route protection checks
      localStorage.setItem("userRole", loggedUser.role); 

      // Save student profile data (for bvc.profile key used by StudentDashboard)
      if (loggedUser.role === "student") {
        localStorage.setItem(
          "bvc.profile",
          JSON.stringify({
            firstName: loggedUser.profile.firstName || "",
            lastName: loggedUser.profile.lastName || "",
            studentId: loggedUser.profile.studentId || "",
            program: loggedUser.profile.program || "",
            status: "STUDENT",
            selectedCourses: loggedUser.profile.selectedCourses || [],
          })
        );
      }

      window.dispatchEvent(new Event("auth-changed"));

      // Redirect based on role
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
                        onChange={handleUsernameChange} 
                        required
                    />
                    
                    <label className="login-label">PASSWORD</label>
                    <input 
                        className="login-input"
                        type="password"
                        value={password}
                        onChange={handlePasswordChange} 
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