import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../../Api/axios';

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
  recentOpticiens?: Array<{
    id: string;
    nom: string;
    prenom: string;
    email: string;
    companyName: string;
    status: string;
    city: string;
  }>;
  recentMontures: Array<{
    id: number;
    name: string;
    brand?: string;
    price: number;
    status: string;
    owner?: {
      id: string;
      nom: string;
      prenom: string;
    };
    createdAt: string;
  }>;
}

const Statistics: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchStats();
    checkUserRole();
  }, []);

  const checkUserRole = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setIsAdmin(payload.roles?.includes('ROLE_ADMIN') || false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/stats/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStats(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const lowerStatus = status.toLowerCase();
    const config = {
      approved: {
        bg: 'bg-gradient-to-r from-green-500 to-emerald-500',
        text: 'text-white',
        label: 'Approuvé',
        icon: (
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        ),
      },
      pending: {
        bg: 'bg-gradient-to-r from-yellow-500 to-orange-500',
        text: 'text-white',
        label: 'En attente',
        icon: (
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        ),
      },
      rejected: {
        bg: 'bg-gradient-to-r from-red-500 to-pink-500',
        text: 'text-white',
        label: 'Rejeté',
        icon: (
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        ),
      },
    };

    const statusConfig = config[lowerStatus as keyof typeof config] || config.pending;

    return (
      <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full ${statusConfig.bg} ${statusConfig.text} shadow-lg`}>
        {statusConfig.icon}
        {statusConfig.label}
      </span>
    );
  };

  const renderLabel = (props: any) => {
    const { name, percent } = props;
    return `${name}: ${(percent * 100).toFixed(0)}%`;
  };

  if (loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-950 via-blue-950 to-slate-900">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        </div>

        <div className="relative text-center z-10">
          <div className="relative inline-flex mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full blur-xl opacity-60 animate-pulse" />
            <div className="relative">
              <svg className="animate-spin h-20 w-20 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          </div>
          <p className="text-xl font-bold text-white">Chargement des statistiques...</p>
        </div>

        <style>{`
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          .animate-blob { animation: blob 7s infinite; }
          .animation-delay-2000 { animation-delay: 2s; }
        `}</style>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-950 via-blue-950 to-slate-900 py-8 px-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        </div>

        <div className="relative max-w-7xl mx-auto z-10">
          <div className="backdrop-blur-xl bg-white/10 border-2 border-red-400/50 rounded-2xl p-6">
            <div className="flex items-center justify-center">
              <svg className="w-12 h-12 text-red-300 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-white text-lg font-semibold">Impossible de charger les statistiques</p>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          .animate-blob { animation: blob 7s infinite; }
          .animation-delay-2000 { animation-delay: 2s; }
        `}</style>
      </div>
    );
  }

  const monturesData = [
    { name: 'Approuvées', value: stats.montures.approved, color: '#10B981' },
    { name: 'En attente', value: stats.montures.pending, color: '#F59E0B' },
    { name: 'Rejetées', value: stats.montures.rejected, color: '#EF4444' },
  ];

  const opticiensData = stats.opticiens ? [
    { name: 'Approuvés', value: stats.opticiens.approved, color: '#10B981' },
    { name: 'En attente', value: stats.opticiens.pending, color: '#F59E0B' },
    { name: 'Rejetés', value: stats.opticiens.rejected, color: '#EF4444' },
  ] : [];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-950 via-blue-950 to-slate-900 py-8 px-4">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="relative max-w-7xl mx-auto z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white mb-2">Statistiques</h1>
          <p className="text-blue-200 text-lg">
            {isAdmin ? 'Vue d\'ensemble de la plateforme' : 'Vos statistiques personnelles'}
          </p>
        </div>

        {/* Montures Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {/* Total Montures */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition duration-300" />
            <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm font-semibold uppercase tracking-wide">Montures</p>
                  <p className="text-4xl font-black text-white mt-2">{stats.montures.total}</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Approved */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition duration-300" />
            <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-200 text-sm font-semibold uppercase tracking-wide">Approuvées</p>
                  <p className="text-4xl font-black text-white mt-2">{stats.montures.approved}</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Pending */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition duration-300" />
            <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-200 text-sm font-semibold uppercase tracking-wide">En Attente</p>
                  <p className="text-4xl font-black text-white mt-2">{stats.montures.pending}</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Rejected */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition duration-300" />
            <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-200 text-sm font-semibold uppercase tracking-wide">Rejetées</p>
                  <p className="text-4xl font-black text-white mt-2">{stats.montures.rejected}</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Only: Opticiens Stats */}
        {isAdmin && stats.opticiens && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {/* Total Opticiens */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition duration-300" />
              <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-200 text-sm font-semibold uppercase tracking-wide">Opticiens</p>
                    <p className="text-4xl font-black text-white mt-2">{stats.opticiens.total}</p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Approved Opticiens */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition duration-300" />
              <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-200 text-sm font-semibold uppercase tracking-wide">Approuvés</p>
                    <p className="text-4xl font-black text-white mt-2">{stats.opticiens.approved}</p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Pending Opticiens */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition duration-300" />
              <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-200 text-sm font-semibold uppercase tracking-wide">En Attente</p>
                    <p className="text-4xl font-black text-white mt-2">{stats.opticiens.pending}</p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Rejected Opticiens */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition duration-300" />
              <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-200 text-sm font-semibold uppercase tracking-wide">Rejetés</p>
                    <p className="text-4xl font-black text-white mt-2">{stats.opticiens.rejected}</p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Graphique Montures */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-white/5 border-b border-white/20 px-6 py-4">
              <h3 className="text-xl font-bold text-white">Répartition des montures</h3>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={monturesData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {monturesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '12px',
                      color: '#fff',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Graphique Opticiens (Admin only) */}
          {isAdmin && stats.opticiens && (
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl overflow-hidden shadow-2xl">
              <div className="bg-white/5 border-b border-white/20 px-6 py-4">
                <h3 className="text-xl font-bold text-white">Répartition des opticiens</h3>
              </div>
              <div className="p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={opticiensData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {opticiensData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '12px',
                        color: '#fff',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* Dernières inscriptions (Admin only) */}
        {isAdmin && stats.recentOpticiens && stats.recentOpticiens.length > 0 && (
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl overflow-hidden shadow-2xl mb-8">
            <div className="bg-white/5 border-b-2 border-white/20 px-6 py-4">
              <h3 className="text-xl font-bold text-white">Dernières inscriptions d'opticiens</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5 border-b-2 border-white/20">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-blue-200 uppercase tracking-wider">Nom</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-blue-200 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-blue-200 uppercase tracking-wider">Entreprise</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-blue-200 uppercase tracking-wider">Ville</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-blue-200 uppercase tracking-wider">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {stats.recentOpticiens.map((opticien) => (
                    <tr key={opticien.id} className="hover:bg-white/5 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow-lg">
                            {opticien.prenom[0]}{opticien.nom[0]}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-bold text-white">
                              {opticien.prenom} {opticien.nom}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white/70">{opticien.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white font-medium">{opticien.companyName || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white/70">{opticien.city || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(opticien.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Dernières montures ajoutées */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl overflow-hidden shadow-2xl">
          <div className="bg-white/5 border-b-2 border-white/20 px-6 py-4">
            <h3 className="text-xl font-bold text-white">Dernières montures ajoutées</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b-2 border-white/20">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-blue-200 uppercase tracking-wider">Nom</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-blue-200 uppercase tracking-wider">Marque</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-blue-200 uppercase tracking-wider">Prix</th>
                  {isAdmin && (
                    <th className="px-6 py-4 text-left text-xs font-bold text-blue-200 uppercase tracking-wider">Propriétaire</th>
                  )}
                  <th className="px-6 py-4 text-left text-xs font-bold text-blue-200 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-blue-200 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {stats.recentMontures.map((monture) => (
                  <tr key={monture.id} className="hover:bg-white/5 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg">
                          {monture.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-white">{monture.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white/70">{monture.brand || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-white">{monture.price.toFixed(2)} MAD</div>
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white/70">
                          {monture.owner ? `${monture.owner.prenom} ${monture.owner.nom}` : 'N/A'}
                        </div>
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(monture.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white/70">
                        {new Date(monture.createdAt).toLocaleDateString('fr-FR')}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Additional CSS for animations */}
      <style>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Statistics;