import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "./ui/Card";
import "../styles/Login.css";
import LogoutButton from "./ui/LogoutButton";

// const MOCK_USERS = [
//     { username: 'student', password: '123', role: 'student', id: 1 },
//     { username: 'admin', password: '123', role: 'admin', id: 2 },
// ];

const getUsers = () => JSON.parse(localStorage.getItem("users") || "[]");

function LoginForm() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  //   function handleUsernameChange(e) {
  //     setUserName(e.target.value);
  //   }

  //   function handlePasswordChange(e) {
  //     setPassword(e.target.value);
  //   }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // const loggedUser = MOCK_USERS.find(
    //   (user) => user.username === userName && user.password === password
    // );

    const users = getUsers();

    if (userName.trim().toLowerCase() === "admin" && password === "admin123") {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          id: "admin-001",
          role: "admin",
          username: "admin",
          profile: { firstName: "Administrator" },
        })
      );

      localStorage.setItem(
        "bvc.profile",
        JSON.stringify({
          firstName: "Administrator",
          lastName: "",
          studentId: "ADMIN",
          program: "",
          status: "ADMINISTRATOR",
        })
      );

      window.dispatchEvent(new Event("auth-changed"));
      navigate("/adminDashboard");
      return;
    }

    const loggedUser = users.find(
      (u) =>
        u.username.trim().toLowerCase() === userName.trim().toLowerCase() &&
        u.password === password
    );

    if (loggedUser) {
      //   localStorage.setItem("userRole", loggedUser.role);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          id: loggedUser.id,
          role: loggedUser.role,
          username: loggedUser.username,
          profile: loggedUser.profile,
        })
      );

      localStorage.setItem(
        "bvc.profile",
        JSON.stringify({
          firstName: loggedUser.profile.firstName || "",
          lastName: loggedUser.profile.lastName || "",
          studentId: loggedUser.profile.studentId || "",
          program: loggedUser.profile.program || "",
          status: "STUDENT",
        })
      );

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
