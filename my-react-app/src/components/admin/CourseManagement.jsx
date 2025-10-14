// src/components/Admin/CourseManagement.jsx

import React from 'react';
import CourseCard from './CourseCard';

const CourseManagement = ({ courses, setCourses }) => {
    const handleEdit = (id) => alert(`Editando curso ${id}`);
    const handleDelete = (id) => {
        setCourses(courses.filter(course => course.id !== id));
    };

    return (
        <div className="course-grid">
            {courses.map(course => (
                <CourseCard 
                    key={course.id}
                    title={course.title}
                    onEdit={() => handleEdit(course.id)}
                    onDelete={() => handleDelete(course.id)}
                />
            ))}
        </div>
    );
};
export default CourseManagement;