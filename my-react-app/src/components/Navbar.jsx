import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LogoutButton from "./ui/LogoutButton";

const Navbar = () => {
  const readAuth = () => {
    const raw = localStorage.getItem("currentUser");
    const currentUser = raw ? JSON.parse(raw) : null;
    const isLoggedIn =
      localStorage.getItem("isLoggedIn") === "true" && !!currentUser;
    return { isLoggedIn, currentUser };
  };

  const [auth, setAuth] = useState(readAuth());

  useEffect(() => {
    const sync = () => setAuth(readAuth());
    window.addEventListener("storage", sync);
    window.addEventListener("auth-changed", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("auth-changed", sync);
    };
  }, []);

  const { isLoggedIn, currentUser } = auth;

  return (
    <nav className="navbar">
      <div className="container nav-content">
        <Link to="/" className="nav-logo">
          <span>🎓</span>
          Bow Registration
        </Link>

        <div className="nav-links">
          <Link to="/" className="nav-link">
            Home
          </Link>

          {!isLoggedIn ? (
            <>
              <Link to="/signup" className="nav-link">
                Signup
              </Link>

              <Link to="/login" className="nav-link">
                Login
              </Link>
            </>
          ) : (
            <>
              <span className="nav-user">
                Welcome,{" "}
                <strong>
                  {currentUser?.profile?.firstName || currentUser?.username}
                </strong>
              </span>
              <LogoutButton />
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
