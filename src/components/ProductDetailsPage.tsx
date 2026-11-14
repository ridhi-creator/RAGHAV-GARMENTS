import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  Check,
  Ruler,
  MapPin,
  Share2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  PackageCheck,
  RotateCcw
} from 'lucide-react';
import { Product, ActiveTab, PageView } from '../types';
import { ProductCard } from './ProductCard';

interface ProductDetailsPageProps {
  product: Product | null;
  allProducts: Product[];
  preselectedColor?: string;
  onBackToCategory: (tab: ActiveTab) => void;
  onOpenProduct: (product: Product, preselectedColor?: string) => void;
  onQuickView?: (product: Product, preselectedColor?: string) => void;
  onAddToCart: (product: Product, size: string, color: string, quantity?: number) => void;
  onBuyNow: (product: Product, size: string, color: string, quantity?: number) => void;
  wishlistIds: Set<string>;
  onToggleWishlist: (product: Product) => void;
  onNavigatePage: (page: PageView) => void;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({
  product,
  allProducts,
  preselectedColor,
  onBackToCategory,
  onOpenProduct,
  onQuickView,
  onAddToCart,
  onBuyNow,
  wishlistIds,
  onToggleWishlist,
  onNavigatePage
}) => {
  const categoryLabel = (cat: Product['category']) => {
    switch (cat) {
      case 'pajamas':
        return "Men's Pajamas";
      case 'pants':
        return "Men's Pants";
      case 'jackets':
        return "Men's Jackets";
      case 'tracksuits':
        return "Men's Track Suits";
    }
  };

  if (!product) {
    return (
      <div className="py-20 bg-slate-50 min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 text-center shadow-xs space-y-4">
          <div className="w-16 h-16 bg-blue-50 text-[#1455D9] rounded-full flex items-center justify-center mx-auto font-black text-2xl font-heading">
            ?
          </div>
          <h1 className="text-2xl font-black text-slate-900 font-heading">Product Not Found</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            The requested product URL could not be matched to an active catalog item. Browse our complete signature menswear collection below.
          </p>
          <button
            onClick={() => onBackToCategory('all')}
            className="bg-[#1455D9] hover:bg-[#0F42A8] text-white text-xs font-bold px-6 py-3 rounded-xl transition-colors cursor-pointer"
          >
            Browse All Products
          </button>
        </div>
      </div>
    );
  }

  const getColorImage = (colorName: string): string => {
    if (!product.colorImages) return product.images[0];
    if (product.colorImages[colorName]) return product.colorImages[colorName];
    const key = Object.keys(product.colorImages).find(
      (k) => k.toLowerCase() === colorName.toLowerCase()
    );
    return key ? product.colorImages[key] : product.images[0];
  };

  const defaultColor =
    preselectedColor ||
    product.colors.find((c) => c.name.toLowerCase() === 'black')?.name ||
    product.colors[0]?.name ||
    'Black';

  const [selectedColor, setSelectedColor] = useState<string>(defaultColor);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState<string>(() => getColorImage(defaultColor));
  const [pincode, setPincode] = useState<string>('');
  const [pincodeResult, setPincodeResult] = useState<string | null>(null);
  const [showSizeGuide, setShowSizeGuide] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'care'>('desc');
  const [isCopied, setIsCopied] = useState(false);
  const [heartBounce, setHeartBounce] = useState(false);

  useEffect(() => {
    const target =
      preselectedColor ||
      product.colors.find((c) => c.name.toLowerCase() === 'black')?.name ||
      product.colors[0]?.name ||
      'Black';
    setSelectedColor(target);
    setSelectedSize(product.sizes[0] || 'M');
    setQuantity(1);
    setSelectedImage(getColorImage(target));
    setPincodeResult(null);
  }, [product.id, preselectedColor]);

  const handleColorSelect = (colorName: string) => {
    setSelectedColor(colorName);
    setSelectedImage(getColorImage(colorName));
  };

  const currentImgIndex = product.images.indexOf(selectedImage);
  const handlePrevImage = () => {
    if (!product.images || product.images.length <= 1) return;
    const current = currentImgIndex !== -1 ? currentImgIndex : 0;
    const prevIdx = current > 0 ? current - 1 : product.images.length - 1;
    setSelectedImage(product.images[prevIdx]);
  };

  const handleNextImage = () => {
    if (!product.images || product.images.length <= 1) return;
    const current = currentImgIndex !== -1 ? currentImgIndex : 0;
    const nextIdx = current < product.images.length - 1 ? current + 1 : 0;
    setSelectedImage(product.images[nextIdx]);
  };

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.trim().length === 6 && /^\d+$/.test(pincode.trim())) {
      setPincodeResult('✓ Delivery in 2–4 Business Days | Cash on Delivery Available');
    } else {
      setPincodeResult('Please enter a valid 6-digit Indian PIN Code');
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleWishlistToggle = () => {
    setHeartBounce(true);
    setTimeout(() => setHeartBounce(false), 500);
    onToggleWishlist(product);
  };

  const relatedProducts = useMemo(() => {
    return allProducts
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [allProducts, product.category, product.id]);

  const isWishlisted = wishlistIds.has(product.id);

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-[75vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Breadcrumb & Back */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <button
              onClick={() => onBackToCategory('all')}
              className="hover:text-[#1455D9] font-medium cursor-pointer"
            >
              Home
            </button>
            <span>/</span>
            <button
              onClick={() => onBackToCategory(product.category)}
              className="hover:text-[#1455D9] font-medium cursor-pointer"
            >
              {categoryLabel(product.category)}
            </button>
            <span>/</span>
            <span className="font-semibold text-slate-900 line-clamp-1">{product.name}</span>
          </div>

          <button
            onClick={() => onBackToCategory(product.category)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1455D9] hover:text-[#0F42A8] bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to {categoryLabel(product.category)}
          </button>
        </div>

        {/* Main Product Showcase Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-8 lg:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* LEFT: Image Gallery Column (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="relative aspect-[3/4] max-h-[580px] rounded-2xl overflow-hidden bg-[#F8F9FA] border border-slate-200 flex items-center justify-center">
                <img
                  key={selectedImage}
                  src={selectedImage}
                  alt={`${product.name} in ${selectedColor}`}
                  className="w-full h-full object-contain p-3 transition-all duration-300 animate-fade-in"
                  referrerPolicy="no-referrer"
                />

                {product.images && product.images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrevImage}
                      aria-label="Previous photograph"
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 hover:bg-white text-slate-800 shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer z-10"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextImage}
                      aria-label="Next photograph"
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 hover:bg-white text-slate-800 shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer z-10"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className="absolute top-4 right-4 bg-black/75 text-white text-xs font-mono px-3 py-1 rounded-lg z-10">
                      {currentImgIndex !== -1 ? currentImgIndex + 1 : 1} / {product.images.length}
                    </div>
                  </>
                )}

                {product.badge && (
                  <span className="absolute top-4 left-4 bg-[#080B12] text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md shadow-sm z-10">
                    {product.badge}
                  </span>
                )}

                <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-lg border border-white/10 z-10">
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-white/60"
                    style={{
                      backgroundColor:
                        product.colors.find((c) => c.name.toLowerCase() === selectedColor.toLowerCase())?.hex ||
                        '#111827'
                    }}
                  />
                  <span>
                    Colour: <strong className="uppercase text-blue-300">{selectedColor}</strong>
                  </span>
                </div>
              </div>

              {/* Angle Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    Product Photographs & Angles ({product.images.length}):
                  </span>
                  <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar">
                    {product.images.map((imgUrl, idx) => {
                      const isSelected = selectedImage === imgUrl;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedImage(imgUrl)}
                          className={`w-16 h-20 rounded-xl overflow-hidden border-2 transition-all p-0.5 bg-white cursor-pointer shrink-0 ${
                            isSelected
                              ? 'border-[#1455D9] ring-2 ring-blue-100 scale-102 shadow-sm'
                              : 'border-slate-200 hover:border-slate-400 opacity-75 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={imgUrl}
                            alt={`${product.name} view ${idx + 1}`}
                            className="w-full h-full object-cover object-top rounded-lg"
                            referrerPolicy="no-referrer"
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Colour Variant Thumbnails */}
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  All Colour Variants ({product.colors.length}):
                </span>
                <div className="flex flex-wrap items-center gap-2.5">
                  {product.colors.map((color) => {
                    const colorImg = getColorImage(color.name);
                    const isSelected = selectedColor.toLowerCase() === color.name.toLowerCase();
                    return (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => handleColorSelect(color.name)}
                        className={`group w-20 sm:w-24 rounded-xl overflow-hidden border-2 transition-all p-1 bg-white cursor-pointer ${
                          isSelected
                            ? 'border-[#1455D9] ring-2 ring-blue-100 scale-102 shadow-md'
                            : 'border-slate-200 hover:border-slate-400 opacity-85 hover:opacity-100'
                        }`}
                      >
                        <div className="w-full h-16 sm:h-20 rounded-lg overflow-hidden bg-[#F8F9FA]">
                          <img
                            src={colorImg}
                            alt={`${product.name} in ${color.name}`}
                            className="w-full h-full object-cover object-top"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex items-center justify-center gap-1.5 pt-1.5 pb-0.5 text-[11px] font-bold text-slate-800">
                          <span
                            className="w-2 h-2 rounded-full border border-black/20"
                            style={{ backgroundColor: color.hex }}
                          />
                          <span className="capitalize truncate">{color.name}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quality & Delivery Strip */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 grid grid-cols-3 gap-3 text-center text-xs">
                <div>
                  <Sparkles className="w-4 h-4 text-[#1455D9] mx-auto mb-1" />
                  <span className="font-bold text-slate-800">Original Fabric</span>
                  <p className="text-[10px] text-slate-500">100% genuine garment</p>
                </div>
                <div>
                  <RotateCcw className="w-4 h-4 text-[#1455D9] mx-auto mb-1" />
                  <span className="font-bold text-slate-800">7-Day Returns</span>
                  <p className="text-[10px] text-slate-500">Easy doorstep pickup</p>
                </div>
                <div>
                  <Truck className="w-4 h-4 text-[#1455D9] mx-auto mb-1" />
                  <span className="font-bold text-slate-800">24h Dispatch</span>
                  <p className="text-[10px] text-slate-500">Free shipping ₹999+</p>
                </div>
              </div>
            </div>

            {/* RIGHT: Purchase & Spec Column (5 cols) */}
            <div className="lg:col-span-5 flex flex-col">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="uppercase tracking-widest font-bold text-[#1455D9]">
                  {categoryLabel(product.category)}
                </span>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 font-bold text-slate-800 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                    <span className="text-amber-500">★</span> {product.rating}
                    <span className="text-slate-400 font-normal">({product.reviewsCount})</span>
                  </span>
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:text-[#1455D9] hover:border-[#1455D9] cursor-pointer"
                    title={isCopied ? 'Copied link!' : 'Copy product URL'}
                  >
                    {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={handleWishlistToggle}
                    className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                      heartBounce ? 'animate-heart-pop' : ''
                    } ${
                      isWishlisted
                        ? 'bg-rose-50 border-rose-300 text-rose-600'
                        : 'border-slate-200 text-slate-600 hover:text-rose-600'
                    }`}
                    title={isWishlisted ? 'Saved in Wishlist' : 'Save to Wishlist'}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-[#080B12] font-heading leading-tight">
                {product.name}
              </h1>

              {/* Price Box */}
              <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-3xl font-black text-[#080B12] tabular-nums font-heading">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-sm text-slate-400 line-through tabular-nums">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <span className="text-xs text-emerald-700 font-semibold block mt-0.5">
                    Inclusive of all taxes · Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="bg-rose-100 text-rose-700 font-extrabold text-xs px-3 py-1.5 rounded-lg">
                  {product.discount}% OFF
                </div>
              </div>

              {/* Colour Selector */}
              <div className="mt-5 p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                    SELECT COLOUR: <strong className="text-[#1455D9] uppercase">{selectedColor}</strong>
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {product.colors.map((color) => {
                    const isSelected = selectedColor.toLowerCase() === color.name.toLowerCase();
                    return (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => handleColorSelect(color.name)}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#1455D9] bg-white shadow-sm ring-2 ring-blue-100'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-black/20 shrink-0"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className={`text-xs font-bold uppercase truncate ${isSelected ? 'text-[#1455D9]' : 'text-slate-800'}`}>
                          {color.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Size Selector */}
              <div className="mt-5">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-slate-800 uppercase tracking-wider">SELECT SIZE</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setShowSizeGuide(!showSizeGuide)}
                      className="text-[#1455D9] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      <Ruler className="w-3.5 h-3.5" /> Quick Chart
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigatePage('size-guide')}
                      className="text-slate-500 hover:text-[#1455D9] hover:underline font-semibold cursor-pointer"
                    >
                      Full Size Guide &rarr;
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                        selectedSize === sz
                          ? 'bg-[#080B12] text-white shadow-sm ring-2 ring-slate-800'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200/60'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
                {showSizeGuide && (
                  <div className="mt-3 p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-slate-700">
                    <p className="font-bold text-slate-900 mb-1">Standard Indian Menswear Measurements (Inches):</p>
                    <div className="grid grid-cols-5 text-center text-[11px] gap-1 font-mono">
                      <div className="bg-white p-1.5 rounded border border-blue-100">S / 28-30</div>
                      <div className="bg-white p-1.5 rounded border border-blue-100">M / 32</div>
                      <div className="bg-white p-1.5 rounded border border-blue-100">L / 34</div>
                      <div className="bg-white p-1.5 rounded border border-blue-100">XL / 36</div>
                      <div className="bg-white p-1.5 rounded border border-blue-100">XXL / 38</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Quantity */}
              <div className="mt-5 flex items-center gap-4">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">QUANTITY</span>
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-2 text-slate-600 hover:bg-slate-200 text-sm font-bold cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-xs font-black text-slate-900 tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3.5 py-2 text-slate-600 hover:bg-slate-200 text-sm font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Wholesale B2B Tier Card */}
              <div className="mt-5 p-3.5 bg-gradient-to-r from-blue-50/80 to-slate-50 border border-blue-200/80 rounded-2xl">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-[#080B12] flex items-center gap-1.5">
                    <PackageCheck className="w-4 h-4 text-[#1455D9]" />
                    Wholesale B2B Rate (10+ pcs)
                  </span>
                  <span className="font-black text-[#1455D9] text-sm">
                    ₹{Math.round(product.price * 0.85).toLocaleString('en-IN')}/pc
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                  <span>GST input invoice & pan-India transport available</span>
                  <button
                    type="button"
                    onClick={() => onNavigatePage('wholesale')}
                    className="text-[#1455D9] font-bold hover:underline cursor-pointer"
                  >
                    B2B Quote &rarr;
                  </button>
                </div>
              </div>

              {/* Primary CTAs */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => onAddToCart(product, selectedSize, selectedColor, quantity)}
                  className="w-full bg-white hover:bg-slate-50 text-[#080B12] border-2 border-[#080B12] py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-[#1455D9]" /> Add To Cart
                </button>
                <button
                  type="button"
                  onClick={() => onBuyNow(product, selectedSize, selectedColor, quantity)}
                  className="w-full bg-[#1455D9] hover:bg-[#0F42A8] text-white py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-800/20 transition-all active:scale-95 cursor-pointer"
                >
                  Buy Now
                </button>
              </div>

              {/* PIN Code Checker */}
              <div className="mt-6 pt-5 border-t border-slate-200">
                <form onSubmit={handlePincodeCheck} className="space-y-2">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#1455D9]" /> Check Delivery & COD Availability
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="Enter 6-digit PIN Code (e.g. 110001)"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1455D9]"
                    />
                    <button
                      type="submit"
                      className="bg-slate-900 hover:bg-black text-white text-xs font-semibold px-4 py-2 rounded-xl cursor-pointer"
                    >
                      Check
                    </button>
                  </div>
                  {pincodeResult && (
                    <p className={`text-xs font-medium ${pincodeResult.includes('✓') ? 'text-emerald-700' : 'text-rose-600'}`}>
                      {pincodeResult}
                    </p>
                  )}
                </form>
              </div>

              {/* Tabs: Description / Specs / Wash & Care */}
              <div className="mt-6 pt-5 border-t border-slate-200">
                <div className="flex border-b border-slate-200 text-xs font-bold">
                  {[
                    { id: 'desc', label: 'Description' },
                    { id: 'specs', label: 'Specifications' },
                    { id: 'care', label: 'Wash & Care' }
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setActiveTab(t.id as 'desc' | 'specs' | 'care')}
                      className={`pb-2 mr-5 border-b-2 transition-colors cursor-pointer ${
                        activeTab === t.id
                          ? 'border-[#1455D9] text-[#1455D9]'
                          : 'border-transparent text-slate-500'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
                <div className="pt-3 text-xs text-slate-600 leading-relaxed">
                  {activeTab === 'desc' && (
                    <div>
                      <p className="mb-2">{product.description}</p>
                      <ul className="space-y-1 list-disc list-inside text-slate-700">
                        {product.features.map((feat, i) => (
                          <li key={i}>{feat}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {activeTab === 'specs' && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="font-semibold text-slate-800">Fabric Composition:</span>
                        <span>{product.fabric}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="font-semibold text-slate-800">Fit Silhouette:</span>
                        <span>{product.fit}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="font-semibold text-slate-800">Selected Colourway:</span>
                        <span className="font-bold text-[#1455D9] uppercase">{selectedColor}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="font-semibold text-slate-800">Manufacturer:</span>
                        <span>Raghav Garments, New Delhi, India</span>
                      </div>
                    </div>
                  )}
                  {activeTab === 'care' && (
                    <div>
                      <p className="font-medium text-slate-800 mb-1">Garment Care Guide:</p>
                      <p>{product.care}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#1455D9]">
                  More From {categoryLabel(product.category)}
                </span>
                <h2 className="text-2xl font-black text-slate-900 font-heading mt-0.5">
                  SIMILAR STYLES YOU MAY LIKE
                </h2>
              </div>
              <button
                onClick={() => onBackToCategory(product.category)}
                className="text-xs font-bold text-[#1455D9] hover:underline cursor-pointer"
              >
                View All &rarr;
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((rel, idx) => (
                <ProductCard
                  key={rel.id}
                  product={rel}
                  index={idx}
                  onOpenDetails={onOpenProduct}
                  onQuickView={onQuickView}
                  onAddToCart={(p, s, c) => onAddToCart(p, s, c, 1)}
                  isWishlisted={wishlistIds.has(rel.id)}
                  onToggleWishlist={onToggleWishlist}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
