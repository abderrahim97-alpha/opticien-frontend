import React, { useEffect, useState } from 'react';
import api from '../../Api/axios';
import { Monture } from '../../types/marketplace';
import ProductCard from './ProductCard';
import { TrendingUp, Sparkles } from 'lucide-react';

interface SimilarProductsProps {
  montureId: number;
}

const SimilarProducts: React.FC<SimilarProductsProps> = ({ montureId }) => {
  const [similarProducts, setSimilarProducts] = useState<Monture[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimilar = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get(`/marketplace/montures/${montureId}/similar`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSimilarProducts(response.data);
      } catch (error) {
        console.error('Error fetching similar products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilar();
  }, [montureId]);

  if (loading) {
    return (
      <div className="relative mt-8 sm:mt-10 lg:mt-12">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl p-8 sm:p-12 text-center">
          <div className="relative inline-flex mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full blur-xl opacity-60 animate-pulse" />
            <div className="relative">
              <svg className="animate-spin h-10 w-10 sm:h-12 sm:w-12 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          </div>
          <p className="text-white font-bold text-sm sm:text-base">Chargement des produits similaires...</p>
        </div>
      </div>
    );
  }

  if (similarProducts.length === 0) {
    return null;
  }

  return (
    <div className="relative mt-8 sm:mt-10 lg:mt-12">
      {/* Header Section */}
      <div className="relative group mb-4 sm:mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl sm:rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition duration-300" />
        <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Icon Badge */}
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur-lg opacity-60 animate-pulse" />
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-2xl">
                <TrendingUp className="text-white" size={24} />
              </div>
            </div>

            {/* Title */}
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white flex items-center gap-2">
                <span>Produits similaires</span>
                <Sparkles className="text-yellow-300 animate-pulse flex-shrink-0" size={20} />
              </h2>
              <p className="text-blue-200 text-xs sm:text-sm font-semibold mt-1">
                Découvrez d'autres montures qui pourraient vous intéresser
              </p>
            </div>

            {/* Count Badge */}
            <div className="hidden sm:flex flex-shrink-0">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full blur-lg opacity-60" />
                <div className="relative backdrop-blur-md bg-white/20 border border-white/30 rounded-full px-4 py-2">
                  <span className="text-white font-black text-lg">{similarProducts.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 xl:gap-6">
        {similarProducts.map((monture) => (
          <ProductCard key={monture.id} monture={monture} />
        ))}
      </div>
    </div>
  );
};

export default SimilarProducts;