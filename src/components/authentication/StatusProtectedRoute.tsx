import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../../Api/axios';

interface StatusProtectedRouteProps {
  children: React.ReactNode;
  requiresApproval?: boolean; // Si true, nécessite un compte approuvé
}

interface CurrentUser {
  id: string;
  email: string;
  roles: string[];
  status?: string;
}

const StatusProtectedRoute: React.FC<StatusProtectedRouteProps> = ({ 
  children, 
  requiresApproval = true 
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const checkUserStatus = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (err) {
        console.error('Error fetching user:', err);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkUserStatus();
  }, [token]);

  // Afficher un loader pendant la vérification
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600 font-medium">Vérification du compte...</p>
        </div>
      </div>
    );
  }

  // Pas de token → rediriger vers login
  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  // Admin a toujours accès
  if (user.roles?.includes('ROLE_ADMIN')) {
    return <>{children}</>;
  }

  // Si la route nécessite une approbation
  if (requiresApproval) {
    const status = user.status?.toLowerCase();

    // Compte en attente → page pending
    if (status === 'pending') {
      return <Navigate to="/pending-approval" replace />;
    }

    // Compte rejeté → page rejected
    if (status === 'rejected') {
      return <Navigate to="/account-rejected" replace />;
    }

    // Compte approuvé → accès autorisé
    if (status === 'approved') {
      return <>{children}</>;
    }

    // Statut inconnu → rediriger vers pending par sécurité
    return <Navigate to="/pending-approval" replace />;
  }

  // Si la route ne nécessite pas d'approbation (pages pending/rejected)
  return <>{children}</>;
};

export default StatusProtectedRoute;