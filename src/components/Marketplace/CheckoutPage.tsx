import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import api from '../../Api/axios';
import { ShoppingBag, CheckCircle, AlertCircle, Package, ArrowLeft, Sparkles } from 'lucide-react';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);

  const getImageUrl = (imageName: string | undefined) => {
    if (!imageName) return '/placeholder-glasses.png';
    return `http://localhost:8000/uploads/images/${imageName}`;
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');

      const orderData = {
        items: cart.items.map((item) => ({
          montureId: item.monture.id,
          quantite: item.quantity,
        })),
      };

      const response = await api.post('/orders/create', orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrderId(response.data.commandeId);
      setSuccess(true);
      clearCart();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de la création de la commande');
      console.error('Order creation error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Empty Cart State
  if (cart.items.length === 0 && !success) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-950 via-blue-950 to-slate-900 py-8 px-4 flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        </div>

        <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl p-8 sm:p-12 text-center max-w-2xl z-10">
          <div className="relative inline-flex mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full blur-xl opacity-40" />
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-yellow-400 flex items-center justify-center shadow-2xl">
              <AlertCircle className="text-white" size={48} />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-4">Votre panier est vide</h2>
          <p className="text-blue-200 mb-8 text-sm sm:text-base lg:text-lg">
            Veuillez ajouter des articles à votre panier avant de passer commande
          </p>
          <button
            onClick={() => navigate('/marketplace')}
            className="relative group overflow-hidden w-full sm:w-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300" />
            <div className="relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold rounded-xl shadow-lg group-hover:shadow-2xl transition-all text-sm sm:text-base lg:text-lg">
              Retour au marketplace
            </div>
          </button>
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

  // Success State
  if (success) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-950 via-blue-950 to-slate-900 py-8 px-4 flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        </div>

        <div className="relative max-w-3xl mx-auto z-10">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl p-8 sm:p-12 text-center">
            <div className="relative inline-flex mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full blur-2xl opacity-60 animate-pulse" />
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-2xl animate-bounce">
                <CheckCircle className="text-white" size={60} />
              </div>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-4">Commande créée avec succès !</h1>
            <p className="text-lg sm:text-xl text-blue-200 mb-2">
              Numéro de commande: <span className="font-black text-green-300">#{orderId}</span>
            </p>
            <p className="text-blue-200 mb-8 text-sm sm:text-base">
              Votre commande a été envoyée à l'administrateur pour validation.
              Vous recevrez un email de confirmation dès que votre commande sera validée.
            </p>

            <div className="backdrop-blur-md bg-blue-500/20 border border-blue-400/30 rounded-xl p-6 mb-8 text-left">
              <p className="text-blue-200 font-bold mb-3 flex items-center gap-2">
                <Sparkles className="text-yellow-300" size={20} />
                📧 Prochaines étapes:
              </p>
              <ul className="space-y-3 text-blue-100 text-sm sm:text-base">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/30 flex items-center justify-center font-black text-xs">1</span>
                  <span>L'administrateur vérifiera votre commande</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/30 flex items-center justify-center font-black text-xs">2</span>
                  <span>Vous recevrez un email de validation ou de refus</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/30 flex items-center justify-center font-black text-xs">3</span>
                  <span>En cas de validation, vous pourrez organiser la livraison</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/orders')}
                className="relative group overflow-hidden flex-1 sm:flex-none"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300" />
                <div className="relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold rounded-xl shadow-lg group-hover:shadow-2xl transition-all text-sm sm:text-base">
                  Voir mes commandes
                </div>
              </button>
              <button
                onClick={() => navigate('/marketplace')}
                className="relative group overflow-hidden flex-1 sm:flex-none"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-0 group-hover:opacity-50 transition duration-300" />
                <div className="relative px-6 sm:px-8 py-3 sm:py-4 backdrop-blur-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold rounded-xl transition-all text-sm sm:text-base">
                  Continuer mes achats
                </div>
              </button>
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

  // Main Checkout
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-950 via-blue-950 to-slate-900 py-6 sm:py-8 px-3 sm:px-4 lg:px-6">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="relative max-w-7xl mx-auto z-10">
        {/* Back Button */}
        <button
          onClick={() => navigate('/cart')}
          className="relative group overflow-hidden mb-4 sm:mb-6 inline-block"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-0 group-hover:opacity-75 transition duration-300" />
          <div className="relative flex items-center gap-2 px-4 py-2 backdrop-blur-sm bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg sm:rounded-xl text-white font-bold transition-all text-sm sm:text-base">
            <ArrowLeft className="group-hover:-translate-x-1 transition-transform flex-shrink-0" size={18} />
            <span>Retour au panier</span>
          </div>
        </button>

        {/* Header */}
        <div className="relative group mb-6 sm:mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl sm:rounded-2xl blur-xl opacity-50 transition duration-300" />
          <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-2 flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                <ShoppingBag size={24} />
              </div>
              <span>Finaliser ma commande</span>
            </h1>
            <p className="text-blue-200 text-sm sm:text-base lg:text-lg">
              Vérifiez votre commande avant de la soumettre à validation
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="backdrop-blur-xl bg-white/10 border-2 border-red-400/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <AlertCircle className="text-white" size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold mb-1 text-sm sm:text-base">Erreur</p>
                <p className="text-red-200 text-xs sm:text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Items Card */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl sm:rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition duration-300" />
              <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-black text-white mb-4 sm:mb-6 flex items-center gap-2">
                  <Package size={24} className="flex-shrink-0" />
                  <span>Articles commandés ({cart.totalItems})</span>
                </h2>

                <div className="space-y-3 sm:space-y-4">
                  {cart.items.map((item) => (
                    <div
                      key={item.monture.id}
                      className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4 backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg sm:rounded-xl"
                    >
                      {/* Image */}
                      <div className="w-full sm:w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
                        <img
                          src={getImageUrl(item.monture.images[0]?.imageName)}
                          alt={item.monture.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder-glasses.png';
                          }}
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        {item.monture.brand && (
                          <p className="text-xs font-bold text-blue-300 uppercase mb-1 truncate">
                            {item.monture.brand}
                          </p>
                        )}
                        <h3 className="font-bold text-white mb-2 text-sm sm:text-base line-clamp-2">{item.monture.name}</h3>
                        <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-blue-200">
                          <span>Qté: <span className="font-bold text-white">{item.quantity}</span></span>
                          <span>Prix: <span className="font-bold text-white">{item.monture.price.toFixed(2)} MAD</span></span>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-left sm:text-right">
                        <p className="text-lg sm:text-xl font-black bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                          {(item.monture.price * item.quantity).toFixed(2)} MAD
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Important Notice */}
            <div className="backdrop-blur-md bg-blue-500/20 border border-blue-400/30 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-blue-200 mb-3 flex items-center gap-2">
                <AlertCircle size={20} className="flex-shrink-0" />
                <span>Informations importantes</span>
              </h3>
              <ul className="space-y-2 sm:space-y-3 text-blue-100 text-xs sm:text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-blue-300 font-bold flex-shrink-0">•</span>
                  <span>Votre commande sera soumise à l'administrateur pour validation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-300 font-bold flex-shrink-0">•</span>
                  <span>Le stock sera réservé dès la création de la commande</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-300 font-bold flex-shrink-0">•</span>
                  <span>Vous recevrez un email de confirmation une fois validée</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-300 font-bold flex-shrink-0">•</span>
                  <span>Le paiement et la livraison seront organisés après validation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-300 font-bold flex-shrink-0">•</span>
                  <span>En cas de refus, le stock sera automatiquement restauré</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:sticky lg:top-6">
              <h2 className="text-xl sm:text-2xl font-black text-white mb-4 sm:mb-6">Récapitulatif</h2>

              <div className="space-y-3 sm:space-y-4 mb-6">
                <div className="flex justify-between text-blue-200 text-sm sm:text-base">
                  <span className="font-semibold">Articles ({cart.totalItems}):</span>
                  <span className="font-bold text-white">{cart.totalPrice.toFixed(2)} MAD</span>
                </div>

                <div className="flex justify-between text-blue-200 text-sm sm:text-base">
                  <span className="font-semibold">Frais de traitement:</span>
                  <span className="text-green-400 font-bold">Gratuit</span>
                </div>

                <div className="flex justify-between text-blue-200 text-sm sm:text-base">
                  <span className="font-semibold">Livraison:</span>
                  <span className="text-yellow-400 font-bold">À déterminer</span>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg sm:text-xl font-bold text-white">Total:</span>
                    <span className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                      {cart.totalPrice.toFixed(2)} MAD
                    </span>
                  </div>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="relative w-full group/btn overflow-hidden mb-4"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl blur-lg opacity-75 group-hover/btn:opacity-100 transition duration-300" />
                <div className={`relative py-3 sm:py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold text-base sm:text-lg shadow-lg group-hover/btn:shadow-2xl transition-all flex items-center justify-center gap-2 ${
                  loading ? 'cursor-not-allowed opacity-75' : ''
                }`}>
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-white"></div>
                      <span className="text-sm sm:text-base">Création en cours...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle size={20} className="flex-shrink-0 sm:w-6 sm:h-6" />
                      <span>Confirmer la commande</span>
                    </>
                  )}
                </div>
              </button>

              <p className="text-xs text-blue-200/70 text-center">
                En confirmant, vous acceptez que votre commande soit soumise à validation administrative
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
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

export default CheckoutPage;