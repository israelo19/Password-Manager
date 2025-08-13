import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      const currentUser = authAPI.getCurrentUser();
      const isAuthenticated = authAPI.isAuthenticated();
      console.log('🔐 AuthContext Init:', { currentUser, isAuthenticated }); // Debug log
      setUser(currentUser);
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      console.log('🔐 AuthContext: Starting login process'); // Debug log
      const data = await authAPI.login(credentials);
      console.log('🔐 AuthContext: Login successful, setting user:', data.user); // Debug log
      setUser(data.user);
      return data;
    } catch (error) {
      console.error('🔐 AuthContext: Login failed:', error); // Debug log
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const data = await authAPI.register(userData);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user && authAPI.isAuthenticated(),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
