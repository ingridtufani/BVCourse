import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { courseData } from "../data/demoData"; 
import AdminHeader from "./admin/AdminHeader";
import CourseManagement from "./admin/CourseManagement";
import CourseCreator from "./admin/CourseCreator";
import StudentList from "./admin/StudentList";
// Using ContactForm (now dual-purpose) for admin message viewing
import ContactForm from "./ContactForm"; 
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

/**
 * FIX 1: Robustly matches a message sender string to a student user object.
 * This is the function that ensures student ID/Email is found for the message.
 * @param {string} sender - The sender string from the message (e.g., "John Doe" or "johndoe").
 * @param {Array<Object>} students - The list of student user objects.
 * @returns {Object|undefined} The matched student user object.
 */
const findStudentByMessageSender = (sender, students) => {
    if (!sender) return undefined;
    const normalizedSender = sender.trim().toLowerCase();

    // 1. Try to match by exact username (if the sender field is the username)
    let user = students.find(s => s.username?.toLowerCase() === normalizedSender);

    if (!user) {
        // 2. If no match, try to match by full name (which is common for messages)
        user = students.find(s => {
            // Check if profile exists before accessing nested properties
            const fullName = `${s.profile?.firstName || ''} ${s.profile?.lastName || ''}`.trim().toLowerCase();
            return fullName === normalizedSender && fullName !== '';
        });
    }
    
    // Return the found user object, which contains the 'profile' data
    return user;
};


function AdminDashboard() {
  const navigate = useNavigate();
  const { isLoggedIn, userRole } = getAuthStatus();

  // --- ACCESS PROTECTION LOGIC ---
  if (!isLoggedIn || userRole !== 'admin') {
    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        } else {
            navigate('/');
        }
    }, [isLoggedIn, navigate]);
    return <div style={{padding: 20}}>Redirecting...</div>;
  }
  
  const allUsers = getUsers();
  // Filter for students only, as admin won't send a student message
  const studentUsers = allUsers.filter(u => u.role === 'student'); 


  const [messages, setMessages] = useState([]);
  const [courses, setCourses] = useState(courseData); 
  // Map studentUsers to a format suitable for StudentList, ensuring profile data is used
  const [students] = useState(studentUsers.map(s => ({ 
    id: s.profile.studentId, 
    name: `${s.profile.firstName} ${s.profile.lastName}`,
    program: s.profile.program,
    email: s.profile.email,
    status: 'ACTIVE'
  }))); 


  // Function to fetch/refresh messages, including enrichment logic
  const fetchMessages = useCallback(() => {
    const allMsgs = getMessages();
    
    // ENRICHMENT STEP: Map messages to include student ID and Email
    const enrichedMessages = allMsgs.map(msg => {
        // Use the refined finder function
        const student = findStudentByMessageSender(msg.sender, studentUsers);
        
        return {
            ...msg,
            // Access nested profile properties, providing a fallback
            studentId: student?.profile?.studentId || 'ID N/A',
            studentEmail: student?.profile?.email || 'Email N/A',
        };
    });

    setMessages(enrichedMessages);
  }, [studentUsers]);
  
  // Load messages on mount
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);


  // Handler for creating a new course (called from CourseCreator)
  const handleCreateCourse = useCallback(
    (newCourseData) => {
      setCourses((prevCourses) => [
        ...prevCourses,
        {
          id: prevCourses.length + 1,
          code: newCourseData.code,
          name: newCourseData.courseName,
          term: newCourseData.term,
          startDate: newCourseData.startDate,
          endDate: newCourseData.endDate,
          description: newCourseData.description || '',
        },
      ]);
    },
    [courses]
  );
  
  // Course Editing Logic (used by CourseManagement)
  const handleEditCourse = useCallback((updatedCourse) => {
    setCourses((prevCourses) =>
      prevCourses.map((course) =>
        course.id === updatedCourse.id ? updatedCourse : course
      )
    );
  }, []);
  
  return (
    <div className="admin-page-layout">

      <AdminHeader adminName="ADMIN USER" status="ADMINISTRATOR" />

      <section className="dashboard-section">
        <h2>📘 Manage Courses:</h2>
        <CourseManagement 
            courses={courses} 
            setCourses={setCourses} 
            onEdit={handleEditCourse}
        />
      </section>

      <hr className="divider" />

      <section className="dashboard-section">
        <h2>➕ Create New Course</h2>
        <CourseCreator onCreate={handleCreateCourse} />
      </section>

      <hr className="divider" />

      <section className="dashboard-section">
        <h2>👥 Registered Students:</h2>
        <StudentList students={students} />
      </section>

      <hr className="divider" />

      <section className="dashboard-section">
        <h2>✉️ Contact Messages:</h2>
        {/* Pass messages and refresh handler to trigger Admin View in ContactForm */}
        <ContactForm messages={messages} onRefresh={fetchMessages} />
      </section>
    </div>
  );
}
export default AdminDashboard;