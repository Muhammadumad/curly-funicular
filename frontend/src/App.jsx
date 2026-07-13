import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import TechBackground from './components/TechBackground';
import Login from './pages/Login';
import Register from './pages/Register';
import Storefront from './pages/Storefront';
import Classroom from './pages/Classroom';
import Dashboard from './pages/Dashboard';
import Pricing from './pages/Pricing';
import Settings from './pages/Settings';

// Route Guard component
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-[#f8fafc] relative z-10">
        <div className="flex flex-col items-center gap-4 glass-panel px-8 py-6 rounded-2xl shadow-xl">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600/20 border-t-indigo-600"></div>
          <p className="text-xs font-mono tracking-widest text-slate-500 uppercase font-bold">Verifying Sanctum Handshake...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AppContent() {
  const location = useLocation();
  const hideNavbarRoutes = ['/login', '/register'];
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);
  
  return (
    <div className={`relative min-h-screen antialiased overflow-x-hidden selection:bg-indigo-500/15 selection:text-indigo-950 bg-[#f8fafc] text-slate-800`}>
        
        {/* --- GLOBAL DYNAMIC TECH & CYBER BACKGROUND --- */}
        <TechBackground variant="light" />

        {/* Core Foreground Content Stack */}
        <div className="relative z-10 flex flex-col min-h-screen pointer-events-auto">
          {shouldShowNavbar && <Navbar />}
          
          <main className="flex-1 flex flex-col">
            <Routes>
              <Route path="/" element={<Storefront />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/classroom" 
                element={
                  <ProtectedRoute>
                    <Classroom />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>

      </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}