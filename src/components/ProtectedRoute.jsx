import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();

  console.log('🛡️ ProtectedRoute check:', { isAuthenticated, loading, user: !!user }); // Debug log

  if (loading) {
    console.log('🛡️ ProtectedRoute: Loading...'); // Debug log
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('🛡️ ProtectedRoute: Not authenticated, redirecting to login'); // Debug log
    return <Navigate to="/login" replace />;
  }

  console.log('🛡️ ProtectedRoute: Authenticated, rendering children'); // Debug log
  return children;
};

export default ProtectedRoute;
