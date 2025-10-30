import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Login from './components/authentication/Login';
import Register from './components/authentication/Register';
import StatusProtectedRoute from './components/authentication/StatusProtectedRoute';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import OpticienList from './components/opticiens/OpticienList';
import OpticienDetails from './components/opticiens/OpticienDetails';
import MontureForm from './components/montures/MontureForm';
import MontureList from './components/montures/MontureList';
import MontureDetails from './components/montures/MontureDetails';
import MontureEdit from './components/montures/MontureEdit';
import PendingApproval from './components/status/PendingApproval';
import AccountRejected from './components/status/AccountRejected';
import DashboardLayout from './components/layout/DashboardLayout';
import ProfileSettings from './components/opticiens/ProfileSettings';
import ForgotPassword from './components/authentication/ForgotPassword';
import ResetPassword from './components/authentication/ResetPassword';
import Statistics from './components/Statistics/Statistics';
import AdminValidation from './components/Admin/AdminValidation';
import Dashboard from './components/Dashboard';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Password Reset Routes - Public */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        
        {/* Status Pages - Ne nécessitent PAS d'approbation */}
        <Route
          path="/pending-approval"
          element={
            <StatusProtectedRoute requiresApproval={false}>
              <PendingApproval />
            </StatusProtectedRoute>
          }
        />
        <Route
          path="/account-rejected"
          element={
            <StatusProtectedRoute requiresApproval={false}>
              <AccountRejected />
            </StatusProtectedRoute>
          }
        />
        
        {/* Protected Routes - Nécessitent approbation (sauf admin) */}
        <Route
          path="/opticiens"
          element={
            <StatusProtectedRoute requiresApproval={true}>
              <DashboardLayout>
              <OpticienList />
              </DashboardLayout>
            </StatusProtectedRoute>
          }
        />
        <Route
          path="/opticiens/:id"
          element={
            <StatusProtectedRoute requiresApproval={true}>
              <DashboardLayout>
              <OpticienDetails />
              </DashboardLayout>
            </StatusProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <StatusProtectedRoute requiresApproval={true}>
              <DashboardLayout>
              <Dashboard />
              </DashboardLayout>
            </StatusProtectedRoute>
          }
        />
        <Route
          path="/statistiques"
          element={
            <StatusProtectedRoute requiresApproval={true}>
              <DashboardLayout>
              <Statistics />
              </DashboardLayout>
            </StatusProtectedRoute>
          }
        />
        <Route
          path="/validation"
          element={
            <StatusProtectedRoute requiresApproval={true}>
              <DashboardLayout>
              <AdminValidation />
              </DashboardLayout>
            </StatusProtectedRoute>
          }
        />
        <Route
          path="/ProfileSettings"
          element={
            <StatusProtectedRoute requiresApproval={true}>
              <DashboardLayout>
              <ProfileSettings />
              </DashboardLayout>
            </StatusProtectedRoute>
          }
        />
        <Route
          path="/montureform"
          element={
            <StatusProtectedRoute requiresApproval={true}>
              <DashboardLayout>
              <MontureForm />
              </DashboardLayout>
            </StatusProtectedRoute>
          }
        />
        <Route
          path="/montures/:id/edit"
          element={
            <StatusProtectedRoute requiresApproval={true}>
              <DashboardLayout>
              <MontureEdit />
              </DashboardLayout>
            </StatusProtectedRoute>
          }
        />
        <Route
          path="/montures"
          element={
            <StatusProtectedRoute requiresApproval={true}>
              <DashboardLayout>
              <MontureList />
              </DashboardLayout>
            </StatusProtectedRoute>
          }
        />
        <Route
          path="/montures/create"
          element={
            <StatusProtectedRoute requiresApproval={true}>
              <DashboardLayout>
              <MontureForm />
              </DashboardLayout>
            </StatusProtectedRoute>
          }
        />
        <Route
          path="/montures/:id"
          element={
            <StatusProtectedRoute requiresApproval={true}>
              <DashboardLayout>
              <MontureDetails />
              </DashboardLayout>
            </StatusProtectedRoute>
          }
        />
        <Route 
          path="/app" 
          element={
            <StatusProtectedRoute requiresApproval={true}>
              <App />
            </StatusProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();