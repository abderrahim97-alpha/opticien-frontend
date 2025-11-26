// src/pages/AdminOrdersPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import api from '../../Api/axios';

interface CommandeItem {
  id: number;
  monture: {
    id: number;
    name: string;
    brand?: string;
    price: number;
  };
  vendeur: {
    id: string;
    nom?: string;
    prenom?: string;
    email?: string;
  };
  vendeurName?: string;
  quantite: number;
  prixUnitaire: string;
  sousTotal: string;
}

interface Commande {
  id: number;
  acheteur: {
    id: string;
    nom: string;
    prenom: string;
    email: string;
  };
  status: 'pending' | 'validated' | 'refused' | 'completed';
  totalPrice: string;
  createdAt: string;
  validatedAt?: string;
  noteAdmin?: string;
  items: CommandeItem[];
}

interface OrderStats {
  total: number;
  pending: number;
  validated: number;
  refused: number;
  completed: number;
}

const AdminOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Commande[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Commande | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showValidateModal, setShowValidateModal] = useState(false);
  const [showRefuseModal, setShowRefuseModal] = useState(false);
  const [adminNote, setAdminNote] = useState('');
  const [refuseReason, setRefuseReason] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/', { replace: true });
      return;
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.roles?.includes('ROLE_ADMIN')) {
      navigate('/orders', { replace: true });
      return;
    }

    fetchData(token);
  }, [navigate, filterStatus]);

  // Désactiver le scroll quand un modal est ouvert
  useEffect(() => {
    if (showDetailsModal || showValidateModal || showRefuseModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showDetailsModal, showValidateModal, showRefuseModal]);

  // Navigation au clavier pour fermer les modaux
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showRefuseModal) {
          setShowRefuseModal(false);
          setRefuseReason('');
        } else if (showValidateModal) {
          setShowValidateModal(false);
          setAdminNote('');
        } else if (showDetailsModal) {
          setShowDetailsModal(false);
          setSelectedOrder(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showDetailsModal, showValidateModal, showRefuseModal]);

  const fetchData = async (token: string) => {
    setLoading(true);
    try {
      const ordersResponse = await api.get('/admin/orders', {
        headers: { Authorization: `Bearer ${token}` },
        params: filterStatus !== 'all' ? { status: filterStatus } : {},
      });
      setOrders(ordersResponse.data);

      const statsResponse = await api.get('/admin/orders/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(statsResponse.data);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (order: Commande) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(`/admin/orders/${order.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedOrder(response.data);
      setShowDetailsModal(true);
    } catch (error) {
      console.error('Erreur lors du chargement des détails:', error);
      alert('Erreur lors du chargement des détails de la commande');
    }
  };

  const handleValidate = async () => {
    if (!selectedOrder) return;

    try {
      const token = localStorage.getItem('token');
      await api.put(`/admin/orders/${selectedOrder.id}/validate`, 
        { noteAdmin: adminNote },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShowValidateModal(false);
      setShowDetailsModal(false);
      setAdminNote('');
      setSelectedOrder(null);
      if (token) fetchData(token);
      alert('Commande validée avec succès !');
    } catch (error) {
      console.error('Erreur lors de la validation:', error);
      alert('Erreur lors de la validation de la commande');
    }
  };

  const handleRefuse = async () => {
    if (!selectedOrder || !refuseReason.trim()) {
      alert('Veuillez préciser une raison de refus');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await api.put(`/admin/orders/${selectedOrder.id}/refuse`, 
        { raison: refuseReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShowRefuseModal(false);
      setShowDetailsModal(false);
      setRefuseReason('');
      setSelectedOrder(null);
      if (token) fetchData(token);
      alert('Commande refusée et stock restauré !');
    } catch (error) {
      console.error('Erreur lors du refus:', error);
      alert('Erreur lors du refus de la commande');
    }
  };

  const getVendeurDisplay = (item: CommandeItem): string => {
    if (item.vendeurName) {
      return item.vendeurName;
    }
    
    if (item.vendeur?.nom && item.vendeur?.prenom) {
      return `${item.vendeur.prenom} ${item.vendeur.nom}`;
    }
    
    return item.vendeur?.email || 'Vendeur inconnu';
  };

  const getStatusBadge = (status: string) => {
    const lowerStatus = status.toLowerCase();
    const config = {
      validated: {
        bg: 'bg-gradient-to-r from-green-500 to-emerald-500',
        text: 'text-white',
        label: 'Validée',
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
      refused: {
        bg: 'bg-gradient-to-r from-red-500 to-pink-500',
        text: 'text-white',
        label: 'Refusée',
        icon: (
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        ),
      },
      completed: {
        bg: 'bg-gradient-to-r from-blue-500 to-indigo-500',
        text: 'text-white',
        label: 'Complétée',
        icon: (
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
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

  // Modal Details avec Portal
  const DetailsModal = () => {
    if (!showDetailsModal || !selectedOrder) return null;

    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) return null;

    return createPortal(
      <div
        className="fixed inset-0 z-[9999] overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) {
            setShowDetailsModal(false);
            setSelectedOrder(null);
          }
        }}
      >
        <div 
          className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="backdrop-blur-xl bg-slate-900/95 border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-white">Détails de la commande #{selectedOrder.id}</h2>
                  <p className="text-blue-200 text-sm mt-1">
                    {new Date(selectedOrder.createdAt).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <button
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setShowDetailsModal(false);
                    setSelectedOrder(null);
                  }}
                  className="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-2 transition-all duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="p-6 space-y-6 max-h-[calc(90vh-200px)] overflow-y-auto">
              {/* Status & Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Status Card */}
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-4">
                  <p className="text-xs text-blue-200 uppercase tracking-wide font-semibold mb-2">Statut</p>
                  <div className="mb-3">
                    {getStatusBadge(selectedOrder.status)}
                  </div>
                  <p className="text-sm text-white/70">
                    {selectedOrder.status === 'pending' && 'En attente de validation'}
                    {selectedOrder.status === 'validated' && 'Validée par l\'admin'}
                    {selectedOrder.status === 'refused' && 'Refusée'}
                    {selectedOrder.status === 'completed' && 'Complétée'}
                  </p>
                </div>

                {/* Customer Info */}
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-4">
                  <p className="text-xs text-blue-200 uppercase tracking-wide font-semibold mb-3">Acheteur</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                      {selectedOrder.acheteur.prenom[0]}{selectedOrder.acheteur.nom[0]}
                    </div>
                    <div>
                      <p className="font-bold text-white">
                        {selectedOrder.acheteur.prenom} {selectedOrder.acheteur.nom}
                      </p>
                      <p className="text-sm text-white/70">{selectedOrder.acheteur.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Admin Note */}
              {selectedOrder.noteAdmin && (
                <div className={`border-2 rounded-xl p-4 ${
                  selectedOrder.status === 'refused' 
                    ? 'bg-red-500/10 border-red-400/50' 
                    : 'bg-blue-500/10 border-blue-400/50'
                }`}>
                  <p className={`text-sm font-bold mb-2 ${
                    selectedOrder.status === 'refused' ? 'text-red-300' : 'text-blue-300'
                  }`}>
                    {selectedOrder.status === 'refused' ? 'Raison du refus:' : 'Note de l\'administrateur:'}
                  </p>
                  <p className={`${
                    selectedOrder.status === 'refused' ? 'text-red-200' : 'text-blue-200'
                  }`}>
                    {selectedOrder.noteAdmin}
                  </p>
                </div>
              )}

              {/* Items List */}
              <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Articles commandés ({selectedOrder.items.length})
                </h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-4 hover:bg-white/15 transition-all duration-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            {item.monture.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-bold text-white text-lg">{item.monture.name}</h4>
                            <p className="text-sm text-white/70">{item.monture.brand || 'Sans marque'}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-white text-lg">{parseFloat(item.sousTotal).toFixed(2)} MAD</p>
                          <p className="text-xs text-white/70">
                            {item.quantite} × {parseFloat(item.prixUnitaire).toFixed(2)} MAD
                          </p>
                        </div>
                      </div>
                      <div className="pt-3 border-t border-white/20 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <p className="text-sm text-white/70">
                            Vendeur: <span className="font-medium text-white">
                              {getVendeurDisplay(item)}
                            </span>
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                          <p className="text-sm text-white/70">
                            Quantité: <span className="font-medium text-white">{item.quantite}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border-2 border-blue-400/50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                        <span className="text-lg font-bold text-white">Total de la commande</span>
                  </div>
                  <span className="text-3xl font-black text-blue-300">
                    {parseFloat(selectedOrder.totalPrice).toFixed(2)} MAD
                  </span>
                </div>
              </div>

              {/* Action Buttons for Pending Orders */}
              {selectedOrder.status === 'pending' && (
                <div className="flex gap-3 pt-4">
                  <button
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      setShowDetailsModal(false);
                      setShowValidateModal(true);
                    }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-green-500/50"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Valider la commande
                  </button>
                  <button
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      setShowDetailsModal(false);
                      setShowRefuseModal(true);
                    }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-red-500/50"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    Refuser la commande
                  </button>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-white/5 px-6 py-4 border-t border-white/20 flex justify-end">
              <button
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setShowDetailsModal(false);
                  setSelectedOrder(null);
                }}
                className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all duration-200"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>,
      modalRoot
    );
  };

  // Modal Validate avec Portal
  const ValidateModal = () => {
    if (!showValidateModal || !selectedOrder) return null;

    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) return null;

    return createPortal(
      <div
        className="fixed inset-0 z-[9999] overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) {
            setShowValidateModal(false);
            setAdminNote('');
          }
        }}
      >
        <div 
          className="relative w-full max-w-md"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="backdrop-blur-xl bg-slate-900/95 border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-xl font-black text-white">Valider la commande</h2>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="bg-green-500/10 border border-green-400/30 rounded-xl p-4 mb-4">
                <p className="text-white mb-2">
                  Êtes-vous sûr de vouloir valider la commande <span className="font-bold">#{selectedOrder.id}</span> de{' '}
                  <span className="font-bold">{selectedOrder.acheteur.prenom} {selectedOrder.acheteur.nom}</span> ?
                </p>
                <p className="text-sm text-white/70">
                  Montant total: <span className="font-bold text-white">{parseFloat(selectedOrder.totalPrice).toFixed(2)} MAD</span>
                </p>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-bold text-white mb-2">
                  Note admin (optionnelle)
                </label>
                <textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder:text-white/50 focus:border-green-400 focus:bg-white/15 focus:outline-none focus:ring-4 focus:ring-green-500/20 transition-all duration-300"
                  placeholder="Ajouter une note pour l'acheteur..."
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setShowValidateModal(false);
                    setAdminNote('');
                  }}
                  className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all duration-200"
                >
                  Annuler
                </button>
                <button
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    handleValidate();
                  }}
                  className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl font-bold transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-green-500/50"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Valider
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>,
      modalRoot
    );
  };

  // Modal Refuse avec Portal
  const RefuseModal = () => {
    if (!showRefuseModal || !selectedOrder) return null;

    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) return null;

    return createPortal(
      <div
        className="fixed inset-0 z-[9999] overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) {
            setShowRefuseModal(false);
            setRefuseReason('');
          }
        }}
      >
        <div 
          className="relative w-full max-w-md"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="backdrop-blur-xl bg-slate-900/95 border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-red-600 to-pink-600 p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-xl font-black text-white">Refuser la commande</h2>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="bg-red-500/10 border border-red-400/30 rounded-xl p-4 mb-4">
                <p className="text-white mb-2">
                  Refuser la commande <span className="font-bold">#{selectedOrder.id}</span> ?
                </p>
                <p className="text-sm font-bold text-red-300 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Le stock sera automatiquement restauré
                </p>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-bold text-white mb-2">
                  Raison du refus <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={refuseReason}
                  onChange={(e) => setRefuseReason(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder:text-white/50 focus:border-red-400 focus:bg-white/15 focus:outline-none focus:ring-4 focus:ring-red-500/20 transition-all duration-300"
                  placeholder="Expliquer clairement la raison du refus à l'acheteur..."
                  required
                />
                {!refuseReason.trim() && (
                  <p className="text-xs text-red-300 mt-2 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Ce champ est obligatoire
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setShowRefuseModal(false);
                    setRefuseReason('');
                  }}
                  className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all duration-200"
                >
                  Annuler
                </button>
                <button
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    handleRefuse();
                  }}
                  disabled={!refuseReason.trim()}
                  className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white rounded-xl font-bold transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-red-600 disabled:hover:to-pink-600"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Refuser
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>,
      modalRoot
    );
  };

  const lowerSearchQuery = searchQuery.toLowerCase();

  const filteredOrders = orders.filter(order => {
    const acheteurNom = order.acheteur?.nom || "";
    const acheteurPrenom = order.acheteur?.prenom || "";
    const acheteurEmail = order.acheteur?.email || "";

    return (
      order.id.toString().includes(searchQuery) ||
      acheteurNom.toLowerCase().includes(lowerSearchQuery) ||
      acheteurPrenom.toLowerCase().includes(lowerSearchQuery) ||
      acheteurEmail.toLowerCase().includes(lowerSearchQuery)
    );
  });

  if (loading) {
    return (
      <div className="relative min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        </div>

        <div className="relative text-center z-10">
          <div className="relative inline-flex mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full blur-xl opacity-60 animate-pulse" />
            <div className="relative">
              <svg className="animate-spin h-16 w-16 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          </div>
          <p className="text-lg font-bold text-white">Chargement des commandes...</p>
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
    <>
      <div className="relative p-6 space-y-6">
        {/* Background decoration subtil */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20 -z-10">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
        </div>

        <div className="relative z-10 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-black text-white mb-2">Gestion des Commandes</h1>
            <p className="text-blue-200 text-lg">Validez ou refusez les commandes en attente</p>
          </div>

          {/* Stats Cards - GLASSMORPHISM */}
          {stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Total */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition duration-300" />
                <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-5 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-200 text-xs font-semibold uppercase tracking-wide">Total</p>
                      <p className="text-3xl font-black text-white mt-2">{stats.total}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pending */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition duration-300" />
                <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-5 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-200 text-xs font-semibold uppercase tracking-wide">En attente</p>
                      <p className="text-3xl font-black text-white mt-2">{stats.pending}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Validated */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition duration-300" />
                <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-5 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-200 text-xs font-semibold uppercase tracking-wide">Validées</p>
                      <p className="text-3xl font-black text-white mt-2">{stats.validated}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Refused */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition duration-300" />
                <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-5 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-200 text-xs font-semibold uppercase tracking-wide">Refusées</p>
                      <p className="text-3xl font-black text-white mt-2">{stats.refused}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Completed */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition duration-300" />
                <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-5 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-200 text-xs font-semibold uppercase tracking-wide">Complétées</p>
                      <p className="text-3xl font-black text-white mt-2">{stats.completed}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Filters - GLASSMORPHISM */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-5 shadow-lg">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Rechercher par ID ou nom d'acheteur..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder:text-white/50 focus:border-blue-400 focus:bg-white/15 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 font-medium"
                  />
                  <svg className="w-5 h-5 text-white/50 absolute left-4 top-3.5 group-focus-within:text-blue-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Status Filter */}
              <div className="md:w-56">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white focus:border-blue-400 focus:bg-white/15 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 font-bold"
                >
                  <option value="all" className="bg-slate-800">Tous les statuts</option>
                  <option value="pending" className="bg-slate-800">En attente</option>
                  <option value="validated" className="bg-slate-800">Validées</option>
                  <option value="refused" className="bg-slate-800">Refusées</option>
                  <option value="completed" className="bg-slate-800">Complétées</option>
                </select>
              </div>
            </div>
          </div>

          {/* Orders Table - GLASSMORPHISM */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl overflow-hidden shadow-lg">
            {filteredOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5 border-b-2 border-white/20">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-blue-200 uppercase tracking-wider">Commande</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-blue-200 uppercase tracking-wider">Acheteur</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-blue-200 uppercase tracking-wider">Articles</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-blue-200 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-blue-200 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-blue-200 uppercase tracking-wider">Statut</th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-blue-200 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-white/5 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow-lg">
                              #{order.id}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg">
                              {order.acheteur.prenom[0]}{order.acheteur.nom[0]}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-bold text-white">
                                {order.acheteur.prenom} {order.acheteur.nom}
                              </div>
                              <div className="text-sm text-white/70">{order.acheteur.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">{order.items.length} article(s)</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-white">
                            {parseFloat(order.totalPrice).toFixed(2)} MAD
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-white">
                            {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                          </div>
                          <div className="text-xs text-white/70">
                            {new Date(order.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(order.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleViewDetails(order)}
                              className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 hover:text-blue-200 rounded-lg transition-all duration-200 border border-blue-400/30"
                              title="Voir les détails"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>

                            {order.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => {
                                    setSelectedOrder(order);
                                    setShowValidateModal(true);
                                  }}
                                  className="p-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 hover:text-green-200 rounded-lg transition-all duration-200 border border-green-400/30"
                                  title="Valider"
                                >
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedOrder(order);
                                    setShowRefuseModal(true);
                                  }}
                                  className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 rounded-lg transition-all duration-200 border border-red-400/30"
                                  title="Refuser"
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
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Aucune commande trouvée</h3>
                <p className="text-white/70">Aucune commande ne correspond à vos critères de recherche.</p>
              </div>
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
          
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out;
          }
        `}</style>
      </div>

      {/* Modaux rendus via Portal */}
      <DetailsModal />
      <ValidateModal />
      <RefuseModal />
    </>
  );
};

export default AdminOrdersPage;