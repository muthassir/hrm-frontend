import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import EmployeeManagement from "./pages/EmployeeManagement";
import OfficeLocation from "./pages/OfficeLocation";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PublicDashboard from "./pages/PublicDashboard"

// Protected route 
const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/dashboard" replace />;
  return children;
};

// public route - FIXED
const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  
  // If user is logged in, redirect to dashboard from auth pages
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// Add this new component for public dashboard with redirect
const PublicDashboardRoute = ({ children }) => {
  const { user } = useAuth();
  
  // If user is logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">
            <Routes>
              {/* Public dashboard - redirect to dashboard if user is logged in */}
              <Route path="/" element={
                <PublicDashboardRoute>
                  <PublicDashboard />
                </PublicDashboardRoute>
              } />
              
              {/* Auth pages - redirect to dashboard if already logged in */}
              <Route path="/login" element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } />
              <Route path="/register" element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              } />

              {/* Protected routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/employees" element={
                <ProtectedRoute role="admin">
                  <EmployeeManagement />
                </ProtectedRoute>
              } />
              <Route path="/office-location" element={
                <ProtectedRoute role="admin">
                  <OfficeLocation />
                </ProtectedRoute>
              } />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;