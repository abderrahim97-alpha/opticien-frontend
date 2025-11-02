// src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../Api/axios';

interface DashboardStats {
  montures: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
  };
  opticiens?: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
  };
  recentMontures: Array<{
    id: number;
    name: string;
    brand: string;
    price: number;
    status: string;
    owner?: {
      id: string;
      nom: string;
      prenom: string;
    };
    createdAt: string;
  }>;
  recentOpticiens?: Array<{
    id: string;
    nom: string;
    prenom: string;
    email: string;
    companyName: string;
    city: string;
    status: string;
  }>;
}

interface CurrentUser {
  id: string;
  email: string;
  roles: string[];
  nom?: string;
  prenom?: string;
  status?: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/', { replace: true });
        return;
      }

      // Fetch current user
      const userResponse = await api.get('/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(userResponse.data);

      // Fetch dashboard stats
      const statsResponse = await api.get('/stats/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(statsResponse.data);
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError(err.response?.data?.message || 'Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = () => user?.roles?.includes('ROLE_ADMIN');

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'Approuvé';
      case 'pending':
        return 'En attente';
      case 'rejected':
        return 'Rejeté';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Welcome Section - Responsive */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg shadow-lg p-4 sm:p-6 text-white">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 break-words">
          Bienvenue {user?.prenom ? `${user.prenom} ${user.nom}` : user?.email} !
        </h1>
        <p className="text-sm sm:text-base text-blue-100">
          {isAdmin() 
            ? 'Gérez votre plateforme et validez les nouvelles inscriptions'
            : 'Gérez vos montures et suivez vos statistiques'}
        </p>
      </div>

      {/* Stats Cards - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {/* Total Montures */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 border-l-4 border-blue-500 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total Montures</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">
                {stats?.montures.total || 0}
              </p>
            </div>
            <div className="bg-blue-100 rounded-full p-2 sm:p-3 flex-shrink-0 ml-3">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Montures Approuvées */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 border-l-4 border-green-500 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Approuvées</p>
              <p className="text-2xl sm:text-3xl font-bold text-green-600 mt-1 sm:mt-2">
                {stats?.montures.approved || 0}
              </p>
            </div>
            <div className="bg-green-100 rounded-full p-2 sm:p-3 flex-shrink-0 ml-3">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Montures En Attente */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 border-l-4 border-yellow-500 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">En Attente</p>
              <p className="text-2xl sm:text-3xl font-bold text-yellow-600 mt-1 sm:mt-2">
                {stats?.montures.pending || 0}
              </p>
            </div>
            <div className="bg-yellow-100 rounded-full p-2 sm:p-3 flex-shrink-0 ml-3">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Montures Rejetées */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 border-l-4 border-red-500 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Rejetées</p>
              <p className="text-2xl sm:text-3xl font-bold text-red-600 mt-1 sm:mt-2">
                {stats?.montures.rejected || 0}
              </p>
            </div>
            <div className="bg-red-100 rounded-full p-2 sm:p-3 flex-shrink-0 ml-3">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Only: Opticiens Stats */}
      {isAdmin() && stats?.opticiens && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 border-l-4 border-purple-500 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total Opticiens</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">
                  {stats.opticiens.total}
                </p>
              </div>
              <div className="bg-purple-100 rounded-full p-2 sm:p-3 flex-shrink-0 ml-3">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6 border-l-4 border-green-500 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Opticiens Approuvés</p>
                <p className="text-2xl sm:text-3xl font-bold text-green-600 mt-1 sm:mt-2">
                  {stats.opticiens.approved}
                </p>
              </div>
              <div className="bg-green-100 rounded-full p-2 sm:p-3 flex-shrink-0 ml-3">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6 border-l-4 border-yellow-500 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">En Attente</p>
                <p className="text-2xl sm:text-3xl font-bold text-yellow-600 mt-1 sm:mt-2">
                  {stats.opticiens.pending}
                </p>
              </div>
              <div className="bg-yellow-100 rounded-full p-2 sm:p-3 flex-shrink-0 ml-3">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6 border-l-4 border-red-500 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Rejetés</p>
                <p className="text-2xl sm:text-3xl font-bold text-red-600 mt-1 sm:mt-2">
                  {stats.opticiens.rejected}
                </p>
              </div>
              <div className="bg-red-100 rounded-full p-2 sm:p-3 flex-shrink-0 ml-3">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activities Grid - Responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Montures */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Montures Récentes</h2>
          </div>
          <div className="p-4 sm:p-6">
            {stats?.recentMontures && stats.recentMontures.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {stats.recentMontures.map((monture) => (
                  <div
                    key={monture.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer gap-2 sm:gap-4"
                    onClick={() => navigate(`/montures/${monture.id}`)}
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">{monture.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">
                        {monture.brand} • {monture.price.toFixed(2)} MAD
                      </p>
                      {isAdmin() && monture.owner && (
                        <p className="text-xs text-gray-500 mt-1">
                          Par: {monture.owner.prenom} {monture.owner.nom}
                        </p>
                      )}
                    </div>
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(monture.status)} self-start sm:self-center whitespace-nowrap`}>
                      {getStatusLabel(monture.status)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-gray-500 text-sm mt-3">Aucune monture récente</p>
              </div>
            )}
            <button
              onClick={() => navigate('/montures')}
              className="mt-4 w-full text-center text-blue-600 hover:text-blue-800 font-medium text-sm py-2 hover:bg-blue-50 rounded transition"
            >
              Voir toutes les montures →
            </button>
          </div>
        </div>

        {/* Recent Opticiens (Admin Only) */}
        {isAdmin() && stats?.recentOpticiens && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Opticiens Récents</h2>
            </div>
            <div className="p-4 sm:p-6">
              {stats.recentOpticiens.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {stats.recentOpticiens.map((opticien) => (
                    <div
                      key={opticien.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer gap-2 sm:gap-4"
                      onClick={() => navigate(`/opticiens/${opticien.id}`)}
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">
                          {opticien.prenom} {opticien.nom}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1 truncate">{opticien.companyName}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{opticien.city}</p>
                      </div>
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(opticien.status)} self-start sm:self-center whitespace-nowrap`}>
                        {getStatusLabel(opticien.status)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p className="text-gray-500 text-sm mt-3">Aucun opticien récent</p>
                </div>
              )}
              <button
                onClick={() => navigate('/opticiens')}
                className="mt-4 w-full text-center text-blue-600 hover:text-blue-800 font-medium text-sm py-2 hover:bg-blue-50 rounded transition"
              >
                Voir tous les opticiens →
              </button>
            </div>
          </div>
        )}

        {/* Quick Actions (For Opticiens) */}
        {!isAdmin() && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Actions Rapides</h2>
            </div>
            <div className="p-4 sm:p-6 space-y-3">
              <button
                onClick={() => navigate('/montureform')}
                className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="truncate">Ajouter une monture</span>
              </button>
              <button
                onClick={() => navigate('/montures')}
                className="w-full flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="truncate">Gérer mes montures</span>
              </button>
              <button
                onClick={() => navigate('/statistiques')}
                className="w-full flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="truncate">Voir les statistiques</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;