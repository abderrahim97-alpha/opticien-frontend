import React, { useState, memo } from 'react';
import { useMarketplace } from '../../hooks/useMarketplace';
import ProductCard from '../../components/Marketplace/ProductCard';
import FilterSidebar from '../../components/Marketplace/FilterSidebar';
import SearchBar from '../../components/Marketplace/SearchBar';
import SortDropdown from '../../components/Marketplace/SortDropdown';
import PaginationControls from '../../components/Marketplace/PaginationControls';
import CartIcon from '../../components/Marketplace/CartIcon';
import { Filter, TrendingUp, Package, DollarSign } from 'lucide-react';
import logoImage from '../../assets/opt-Logo.png';

const MarketplacePage: React.FC = () => {
  const {
    montures,
    loading,
    error,
    filters,
    updateFilter,
    resetFilters,
    pagination,
    goToPage,
    filterOptions,
    stats,
  } = useMarketplace();

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Initial loading state
  if (loading && montures.length === 0 && !filterOptions) {
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
          <p className="text-base sm:text-lg font-bold text-white px-4">Chargement de la marketplace...</p>
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

  if (error) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-950 via-blue-950 to-slate-900 py-6 sm:py-8 px-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        </div>

        <div className="relative max-w-4xl mx-auto z-10">
          <div className="backdrop-blur-xl bg-white/10 border-2 border-red-400/50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-white">Erreur de chargement</h3>
                <p className="text-red-200 mt-2 text-sm sm:text-base break-words">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm sm:text-base font-bold rounded-lg sm:rounded-xl hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
                >
                  Réessayer
                </button>
              </div>
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

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-950 via-blue-950 to-slate-900 py-3 sm:py-4 md:py-6 lg:py-8 px-3 sm:px-4 md:px-5 lg:px-6">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="relative w-full max-w-[2000px] mx-auto z-10">
        {/* Header with Logo */}
        <div className="mb-3 sm:mb-4 md:mb-5 lg:mb-6">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-2">
            {/* Logo */}
            <div className="relative group flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg sm:rounded-xl blur-md sm:blur-lg opacity-60 group-hover:opacity-80 transition duration-500 animate-pulse" />
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-white/10 backdrop-blur-md border-2 sm:border-3 md:border-4 border-white/30 rounded-lg sm:rounded-xl flex items-center justify-center shadow-2xl">
                <img 
                  src={logoImage} 
                  alt="Optique Marketplace Logo" 
                  className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 object-contain drop-shadow-2xl"
                />
              </div>
            </div>
            
            {/* Nom */}
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white truncate">
                Opti<span className="text-blue-300">MAROC</span>
              </h1>
              <p className="text-blue-200/70 text-xs sm:text-sm font-semibold">
                Marketplace
              </p>
            </div>
          </div>
          
          <p className="text-blue-200 text-xs sm:text-sm md:text-base lg:text-lg mt-1 sm:mt-2">
            Découvrez notre sélection exclusive de montures de qualité professionnelle
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6 mb-3 sm:mb-4 md:mb-5 lg:mb-6">
            {/* Total Products */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg sm:rounded-xl md:rounded-2xl blur-md sm:blur-lg opacity-50 group-hover:opacity-75 transition duration-300" />
              <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-blue-200 text-[10px] sm:text-xs md:text-sm font-semibold uppercase tracking-wide truncate">Produits</p>
                    <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white mt-0.5 sm:mt-1 md:mt-2">{stats.totalMontures}</p>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <Package className="text-white" size={16} />
                  </div>
                </div>
              </div>
            </div>

            {/* Total Stock */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg sm:rounded-xl md:rounded-2xl blur-md sm:blur-lg opacity-50 group-hover:opacity-75 transition duration-300" />
              <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-green-200 text-[10px] sm:text-xs md:text-sm font-semibold uppercase tracking-wide truncate">Stock Total</p>
                    <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white mt-0.5 sm:mt-1 md:mt-2">{stats.totalStock}</p>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <TrendingUp className="text-white" size={16} />
                  </div>
                </div>
              </div>
            </div>

            {/* Average Price */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg sm:rounded-xl md:rounded-2xl blur-md sm:blur-lg opacity-50 group-hover:opacity-75 transition duration-300" />
              <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-yellow-200 text-[10px] sm:text-xs md:text-sm font-semibold uppercase tracking-wide truncate">Prix Moyen</p>
                    <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-white mt-0.5 sm:mt-1 md:mt-2">{stats.averagePrice.toFixed(0)} MAD</p>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <DollarSign className="text-white" size={16} />
                  </div>
                </div>
              </div>
            </div>

            {/* Price Range */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg sm:rounded-xl md:rounded-2xl blur-md sm:blur-lg opacity-50 group-hover:opacity-75 transition duration-300" />
              <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-purple-200 text-[10px] sm:text-xs md:text-sm font-semibold uppercase tracking-wide truncate">Fourchette</p>
                    <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-black text-white mt-0.5 sm:mt-1 md:mt-2 truncate">{stats.minPrice}-{stats.maxPrice} MAD</p>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <DollarSign className="text-white" size={16} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Sort Bar */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6 mb-3 sm:mb-4 md:mb-5 lg:mb-6 shadow-2xl">
          <div className="flex flex-col lg:flex-row gap-2 sm:gap-3 md:gap-4 items-stretch lg:items-center">
            <div className="w-full lg:flex-1 lg:max-w-2xl">
              <SearchBar
                value={filters.search}
                onChange={(value) => updateFilter('search', value)}
                placeholder="Rechercher par nom, marque, description..."
              />
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden relative group/btn overflow-hidden flex-1"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg sm:rounded-xl blur opacity-75 group-hover/btn:opacity-100 transition duration-300" />
                <div className="relative bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 sm:py-2.5 md:py-3 px-4 sm:px-5 md:px-6 rounded-lg sm:rounded-xl font-bold shadow-lg group-hover/btn:shadow-2xl transition duration-300 flex items-center justify-center gap-2 text-xs sm:text-sm md:text-base">
                  <Filter size={16} className="flex-shrink-0" />
                  <span>Filtres</span>
                </div>
              </button>
              <div className="flex-1 lg:flex-none lg:min-w-[200px]">
                <SortDropdown
                  sortBy={filters.sortBy}
                  sortOrder={filters.sortOrder}
                  onSortByChange={(value) => updateFilter('sortBy', value)}
                  onSortOrderChange={(value) => updateFilter('sortOrder', value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-64 xl:w-72 2xl:w-80 flex-shrink-0">
            <div className="sticky top-6">
              <FilterSidebar
                filters={filters}
                updateFilter={updateFilter}
                resetFilters={resetFilters}
                filterOptions={filterOptions}
              />
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1 min-w-0">
            {/* Results Count with Loading Indicator */}
            <div className="mb-3 sm:mb-4 md:mb-5 lg:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 backdrop-blur-xl bg-white/10 border border-white/20 rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4">
              <p className="text-white font-bold text-xs sm:text-sm md:text-base lg:text-lg">
                <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-blue-300">{pagination.total}</span> monture
                {pagination.total > 1 ? 's' : ''} trouvée{pagination.total > 1 ? 's' : ''}
              </p>
              
              {/* Inline Loading Indicator */}
              {loading && (
                <div className="flex items-center gap-2 text-blue-300">
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-blue-300"></div>
                  <span className="text-xs sm:text-sm font-bold">Mise à jour...</span>
                </div>
              )}
            </div>

            {/* Products Grid Container with Loading Overlay */}
            <div className="relative min-h-[300px] sm:min-h-[400px]">
              {/* Loading Overlay */}
              {loading && montures.length > 0 && (
                <div className="absolute inset-0 backdrop-blur-sm bg-indigo-950/60 z-10 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center pointer-events-none">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full blur-xl opacity-60 animate-pulse" />
                    <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-6">
                      <svg className="animate-spin h-10 w-10 sm:h-12 sm:w-12 text-white mx-auto mb-2 sm:mb-3" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <p className="text-white font-bold text-xs sm:text-sm whitespace-nowrap">Chargement...</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Products Grid */}
              {montures.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 mb-4 sm:mb-6 md:mb-8">
                    {montures.map((monture) => (
                      <ProductCard key={monture.id} monture={monture} />
                    ))}
                  </div>

                  {/* Pagination */}
                  <div className="mt-4 sm:mt-6 md:mt-8">
                    <PaginationControls
                      currentPage={pagination.page}
                      totalPages={pagination.totalPages}
                      onPageChange={goToPage}
                    />
                  </div>
                </>
              ) : (
                <div className="backdrop-blur-xl bg-white/10 border-2 border-dashed border-white/30 rounded-lg sm:rounded-xl md:rounded-2xl p-6 sm:p-8 md:p-10 lg:p-12 text-center">
                  <div className="relative inline-flex mb-4 sm:mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full blur-lg sm:blur-xl opacity-40" />
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center shadow-2xl">
                      <Package className="text-white" size={28} />
                    </div>
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-white mb-2 sm:mb-3 px-2">
                    Aucun produit trouvé
                  </h3>
                  <p className="text-blue-200 text-xs sm:text-sm md:text-base lg:text-lg mb-4 sm:mb-6 px-2">
                    Essayez de modifier vos critères de recherche ou filtres
                  </p>
                  <button
                    onClick={resetFilters}
                    className="relative inline-block group/btn overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg sm:rounded-xl blur opacity-75 group-hover/btn:opacity-100 transition duration-300" />
                    <div className="relative bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 sm:py-2.5 md:py-3 lg:py-4 px-4 sm:px-5 md:px-6 lg:px-8 rounded-lg sm:rounded-xl font-bold shadow-lg group-hover/btn:shadow-2xl transition duration-300 flex items-center gap-2 text-xs sm:text-sm md:text-base">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span className="whitespace-nowrap">Réinitialiser les filtres</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Floating Cart Icon */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-40">
        <CartIcon />
      </div>

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div className="lg:hidden">
          <FilterSidebar
            filters={filters}
            updateFilter={updateFilter}
            resetFilters={resetFilters}
            filterOptions={filterOptions}
            onClose={() => setShowMobileFilters(false)}
            isMobile={true}
          />
        </div>
      )}

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

export default MarketplacePage;