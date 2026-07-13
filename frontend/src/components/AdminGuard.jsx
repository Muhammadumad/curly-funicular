import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Route guard that verifies the user is authenticated AND has admin role.
 * Renders a dark-themed loading state while auth is being verified.
 */
export default function AdminGuard({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-8 py-6 backdrop-blur-xl">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-400/20 border-t-indigo-400"></div>
          <p className="text-xs font-mono tracking-widest text-slate-400 uppercase font-bold">
            Verifying Admin Clearance...
          </p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return children;
}
