import React, { useState } from 'react';
import CourseCard from './CourseCard';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Card from '../ui/Card';

const CourseManagement = ({ courses, setCourses, onEdit }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [currentCourse, setCurrentCourse] = useState(null);

    // FIX: Change identifier to 'code' and filter courses based on course.code
    const handleDelete = (code) => {
        setCourses(courses.filter(course => course.code !== code));
    };
    
    // Function to open the edit modal
    const startEdit = (course) => {
        // Prepare the course data for editing
        setCurrentCourse({
            ...course,
            name: course.name || course.title,
            description: course.description || '',
        });
        setIsEditing(true);
    };

    // Handle input changes in the modal form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentCourse(prev => ({ ...prev, [name]: value }));
    };

    // Submit the changes
    const handleSubmit = (e) => {
        e.preventDefault();
        onEdit(currentCourse); // Call the handler passed from AdminDashboard
        setIsEditing(false);
        setCurrentCourse(null);
    };

    return (
        <div className="course-management-container">
            <div className="course-grid">
                {courses.map(course => (
                    <CourseCard 
                        // Keying by code or a combination is more robust than id if id is not guaranteed unique
                        key={course.code || course.id || course.name}
                        course={course}
                        onEdit={startEdit} // Calls startEdit with the course data
                        onDelete={handleDelete}
                    />
                ))}
            </div>

            {/* NEW: Edit Course Modal */}
            {isEditing && currentCourse && (
                <div 
                    className="modal-backdrop" 
                    style={{ 
                        position: 'fixed', 
                        top: 0, 
                        left: 0, 
                        right: 0, 
                        bottom: 0, 
                        backgroundColor: 'rgba(0,0,0,0.5)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        zIndex: 1000 
                    }}
                    onClick={() => setIsEditing(false)} 
                >
                    <Card 
                        className="modal-content" 
                        style={{ padding: 20, width: '90%', maxWidth: 500, margin: '50px auto' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 style={{ marginBottom: 20, fontSize: 18 }}>✏️ Edit Course: {currentCourse.name}</h2>
                        <form onSubmit={handleSubmit}>
                            <Input
                                id="name"
                                name="name"
                                label="Course Name"
                                value={currentCourse.name}
                                onChange={handleChange}
                                required
                            />
                            <div style={{ marginTop: 15 }}>
                                <label className="form-label">Description</label>
                                <textarea
                                    name="description"
                                    value={currentCourse.description}
                                    onChange={handleChange}
                                    rows={4}
                                    style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4, resize: 'vertical' }}
                                />
                            </div>
                            
                            <Input
                                id="code"
                                name="code"
                                label="Course Code (Read-Only)"
                                value={currentCourse.code}
                                readOnly
                                style={{ marginTop: 15 }}
                            />

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 25 }}>
                                <Button type="button" variant="btn-outline" onClick={() => setIsEditing(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="btn-primary">
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
};
export default CourseManagement;