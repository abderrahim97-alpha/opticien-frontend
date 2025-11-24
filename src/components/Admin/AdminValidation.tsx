import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../Api/axios';

interface Opticien {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  companyName?: string;
  city?: string;
  status: string;
  telephone?: string;
}

interface Monture {
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
}

type ViewType = 'opticiens' | 'montures';

const AdminValidation: React.FC = () => {
  const navigate = useNavigate();
  const [viewType, setViewType] = useState<ViewType>('opticiens');
  const [opticiens, setOpticiens] = useState<Opticien[]>([]);
  const [montures, setMontures] = useState<Monture[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('pending');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/', { replace: true });
      return;
    }
    
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.roles?.includes('ROLE_ADMIN')) {
      navigate('/montures', { replace: true });
      return;
    }

    fetchData(token);
  }, [navigate, viewType]);

  const fetchData = async (token: string) => {
    setLoading(true);
    try {
      if (viewType === 'opticiens') {
        const response = await api.get('/my-opticiens', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOpticiens(response.data.member || []);
      } else {
        const response = await api.get('/my-montures', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMontures(response.data.member || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string | number, type: 'opticien' | 'monture') => {
    if (!window.confirm(`Êtes-vous sûr de vouloir approuver ce(tte) ${type} ?`)) return;

    try {
      const token = localStorage.getItem('token');
      const endpoint = type === 'opticien' ? `/opticiens/${id}/approve` : `/montures/${id}/approve`;
      
      await api.patch(endpoint, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (token) fetchData(token);
    } catch (error) {
      console.error('Erreur lors de l\'approbation:', error);
      alert('Erreur lors de l\'approbation');
    }
  };

  const handleReject = async (id: string | number, type: 'opticien' | 'monture') => {
    const reason = prompt(`Raison du rejet (optionnel) :`);
    if (reason === null) return;

    try {
      const token = localStorage.getItem('token');
      const endpoint = type === 'opticien' ? `/opticiens/${id}/reject` : `/montures/${id}/reject`;
      
      await api.patch(endpoint, reason ? { reason } : {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (token) fetchData(token);
    } catch (error) {
      console.error('Erreur lors du rejet:', error);
      alert('Erreur lors du rejet');
    }
  };

  const handleViewDetails = (id: string | number, type: 'opticien' | 'monture') => {
    navigate(`/${type === 'opticien' ? 'opticiens' : 'montures'}/${id}`);
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

  const filteredOpticiens = opticiens.filter(opt => {
    const matchesStatus = filterStatus === 'all' || opt.status.toLowerCase() === filterStatus;
    const matchesSearch = 
      opt.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opt.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opt.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opt.companyName?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const filteredMontures = montures.filter(mont => {
    const matchesStatus = filterStatus === 'all' || mont.status.toLowerCase() === filterStatus;
    const matchesSearch = 
      mont.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mont.brand?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const pendingCount = viewType === 'opticiens' 
    ? opticiens.filter(o => o.status.toLowerCase() === 'pending').length
    : montures.filter(m => m.status.toLowerCase() === 'pending').length;

  const approvedCount = viewType === 'opticiens' 
    ? opticiens.filter(o => o.status.toLowerCase() === 'approved').length
    : montures.filter(m => m.status.toLowerCase() === 'approved').length;

  const rejectedCount = viewType === 'opticiens' 
    ? opticiens.filter(o => o.status.toLowerCase() === 'rejected').length
    : montures.filter(m => m.status.toLowerCase() === 'rejected').length;

  const totalCount = viewType === 'opticiens' ? opticiens.length : montures.length;

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
          <p className="text-xl font-bold text-white">Chargement du dashboard...</p>
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
          <h1 className="text-4xl font-black text-white mb-2">Dashboard Admin</h1>
          <p className="text-blue-200 text-lg">Gérez les demandes d'approbation</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Total Card */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition duration-300" />
            <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm font-semibold uppercase tracking-wide">Total</p>
                  <p className="text-4xl font-black text-white mt-2">{totalCount}</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Card */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition duration-300" />
            <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-200 text-sm font-semibold uppercase tracking-wide">En attente</p>
                  <p className="text-4xl font-black text-white mt-2">{pendingCount}</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Approved Card */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition duration-300" />
            <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-200 text-sm font-semibold uppercase tracking-wide">Approuvés</p>
                  <p className="text-4xl font-black text-white mt-2">{approvedCount}</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Rejected Card */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition duration-300" />
            <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-200 text-sm font-semibold uppercase tracking-wide">Rejetés</p>
                  <p className="text-4xl font-black text-white mt-2">{rejectedCount}</p>
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

        {/* View Toggle & Alert */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Toggle Buttons */}
            <div className="flex bg-white/10 backdrop-blur-sm rounded-xl p-1.5 border border-white/20">
              <button
                onClick={() => setViewType('opticiens')}
                className={`px-6 py-3 rounded-lg font-bold transition-all duration-300 flex items-center ${
                  viewType === 'opticiens'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/50'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Opticiens
              </button>
              <button
                onClick={() => setViewType('montures')}
                className={`px-6 py-3 rounded-lg font-bold transition-all duration-300 flex items-center ${
                  viewType === 'montures'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/50'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Montures
              </button>
            </div>

            {/* Pending Alert */}
            {pendingCount > 0 && (
              <div className="flex items-center bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border-2 border-yellow-400/50 text-yellow-100 px-5 py-3 rounded-xl shadow-lg">
                <svg className="w-6 h-6 mr-3 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span className="font-bold text-lg">{pendingCount} en attente de validation</span>
              </div>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative group">
                <input
                  type="text"
                  placeholder={`Rechercher ${viewType === 'opticiens' ? 'un opticien' : 'une monture'}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl text-white placeholder:text-white/40 focus:border-blue-400 focus:bg-white/15 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 font-medium"
                />
                <svg className="w-5 h-5 text-white/40 absolute left-4 top-4 group-focus-within:text-blue-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Status Filter */}
            <div className="md:w-56">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-3.5 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl text-white focus:border-blue-400 focus:bg-white/15 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 font-bold"
              >
                <option value="all" className="bg-slate-900">Tous les statuts</option>
                <option value="pending" className="bg-slate-900">En attente</option>
                <option value="approved" className="bg-slate-900">Approuvés</option>
                <option value="rejected" className="bg-slate-900">Rejetés</option>
              </select>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl overflow-hidden shadow-2xl">
          {viewType === 'opticiens' ? (
            // Opticiens List
            filteredOpticiens.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5 border-b-2 border-white/20">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-blue-200 uppercase tracking-wider">Opticien</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-blue-200 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-blue-200 uppercase tracking-wider">Entreprise</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-blue-200 uppercase tracking-wider">Ville</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-blue-200 uppercase tracking-wider">Statut</th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-blue-200 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {filteredOpticiens.map((opticien) => (
                      <tr key={opticien.id} className="hover:bg-white/5 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow-lg">
                              {opticien.prenom[0]}{opticien.nom[0]}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-bold text-white">{opticien.prenom} {opticien.nom}</div>
                              <div className="text-sm text-white/60">{opticien.telephone || 'N/A'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-white font-medium">{opticien.email}</div>
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
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleViewDetails(opticien.id, 'opticien')}
                              className="p-2 bg-blue-500/20 hover:bg-blue-500/40 text-blue-200 hover:text-white rounded-lg transition-all duration-200 backdrop-blur-sm border border-blue-400/30"
                              title="Voir les détails"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            {opticien.status.toLowerCase() === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleApprove(opticien.id, 'opticien')}
                                  className="p-2 bg-green-500/20 hover:bg-green-500/40 text-green-200 hover:text-white rounded-lg transition-all duration-200 backdrop-blur-sm border border-green-400/30"
                                  title="Approuver"
                                >
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => handleReject(opticien.id, 'opticien')}
                                  className="p-2 bg-red-500/20 hover:bg-red-500/40 text-red-200 hover:text-white rounded-lg transition-all duration-200 backdrop-blur-sm border border-red-400/30"
                                  title="Rejeter"
                                >
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="relative inline-flex mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full blur-xl opacity-30" />
                  <div className="relative w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                </div>
                <p className="text-white/70 text-lg font-semibold">Aucun opticien trouvé</p>
              </div>
            )
          ) : (
            // Montures List
            filteredMontures.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5 border-b-2 border-white/20">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-blue-200 uppercase tracking-wider">Monture</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-blue-200 uppercase tracking-wider">Marque</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-blue-200 uppercase tracking-wider">Prix</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-blue-200 uppercase tracking-wider">Propriétaire</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-blue-200 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-blue-200 uppercase tracking-wider">Statut</th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-blue-200 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {filteredMontures.map((monture) => (
                      <tr key={monture.id} className="hover:bg-white/5 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg">
                              {monture.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-bold text-white">{monture.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-white font-medium">{monture.brand || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-white">{monture.price.toFixed(2)} MAD</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-white font-medium">
                            {monture.owner ? `${monture.owner.prenom} ${monture.owner.nom}` : 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-white/70">
                            {new Date(monture.createdAt).toLocaleDateString('fr-FR')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(monture.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleViewDetails(monture.id, 'monture')}
                              className="p-2 bg-blue-500/20 hover:bg-blue-500/40 text-blue-200 hover:text-white rounded-lg transition-all duration-200 backdrop-blur-sm border border-blue-400/30"
                              title="Voir les détails"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            {monture.status.toLowerCase() === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleApprove(monture.id, 'monture')}
                                  className="p-2 bg-green-500/20 hover:bg-green-500/40 text-green-200 hover:text-white rounded-lg transition-all duration-200 backdrop-blur-sm border border-green-400/30"
                                  title="Approuver"
                                >
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => handleReject(monture.id, 'monture')}
                                  className="p-2 bg-red-500/20 hover:bg-red-500/40 text-red-200 hover:text-white rounded-lg transition-all duration-200 backdrop-blur-sm border border-red-400/30"
                                  title="Rejeter"
                                >
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="relative inline-flex mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-30" />
                  <div className="relative w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                </div>
                <p className="text-white/70 text-lg font-semibold">Aucune monture trouvée</p>
              </div>
            )
          )}
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

export default AdminValidation;