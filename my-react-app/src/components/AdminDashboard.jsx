import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { courseData } from "../data/demoData"; 
import AdminHeader from "./admin/AdminHeader";
import CourseManagement from "./admin/CourseManagement";
import CourseCreator from "./admin/CourseCreator";
import StudentList from "./admin/StudentList";
import ContactMessages from "./admin/ContactMessages";
import { getMessages } from "../data/messageStore";

import "../styles/AdminDashboard.css";

// Helper function to get the current user's role and login status
const getAuthStatus = () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const userRole = localStorage.getItem("userRole"); 
    return { isLoggedIn, userRole };
};

// Helper function to get all registered users (Students and Admin)
const getUsers = () => JSON.parse(localStorage.getItem("users") || "[]");


function AdminDashboard() {
  const navigate = useNavigate();
  const { isLoggedIn, userRole } = getAuthStatus();

  // --- ACCESS PROTECTION LOGIC ---
  if (!isLoggedIn || userRole !== 'admin') {
    // If not logged in, redirect to login after rendering the message
    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login", { replace: true });
        }
    }, [isLoggedIn, navigate]);

    // Render the access denied message
    return (
        <div style={{ padding: '50px', textAlign: 'center' }}>
            <h1>🚫 Access Denied</h1>
            <p>You must be logged in as an **Administrator** to view this page.</p>
            <button onClick={() => navigate('/login')}>Go to Login</button>
        </div>
    );
  }
  // --- END ACCESS PROTECTION LOGIC ---
  
  const [courses, setCourses] = useState(courseData); 
  
  // Load and filter registered students from localStorage
  const registeredUsers = getUsers();
  const studentList = registeredUsers.filter(user => user.role === 'student');

  // Map the registered user data to the format expected by StudentList
  const [students] = useState(studentList.map(user => ({
      id: user.profile?.studentId || user.id,
      name: `${user.profile?.firstName || ''} ${user.profile?.lastName || ''}`.trim(),
      program: user.profile?.program || 'N/A',
      email: user.profile?.email || user.username || 'N/A',
      status: 'Enrolled'
  })));

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages(getMessages());
  }, []);

  const refresh = () => setMessages(getMessages());

  const handleCreateCourse = useCallback(
    (newCourseData) => {
      const maxId = courses.length > 0 ? Math.max(...courses.map((c) => c.id || 0)) : 0;
      const newId = maxId + 1;
      
      setCourses((prevCourses) => [
        ...prevCourses,
        { 
          id: newId, 
          code: `NEW-${newId}`,
          name: newCourseData.courseName, 
          description: newCourseData.description || '',
        },
      ]);
    },
    [courses]
  );
  
  return (
    <div className="admin-page-layout">
      {/* Logout is handled in Navbar component */}

      <AdminHeader adminName="ADMIN USER" status="ADMINISTRATOR" />

            <section className="dashboard-section">
                <h2>📘 Manage Courses:</h2>
                <CourseManagement courses={courses} setCourses={setCourses} />
            </section>
            
            <hr className="divider" /> 

            <section className="dashboard-section">
                <h2>➕ Create New Course</h2>
                <CourseCreator onCreate={handleCreateCourse} />
            </section>
            
            <hr className="divider" />

      <section className="dashboard-section">
        <h2>👤 Registered Students ({students.length})</h2> 
        <StudentList students={students} />
      </section>

      <hr className="divider" />

            <section className="dashboard-section">
                <h2>✉️ Contact Message ({messages.length})</h2>
                <ContactMessages messages={messages} />
            </section>
        </div>
    );
}

export default AdminDashboard;