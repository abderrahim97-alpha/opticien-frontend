import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, ShoppingBag, AlertCircle, Sparkles } from 'lucide-react';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

  const getImageUrl = (imageName: string | undefined) => {
    if (!imageName) return '/placeholder-glasses.png';
    return `http://localhost:8000/uploads/images/${imageName}`;
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  // Empty Cart State
  if (cart.items.length === 0) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-950 via-blue-950 to-slate-900 py-8 px-4 flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        </div>

        <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl p-8 sm:p-12 text-center max-w-2xl z-10">
          <div className="relative inline-flex mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-40" />
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-2xl">
              <ShoppingCart className="text-white" size={48} />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-4">Votre panier est vide</h2>
          <p className="text-blue-200 mb-8 text-sm sm:text-base lg:text-lg">
            Découvrez notre sélection de montures et ajoutez vos favoris au panier
          </p>
          <button
            onClick={() => navigate('/marketplace')}
            className="relative group overflow-hidden w-full sm:w-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300" />
            <div className="relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold rounded-xl shadow-lg group-hover:shadow-2xl transition-all text-sm sm:text-base lg:text-lg">
              Découvrir le marketplace
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

  // Main Cart
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
          onClick={() => navigate('/marketplace')}
          className="relative group overflow-hidden mb-4 sm:mb-6 inline-block"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-0 group-hover:opacity-75 transition duration-300" />
          <div className="relative flex items-center gap-2 px-4 py-2 backdrop-blur-sm bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg sm:rounded-xl text-white font-bold transition-all text-sm sm:text-base">
            <ArrowLeft className="group-hover:-translate-x-1 transition-transform flex-shrink-0" size={18} />
            <span>Continuer mes achats</span>
          </div>
        </button>

        {/* Header */}
        <div className="relative group mb-6 sm:mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl sm:rounded-2xl blur-xl opacity-50 transition duration-300" />
          <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-2 flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <ShoppingCart size={24} />
                  </div>
                  <span>Mon Panier</span>
                </h1>
                <p className="text-blue-200 text-sm sm:text-base lg:text-lg">
                  {cart.totalItems} article{cart.totalItems > 1 ? 's' : ''} • Total: {cart.totalPrice.toFixed(2)} MAD
                </p>
              </div>
              <button
                onClick={clearCart}
                className="relative group/clear overflow-hidden w-full sm:w-auto"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl blur opacity-0 group-hover/clear:opacity-50 transition duration-300" />
                <div className="relative flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 backdrop-blur-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold rounded-xl transition-all text-sm sm:text-base">
                  <Trash2 size={18} className="flex-shrink-0" />
                  <span>Vider le panier</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {cart.items.map((item) => {
              const stockWarning = item.quantity > item.monture.stock;

              return (
                <div
                  key={item.monture.id}
                  className="relative group/item"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl sm:rounded-2xl blur-xl opacity-0 group-hover/item:opacity-20 transition duration-300" />
                  <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Image */}
                      <div
                        className="w-full sm:w-28 h-28 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 cursor-pointer group/img"
                        onClick={() => navigate(`/marketplace/monture/${item.monture.id}`)}
                      >
                        <img
                          src={getImageUrl(item.monture.images[0]?.imageName)}
                          alt={item.monture.name}
                          className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder-glasses.png';
                          }}
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0 space-y-3">
                        {/* Brand */}
                        {item.monture.brand && (
                          <p className="text-xs font-bold text-blue-300 uppercase truncate">
                            {item.monture.brand}
                          </p>
                        )}

                        {/* Name */}
                        <h3
                          className="font-bold text-white text-base sm:text-lg hover:text-blue-300 cursor-pointer transition-colors line-clamp-2"
                          onClick={() => navigate(`/marketplace/monture/${item.monture.id}`)}
                        >
                          {item.monture.name}
                        </h3>

                        {/* Attributes */}
                        <div className="flex flex-wrap gap-2">
                          {item.monture.type && (
                            <span className="px-2 py-1 backdrop-blur-sm bg-blue-500/20 border border-blue-400/30 text-blue-200 rounded-lg text-xs font-semibold">
                              {item.monture.type === 'vue' ? '👓 Vue' : '🕶️ Soleil'}
                            </span>
                          )}
                          {item.monture.genre && (
                            <span className="px-2 py-1 backdrop-blur-sm bg-purple-500/20 border border-purple-400/30 text-purple-200 rounded-lg text-xs font-semibold capitalize">
                              {item.monture.genre}
                            </span>
                          )}
                          {item.monture.couleur && (
                            <span className="px-2 py-1 backdrop-blur-sm bg-pink-500/20 border border-pink-400/30 text-pink-200 rounded-lg text-xs font-semibold capitalize">
                              {item.monture.couleur}
                            </span>
                          )}
                        </div>

                        {/* Stock Warning */}
                        {stockWarning && (
                          <div className="flex items-center gap-2 text-red-300 backdrop-blur-sm bg-red-500/20 border border-red-400/30 px-3 py-2 rounded-lg text-xs sm:text-sm">
                            <AlertCircle size={16} className="flex-shrink-0" />
                            <span className="font-semibold">
                              Stock insuffisant ! Seulement {item.monture.stock} disponible{item.monture.stock > 1 ? 's' : ''}
                            </span>
                          </div>
                        )}

                        {/* Quantity Controls & Price */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-white/10">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => updateQuantity(item.monture.id, item.quantity - 1)}
                              className="w-9 h-9 rounded-lg backdrop-blur-sm bg-white/10 hover:bg-white/20 border border-white/20 font-bold transition-colors flex items-center justify-center text-white"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="text-lg font-bold text-white w-10 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.monture.id, item.quantity + 1)}
                              disabled={item.quantity >= item.monture.stock}
                              className="w-9 h-9 rounded-lg backdrop-blur-sm bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed border border-white/20 font-bold transition-colors flex items-center justify-center text-white"
                            >
                              <Plus size={16} />
                            </button>
                          </div>

                          <div className="text-left sm:text-right">
                            <p className="text-xs text-blue-200">
                              {item.monture.price.toFixed(2)} MAD × {item.quantity}
                            </p>
                            <p className="text-lg sm:text-xl font-black bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                              {(item.monture.price * item.quantity).toFixed(2)} MAD
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.monture.id)}
                        className="absolute top-3 right-3 sm:relative sm:top-auto sm:right-auto self-start p-2 sm:p-3 hover:bg-red-500/20 rounded-lg transition-colors group/delete"
                        title="Retirer du panier"
                      >
                        <Trash2 className="text-blue-200 group-hover/delete:text-red-400 transition-colors" size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:sticky lg:top-6">
              <h2 className="text-xl sm:text-2xl font-black text-white mb-4 sm:mb-6 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
                  <ShoppingBag size={18} />
                </div>
                <span>Résumé</span>
              </h2>

              <div className="space-y-3 sm:space-y-4 mb-6">
                <div className="flex justify-between text-blue-200 text-sm sm:text-base">
                  <span className="font-semibold">
                    Sous-total ({cart.totalItems} article{cart.totalItems > 1 ? 's' : ''}):
                  </span>
                  <span className="font-bold text-white">{cart.totalPrice.toFixed(2)} MAD</span>
                </div>

                <div className="flex justify-between text-blue-200 text-sm sm:text-base">
                  <span className="font-semibold">Livraison:</span>
                  <span className="text-green-400 font-bold">Selon arrangement</span>
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

              {/* Warning if stock issues */}
              {cart.items.some((item) => item.quantity > item.monture.stock) && (
                <div className="mb-6 backdrop-blur-md bg-red-500/20 border border-red-400/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-red-300 mb-2">
                    <AlertCircle size={18} className="flex-shrink-0" />
                    <span className="font-bold text-sm sm:text-base">Attention</span>
                  </div>
                  <p className="text-xs sm:text-sm text-red-200">
                    Certains articles dépassent le stock disponible. Veuillez ajuster les quantités avant de continuer.
                  </p>
                </div>
              )}

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={cart.items.some((item) => item.quantity > item.monture.stock)}
                className="relative w-full group/btn overflow-hidden mb-4"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl blur-lg opacity-75 group-hover/btn:opacity-100 transition duration-300" />
                <div className={`relative py-3 sm:py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold text-base sm:text-lg shadow-lg group-hover/btn:shadow-2xl transition-all flex items-center justify-center gap-2 ${
                  cart.items.some((item) => item.quantity > item.monture.stock) ? 'cursor-not-allowed opacity-50' : ''
                }`}>
                  <ShoppingBag size={20} className="flex-shrink-0 sm:w-6 sm:h-6" />
                  <span>Passer la commande</span>
                </div>
              </button>

              <p className="text-xs text-blue-200/70 text-center">
                La commande sera validée par l'administrateur avant traitement
              </p>

              {/* Info Box */}
              <div className="mt-6 backdrop-blur-md bg-blue-500/20 border border-blue-400/30 rounded-xl p-4">
                <p className="text-blue-200 font-bold mb-2 flex items-center gap-2 text-sm">
                  <Sparkles className="text-yellow-300 flex-shrink-0" size={16} />
                  <span>Processus de commande</span>
                </p>
                <ul className="space-y-2 text-blue-100 text-xs">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-300 font-bold flex-shrink-0">•</span>
                    <span>Validation administrative requise</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-300 font-bold flex-shrink-0">•</span>
                    <span>Notification par email</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-300 font-bold flex-shrink-0">•</span>
                    <span>Organisation de la livraison</span>
                  </li>
                </ul>
              </div>
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

export default CartPage;