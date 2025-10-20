import React from 'react';
import CourseCard from './CourseCard';

const CourseManagement = ({ courses, setCourses }) => {
    const handleEdit = (id) => alert(`Editing course... ${id}`);
    const handleDelete = (id) => {
        // Use the code (or id) as the unique identifier for deletion
        setCourses(courses.filter(course => (course.code || course.id) !== id)); 
    };

    return (
        <div className="course-grid">
            {courses.map(course => (
                <CourseCard 
                    key={course.code || course.id || course.name} // Use code or id as key
                    title={course.name} // Use 'name' as the title property
                    description={course.description}
                    onEdit={() => handleEdit(course.code || course.id)} // Pass unique identifier
                    onDelete={() => handleDelete(course.code || course.id)} // Pass unique identifier
                />
            ))}
        </div>
    );
};
export default CourseManagement;