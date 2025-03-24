// RegistrationForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../App';

const RegistrationForm = () => {
  const { setUser } = useUser();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, gender, password }),
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem('trainer', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        setUser(data.user);
        navigate('/game');
      } else {
        setErrorMsg(data.error || 'Registration failed.');
      }
    } catch (err) {
      setErrorMsg('Error during registration: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>Your Name:</label>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 p-2 border rounded w-full"
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 p-2 border rounded w-full"
        />
      </div>
      <div>
        <label>Gender:</label>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
          className="mt-1 p-2 border rounded w-full"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          placeholder="Enter a secure password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 p-2 border rounded w-full"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-all duration-300"
      >
        {loading ? 'Registering...' : 'Register'}
      </button>
      {errorMsg && <p className="text-red-500">{errorMsg}</p>}
    </form>
  );
};

export default RegistrationForm;
