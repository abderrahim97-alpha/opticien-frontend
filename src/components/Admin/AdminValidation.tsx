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
    
    // Vérifier si l'utilisateur est admin
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
    const badges = {
      approved: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800',
    };
    const labels = {
      approved: 'Approuvé',
      pending: 'En attente',
      rejected: 'Rejeté',
    };
    return (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${badges[lowerStatus as keyof typeof badges]}`}>
        {labels[lowerStatus as keyof typeof labels]}
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Validation Admin</h1>
          <p className="text-gray-600">Gérez les demandes d'approbation</p>
        </div>

        {/* View Toggle & Stats */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Toggle Buttons */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewType('opticiens')}
                className={`px-6 py-2 rounded-md font-medium transition ${
                  viewType === 'opticiens'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <svg className="w-5 h-5 inline-block mr-2 -mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Opticiens
              </button>
              <button
                onClick={() => setViewType('montures')}
                className={`px-6 py-2 rounded-md font-medium transition ${
                  viewType === 'montures'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <svg className="w-5 h-5 inline-block mr-2 -mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Montures
              </button>
            </div>

            {/* Pending Count */}
            {pendingCount > 0 && (
              <div className="flex items-center bg-yellow-50 text-yellow-800 px-4 py-2 rounded-lg border border-yellow-200">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">{pendingCount} en attente</span>
              </div>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder={`Rechercher ${viewType === 'opticiens' ? 'un opticien' : 'une monture'}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Status Filter */}
            <div className="md:w-48">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="approved">Approuvés</option>
                <option value="rejected">Rejetés</option>
              </select>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {viewType === 'opticiens' ? (
            // Opticiens List
            filteredOpticiens.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opticien</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entreprise</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ville</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredOpticiens.map((opticien) => (
                      <tr key={opticien.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                              {opticien.prenom[0]}{opticien.nom[0]}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{opticien.prenom} {opticien.nom}</div>
                              <div className="text-sm text-gray-500">{opticien.telephone || 'N/A'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{opticien.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{opticien.companyName || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{opticien.city || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(opticien.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleViewDetails(opticien.id, 'opticien')}
                              className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded transition"
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
                                  className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded transition"
                                  title="Approuver"
                                >
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => handleReject(opticien.id, 'opticien')}
                                  className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded transition"
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
              <div className="text-center py-12">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-gray-500">Aucun opticien trouvé</p>
              </div>
            )
          ) : (
            // Montures List
            filteredMontures.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monture</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marque</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Propriétaire</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredMontures.map((monture) => (
                      <tr key={monture.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
                              {monture.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{monture.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{monture.brand || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">{monture.price.toFixed(2)} MAD</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {monture.owner ? `${monture.owner.prenom} ${monture.owner.nom}` : 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
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
                              className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded transition"
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
                                  className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded transition"
                                  title="Approuver"
                                >
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => handleReject(monture.id, 'monture')}
                                  className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded transition"
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
              <div className="text-center py-12">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-gray-500">Aucune monture trouvée</p>
              </div>
            )
          )}
        </div>

        {/* Summary Stats */}
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {viewType === 'opticiens' ? filteredOpticiens.length : filteredMontures.length}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">En attente</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Approuvés</p>
              <p className="text-2xl font-bold text-green-600">
                {viewType === 'opticiens' 
                  ? opticiens.filter(o => o.status.toLowerCase() === 'approved').length
                  : montures.filter(m => m.status.toLowerCase() === 'approved').length
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminValidation;