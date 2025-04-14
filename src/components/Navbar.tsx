import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, User, Bell, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  if (!user) return null;

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            <Link to="/" className="flex items-center hover:text-blue-600">
              <Home className="h-5 w-5 mr-1" />
              <span>Home</span>
            </Link>
            <Link to="/profile" className="flex items-center hover:text-blue-600">
              <User className="h-5 w-5 mr-1" />
              <span>Profile</span>
            </Link>
            {/*<Link to="/activity" className="flex items-center hover:text-blue-600">
              <Bell className="h-5 w-5 mr-1" />
              <span>Activity</span>
            </Link>*/}
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center text-gray-600 hover:text-blue-600"
          >
            <LogOut className="h-5 w-5 mr-1" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};