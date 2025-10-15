import React from 'react';
import Card from '../ui/Card';

const CourseCard = ({ title, onEdit, onDelete }) => (
    <Card className="course-card">
        <div className="course-icon">📘</div>
        <h3>{title}</h3>
        
        <div className="placeholder-line full-width"></div>
        <div className="placeholder-line full-width"></div>
        <div className="placeholder-line reduced-width"></div>
        
        <div className="card-actions">
        </div>
    </Card>
);
export default CourseCard;