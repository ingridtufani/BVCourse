import React from 'react';
import Card from '../ui/Card'; // Assuming Card.jsx is now in the same directory or adjust path
import Button from '../ui/Button'; // Assuming Button.jsx is available

const CourseCard = ({ title, onEdit, onDelete, description }) => (
    <Card className="course-card">
        <div className="course-icon">📘</div>
        <h3>{title}</h3>
        
        <h2 className="placeholder-line full-width">{description}</h2>
        
        <div className="card-actions">
            <Button onClick={onEdit} variant="btn-outline" className="edit-button">Edit</Button>
            <Button onClick={onDelete} variant="btn-primary" className="delete-button">Delete</Button>
        </div>
    </Card>
);
export default CourseCard;