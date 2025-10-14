// src/components/Admin/CourseCreator.jsx

import React, { useState } from 'react';

const CourseCreator = ({ onCreate }) => {
    const [formData, setFormData] = useState({
        courseName: '', term: '', startDate: '', endDate: '', description: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onCreate(formData);
        // Resetar o formulário
        setFormData({ courseName: '', term: '', startDate: '', endDate: '', description: '' });
    };

    return (
        <form onSubmit={handleSubmit} className="course-creator-form">
            <div className="form-row">
                <div className="form-field"><label>Course Name: <input type="text" name="courseName" value={formData.courseName} onChange={handleChange} required /></label></div>
                <div className="form-field"><label>Term: <input type="text" name="term" value={formData.term} onChange={handleChange} /></label></div>
            </div>
            <div className="form-row">
                <div className="form-field"><label>Start Date: <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} /></label></div>
                <div className="form-field"><label>End Date: <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} /></label></div>
            </div>
            <div className="form-full"><label>Description: <textarea name="description" value={formData.description} onChange={handleChange}></textarea></label></div>
            
            <button type="submit" className="create-course-button">
                Create Course
            </button>
        </form>
    );
};
export default CourseCreator;