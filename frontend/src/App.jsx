import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import TechBackground from './components/TechBackground';
import AdminGuard from './components/AdminGuard';
import AdminLayout from './components/AdminLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Storefront from './pages/Storefront';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Classroom from './pages/Classroom';
import Dashboard from './pages/Dashboard';
import Pricing from './pages/Pricing';
import Settings from './pages/Settings';
import Checkout from './pages/Checkout';
import CheckoutSuccess from './pages/CheckoutSuccess';
import CheckoutCancelled from './pages/CheckoutCancelled';
import Orders from './pages/Orders';
import LegalPage from './pages/LegalPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminStudents from './pages/admin/AdminStudents';
import AdminCurriculum from './pages/admin/AdminCurriculum';
import AdminSettings from './pages/admin/AdminSettings';

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
  const hideNavbarRoutes = ['/login', '/register', '/forgot-password', '/reset-password', '/checkout', '/checkout/success', '/checkout/cancelled'];
  const isAdmin = location.pathname.startsWith('/admin');
  
  return (
    <div className={`relative min-h-screen antialiased overflow-x-hidden ${isAdmin ? 'bg-slate-950 text-slate-100' : 'selection:bg-indigo-500/15 selection:text-indigo-950 bg-[#f8fafc] text-slate-800'}`}>
        
        {/* --- GLOBAL DYNAMIC TECH & CYBER BACKGROUND --- */}
        {!isAdmin && <TechBackground variant="light" />}

        {/* Core Foreground Content Stack */}
        <div className="relative z-10 flex flex-col min-h-screen pointer-events-auto">
          {!isAdmin && !hideNavbarRoutes.includes(location.pathname) && <Navbar />}
          
          <main className="flex-1 flex flex-col">
            <Routes>
              <Route path="/" element={<Storefront />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/terms" element={<LegalPage />} />
              <Route path="/privacy" element={<LegalPage />} />
              <Route path="/refund-policy" element={<LegalPage />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/checkout/success" element={<CheckoutSuccess />} />
              <Route path="/checkout/cancelled" element={<CheckoutCancelled />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/orders" 
                element={
                  <ProtectedRoute>
                    <Orders />
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
              <Route 
                path="/classroom/:lessonId" 
                element={
                  <ProtectedRoute>
                    <Classroom />
                  </ProtectedRoute>
                } 
              />
              <Route
                path="/admin"
                element={
                  <AdminGuard>
                    <AdminLayout />
                  </AdminGuard>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="students" element={<AdminStudents />} />
                <Route path="curriculum" element={<AdminCurriculum />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
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