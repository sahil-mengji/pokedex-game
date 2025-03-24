// AuthPage.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RegistrationForm from './RegistrationForm';
import LoginForm from './LoginForm';
import { useUser } from '../../App';

const AuthPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState('login');

  // Redirect to /game if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/game', { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex justify-center mb-6">
          <button
            className={`px-4 py-2 mx-2 rounded-md font-semibold transition-colors duration-300 ${
              activeTab === 'login'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
          <button
            className={`px-4 py-2 mx-2 rounded-md font-semibold transition-colors duration-300 ${
              activeTab === 'register'
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
            onClick={() => setActiveTab('register')}
          >
            Register
          </button>
        </div>
        {activeTab === 'login' ? <LoginForm /> : <RegistrationForm />}
      </div>
    </div>
  );
};

export default AuthPage;
