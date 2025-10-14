
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { initialCourses, initialStudents, initialMessages } from '../data/demoData'; 

import AdminHeader from './admin/AdminHeader';
import CourseManagement from './admin/CourseManagement';
import CourseCreator from './admin/CourseCreator';
import StudentList from './admin/StudentList';
import ContactMessages from './admin/ContactMessages';

import '../styles/AdminDashboard.css'; // Estilos específicos

function AdminDashboard() {
    // 1. Estados Centrais
    const [courses, setCourses] = useState(initialCourses);
    const [students] = useState(initialStudents);
    const [messages] = useState(initialMessages);
    const navigate = useNavigate();

    // 2. Lógica de Criação de Curso (passada para CourseCreator)
    const handleCreateCourse = useCallback((newCourseData) => {
        const newId = courses.length > 0 ? Math.max(...courses.map(c => c.id)) + 1 : 1;
        setCourses(prevCourses => [
            ...prevCourses, 
            { id: newId, title: newCourseData.courseName }
        ]);
    }, [courses]);

    // 3. Lógica de Logout
    const handleLogout = () => {
        localStorage.removeItem('userRole');
        localStorage.removeItem('isLoggedIn');
        navigate('/'); 
    };

    return (
        <div className="admin-page-layout">
            <button onClick={handleLogout} className="logout-simple-button">Logout</button>
            
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