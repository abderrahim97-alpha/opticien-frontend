// src/components/Marketplace/SortDropdown.tsx

import React from 'react';
import { ArrowUpDown, ChevronDown } from 'lucide-react';

interface SortDropdownProps {
  sortBy: string;
  sortOrder: string;
  onSortByChange: (value: string) => void;
  onSortOrderChange: (value: string) => void;
}

const SortDropdown: React.FC<SortDropdownProps> = ({
  sortBy,
  sortOrder,
  onSortByChange,
  onSortOrderChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
      {/* Label (hidden on mobile) */}
      <div className="hidden sm:flex items-center gap-2 text-white flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
          <ArrowUpDown size={16} />
        </div>
        <span className="font-bold text-sm">Trier par:</span>
      </div>

      {/* Sort By Dropdown */}
      <div className="relative group/sort flex-1 sm:flex-none">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg blur opacity-0 group-focus-within/sort:opacity-50 transition duration-300" />
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="w-full sm:w-auto appearance-none pl-3 sm:pl-4 pr-10 sm:pr-12 py-2 sm:py-2.5 backdrop-blur-xl bg-white/10 border border-white/20 rounded-lg focus:bg-white/15 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-white font-bold text-xs sm:text-sm cursor-pointer"
          >
            <option value="createdAt" className="bg-slate-800 text-white font-bold">Date d'ajout</option>
            <option value="price" className="bg-slate-800 text-white font-bold">Prix</option>
            <option value="name" className="bg-slate-800 text-white font-bold">Nom</option>
            <option value="brand" className="bg-slate-800 text-white font-bold">Marque</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3 pointer-events-none">
            <ChevronDown size={16} className="text-white" />
          </div>
        </div>
      </div>

      {/* Sort Order Dropdown */}
      <div className="relative group/order flex-1 sm:flex-none">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-0 group-focus-within/order:opacity-50 transition duration-300" />
        <div className="relative">
          <select
            value={sortOrder}
            onChange={(e) => onSortOrderChange(e.target.value)}
            className="w-full sm:w-auto appearance-none pl-3 sm:pl-4 pr-10 sm:pr-12 py-2 sm:py-2.5 backdrop-blur-xl bg-white/10 border border-white/20 rounded-lg focus:bg-white/15 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all text-white font-bold text-xs sm:text-sm cursor-pointer"
          >
            <option value="DESC" className="bg-slate-800 text-white font-bold">↓ Décroissant</option>
            <option value="ASC" className="bg-slate-800 text-white font-bold">↑ Croissant</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3 pointer-events-none">
            <ChevronDown size={16} className="text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SortDropdown;