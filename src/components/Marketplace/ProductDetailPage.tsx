import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../Api/axios';
import { Monture } from '../../types/marketplace';
import { useCart } from '../../context/CartContext';
import ProductImageGallery from '../../components/Marketplace/ProductImageGallery';
import SimilarProducts from '../../components/Marketplace/SimilarProducts';
import {
  ShoppingCart,
  Package,
  AlertCircle,
  ArrowLeft,
  Check,
  User,
  Tag,
  Palette,
  Box,
  Eye,
  Users,
  Shapes,
  Sparkles,
} from 'lucide-react';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, isInCart, getItemQuantity } = useCart();

  const [monture, setMonture] = useState<Monture | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchMonture = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get(`/marketplace/montures/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMonture(response.data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Erreur lors du chargement du produit');
      } finally {
        setLoading(false);
      }
    };

    fetchMonture();
  }, [id]);

  const handleAddToCart = () => {
    if (monture && quantity > 0 && quantity <= monture.stock) {
      addToCart(monture, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  const getTypeIcon = () => {
    if (monture?.type === 'vue') return '👓';
    if (monture?.type === 'soleil') return '🕶️';
    return '👓';
  };

  const getGenreLabel = () => {
    const labels = {
      homme: '👨 Homme',
      femme: '👩 Femme',
      enfant: '👶 Enfant',
      unisexe: '⚡ Unisexe',
    };
    return monture?.genre ? labels[monture.genre] : null;
  };

  const getMateriauLabel = (value: string) => {
    const labels: Record<string, string> = {
      acetate: 'Acétate',
      metal: 'Métal',
      plastique: 'Plastique',
      titane: 'Titane',
      tr90: 'TR90',
      aluminium: 'Aluminium',
      acier_inoxydable: 'Acier inoxydable',
      fibre_carbone: 'Fibre de carbone',
      bois: 'Bois',
      corne: 'Corne',
      metal_plastique: 'Métal/Plastique',
    };
    return labels[value] || value;
  };

  if (loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-950 via-blue-950 to-slate-900 px-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        </div>

        <div className="relative text-center z-10">
          <div className="relative inline-flex mb-4 sm:mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full blur-xl opacity-60 animate-pulse" />
            <div className="relative">
              <svg className="animate-spin h-12 w-12 sm:h-16 sm:w-16 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          </div>
          <p className="text-base sm:text-lg font-bold text-white">Chargement du produit...</p>
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

  if (error || !monture) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-950 via-blue-950 to-slate-900 px-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        </div>

        <div className="relative backdrop-blur-xl bg-white/10 border-2 border-red-400/50 rounded-xl sm:rounded-2xl p-6 sm:p-8 max-w-md z-10">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <AlertCircle className="text-white" size={32} />
          </div>
          <p className="text-white font-bold text-center mb-4 text-base sm:text-lg">{error || 'Produit introuvable'}</p>
          <button
            onClick={() => navigate('/marketplace')}
            className="relative w-full group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300" />
            <div className="relative px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold rounded-xl shadow-lg group-hover:shadow-2xl transition-all duration-300 text-sm sm:text-base">
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

  const isLowStock = monture.stock > 0 && monture.stock <= 5;
  const isOutOfStock = monture.stock === 0;
  const inCart = isInCart(monture.id);
  const cartQuantity = getItemQuantity(monture.id);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-950 via-blue-950 to-slate-900 py-6 sm:py-8 px-3 sm:px-4 lg:px-6">
      {/* Animated Background Blobs */}
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
          <div className="relative flex items-center gap-2 px-4 py-2 backdrop-blur-sm bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg sm:rounded-xl text-white font-bold transition-all duration-300 text-sm sm:text-base">
            <ArrowLeft className="group-hover:-translate-x-1 transition-transform flex-shrink-0" size={18} />
            <span>Retour au marketplace</span>
          </div>
        </button>

        {/* Main Content */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl sm:rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition duration-300" />
          <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 p-4 sm:p-6 lg:p-8">
              {/* Left Column - Images */}
              <div>
                <ProductImageGallery images={monture.images} productName={monture.name} />
              </div>

              {/* Right Column - Details */}
              <div className="space-y-4 sm:space-y-6">
                {/* Type Badge */}
                {monture.type && (
                  <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 backdrop-blur-md bg-blue-500/20 border border-blue-400/30 text-blue-200 rounded-full font-bold text-xs sm:text-sm">
                    <span className="text-base sm:text-lg">{getTypeIcon()}</span>
                    <span>{monture.type === 'vue' ? 'Lunettes de vue' : 'Lunettes de soleil'}</span>
                  </div>
                )}

                {/* Brand */}
                {monture.brand && (
                  <p className="text-xs sm:text-sm font-bold text-blue-300 uppercase tracking-wider">
                    {monture.brand}
                  </p>
                )}

                {/* Name */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">{monture.name}</h1>

                {/* Price */}
                <div className="flex items-baseline gap-2 sm:gap-3">
                  <span className="text-4xl sm:text-5xl lg:text-6xl font-black bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    {monture.price.toFixed(2)}
                  </span>
                  <span className="text-xl sm:text-2xl text-blue-200">MAD</span>
                </div>

                {/* Stock Status */}
                <div>
                  {isOutOfStock && (
                    <div className="flex items-center gap-2 sm:gap-3 backdrop-blur-md bg-red-500/20 border border-red-400/30 text-red-200 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl">
                      <AlertCircle size={18} className="flex-shrink-0 sm:w-5 sm:h-5" />
                      <span className="font-bold text-xs sm:text-sm">Rupture de stock</span>
                    </div>
                  )}
                  {isLowStock && !isOutOfStock && (
                    <div className="flex items-center gap-2 sm:gap-3 backdrop-blur-md bg-orange-500/20 border border-orange-400/30 text-orange-200 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl animate-pulse">
                      <Sparkles size={18} className="flex-shrink-0 sm:w-5 sm:h-5" />
                      <span className="font-bold text-xs sm:text-sm">
                        Plus que {monture.stock} en stock - Commandez vite !
                      </span>
                    </div>
                  )}
                  {!isOutOfStock && !isLowStock && (
                    <div className="flex items-center gap-2 sm:gap-3 backdrop-blur-md bg-green-500/20 border border-green-400/30 text-green-200 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl">
                      <Check size={18} className="flex-shrink-0 sm:w-5 sm:h-5" />
                      <span className="font-bold text-xs sm:text-sm">{monture.stock} disponibles en stock</span>
                    </div>
                  )}
                </div>

                {/* Attributes Grid */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 pt-4 sm:pt-6 border-t border-white/10">
                  {monture.genre && (
                    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 backdrop-blur-sm bg-purple-500/20 border border-purple-400/30 rounded-lg">
                      <Users className="text-purple-300 flex-shrink-0" size={20} />
                      <div className="min-w-0">
                        <p className="text-[10px] sm:text-xs text-purple-300 font-bold uppercase truncate">Genre</p>
                        <p className="text-xs sm:text-sm font-bold text-white truncate">{getGenreLabel()}</p>
                      </div>
                    </div>
                  )}

                  {monture.forme && (
                    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 backdrop-blur-sm bg-indigo-500/20 border border-indigo-400/30 rounded-lg">
                      <Shapes className="text-indigo-300 flex-shrink-0" size={20} />
                      <div className="min-w-0">
                        <p className="text-[10px] sm:text-xs text-indigo-300 font-bold uppercase truncate">Forme</p>
                        <p className="text-xs sm:text-sm font-bold text-white capitalize truncate">{monture.forme}</p>
                      </div>
                    </div>
                  )}

                  {monture.couleur && (
                    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 backdrop-blur-sm bg-pink-500/20 border border-pink-400/30 rounded-lg">
                      <Palette className="text-pink-300 flex-shrink-0" size={20} />
                      <div className="min-w-0">
                        <p className="text-[10px] sm:text-xs text-pink-300 font-bold uppercase truncate">Couleur</p>
                        <p className="text-xs sm:text-sm font-bold text-white capitalize truncate">{monture.couleur}</p>
                      </div>
                    </div>
                  )}

                  {monture.materiau && (
                    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 backdrop-blur-sm bg-amber-500/20 border border-amber-400/30 rounded-lg">
                      <Box className="text-amber-300 flex-shrink-0" size={20} />
                      <div className="min-w-0">
                        <p className="text-[10px] sm:text-xs text-amber-300 font-bold uppercase truncate">Matériau</p>
                        <p className="text-xs sm:text-sm font-bold text-white truncate">{getMateriauLabel(monture.materiau)}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                {monture.description && (
                  <div className="pt-4 sm:pt-6 border-t border-white/10">
                    <h3 className="text-base sm:text-lg font-black text-white mb-2 sm:mb-3 flex items-center gap-2">
                      <Eye size={18} className="flex-shrink-0 sm:w-5 sm:h-5" />
                      <span>Description</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-blue-100 leading-relaxed whitespace-pre-wrap">
                      {monture.description}
                    </p>
                  </div>
                )}

                {/* Seller Info */}
                {monture.owner && (
                  <div className="pt-4 sm:pt-6 border-t border-white/10">
                    <div className="flex items-center gap-3 p-3 sm:p-4 backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg sm:rounded-xl">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                        <User className="text-white" size={20} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] sm:text-xs text-blue-300 font-bold uppercase">Vendeur</p>
                        <p className="text-xs sm:text-sm font-bold text-white truncate">{monture.owner.email}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Add to Cart Section */}
                {!isOutOfStock && (
                  <div className="pt-4 sm:pt-6 border-t border-white/10 space-y-3 sm:space-y-4">
                    {/* Quantity Selector */}
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-white mb-2">
                        Quantité
                      </label>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg backdrop-blur-sm bg-white/10 hover:bg-white/20 border border-white/20 font-bold text-lg sm:text-xl text-white transition-all"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          value={quantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (val >= 1 && val <= monture.stock) {
                              setQuantity(val);
                            }
                          }}
                          min="1"
                          max={monture.stock}
                          className="w-16 sm:w-20 h-10 sm:h-12 text-center text-lg sm:text-xl font-bold backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          onClick={() => setQuantity(Math.min(monture.stock, quantity + 1))}
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg backdrop-blur-sm bg-white/10 hover:bg-white/20 border border-white/20 font-bold text-lg sm:text-xl text-white transition-all"
                        >
                          +
                        </button>
                        <span className="text-blue-200 text-xs sm:text-sm ml-1 sm:ml-2 hidden sm:block">
                          / {monture.stock} disponible{monture.stock > 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>

                    {/* Already in Cart Info */}
                    {inCart && (
                      <div className="flex items-center gap-2 backdrop-blur-md bg-green-500/20 border border-green-400/30 text-green-200 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl">
                        <Check size={18} className="flex-shrink-0 sm:w-5 sm:h-5" />
                        <span className="font-bold text-xs sm:text-sm">
                          {cartQuantity} article{cartQuantity > 1 ? 's' : ''} déjà dans le panier
                        </span>
                      </div>
                    )}

                    {/* Add to Cart Button */}
                    <button
                      onClick={handleAddToCart}
                      disabled={addedToCart}
                      className="relative w-full group/btn overflow-hidden"
                    >
                      <div className={`absolute inset-0 rounded-xl blur-lg transition duration-300 ${
                        addedToCart
                          ? 'bg-gradient-to-r from-green-600 to-emerald-600 opacity-75'
                          : 'bg-gradient-to-r from-blue-600 to-indigo-600 opacity-75 group-hover/btn:opacity-100'
                      }`} />
                      <div className={`relative py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 shadow-lg group-hover/btn:shadow-2xl ${
                        addedToCart
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                          : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                      }`}>
                        {addedToCart ? (
                          <>
                            <Check size={20} className="flex-shrink-0 sm:w-6 sm:h-6" />
                            <span>Ajouté au panier !</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart size={20} className="flex-shrink-0 sm:w-6 sm:h-6" />
                            <span>Ajouter au panier</span>
                          </>
                        )}
                      </div>
                    </button>

                    {/* Total Price */}
                    <div className="backdrop-blur-md bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-400/30 p-3 sm:p-4 rounded-xl">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-blue-200 font-bold text-sm sm:text-base">Total:</span>
                        <span className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
                          {(monture.price * quantity).toFixed(2)} MAD
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        <div className="mt-6 sm:mt-8 lg:mt-12">
          <SimilarProducts montureId={monture.id} />
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

export default ProductDetailPage;