import { useNavigate } from "react-router-dom";
import Button from "./Button";

export default function LogoutButton() {
  const navigate = useNavigate();

  function handleLogout() {
    // Clean all session/auth-related keys from local storage
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("bvc.profile"); // Crucial to clear profile data
    localStorage.removeItem("userRole"); // Clear old/redundant key for safety

    // Dispatch event to update Navbar/other listeners
    window.dispatchEvent(new Event("auth-changed"));

    // Redirects to login, using { replace: true } prevents navigating back
    navigate("/login", { replace: true });
  }

  // Note: Since this component is likely used in a Navigation bar,
  // it retains the raw button structure to fit those styles.
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