import React from 'react';

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
                <button className="view-details-button">View Details</button>
            </div>
        ))}
    </div>
);
export default StudentList;