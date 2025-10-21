import React, { useState } from 'react';
import Input from '../ui/Input'; // Assuming Input.jsx is available
import Button from '../ui/Button'; // Assuming Button.jsx is available

// NEW: Helper function to generate the required course code (SD + three random numbers)
const generateCourseCode = () => {
    // Generate 3 random digits (000-999) and pad with leading zeros
    const randomDigits = String(Math.floor(Math.random() * 1000)).padStart(3, '0'); 
    return `SD${randomDigits}`;
};

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
        
        // NEW: 1. Generate the unique code
        const newCourseCode = generateCourseCode();

        // NEW: 2. Create the final data object including the generated code
        const finalCourseData = {
            ...formData,
            code: newCourseCode, // Add the code here
        };

        onCreate(finalCourseData);
        // Clear form after submission
        setFormData({ courseName: '', term: '', startDate: '', endDate: '', description: '' });
    };

    return (
        <form onSubmit={handleSubmit} className="course-creator-form">
            <div className="form-row">
                <Input 
                    id="courseName"
                    label="Course Name:"
                    name="courseName" 
                    value={formData.courseName} 
                    onChange={handleChange} 
                    required 
                    type="text"
                />
                <Input 
                    id="term"
                    label="Term:"
                    name="term" 
                    value={formData.term} 
                    onChange={handleChange}
                    type="text" 
                />
            </div>
            <div className="form-row">
                <Input 
                    id="startDate"
                    label="Start Date:"
                    name="startDate" 
                    value={formData.startDate} 
                    onChange={handleChange}
                    type="date"
                />
                <Input 
                    id="endDate"
                    label="End Date:"
                    name="endDate" 
                    value={formData.endDate} 
                    onChange={handleChange}
                    type="date"
                />
            </div>
            {/* Note: Keeping textarea as raw HTML since no custom Textarea component was provided */}
            <div className="form-full">
                <label htmlFor="description">Description:</label>
                <textarea 
                    id="description"
                    name="description" 
                    value={formData.description} 
                    onChange={handleChange}
                ></textarea>
            </div>
            
            <Button type="submit" variant="btn-primary" className="create-course-button">
                Create Course
            </Button>
        </form>
    );
};
export default CourseCreator;