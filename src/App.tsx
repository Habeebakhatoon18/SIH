import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Navbar } from './components/Navbar';
import { Login } from './components/Login';
import { WorkerDashboard } from './components/dashboards/WorkerDashboard';
import { DoctorDashboard } from './components/dashboards/DoctorDashboard';
import { GovernmentDashboard } from './components/dashboards/GovernmentDashboard';

const AppContent: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  const getDashboard = () => {
    switch (user.role) {
      case 'worker':
        return <WorkerDashboard />;
      case 'doctor':
        return <DoctorDashboard />;
      case 'government':
        return <GovernmentDashboard />;
      default:
        return <div>Invalid role</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        {getDashboard()}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;