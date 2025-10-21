import React from 'react';
import Button from '../ui/Button'; // Assuming ui/Button is the path

const StudentList = ({ students }) => (
    <div className="student-list">
        {students.map(student => (
            <div key={student.id} className="student-item">
                <span className="icon-placeholder">👤</span>
                <div className="student-details">
                    <p className="student-name">{student.name}</p>
                    <p>ID: {student.id} | Program: {student.program} | Email: {student.email}</p>
                </div>
                <span className={`student-status ${student.status.toLowerCase()}`}>{student.status}</span>
                <Button variant="btn-ghost" className="view-details-button">View Details</Button>
            </div>
        ))}
    </div>
);
export default StudentList;