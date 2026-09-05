import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PRODUCTS } from '../data/products';
import { Product } from '../types';
import { 
  Store, 
  Search, 
  Filter, 
  SlidersHorizontal, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Plus, 
  ShoppingCart, 
  TrendingDown, 
  ArrowRight,
  ShieldCheck,
  Truck,
  Leaf,
  Info
} from 'lucide-react';

export const MarketplacePage: React.FC = () => {
  const { addToCart, setActiveTab, setSelectedProductId, showToast } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('freshness');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showOnlyOrganic, setShowOnlyOrganic] = useState<boolean>(false);
  const [priceBreakdownProduct, setPriceBreakdownProduct] = useState<Product | null>(null);

  const categories = [
    { id: 'all', label: 'All Harvests' },
    { id: 'grains', label: 'Grains & Rice' },
    { id: 'vegetables', label: 'Fresh Vegetables' },
    { id: 'spices', label: 'Spices & Honey' }
  ];

  const locations = [
    { id: 'all', label: 'All Districts' },
    { id: 'South 24 Parganas', label: 'South 24 Parganas' },
    { id: 'Hooghly', label: 'Hooghly' },
    { id: 'North 24 Parganas', label: 'North 24 Parganas' },
    { id: 'Purba Bardhaman', label: 'Purba Bardhaman' }
  ];

  const filteredProducts = PRODUCTS.filter(p => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (selectedLocation !== 'all' && p.district !== selectedLocation) return false;
    if (showOnlyOrganic && !p.organic) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.bengaliName.includes(q) ||
        p.hindiName.includes(q) ||
        p.farmerName.toLowerCase().includes(q) ||
        p.panchayat.toLowerCase().includes(q)
      );
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'price_asc') return a.pricePerUnit - b.pricePerUnit;
    if (sortBy === 'price_desc') return b.pricePerUnit - a.pricePerUnit;
    if (sortBy === 'rating') return b.rating - a.rating;
    // Default freshness by harvest date
    return new Date(b.harvestDate).getTime() - new Date(a.harvestDate).getTime();
  });

  const handleProductClick = (productId: string) => {
    setSelectedProductId(productId);
    setActiveTab('product');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              KrishiKavach Direct Farmer-to-Consumer Marketplace
            </h1>
            <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-sm border border-emerald-300">
              Zero Middleman Commission
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Buy farm-fresh harvests directly from verified Panchayat farmers at transparent, fair-trade farmgate prices
          </p>
        </div>

        <button
          onClick={() => setActiveTab('cart')}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>View Cart & Checkout</span>
        </button>
      </div>

      {/* DIRECT COMMODITY EXPLANATION BANNER */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-950 to-slate-900 text-white rounded-2xl border border-emerald-800/60 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            Empowering Fair Agriculture
          </div>
          <h3 className="text-sm sm:text-base font-bold text-white">
            How KrishiKavach Eliminates Middleman Distress Selling
          </h3>
          <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
            During heavy rain or impending storms, farmers often liquidate perishables at 40% distress discounts to local arathdars. KrishiKavach connects them directly with urban households and cooperative aggregators.
          </p>
        </div>

        <div className="bg-emerald-800/60 border border-emerald-600 rounded-xl p-3 text-center shrink-0">
          <div className="text-2xl font-black text-emerald-300">+25%</div>
          <div className="text-[11px] font-semibold text-emerald-100">Farmer Income Gain</div>
        </div>
      </div>

      {/* SEARCH AND FILTERS BAR */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search rice, tomatoes, mustard, farmer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white"
            />
          </div>

          {/* Controls: Location, Sort, Organic toggle */}
          <div className="flex items-center gap-2.5 flex-wrap w-full md:w-auto">
            
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700"
            >
              {locations.map(l => (
                <option key={l.id} value={l.id}>{l.label}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700"
            >
              <option value="freshness">Sort by Freshness (Harvest Date)</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated Farmers</option>
            </select>

            <button
              onClick={() => setShowOnlyOrganic(!showOnlyOrganic)}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                showOnlyOrganic 
                  ? 'bg-emerald-700 text-white shadow-xs' 
                  : 'bg-slate-50 border border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Leaf className="w-3.5 h-3.5 text-emerald-400" />
              <span>Organic Only</span>
            </button>

          </div>

        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100 pb-1">
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                selectedCategory === c.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

      </div>

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => {
          const savingsPerKg = product.traditionalMandiPrice > 0 
            ? product.pricePerUnit - product.traditionalMandiPrice 
            : 0;

          return (
            <div 
              key={product.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
            >
              {/* Image Container with Badges */}
              <div 
                onClick={() => handleProductClick(product.id)}
                className="relative h-48 w-full overflow-hidden cursor-pointer bg-slate-100"
              >
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Organic badge */}
                {product.organic && (
                  <span className="absolute top-3 left-3 bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1 shadow-md">
                    <Leaf className="w-3 h-3" /> Certified Organic
                  </span>
                )}

                {/* Rating badge */}
                <span className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-xs text-amber-400 text-xs font-bold px-2 py-0.5 rounded-md shadow-md">
                  ★ {product.rating.toFixed(1)}
                </span>

                {/* Harvest freshness indicator */}
                <span className="absolute bottom-3 left-3 bg-slate-900/85 backdrop-blur-xs text-slate-200 text-[10px] font-mono px-2 py-0.5 rounded-md">
                  Harvested: {product.harvestDate}
                </span>
              </div>

              {/* Content Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  
                  {/* Farmer name and Panchayat */}
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-semibold text-slate-700 truncate">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      {product.farmerName}
                    </span>
                    <span className="text-[11px] truncate">{product.panchayat}</span>
                  </div>

                  {/* Product Title */}
                  <h3 
                    onClick={() => handleProductClick(product.id)}
                    className="font-bold text-slate-900 text-base group-hover:text-emerald-700 transition-colors cursor-pointer"
                  >
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {product.bengaliName} • {product.hindiName}
                  </p>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Pricing Breakdown & Add to Cart */}
                <div className="pt-3 border-t border-slate-100 space-y-3">
                  
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-2xl font-black text-slate-900">₹{product.pricePerUnit}</span>
                      <span className="text-xs text-slate-500"> / {product.unit}</span>
                    </div>

                    <button
                      onClick={() => setPriceBreakdownProduct(product)}
                      className="text-[11px] font-semibold text-emerald-700 hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <Info className="w-3 h-3" /> Price Breakdown
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Stock: {product.quantityAvailable} {product.unit}</span>
                    <span className="flex items-center gap-1 text-slate-600">
                      <Truck className="w-3.5 h-3.5" /> Direct / Hub Pickup
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => handleProductClick(product.id)}
                      className="py-2 px-3 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-colors text-center"
                    >
                      View Details
                    </button>

                    <button
                      onClick={() => addToCart(product, 5)}
                      className="py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add 5 {product.unit}</span>
                    </button>
                  </div>

                </div>

              </div>
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="py-12 bg-white rounded-2xl border border-slate-200 text-center space-y-2">
          <Store className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Farm Harvests Found</h3>
          <p className="text-xs text-slate-500">Try changing your filters or searching for another crop.</p>
        </div>
      )}

      {/* Transparent Price Breakdown Modal */}
      {priceBreakdownProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="font-bold text-slate-900 text-sm">
                Transparent Price Breakdown
              </div>
              <button 
                onClick={() => setPriceBreakdownProduct(null)}
                className="text-slate-400 hover:text-slate-800 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-slate-600">
              Comparing direct farmer payout on KrishiKavach vs traditional mandi distress sale for <strong>{priceBreakdownProduct.name}</strong>:
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                <span className="font-semibold text-emerald-950">KrishiKavach Direct Price</span>
                <strong className="text-emerald-900">₹{priceBreakdownProduct.pricePerUnit} / {priceBreakdownProduct.unit}</strong>
              </div>

              <div className="flex justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-600">Net Farmer Payout (88%)</span>
                <span className="font-bold text-slate-800">₹{(priceBreakdownProduct.pricePerUnit * 0.88).toFixed(1)}</span>
              </div>

              <div className="flex justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-600">Panchayat FPO Logistics & Packaging</span>
                <span className="font-bold text-slate-800">₹{(priceBreakdownProduct.pricePerUnit * 0.12).toFixed(1)}</span>
              </div>

              <div className="flex justify-between p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-900">
                <span>Traditional Mandi Distress Price (Middleman takes 35%)</span>
                <strong>₹{priceBreakdownProduct.traditionalMandiPrice} / {priceBreakdownProduct.unit}</strong>
              </div>
            </div>

            <div className="p-3 bg-slate-100 rounded-xl text-[11px] text-slate-600 leading-snug">
              Direct selling prevents commission agents from cutting margins when unseasonal rain forces early harvest.
            </div>

            <button
              onClick={() => setPriceBreakdownProduct(null)}
              className="w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
            >
              Close Breakdown
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
