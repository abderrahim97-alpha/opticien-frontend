import React, { useState, memo, useCallback } from 'react';
import { MarketplaceFilters, FilterOptions } from '../../types/marketplace';
import { X, ChevronDown, ChevronUp, Filter } from 'lucide-react';

interface FilterSidebarProps {
  filters: MarketplaceFilters;
  updateFilter: (key: keyof MarketplaceFilters, value: any) => void;
  resetFilters: () => void;
  filterOptions: FilterOptions | null;
  onClose?: () => void;
  isMobile?: boolean;
}

// Composant FilterSection memoïzé
const FilterSection = memo<{
  title: string;
  sectionKey: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}>(({ title, sectionKey, expanded, onToggle, children }) => (
  <div className="border-b border-white/10 pb-4 mb-4">
    <button
      onClick={onToggle}
      className="flex items-center justify-between w-full py-2 text-left font-bold text-white hover:text-blue-300 transition-colors"
    >
      <span>{title}</span>
      {expanded ? <ChevronUp size={20} className="text-blue-300" /> : <ChevronDown size={20} className="text-blue-300" />}
    </button>
    {expanded && <div className="mt-3 space-y-2">{children}</div>}
  </div>
));

FilterSection.displayName = 'FilterSection';

// Composant PriceRangeSlider
const PriceRangeSlider = memo<{
  minPrice: number | null;
  maxPrice: number | null;
  minLimit: number;
  maxLimit: number;
  onMinChange: (value: number | null) => void;
  onMaxChange: (value: number | null) => void;
}>(({ minPrice, maxPrice, minLimit, maxLimit, onMinChange, onMaxChange }) => {
  const [localMin, setLocalMin] = useState(minPrice ?? minLimit);
  const [localMax, setLocalMax] = useState(maxPrice ?? maxLimit);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setLocalMin(value);
    onMinChange(value === minLimit ? null : value);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setLocalMax(value);
    onMaxChange(value === maxLimit ? null : value);
  };

  // Calculer les pourcentages pour la barre de progression
  const minPercent = ((localMin - minLimit) / (maxLimit - minLimit)) * 100;
  const maxPercent = ((localMax - minLimit) / (maxLimit - minLimit)) * 100;

  return (
    <div className="space-y-4">
      {/* Affichage des valeurs */}
      <div className="flex items-center justify-between text-sm font-bold">
        <span className="px-3 py-1.5 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 backdrop-blur-sm border border-blue-400/30 text-blue-300 rounded-lg">
          {localMin.toFixed(0)} MAD
        </span>
        <span className="text-white/50">-</span>
        <span className="px-3 py-1.5 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 backdrop-blur-sm border border-blue-400/30 text-blue-300 rounded-lg">
          {localMax.toFixed(0)} MAD
        </span>
      </div>

      {/* Slider container */}
      <div className="relative pt-2 pb-4">
        {/* Track background */}
        <div className="absolute w-full h-2 bg-white/10 rounded-full top-1/2 -translate-y-1/2" />
        
        {/* Active range */}
        <div
          className="absolute h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full top-1/2 -translate-y-1/2 shadow-lg shadow-blue-500/50"
          style={{
            left: `${minPercent}%`,
            right: `${100 - maxPercent}%`,
          }}
        />

        {/* Min slider */}
        <input
          type="range"
          min={minLimit}
          max={maxLimit}
          value={localMin}
          onChange={handleMinChange}
          className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-blue-500 [&::-webkit-slider-thumb]:to-indigo-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-gradient-to-br [&::-moz-range-thumb]:from-blue-500 [&::-moz-range-thumb]:to-indigo-500 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-lg"
          style={{ zIndex: localMin > maxLimit - 100 ? 5 : 3 }}
        />

        {/* Max slider */}
        <input
          type="range"
          min={minLimit}
          max={maxLimit}
          value={localMax}
          onChange={handleMaxChange}
          className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-blue-500 [&::-webkit-slider-thumb]:to-indigo-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-gradient-to-br [&::-moz-range-thumb]:from-blue-500 [&::-moz-range-thumb]:to-indigo-500 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-lg"
          style={{ zIndex: 4 }}
        />
      </div>

      {/* Inputs numériques */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-white/70 mb-1.5">Min</label>
          <input
            type="number"
            value={localMin}
            onChange={(e) => {
              const value = Number(e.target.value);
              setLocalMin(value);
              onMinChange(value === minLimit ? null : value);
            }}
            className="w-full px-3 py-2 text-sm font-semibold bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-white/70 mb-1.5">Max</label>
          <input
            type="number"
            value={localMax}
            onChange={(e) => {
              const value = Number(e.target.value);
              setLocalMax(value);
              onMaxChange(value === maxLimit ? null : value);
            }}
            className="w-full px-3 py-2 text-sm font-semibold bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all"
          />
        </div>
      </div>
    </div>
  );
});

PriceRangeSlider.displayName = 'PriceRangeSlider';

const FilterSidebar: React.FC<FilterSidebarProps> = memo(({
  filters,
  updateFilter,
  resetFilters,
  filterOptions,
  onClose,
  isMobile = false,
}) => {
  const [expandedSections, setExpandedSections] = useState({
    type: true,
    genre: true,
    brand: false,
    forme: false,
    materiau: false,
    couleur: false,
    price: true,
  });

  const toggleSection = useCallback((section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  }, []);

  const hasActiveFilters = Object.entries(filters).some(
    ([key, value]) => {
      if (key === 'sortBy' || key === 'sortOrder') return false;
      return value !== '' && value !== null;
    }
  );

  // Prix limites
  const minPriceLimit = 0;
  const maxPriceLimit = 10000;

  return (
    <div
      className={`backdrop-blur-xl bg-white/10 border border-white/20 ${
        isMobile ? 'fixed inset-0 z-50 overflow-y-auto' : 'rounded-2xl shadow-2xl'
      } p-6`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
            <Filter className="text-white" size={20} />
          </div>
          <h2 className="text-2xl font-black text-white">Filtres</h2>
        </div>
        {isMobile && onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={24} className="text-white" />
          </button>
        )}
      </div>

      {/* Reset Button */}
      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="w-full mb-4 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 flex items-center justify-center gap-2"
        >
          <X size={18} />
          Réinitialiser les filtres
        </button>
      )}

      {/* Type Filter */}
      {filterOptions?.types && (
        <FilterSection
          title="Type de lunettes"
          sectionKey="type"
          expanded={expandedSections.type}
          onToggle={() => toggleSection('type')}
        >
          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-3 rounded-xl transition-all group">
              <input
                type="radio"
                name="type"
                value=""
                checked={filters.type === ''}
                onChange={(e) => updateFilter('type', e.target.value)}
                className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500 bg-white/10 border-white/30"
              />
              <span className="text-white/90 group-hover:text-white font-semibold">Tous</span>
            </label>
            {filterOptions.types.map((type) => (
              <label
                key={type.value}
                className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-3 rounded-xl transition-all group"
              >
                <input
                  type="radio"
                  name="type"
                  value={type.value}
                  checked={filters.type === type.value}
                  onChange={(e) => updateFilter('type', e.target.value)}
                  className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500 bg-white/10 border-white/30"
                />
                <span className="text-white/90 group-hover:text-white font-semibold">{type.label}</span>
              </label>
            ))}
          </div>
        </FilterSection>
      )}

      {/* Genre Filter */}
      {filterOptions?.genres && (
        <FilterSection
          title="Genre"
          sectionKey="genre"
          expanded={expandedSections.genre}
          onToggle={() => toggleSection('genre')}
        >
          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-3 rounded-xl transition-all group">
              <input
                type="radio"
                name="genre"
                value=""
                checked={filters.genre === ''}
                onChange={(e) => updateFilter('genre', e.target.value)}
                className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500 bg-white/10 border-white/30"
              />
              <span className="text-white/90 group-hover:text-white font-semibold">Tous</span>
            </label>
            {filterOptions.genres.map((genre) => (
              <label
                key={genre.value}
                className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-3 rounded-xl transition-all group"
              >
                <input
                  type="radio"
                  name="genre"
                  value={genre.value}
                  checked={filters.genre === genre.value}
                  onChange={(e) => updateFilter('genre', e.target.value)}
                  className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500 bg-white/10 border-white/30"
                />
                <span className="text-white/90 group-hover:text-white font-semibold">{genre.label}</span>
              </label>
            ))}
          </div>
        </FilterSection>
      )}

      {/* Brand Filter */}
      {filterOptions?.brands && filterOptions.brands.length > 0 && (
        <FilterSection
          title="Marque"
          sectionKey="brand"
          expanded={expandedSections.brand}
          onToggle={() => toggleSection('brand')}
        >
          <select
            value={filters.brand}
            onChange={(e) => updateFilter('brand', e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white font-semibold focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all"
          >
            <option value="" className="bg-slate-900">Toutes les marques</option>
            {filterOptions.brands.map((brand) => (
              <option key={brand} value={brand} className="bg-slate-900">
                {brand}
              </option>
            ))}
          </select>
        </FilterSection>
      )}

      {/* Forme Filter */}
      {filterOptions?.formes && (
        <FilterSection
          title="Forme"
          sectionKey="forme"
          expanded={expandedSections.forme}
          onToggle={() => toggleSection('forme')}
        >
          <select
            value={filters.forme}
            onChange={(e) => updateFilter('forme', e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white font-semibold focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all"
          >
            <option value="" className="bg-slate-900">Toutes les formes</option>
            {filterOptions.formes.map((forme) => (
              <option key={forme.value} value={forme.value} className="bg-slate-900">
                {forme.label}
              </option>
            ))}
          </select>
        </FilterSection>
      )}

      {/* Materiau Filter */}
      {filterOptions?.materiaux && (
        <FilterSection
          title="Matériau"
          sectionKey="materiau"
          expanded={expandedSections.materiau}
          onToggle={() => toggleSection('materiau')}
        >
          <select
            value={filters.materiau}
            onChange={(e) => updateFilter('materiau', e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white font-semibold focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all"
          >
            <option value="" className="bg-slate-900">Tous les matériaux</option>
            {filterOptions.materiaux.map((mat) => (
              <option key={mat.value} value={mat.value} title={mat.description} className="bg-slate-900">
                {mat.label}
              </option>
            ))}
          </select>
        </FilterSection>
      )}

      {/* Couleur Filter */}
      {filterOptions?.couleurs && filterOptions.couleurs.length > 0 && (
        <FilterSection
          title="Couleur"
          sectionKey="couleur"
          expanded={expandedSections.couleur}
          onToggle={() => toggleSection('couleur')}
        >
          <select
            value={filters.couleur}
            onChange={(e) => updateFilter('couleur', e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white font-semibold focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all"
          >
            <option value="" className="bg-slate-900">Toutes les couleurs</option>
            {filterOptions.couleurs.map((couleur) => (
              <option key={couleur} value={couleur} className="capitalize bg-slate-900">
                {couleur}
              </option>
            ))}
          </select>
        </FilterSection>
      )}

      {/* Price Range Filter avec Slider */}
      <FilterSection
        title="Fourchette de prix"
        sectionKey="price"
        expanded={expandedSections.price}
        onToggle={() => toggleSection('price')}
      >
        <PriceRangeSlider
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          minLimit={minPriceLimit}
          maxLimit={maxPriceLimit}
          onMinChange={(value) => updateFilter('minPrice', value)}
          onMaxChange={(value) => updateFilter('maxPrice', value)}
        />
      </FilterSection>

      {/* Apply Button (Mobile) */}
      {isMobile && onClose && (
        <button
          onClick={onClose}
          className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 shadow-2xl"
        >
          Appliquer les filtres
        </button>
      )}
    </div>
  );
});

FilterSidebar.displayName = 'FilterSidebar';

export default FilterSidebar;