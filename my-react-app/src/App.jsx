import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
//import Card from "./components/ui/Card";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Profile from "./components/Profile";
import StudentDashboard from "./components/StudentDashboard";
import AdminDashboard from "./components/AdminDashboard";
import ContactForm from "./components/ContactForm";

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
            <Route path="/login" element={<Login />} />
            <Route path="/studentDashboard" element={<StudentDashboard />} />
            <Route path="/adminDashboard" element={<AdminDashboard />} />
            <Route path="/contact" element={<ContactForm />} />
          </Routes>
        </main>
        <footer>
          <div className="container">
            <small style={{ color: "var(--text-light)" }}>
              &copy; {new Date().getFullYear()} Bow Course Registration — SD
              Department
            </small>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
