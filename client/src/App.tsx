import * as React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, useAuth } from '@/features/auth/AuthContext';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage';
import { SignupPage } from '@/pages/SignupPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { Navbar } from '@/components/Navbar';
import { AIDetectionPage } from '@/pages/AIDetectionPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Navbar />
          <main>
            <AppRoutes />
          </main>
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

function AppRoutes() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
      <Route path="/signup" element={!user ? <SignupPage /> : <Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={user ? <DashboardPage /> : <Navigate to="/login" />} />
      <Route path="/ai-detection" element={user ? <AIDetectionPage /> : <Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
