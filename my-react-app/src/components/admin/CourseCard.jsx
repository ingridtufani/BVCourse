import React from 'react';
import Card from '../ui/Card';

const CourseCard = ({ course, onEdit, onDelete }) => (
    <Card className="course-card">
        <div className="course-icon">📘</div>
        {/* Use course properties */}
        <h3>{course.name || course.title}</h3>
        
        <p className="placeholder-line full-width">{course.description || 'No description available.'}</p>
        <p style={{fontSize: '12px', color: '#666'}}>Code: {course.code}</p>
        
        <div className="card-actions">
            {/* Pass the course object to the startEdit function in the parent */}
            <button onClick={() => onEdit(course)} className="edit-button">Edit</button>
            {/* FIX: Pass course.code instead of course.id to onDelete */}
            <button onClick={() => onDelete(course.code)} className="delete-button">Delete</button>
        </div>
    </Card>
);
export default CourseCard;