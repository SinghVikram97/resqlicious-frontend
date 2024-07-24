import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ResetPassword = () => {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/auth/reset-password', { token, newPassword: password });
            setMessage('Password reset successful.');
        } catch (error) {
            setMessage('Error resetting password.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                required
            />
            <button type="submit">Submit</button>
            {message && <p>{message}</p>}
        </form>
    );
};

export default ResetPassword;
