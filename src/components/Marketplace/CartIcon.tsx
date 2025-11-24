import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const CartIcon: React.FC = () => {
  const navigate = useNavigate();
  const { cart } = useCart();

  return (
    <button
      onClick={() => navigate('/cart')}
      className="relative group"
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur-lg opacity-0 group-hover:opacity-75 transition duration-300" />
      
      {/* Button Container */}
      <div className="relative backdrop-blur-xl bg-white/10 hover:bg-white/15 border border-white/20 rounded-full p-3 transition-all duration-300 group-hover:scale-110 shadow-lg group-hover:shadow-2xl">
        <ShoppingCart className="text-white group-hover:text-blue-300 transition-colors" size={24} />
        
        {/* Badge */}
        {cart.totalItems > 0 && (
          <span className="absolute -top-2 -right-2 flex items-center justify-center">
            {/* Badge Glow */}
            <span className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-full blur-md opacity-75 animate-pulse" />
            {/* Badge Content */}
            <span className="relative bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-black rounded-full w-6 h-6 flex items-center justify-center shadow-xl border-2 border-white/30">
              {cart.totalItems > 99 ? '99+' : cart.totalItems}
            </span>
          </span>
        )}
      </div>
    </button>
  );
};

export default CartIcon;