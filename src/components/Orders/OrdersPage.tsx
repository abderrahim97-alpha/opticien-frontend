import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    nom: string;
    prenom: string;
  };
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

type ViewType = 'purchases' | 'sales';

const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [viewType, setViewType] = useState<ViewType>('sales');
  const [purchases, setPurchases] = useState<Commande[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Commande | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/', { replace: true });
      return;
    }
    
    fetchUserRole(token);
  }, [navigate]);

  const fetchUserRole = async (token: string) => {
    try {
      const response = await api.get('/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const userIsAdmin = response.data.roles?.includes('ROLE_ADMIN') || false;
      setIsAdmin(userIsAdmin);
      
      if (userIsAdmin) {
        setViewType('sales');
      }
      
      fetchOrders(token, userIsAdmin);
    } catch (error) {
      console.error('Erreur lors de la récupération du rôle:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !loading) {
      fetchOrders(token, isAdmin);
    }
  }, [viewType]);

  const fetchOrders = async (token: string, userIsAdmin: boolean) => {
    setLoading(true);
    try {
      if (userIsAdmin) {
        const response = await api.get('/orders/my-sales', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSales(response.data);
      } else {
        if (viewType === 'purchases') {
          const response = await api.get('/orders/my-purchases', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setPurchases(response.data);
        } else {
          const response = await api.get('/orders/my-sales', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setSales(response.data);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
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

    const statusConfig = config[status as keyof typeof config] || config.pending;

    return (
      <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full ${statusConfig.bg} ${statusConfig.text} shadow-lg`}>
        {statusConfig.icon}
        {statusConfig.label}
      </span>
    );
  };

  const handleViewDetails = (order: Commande) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

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
    <div className="relative p-6 space-y-6">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20 -z-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-black text-white mb-2">
            {isAdmin ? 'Gestion des Ventes' : 'Mes Commandes'}
          </h1>
          <p className="text-blue-200 text-lg">
            {isAdmin 
              ? 'Gérez toutes vos ventes en tant qu\'administrateur' 
              : viewType === 'purchases' ? 'Consultez vos achats' : 'Gérez vos ventes'
            }
          </p>
        </div>

        {/* View Toggle & Stats */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Toggle Buttons */}
            {!isAdmin && (
              <div className="flex bg-white/10 rounded-xl p-1 border border-white/20">
                <button
                  onClick={() => setViewType('purchases')}
                  className={`px-6 py-2.5 rounded-lg font-bold transition-all duration-200 ${
                    viewType === 'purchases'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <svg className="w-5 h-5 inline-block mr-2 -mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Mes Achats
                </button>
                <button
                  onClick={() => setViewType('sales')}
                  className={`px-6 py-2.5 rounded-lg font-bold transition-all duration-200 ${
                    viewType === 'sales'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <svg className="w-5 h-5 inline-block mr-2 -mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Mes Ventes
                </button>
              </div>
            )}

            {/* Admin Badge */}
            {isAdmin && (
              <div className="flex items-center gap-2 bg-purple-500/20 border border-purple-400/30 rounded-xl px-4 py-2.5">
                <svg className="w-5 h-5 text-purple-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-bold text-purple-200">Mode Administrateur</span>
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center gap-4">
              <div className="text-center px-5 py-3 bg-blue-500/20 rounded-xl border border-blue-400/30">
                <p className="text-xs text-blue-200 font-semibold uppercase tracking-wide">Total</p>
                <p className="text-2xl font-black text-white mt-1">
                  {isAdmin || viewType === 'sales' ? sales.length : purchases.length}
                </p>
              </div>
              <div className="text-center px-5 py-3 bg-yellow-500/20 rounded-xl border border-yellow-400/30">
                <p className="text-xs text-yellow-200 font-semibold uppercase tracking-wide">En attente</p>
                <p className="text-2xl font-black text-white mt-1">
                  {isAdmin || viewType === 'sales'
                    ? sales.filter((s: any) => s.commande.status === 'pending').length
                    : purchases.filter(p => p.status === 'pending').length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {isAdmin || viewType === 'sales' ? (
          // SALES VIEW
          sales.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {sales.map((sale: any) => (
                <div key={sale.commande.id} className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl overflow-hidden shadow-lg hover:bg-white/15 transition-all duration-200">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      {/* Sale Info */}
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-black text-white">
                            Vente #{sale.commande.id}
                          </h3>
                          <p className="text-sm text-white/70">
                            Acheteur: {sale.commande.acheteur.prenom} {sale.commande.acheteur.nom}
                          </p>
                          <p className="text-xs text-white/50">
                            {new Date(sale.commande.createdAt).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-white/70">Mes articles</p>
                          <p className="text-2xl font-black text-white">
                            {sale.items.reduce((sum: number, item: any) => sum + parseFloat(item.sousTotal), 0).toFixed(2)} MAD
                          </p>
                        </div>
                        {getStatusBadge(sale.commande.status)}
                      </div>
                    </div>

                    {/* My Items in this Order */}
                    <div className="border-t border-white/20 pt-4">
                      <p className="text-sm font-bold text-white mb-3">
                        Mes articles vendus ({sale.items.length})
                      </p>
                      <div className="space-y-2">
                        {sale.items.map((item: any) => (
                          <div key={item.id} className="flex items-center justify-between bg-green-500/10 border border-green-400/30 p-3 rounded-xl">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                {item.monture.name.substring(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-bold text-white">{item.monture.name}</p>
                                <p className="text-sm text-white/70">Quantité: {item.quantite} × {parseFloat(item.prixUnitaire).toFixed(2)} MAD</p>
                              </div>
                            </div>
                            <p className="font-black text-green-300 text-lg">{parseFloat(item.sousTotal).toFixed(2)} MAD</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-12 text-center shadow-lg">
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Aucune vente</h3>
              <p className="text-white/70">Vous n'avez pas encore réalisé de ventes.</p>
            </div>
          )
        ) : (
          // PURCHASES VIEW
          purchases.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {purchases.map((order) => (
                <div key={order.id} className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl overflow-hidden shadow-lg hover:bg-white/15 transition-all duration-200">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      {/* Order Info */}
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-black text-white">
                            Commande #{order.id}
                          </h3>
                          <p className="text-sm text-white/70">
                            {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Status & Price */}
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-white/70">Total</p>
                          <p className="text-2xl font-black text-white">{parseFloat(order.totalPrice).toFixed(2)} MAD</p>
                        </div>
                        {getStatusBadge(order.status)}
                      </div>
                    </div>

                    {/* Items Summary */}
                    <div className="border-t border-white/20 pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-bold text-white">
                          {order.items.length} article{order.items.length > 1 ? 's' : ''}
                        </p>
                        <button
                          onClick={() => handleViewDetails(order)}
                          className="text-blue-300 hover:text-blue-200 text-sm font-bold flex items-center gap-1 bg-blue-500/20 hover:bg-blue-500/30 px-3 py-1.5 rounded-lg transition-all duration-200 border border-blue-400/30"
                        >
                          Voir détails
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>

                      {/* Items Preview */}
                      <div className="space-y-2">
                        {order.items.slice(0, 2).map((item) => (
                          <div key={item.id} className="flex items-center justify-between bg-white/5 border border-white/10 p-3 rounded-xl">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                {item.monture.name.substring(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-bold text-white">{item.monture.name}</p>
                                <p className="text-sm text-white/70">Quantité: {item.quantite}</p>
                              </div>
                            </div>
                            <p className="font-black text-white text-lg">{parseFloat(item.sousTotal).toFixed(2)} MAD</p>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <p className="text-sm text-white/70 text-center py-2 bg-white/5 rounded-lg">
                            +{order.items.length - 2} autre{order.items.length - 2 > 1 ? 's' : ''} article{order.items.length - 2 > 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Admin Note (if refused) */}
                    {order.status === 'refused' && order.noteAdmin && (
                      <div className="mt-4 p-3 bg-red-500/10 border border-red-400/30 rounded-xl">
                        <p className="text-sm font-bold text-red-300 mb-1">Raison du refus:</p>
                        <p className="text-sm text-red-200">{order.noteAdmin}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-12 text-center shadow-lg">
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Aucun achat</h3>
              <p className="text-white/70">Vous n'avez pas encore effectué d'achats.</p>
            </div>
          )
        )}

        {/* Order Details Modal */}
        {showDetails && selectedOrder && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden">
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
                      onClick={() => setShowDetails(false)}
                      className="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-2 transition-all duration-200"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-6 max-h-[calc(90vh-200px)] overflow-y-auto">
                  {/* Status Card */}
                  <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-blue-200 font-semibold">Statut</p>
                        <p className="font-bold text-white">
                          {selectedOrder.status === 'pending' && 'En attente de validation'}
                          {selectedOrder.status === 'validated' && 'Validée par l\'admin'}
                          {selectedOrder.status === 'refused' && 'Refusée'}
                          {selectedOrder.status === 'completed' && 'Complétée'}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(selectedOrder.status)}
                  </div>

                  {/* Admin Note */}
                  {selectedOrder.noteAdmin && (
                    <div className={`p-4 rounded-xl border-2 ${
                      selectedOrder.status === 'refused' 
                        ? 'bg-red-500/10 border-red-400/50' 
                        : 'bg-blue-500/10 border-blue-400/50'
                    }`}>
                      <p className={`text-sm font-bold mb-1 ${
                        selectedOrder.status === 'refused' ? 'text-red-300' : 'text-blue-300'
                      }`}>
                        Note de l'administrateur:
                      </p>
                      <p className={`text-sm ${
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
                      Articles commandés
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
                          <div className="pt-3 border-t border-white/20">
                            <p className="text-sm text-white/70">
                              Vendeur: <span className="font-medium text-white">
                                {item.vendeur.prenom} {item.vendeur.nom}
                              </span>
                            </p>
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
                </div>

                {/* Modal Footer */}
                <div className="bg-white/5 px-6 py-4 border-t border-white/20 flex justify-end">
                  <button
                    onClick={() => setShowDetails(false)}
                    className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all duration-200"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
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

export default OrdersPage;