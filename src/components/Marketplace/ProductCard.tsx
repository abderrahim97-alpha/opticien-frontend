// src/components/Marketplace/ProductCard.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Monture } from '../../types/marketplace';
import { useCart } from '../../context/CartContext';
import { ShoppingCart, Eye, Package, AlertCircle, Sparkles } from 'lucide-react';

interface ProductCardProps {
  monture: Monture;
}

const ProductCard: React.FC<ProductCardProps> = ({ monture }) => {
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();

  const getImageUrl = (imageName: string | undefined) => {
    if (!imageName) return '/placeholder-glasses.png';
    return `http://localhost:8000/uploads/images/${imageName}`;
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (monture.stock > 0) {
      addToCart(monture, 1);
    }
  };

  const handleViewDetails = () => {
    navigate(`/marketplace/monture/${monture.id}`);
  };

  const getTypeIcon = () => {
    if (monture.type === 'vue') return '👓';
    if (monture.type === 'soleil') return '🕶️';
    return '👓';
  };

  const getGenreLabel = () => {
    const labels = {
      homme: { icon: '👨', label: 'Homme' },
      femme: { icon: '👩', label: 'Femme' },
      enfant: { icon: '👶', label: 'Enfant' },
      unisexe: { icon: '⚡', label: 'Unisexe' },
    };
    return monture.genre ? labels[monture.genre] : null;
  };

  const isLowStock = monture.stock > 0 && monture.stock <= 5;
  const isOutOfStock = monture.stock === 0;

  return (
    <div className="relative group h-full">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl sm:rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition duration-300" />
      
      {/* Card Container */}
      <div
        onClick={handleViewDetails}
        className="relative h-full backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer hover:bg-white/15 transition-all duration-300 shadow-2xl flex flex-col"
      >
        {/* Image Container */}
        <div className="relative h-48 sm:h-56 md:h-64 bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden flex-shrink-0">
          <img
            src={getImageUrl(monture.images[0]?.imageName)}
            alt={monture.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.currentTarget.src = '/placeholder-glasses.png';
            }}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Stock Badge */}
          {isOutOfStock && (
            <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
              <AlertCircle size={12} className="flex-shrink-0" />
              <span className="hidden sm:inline">Rupture</span>
            </div>
          )}
          {isLowStock && !isOutOfStock && (
            <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 animate-pulse">
              <Sparkles size={12} className="flex-shrink-0" />
              <span className="hidden sm:inline">Stock faible</span>
            </div>
          )}

          {/* Type Badge */}
          {monture.type && (
            <div className="absolute top-2 sm:top-3 left-2 sm:left-3 backdrop-blur-md bg-white/20 border border-white/30 px-2 sm:px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg">
              <span className="text-sm">{getTypeIcon()}</span> <span className="hidden sm:inline">{monture.type === 'vue' ? 'Vue' : 'Soleil'}</span>
            </div>
          )}

          {/* Quick Actions Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/80 via-indigo-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleViewDetails();
              }}
              className="relative group/btn overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-75 group-hover/btn:opacity-100 transition duration-300" />
              <div className="relative bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-2 sm:p-3 rounded-lg sm:rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110">
                <Eye size={18} className="sm:w-5 sm:h-5" />
              </div>
            </button>
            {!isOutOfStock && (
              <button
                onClick={handleAddToCart}
                className="relative group/btn overflow-hidden"
              >
                <div className={`absolute inset-0 rounded-xl blur opacity-75 group-hover/btn:opacity-100 transition duration-300 ${
                  isInCart(monture.id)
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600'
                }`} />
                <div className={`relative p-2 sm:p-3 rounded-lg sm:rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110 ${
                  isInCart(monture.id)
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                    : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                }`}>
                  <ShoppingCart size={18} className="sm:w-5 sm:h-5" />
                </div>
              </button>
            )}
          </div>

          {/* Image Count Badge */}
          {monture.images && monture.images.length > 1 && (
            <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 backdrop-blur-md bg-black/40 border border-white/20 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg flex items-center gap-1">
              <Package size={10} className="flex-shrink-0" />
              <span>+{monture.images.length - 1}</span>
            </div>
          )}
        </div>

        {/* Card Content */}
        <div className="p-3 sm:p-4 md:p-5 flex-1 flex flex-col">
          {/* Brand */}
          {monture.brand && (
            <p className="text-[10px] sm:text-xs font-bold text-blue-300 uppercase tracking-wider mb-1 sm:mb-2 truncate">
              {monture.brand}
            </p>
          )}

          {/* Name */}
          <h3 className="text-sm sm:text-base md:text-lg font-black text-white mb-2 sm:mb-3 line-clamp-2 group-hover:text-blue-300 transition-colors leading-tight">
            {monture.name}
          </h3>

          {/* Attributes */}
          <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
            {monture.genre && getGenreLabel() && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:py-1 rounded-md backdrop-blur-sm bg-purple-500/20 text-purple-200 border border-purple-400/30 text-[10px] sm:text-xs font-bold">
                <span className="text-xs">{getGenreLabel()?.icon}</span>
                <span className="hidden sm:inline">{getGenreLabel()?.label}</span>
              </span>
            )}
            {monture.forme && (
              <span className="inline-flex items-center px-2 py-0.5 sm:py-1 rounded-md backdrop-blur-sm bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 text-[10px] sm:text-xs font-bold capitalize truncate max-w-[80px] sm:max-w-none">
                {monture.forme}
              </span>
            )}
            {monture.couleur && (
              <span className="inline-flex items-center px-2 py-0.5 sm:py-1 rounded-md backdrop-blur-sm bg-pink-500/20 text-pink-200 border border-pink-400/30 text-[10px] sm:text-xs font-bold capitalize truncate max-w-[80px] sm:max-w-none">
                {monture.couleur}
              </span>
            )}
          </div>

          {/* Price and Action - Pushed to bottom */}
          <div className="mt-auto pt-3 sm:pt-4 border-t border-white/10">
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-xl sm:text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  {monture.price.toFixed(2)}
                </p>
                <p className="text-[10px] sm:text-xs text-blue-200 font-semibold">MAD</p>
                {!isOutOfStock && (
                  <p className="text-[10px] sm:text-xs text-white/60 mt-0.5 sm:mt-1 flex items-center gap-1">
                    <Package size={10} className="flex-shrink-0" />
                    <span>{monture.stock} en stock</span>
                  </p>
                )}
              </div>
              {!isOutOfStock && (
                <button
                  onClick={handleAddToCart}
                  className="relative group/btn overflow-hidden flex-shrink-0"
                >
                  <div className={`absolute inset-0 rounded-lg sm:rounded-xl blur opacity-75 group-hover/btn:opacity-100 transition duration-300 ${
                    isInCart(monture.id)
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600'
                  }`} />
                  <div className={`relative px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center gap-1 sm:gap-2 ${
                    isInCart(monture.id)
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                      : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                  }`}>
                    <ShoppingCart size={14} className="flex-shrink-0 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline whitespace-nowrap">{isInCart(monture.id) ? 'Ajouté' : 'Panier'}</span>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;