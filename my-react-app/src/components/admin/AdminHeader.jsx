
import React from 'react';

const AdminHeader = ({ adminName, status }) => (
    <div className="admin-header-area">
        <div className="admin-icon-title">
            <span className="icon-placeholder">👤</span> 
            <h1 className="admin-title-text">ADMIN DASHBOARD</h1>
        </div>
        <div className="admin-info-fields">
            <div className="info-field">
                <label>ADMIN NAME:</label>
                <div className="info-value">{adminName}</div>
            </div>
            <div className="info-field">
                <label>STATUS:</label>
                <div className="info-value status-value">{status}</div>
            </div>
        </div>
    </div>
);
export default AdminHeader;