import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Card from './ui/Card';
import '../styles/Login.css';

const MOCK_USERS = [
    { username: 'student', password: '123', role: 'student', id: 1 },
    { username: 'admin', password: '123', role: 'admin', id: 2 },
];

function LoginForm() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const navigate = useNavigate(); 

    function handleUsernameChange(e) {
        setUserName(e.target.value);
    }

    function handlePasswordChange(e) {
        setPassword(e.target.value);
    }

   
    function handleSubmit(e) {
        e.preventDefault();
        setError('');
       
        const loggedUser = MOCK_USERS.find(
            user => user.username === userName && user.password === password
        );

        if (loggedUser) {
            localStorage.setItem('userRole', loggedUser.role);
            localStorage.setItem('isLoggedIn', 'true');
            
            navigate(loggedUser.role === 'student' ? '/studentDashboard' : '/adminDashboard');
        } else {
            setError('Invalid credentials');
        }
    }

    return (
        <Card className="login-card"> 
            <div className="login-container">
                <h1 className="login-title">LOGIN</h1>
                
                {error && <p className="error-message">{error}</p>} 
                
                <form onSubmit={handleSubmit} className="login-form">
                    
                    <label className="login-label">USERNAME</label>
                    <input 
                        className="login-input"
                        type="text"
                        value={userName}
                        onChange={handleUsernameChange} 
                        required
                    />
                    
                    <label className="login-label">PASSWORD</label>
                    <input 
                        className="login-input"
                        type="password"
                        value={password}
                        onChange={handlePasswordChange} 
                        required
                    />
                    
                    <button type="submit" className="login-button">
                        Login
                    </button>
                </form>
            </div>
        </Card>
    );
}

export default LoginForm;