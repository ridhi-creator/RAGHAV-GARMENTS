import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Product } from '../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistProducts: Product[];
  onRemoveFromWishlist: (productId: string) => void;
  onMoveToCart: (product: Product, size: string, color: string) => void;
  onOpenProductDetails: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistProducts,
  onRemoveFromWishlist,
  onMoveToCart,
  onOpenProductDetails
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-600 fill-current" />
              <h2 className="text-base font-bold text-slate-900 font-heading">
                Saved Wishlist ({wishlistProducts.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {wishlistProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                <Heart className="w-14 h-14 text-slate-300 mb-3" />
                <h3 className="text-base font-bold text-slate-900 font-heading">Your Wishlist is Empty</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Tap the heart icon on any product to save it here for later.
                </p>
                <button
                  onClick={onClose}
                  className="mt-5 bg-[#1455D9] hover:bg-[#0F42A8] text-white text-xs font-bold px-6 py-3 rounded-xl transition-colors"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              wishlistProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex gap-3 pb-4 border-b border-slate-100 last:border-0"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-20 h-24 object-cover rounded-xl bg-slate-100 border border-slate-200 flex-shrink-0 cursor-pointer"
                    onClick={() => {
                      onOpenProductDetails(product);
                      onClose();
                    }}
                    referrerPolicy="no-referrer"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 
                          onClick={() => {
                            onOpenProductDetails(product);
                            onClose();
                          }}
                          className="text-xs sm:text-sm font-bold text-slate-900 hover:text-[#1455D9] transition-colors line-clamp-1 font-heading cursor-pointer"
                        >
                          {product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveFromWishlist(product.id)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                          title="Remove from wishlist"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-sm font-bold text-[#080B12] tabular-nums">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-slate-400 line-through tabular-nums">
                          ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-rose-600 font-bold">
                          {product.discount}% OFF
                        </span>
                      </div>
                    </div>

                    {/* Move to Cart button */}
                    <div className="pt-2">
                      <button
                        onClick={() => {
                          onMoveToCart(product, product.sizes[0] || 'M', product.colors[0]?.name || 'Standard');
                          onRemoveFromWishlist(product.id);
                        }}
                        className="w-full bg-[#1455D9] hover:bg-[#0F42A8] text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" /> Move to Cart
                      </button>
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {wishlistProducts.length > 0 && (
            <div className="p-4 border-t border-slate-200 bg-slate-50 text-center">
              <button
                onClick={onClose}
                className="text-xs font-bold text-[#1455D9] hover:underline"
              >
                ← Back to Shopping
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
