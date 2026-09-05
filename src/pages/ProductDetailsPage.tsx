import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PRODUCTS } from '../data/products';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Truck, 
  Leaf, 
  ShieldCheck, 
  Phone, 
  MessageSquare, 
  Plus, 
  Minus, 
  ShoppingCart, 
  Store,
  Clock,
  Heart
} from 'lucide-react';

export const ProductDetailsPage: React.FC = () => {
  const { selectedProductId, setSelectedProductId, addToCart, setActiveTab, showToast } = useApp();
  const [quantity, setQuantity] = useState<number>(5);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState<boolean>(false);
  const [messageText, setMessageText] = useState<string>('');

  const product = PRODUCTS.find(p => p.id === selectedProductId) || PRODUCTS[0];
  const related = PRODUCTS.filter(p => p.id !== product.id).slice(0, 3);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    setActiveTab('cart');
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) {
      showToast('Please enter a message for the farmer.');
      return;
    }
    showToast(`Inquiry sent to ${product.farmerName} via SMS gateway.`);
    setMessageText('');
    setIsMessageModalOpen(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Back Button */}
      <button
        onClick={() => setActiveTab('marketplace')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Marketplace</span>
      </button>

      {/* Main Details Showcase */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0">
        
        {/* Left Image Showcase (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-100 relative min-h-[380px] lg:min-h-full">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover"
          />

          {product.organic && (
            <span className="absolute top-4 left-4 bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-md">
              <Leaf className="w-4 h-4" /> 100% Organic Certified
            </span>
          )}

          <div className="absolute bottom-4 left-4 right-4 bg-slate-950/80 backdrop-blur-sm text-white p-3 rounded-xl text-xs flex items-center justify-between">
            <span className="flex items-center gap-1 text-amber-400 font-bold">
              ★ {product.rating.toFixed(1)} / 5.0 Consumer Trust
            </span>
            <span className="text-slate-300 font-mono">Harvested: {product.harvestDate}</span>
          </div>
        </div>

        {/* Right Product & Farmer Story Details (7 Cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 space-y-6 flex flex-col justify-between">
          
          <div className="space-y-4">
            
            {/* Header / Verified Badge */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified Grower
              </span>
              <span className="text-xs text-slate-500 font-mono">
                Item ID: {product.id}
              </span>
            </div>

            {/* Title & Regional Names */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {product.name}
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                {product.bengaliName} • {product.hindiName}
              </p>
            </div>

            {/* Farmer Profile Card */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span>Cultivated by {product.farmerName}</span>
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{product.village}, {product.panchayat}, {product.district}</span>
                </div>
              </div>

              <button
                onClick={() => setIsMessageModalOpen(true)}
                className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 self-start sm:self-auto"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                <span>Message Grower</span>
              </button>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Produce Description</h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Farmer Story */}
            <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-1.5">
              <div className="text-xs font-bold text-emerald-950 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>The Farmer's Journey</span>
              </div>
              <p className="text-xs text-emerald-900 leading-relaxed italic">
                "{product.farmerStory}"
              </p>
            </div>

            {/* Specifications Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-1">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-slate-500 text-[10px]">Quantity Available</div>
                <div className="text-sm font-bold text-slate-900">{product.quantityAvailable} {product.unit}</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-slate-500 text-[10px]">Natural Shelf Life</div>
                <div className="text-sm font-bold text-slate-900">{product.shelfLifeDays} Days</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 col-span-2 sm:col-span-1">
                <div className="text-slate-500 text-[10px]">Pickup Hub</div>
                <div className="text-xs font-bold text-slate-900 truncate">{product.pickupLocation}</div>
              </div>
            </div>

          </div>

          {/* Pricing & Cart Action Bar */}
          <div className="pt-6 border-t border-slate-200 space-y-4">
            
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-3xl font-black text-slate-900">₹{product.pricePerUnit}</span>
                <span className="text-xs text-slate-500"> per {product.unit}</span>
              </div>

              {/* Quantity Stepper */}
              <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
                <button
                  onClick={() => setQuantity(prev => Math.max(prev - 1, 1))}
                  className="w-7 h-7 rounded-lg bg-white hover:bg-slate-200 flex items-center justify-center font-bold text-slate-700 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-xs font-bold text-slate-900">
                  {quantity} {product.unit}
                </span>
                <button
                  onClick={() => setQuantity(prev => Math.min(prev + 1, product.quantityAvailable))}
                  className="w-7 h-7 rounded-lg bg-white hover:bg-slate-200 flex items-center justify-center font-bold text-slate-700 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 border border-slate-300"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add {quantity} {product.unit} to Cart (₹{product.pricePerUnit * quantity})</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <span>Direct Checkout Now</span>
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* RELATED HARVESTS SECTION */}
      <div className="space-y-4 pt-4">
        <h3 className="text-base font-bold text-slate-900">Other Fresh Harvests from This District</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {related.map(r => (
            <div 
              key={r.id}
              onClick={() => {
                setSelectedProductId(r.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs hover:border-emerald-500 transition-all cursor-pointer flex items-center gap-3"
            >
              <img src={r.image} alt={r.name} className="w-16 h-16 rounded-lg object-cover" />
              <div className="space-y-0.5 truncate">
                <div className="text-xs font-bold text-slate-900 truncate">{r.name}</div>
                <div className="text-[11px] text-slate-500">{r.panchayat}</div>
                <div className="text-xs font-extrabold text-emerald-800">₹{r.pricePerUnit} / {r.unit}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message Farmer Modal */}
      {isMessageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="font-bold text-sm text-slate-900">
                Direct Inquiry to {product.farmerName}
              </div>
              <button 
                onClick={() => setIsMessageModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Message will be dispatched via automated regional SMS to the farmer's registered phone ({product.farmerPhone}).
            </p>

            <textarea
              rows={4}
              placeholder="e.g. Hello, we are a housing cooperative in Kolkata interested in ordering 100kg of your produce. Please confirm next pickup date."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
            />

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setIsMessageModalOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                Send Inquiry SMS
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
