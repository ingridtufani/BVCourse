// src/components/Admin/CourseCard.jsx (Ajustado)

import React from 'react';
import Card from '../ui/Card';

const CourseCard = ({ title, onEdit, onDelete }) => (
    <Card className="course-card">
        <div className="course-icon">📘</div>
        <h3>{title}</h3>
        
        {/* Adicione as divs placeholder aqui */}
        <div className="placeholder-line full-width"></div>
        <div className="placeholder-line full-width"></div>
        <div className="placeholder-line reduced-width"></div>
        
        <div className="card-actions">
            {/* ... botões ... */}
        </div>
    </Card>
);
export default CourseCard;