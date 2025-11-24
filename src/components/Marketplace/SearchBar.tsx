import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Rechercher des montures...',
}) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, 500);

    return () => clearTimeout(timer);
  }, [localValue, onChange]);

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <div className="relative group">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg sm:rounded-xl blur-lg opacity-0 group-focus-within:opacity-50 transition duration-300" />
      
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
            <Search className="text-white" size={16} />
          </div>
        </div>

        {/* Input */}
        <input
          type="text"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-14 sm:pl-16 pr-12 sm:pr-14 py-2.5 sm:py-3 backdrop-blur-xl bg-white/10 border border-white/20 rounded-lg sm:rounded-xl focus:bg-white/15 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-white placeholder-white/50 font-medium text-sm sm:text-base"
        />

        {/* Clear Button */}
        {localValue && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center group/clear"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg blur opacity-0 group-hover/clear:opacity-75 transition duration-300" />
              <div className="relative w-8 h-8 backdrop-blur-sm bg-white/10 hover:bg-red-500/20 border border-white/20 hover:border-red-400/30 rounded-lg flex items-center justify-center transition-all duration-300">
                <X size={16} className="text-white" />
              </div>
            </div>
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;