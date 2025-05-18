import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserById } from '../api/userService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Add state for the token
  const [token, setToken] = useState(localStorage.getItem('bqomis_token')); // Initialize from localStorage
  const [user, setUser] = useState(null); // Store user object { id, username, email, role, ... }
  const [loading, setLoading] = useState(true); // To handle initial auth check

  // Mock initial auth check (e.g., from localStorage)
  useEffect(() => {
    // Simulate checking for a token and user in localStorage
    const storedToken = localStorage.getItem('bqomis_token');
    const storedUser = localStorage.getItem('bqomis_user');

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Set both user and token if found
        setUser(parsedUser);
        setToken(storedToken); // Set the token state
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        // Clear storage if parsing fails
        localStorage.removeItem('bqomis_token');
        localStorage.removeItem('bqomis_user');
        // Ensure state is also cleared
        setUser(null);
        setToken(null);
      }
    }
    // Set loading to false after check
    setLoading(false);
  }, []); // Empty dependency array means this runs once on mount

  // Mock login function
  const login = async (email, password) => {
    // TODO: Replace with actual API call
    console.log('Attempting login with:', email, password);
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'admin@bqomis.com' && password === 'admin123') {
          const mockAdminUser = {
            id: '2',
            username: 'Admin User',
            email: 'admin@bqomis.com',
            role: 'ADMIN', // As per backend Role model
          };
          const mockToken = 'fake-admin-jwt-token'; // Define the mock token
          
          localStorage.setItem('bqomis_token', mockToken); // Store the token
          localStorage.setItem('bqomis_user', JSON.stringify(mockAdminUser)); // Store the user

          setUser(mockAdminUser); // Update user state
          setToken(mockToken); // Update token state

          resolve(mockAdminUser); // Resolve with user object
        } else if (email === 'client@bqomis.com' && password === 'client123') {
          const mockClientUser = {
            id: '1',
            username: 'Client User',
            email: 'client@bqomis.com',
            role: 'CLIENT',
          };
          const mockToken = 'fake-client-jwt-token'; // Define the mock token

          localStorage.setItem('bqomis_token', mockToken); // Store the token
          localStorage.setItem('bqomis_user', JSON.stringify(mockClientUser)); // Store the user

          setUser(mockClientUser); // Update user state
          setToken(mockToken); // Update token state

          resolve(mockClientUser); // Resolve with user object
        } else {
          reject(new Error('Invalid credentials')); // Reject on failure
        }
      }, 1000); // Simulate network delay
    });
  };

  // Mock logout function
  const logout = () => {
    setUser(null);
    setToken(null); // Clear the token state
    localStorage.removeItem('bqomis_token'); // Remove token from storage
    localStorage.removeItem('bqomis_user'); // Remove user from storage
    // TODO: Potentially redirect to login page
    console.log('User logged out');
  };

  const refreshUserContext = async () => {
    if (user && user.id && token) { // Only if there's a current user and token
      try {
        const updatedUserData = await getUserById(user.id, token); // Fetch fresh user data
        setUser(updatedUserData);
        localStorage.setItem('bqomis_user', JSON.stringify(updatedUserData)); // Update localStorage
      } catch (error) {
        console.error("Failed to refresh user context:", error);
        // Optionally handle error, e.g., logout if token is invalid
        if (error.message.includes("401") || error.message.includes("403")) {
            logout(); // Example: log out on auth error
        }
      }
    }
  };

  // Include token in the value object
  const value = {
    user,
    token, // Expose the token
    isAuthenticated: !!user && !!token, // Consider authenticated only if both user and token exist
    isAdmin: user?.role === 'ADMIN',
    isClient: user?.role === 'CLIENT',
    login,
    logout,
    refreshUserContext, // Expose the refresh function
    loading, // expose loading state for initial auth check
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// useAuth hook remains the same
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

