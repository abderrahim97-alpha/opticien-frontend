import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import OpticienList from './components/OpticienList';
import OpticienDetails from './components/OpticienDetails';
import MontureForm from './components/MontureForm';
import MontureList from './components/MontureList';
import MontureDetails from './components/MontureDetails';
import MontureEdit from './components/MontureEdit';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Protected Routes */}
        <Route
          path="/opticiens"
          element={
            <ProtectedRoute>
              <OpticienList />
            </ProtectedRoute>
          }
        />
        <Route
        path="/opticiens/:id"
        element={
            <ProtectedRoute>
              <OpticienDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/montureform"
          element={
            <ProtectedRoute>
              <MontureForm />
            </ProtectedRoute>
          }
        />
        <Route
        path="/montures/:id/edit"
        element={
            <ProtectedRoute>
              <MontureEdit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/montures"
          element={
            <ProtectedRoute>
              <MontureList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/montures/create"
          element={
            <ProtectedRoute>
              <MontureForm />
            </ProtectedRoute>
          }
        />
        <Route
        path="/montures/:id"
        element={
          <ProtectedRoute>
            <MontureDetails />
          </ProtectedRoute>
        }
        />
        <Route path="/app" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
