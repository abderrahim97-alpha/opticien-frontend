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
  const [viewType, setViewType] = useState<ViewType>('sales'); // Default to 'sales'
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
    
    // Fetch user profile to check if admin
    fetchUserRole(token);
  }, [navigate]);

  const fetchUserRole = async (token: string) => {
    try {
      const response = await api.get('/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Check if user is admin
      const userIsAdmin = response.data.roles?.includes('ROLE_ADMIN') || false;
      setIsAdmin(userIsAdmin);
      
      // If admin, force sales view
      if (userIsAdmin) {
        setViewType('sales');
      }
      
      // Fetch orders after determining role
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
      // Admin can only see sales
      if (userIsAdmin) {
        const response = await api.get('/orders/my-sales', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSales(response.data);
      } else {
        // Regular users can see both
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
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      validated: 'bg-green-100 text-green-800 border-green-200',
      refused: 'bg-red-100 text-red-800 border-red-200',
      completed: 'bg-blue-100 text-blue-800 border-blue-200',
    };
    const labels = {
      pending: 'En attente',
      validated: 'Validée',
      refused: 'Refusée',
      completed: 'Complétée',
    };
    return (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      pending: (
        <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      ),
      validated: (
        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
      refused: (
        <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      ),
      completed: (
        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
    };
    return icons[status as keyof typeof icons];
  };

  const handleViewDetails = (order: Commande) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des commandes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg shadow-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          {isAdmin ? 'Gestion des Ventes' : 'Mes Commandes'}
        </h1>
        <p className="text-blue-100">
          {isAdmin 
            ? 'Gérez toutes vos ventes en tant qu\'administrateur' 
            : viewType === 'purchases' ? 'Consultez vos achats' : 'Gérez vos ventes'
          }
        </p>
      </div>

      {/* View Toggle & Stats */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Toggle Buttons - Only show for non-admin users */}
          {!isAdmin && (
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewType('purchases')}
                className={`px-6 py-2 rounded-md font-medium transition ${
                  viewType === 'purchases'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <svg className="w-5 h-5 inline-block mr-2 -mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Mes Achats
              </button>
              <button
                onClick={() => setViewType('sales')}
                className={`px-6 py-2 rounded-md font-medium transition ${
                  viewType === 'sales'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-gray-600 hover:text-gray-900'
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
            <div className="flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-lg px-4 py-2">
              <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-purple-900">Mode Administrateur</span>
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center gap-4">
            <div className="text-center px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-600 font-medium">Total</p>
              <p className="text-xl font-bold text-blue-900">
                {isAdmin || viewType === 'sales' ? sales.length : purchases.length}
              </p>
            </div>
            <div className="text-center px-4 py-2 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-xs text-yellow-600 font-medium">En attente</p>
              <p className="text-xl font-bold text-yellow-900">
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
        // SALES VIEW (for admin and regular users on sales tab)
        sales.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {sales.map((sale: any) => (
              <div key={sale.commande.id} className="bg-white rounded-lg shadow hover:shadow-md transition">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    {/* Sale Info */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Vente #{sale.commande.id}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Acheteur: {sale.commande.acheteur.prenom} {sale.commande.acheteur.nom}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(sale.commande.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Mes articles</p>
                        <p className="text-xl font-bold text-gray-900">
                          {sale.items.reduce((sum: number, item: any) => sum + parseFloat(item.sousTotal), 0).toFixed(2)} MAD
                        </p>
                      </div>
                      {getStatusBadge(sale.commande.status)}
                    </div>
                  </div>

                  {/* My Items in this Order */}
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-sm font-medium text-gray-700 mb-3">
                      Mes articles vendus ({sale.items.length})
                    </p>
                    <div className="space-y-2">
                      {sale.items.map((item: any) => (
                        <div key={item.id} className="flex items-center justify-between text-sm bg-green-50 p-3 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded flex items-center justify-center text-green-600 font-semibold text-xs">
                              {item.monture.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{item.monture.name}</p>
                              <p className="text-gray-500">Quantité: {item.quantite} × {parseFloat(item.prixUnitaire).toFixed(2)} MAD</p>
                            </div>
                          </div>
                          <p className="font-semibold text-green-600">{parseFloat(item.sousTotal).toFixed(2)} MAD</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune vente</h3>
            <p className="text-gray-500">Vous n'avez pas encore réalisé de ventes.</p>
          </div>
        )
      ) : (
        // PURCHASES VIEW (only for non-admin users)
        purchases.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {purchases.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow hover:shadow-md transition">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    {/* Order Info */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        {getStatusIcon(order.status)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Commande #{order.id}
                        </h3>
                        <p className="text-sm text-gray-500">
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
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="text-xl font-bold text-gray-900">{parseFloat(order.totalPrice).toFixed(2)} MAD</p>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>

                  {/* Items Summary */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-700">
                        {order.items.length} article{order.items.length > 1 ? 's' : ''}
                      </p>
                      <button
                        onClick={() => handleViewDetails(order)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
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
                        <div key={item.id} className="flex items-center justify-between text-sm bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-100 rounded flex items-center justify-center text-indigo-600 font-semibold text-xs">
                              {item.monture.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{item.monture.name}</p>
                              <p className="text-gray-500">Quantité: {item.quantite}</p>
                            </div>
                          </div>
                          <p className="font-semibold text-gray-900">{parseFloat(item.sousTotal).toFixed(2)} MAD</p>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <p className="text-sm text-gray-500 text-center py-2">
                          +{order.items.length - 2} autre{order.items.length - 2 > 1 ? 's' : ''} article{order.items.length - 2 > 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Admin Note (if refused) */}
                  {order.status === 'refused' && order.noteAdmin && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm font-medium text-red-800 mb-1">Raison du refus:</p>
                      <p className="text-sm text-red-700">{order.noteAdmin}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun achat</h3>
            <p className="text-gray-500">Vous n'avez pas encore effectué d'achats.</p>
          </div>
        )
      )}

      {/* Order Details Modal */}
      {showDetails && selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Détails de la commande #{selectedOrder.id}</h2>
                  <p className="text-blue-100 text-sm mt-1">
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
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Status Card */}
              <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(selectedOrder.status)}
                  <div>
                    <p className="text-sm text-gray-500">Statut</p>
                    <p className="font-semibold text-gray-900">
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
                <div className={`p-4 rounded-lg border ${
                  selectedOrder.status === 'refused' 
                    ? 'bg-red-50 border-red-200' 
                    : 'bg-blue-50 border-blue-200'
                }`}>
                  <p className={`text-sm font-medium mb-1 ${
                    selectedOrder.status === 'refused' ? 'text-red-800' : 'text-blue-800'
                  }`}>
                    Note de l'administrateur:
                  </p>
                  <p className={`text-sm ${
                    selectedOrder.status === 'refused' ? 'text-red-700' : 'text-blue-700'
                  }`}>
                    {selectedOrder.noteAdmin}
                  </p>
                </div>
              )}

              {/* Items List */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Articles commandés</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold">
                            {item.monture.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{item.monture.name}</h4>
                            <p className="text-sm text-gray-500">{item.monture.brand || 'Sans marque'}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">{parseFloat(item.sousTotal).toFixed(2)} MAD</p>
                          <p className="text-xs text-gray-500">
                            {item.quantite} × {parseFloat(item.prixUnitaire).toFixed(2)} MAD
                          </p>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-gray-100">
                        <p className="text-xs text-gray-500">
                          Vendeur: <span className="font-medium text-gray-700">
                            {item.vendeur.prenom} {item.vendeur.nom}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t-2 border-gray-200 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900">Total de la commande</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {parseFloat(selectedOrder.totalPrice).toFixed(2)} MAD
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end gap-3">
              <button
                onClick={() => setShowDetails(false)}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;