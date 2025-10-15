import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Card from "./components/ui/Card";
import Signup from "./components/Signup";
import Profile from "./components/Profile";
import StudentDashboard from "./components/StudentDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/studentdashboard" element={<StudentDashboard />} />
            <Route
              path="/login"
              element={
                <div className="container text-center">
                  <Card className="p-3" style={{ maxWidth: 400, margin: "0 auto" }}>
                    <h2 style={{ color: "var(--primary-color)" }}>Login</h2>
                    <p style={{ color: "var(--text-light)" }}>Login page coming soon...</p>
                  </Card>
                </div>
              }
            />
          </Routes>
        </main>
        <footer>
          <div className="container">
            <small style={{ color: "var(--text-light)" }}>
              &copy; {new Date().getFullYear()} Bow Course Registration — SD Department
            </small>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
