import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check, Globe } from 'lucide-react';
import { WORLD_COUNTRIES } from '../data/countries';

export default function CountrySelect({ value = 'Nigeria', onChange, name = 'country', required = true }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const filteredCountries = WORLD_COUNTRIES.filter((c) =>
    c.toLowerCase().includes(search.toLowerCase().trim())
  );

  const handleSelect = (country) => {
    if (onChange) {
      onChange({ target: { name, value: country } });
    }
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div className="relative font-sans" ref={containerRef}>
      {/* Hidden input for standard HTML form submission and validation */}
      <input type="hidden" name={name} value={value} required={required} />

      {/* Dropdown Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3.5 py-2.5 rounded-xl border text-left flex items-center justify-between text-sm bg-white transition-all ${
          isOpen
            ? 'border-emerald-800 ring-1 ring-emerald-800 shadow-sm'
            : 'border-stone-300 hover:border-stone-400'
        }`}
      >
        <div className="flex items-center space-x-2 truncate">
          <Globe className="w-4 h-4 text-emerald-800 shrink-0" />
          <span className="font-medium text-stone-900 truncate">
            {value || 'Select Country *'}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-stone-500 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-emerald-800' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-stone-200 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in">
          
          {/* Live Search Input Box */}
          <div className="p-2.5 border-b border-stone-100 bg-stone-50/80 sticky top-0 z-10">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Type country name..."
                className="w-full pl-8 pr-3 py-2 rounded-lg bg-white border border-stone-200 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-emerald-800 focus:ring-1 focus:ring-emerald-800"
              />
            </div>
          </div>

          {/* Scrollable Country List */}
          <div className="max-h-60 overflow-y-auto divide-y divide-stone-50 text-xs">
            {filteredCountries.length === 0 ? (
              <div className="p-4 text-center text-stone-400">
                No matching country found for "{search}"
              </div>
            ) : (
              filteredCountries.map((country) => {
                const isSelected = value === country;
                return (
                  <button
                    key={country}
                    type="button"
                    onClick={() => handleSelect(country)}
                    className={`w-full px-3.5 py-2.5 text-left flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-emerald-50 text-emerald-950 font-bold'
                        : 'text-stone-700 hover:bg-stone-50 hover:text-stone-900'
                    }`}
                  >
                    <span>{country}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-800 shrink-0" />}
                  </button>
                );
              })
            )}
          </div>

          {/* Quick Info Footer */}
          <div className="p-2 bg-stone-100/70 border-t border-stone-100 text-[10px] text-stone-500 text-center font-mono">
            {filteredCountries.length} countries available • Click to select
          </div>

        </div>
      )}
    </div>
  );
}
