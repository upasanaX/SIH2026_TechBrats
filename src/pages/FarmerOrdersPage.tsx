import React from 'react';
import { useApp } from '../context/AppContext';
import { ClipboardList, Package, ShoppingBag } from 'lucide-react';

export const FarmerOrdersPage: React.FC = () => {
  const { orders, currentUser, setActiveTab } = useApp();
  const farmerOrders = orders
    .map(order => ({
      order,
      items: order.items.filter(item => item.product.farmerId === currentUser?.id)
    }))
    .filter(entry => entry.items.length > 0);
  const itemCount = farmerOrders.reduce((total, entry) => total + entry.items.reduce((sum, item) => sum + item.quantity, 0), 0);
  const earnings = farmerOrders.reduce((total, entry) => total + entry.items.reduce((sum, item) => sum + item.product.pricePerUnit * item.quantity, 0), 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider"><ClipboardList className="w-4 h-4" /> Farmer orders</div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">Orders for your crops</h1>
            <p className="text-xs text-slate-500 mt-1">See how many orders have arrived for the produce you listed.</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">{currentUser?.name.charAt(0) || 'F'}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs"><div className="text-xs text-slate-500">Total orders</div><div className="text-3xl font-black text-slate-900 mt-1">{farmerOrders.length}</div></div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs"><div className="text-xs text-slate-500">Produce units ordered</div><div className="text-3xl font-black text-emerald-700 mt-1">{itemCount}</div></div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs"><div className="text-xs text-slate-500">Estimated crop value</div><div className="text-3xl font-black text-blue-700 mt-1">₹{earnings}</div></div>
      </div>

      {farmerOrders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3"><ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" /><h2 className="text-base font-bold text-slate-800">No orders for your crops yet</h2><p className="text-xs text-slate-500 max-w-md mx-auto">When a consumer orders one of your listings, the order and quantity will appear here.</p><button onClick={() => setActiveTab('farmer-listing')} className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold">Upload a crop listing</button></div>
      ) : (
        <div className="space-y-3">{farmerOrders.map(({ order, items }) => <div key={order.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs"><div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3"><div className="flex items-center gap-2"><Package className="w-4 h-4 text-emerald-700" /><span className="text-sm font-bold text-slate-900">Order #{order.id}</span></div><span className="text-[11px] font-bold uppercase text-emerald-700">{order.status.replace('_', ' ')}</span></div><div className="pt-3 space-y-2">{items.map(item => <div key={item.product.id} className="flex items-center justify-between gap-3 text-xs"><span className="font-semibold text-slate-800">{item.product.name}</span><span className="text-slate-600">{item.quantity} {item.product.unit} • ₹{item.product.pricePerUnit * item.quantity}</span></div>)}</div><div className="text-[11px] text-slate-400 mt-3">Placed {new Date(order.createdAt).toLocaleDateString('en-IN')}</div></div>)}</div>
      )}
    </div>
  );
};
