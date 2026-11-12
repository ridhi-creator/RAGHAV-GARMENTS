import React, { useState, useMemo } from 'react';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { Product } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onOpenProductDetails: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onOpenProductDetails
}) => {
  const [query, setQuery] = useState('');

  const trendingTags = [
    'Bomber Jacket',
    'Tracksuit',
    'Cotton Pajama',
    'Flex Chinos',
    'Windbreaker',
    'Lounge Trouser'
  ];

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return products.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.fabric.toLowerCase().includes(q)
    );
  }, [products, query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-start justify-center p-4 sm:p-6 pt-16 sm:pt-24 animate-fadeIn">
      <div 
        className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#1455D9] flex-shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search pajamas, pants, jackets, tracksuits, fabrics..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-bold text-slate-500 hover:text-slate-900 px-2 py-1 rounded-lg"
          >
            Esc
          </button>
        </div>

        {/* Quick Trending Tags */}
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-400 font-semibold flex items-center gap-1 shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-[#1455D9]" /> Popular:
          </span>
          {trendingTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="px-2.5 py-1 bg-white hover:bg-blue-50 hover:text-[#1455D9] text-slate-700 font-medium rounded-full border border-slate-200 shrink-0 transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {query.trim() === '' ? (
            <div className="py-8 text-center text-xs text-slate-400">
              Type keywords to instantly discover Raghav Garments styles.
            </div>
          ) : searchResults.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs">
              No products found matching "<strong className="text-slate-800">{query}</strong>". Try searching for "cotton", "jacket", or "pants".
            </div>
          ) : (
            searchResults.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  onOpenProductDetails(product);
                  onClose();
                }}
                className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors cursor-pointer group"
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-14 h-16 object-cover rounded-xl bg-slate-100 border border-slate-200"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#1455D9]">
                    {product.category}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#1455D9] transition-colors">
                    {product.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{product.fabric}</p>
                </div>
                <div className="text-right">
                  <div className="text-xs sm:text-sm font-extrabold text-slate-900 tabular-nums">
                    ₹{product.price.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-rose-600 font-bold">{product.discount}% OFF</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#1455D9] group-hover:translate-x-1 transition-all" />
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
