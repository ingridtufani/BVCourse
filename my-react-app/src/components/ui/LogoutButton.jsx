import { useNavigate } from "react-router-dom";
import Button from "./Button";

export default function LogoutButton() {
  const navigate = useNavigate();

  function handleLogout() {
    //clean the session
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");

    window.dispatchEvent(new Event("auth-changed"));

    //the redirects to login
    navigate("/login", { replace: true });
  }

  return (
    <button
      onClick={handleLogout}
      className="nav-link"
      style={{
        border: "none",
        background: "none",
        cursor: "pointer",
        font: "inherit",
        color: "inherit",
        padding: 0,
      }}
    >
      Logout
    </button>
  );
}
