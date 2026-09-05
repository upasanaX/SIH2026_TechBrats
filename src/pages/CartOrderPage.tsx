import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  Truck, 
  MapPin, 
  CreditCard, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Store,
  QrCode,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Order } from '../types';

export const CartOrderPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, createOrder, orders, setActiveTab, showToast } = useApp();
  
  const [step, setStep] = useState<number>(1); // 1: Cart, 2: Delivery, 3: Address, 4: Payment, 5: Confirmation
  const [deliveryType, setDeliveryType] = useState<'direct_pickup' | 'hub_delivery'>('hub_delivery');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'kisan_pay' | 'cod'>('upi');
  
  const [shippingAddress, setShippingAddress] = useState({
    fullName: 'Pooja Sen',
    phone: '+91 98301 23456',
    addressLine: 'Flat 4B, Greenfield Heights, New Town Action Area II',
    city: 'Kolkata',
    pincode: '700156'
  });

  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  const subtotal = cart.reduce((tot, item) => tot + item.product.pricePerUnit * item.quantity, 0);
  const deliveryFee = deliveryType === 'hub_delivery' ? 50 : 0;
  const totalAmount = subtotal + deliveryFee;
  
  // Calculate farmer earnings (88%) and middleman savings (approx 25%)
  const farmerEarnings = Math.round(subtotal * 0.88);
  const middlemanSavings = Math.round(subtotal * 0.28);

  const handleNextStep = () => {
    if (step === 1 && cart.length === 0) {
      showToast('Your cart is empty. Add items from the marketplace first.');
      return;
    }
    setStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleCompleteOrder = () => {
    const newOrd = createOrder({
      subtotal,
      deliveryFee,
      totalAmount,
      farmerEarnings,
      middlemanSavings,
      deliveryType,
      shippingAddress,
      paymentMethod
    });

    setConfirmedOrder(newOrd);
    setStep(5);

    // Trigger celebratory confetti on order confirmation
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    showToast(`Order #${newOrd.id} confirmed! Farmer notified.`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Direct Farm Checkout & Orders
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent order routing directly settling with Panchayat rural growers
          </p>
        </div>

        <span className="text-xs font-bold uppercase bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full border border-emerald-300">
          Direct Farmer Escrow Sandbox
        </span>
      </div>

      {/* STEPPER PROGRESS BAR (Steps 1 to 4) */}
      {step < 5 && (
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between max-w-2xl mx-auto text-xs font-bold">
            <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-emerald-700' : 'text-slate-400'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 1 ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-600'}`}>1</span>
              <span>Cart</span>
            </div>
            <div className={`h-0.5 w-12 sm:w-20 ${step >= 2 ? 'bg-emerald-700' : 'bg-slate-200'}`} />

            <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-emerald-700' : 'text-slate-400'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 2 ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-600'}`}>2</span>
              <span>Delivery</span>
            </div>
            <div className={`h-0.5 w-12 sm:w-20 ${step >= 3 ? 'bg-emerald-700' : 'bg-slate-200'}`} />

            <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-emerald-700' : 'text-slate-400'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 3 ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-600'}`}>3</span>
              <span>Address</span>
            </div>
            <div className={`h-0.5 w-12 sm:w-20 ${step >= 4 ? 'bg-emerald-700' : 'bg-slate-200'}`} />

            <div className={`flex items-center gap-1.5 ${step >= 4 ? 'text-emerald-700' : 'text-slate-400'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 4 ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-600'}`}>4</span>
              <span>Payment</span>
            </div>
          </div>
        </div>
      )}

      {/* STEP 1: CART REVIEW */}
      {step === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">
                Selected Harvests ({cart.length} unique items)
              </h2>
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-red-600 hover:underline font-medium"
                >
                  Clear Cart
                </button>
              )}
            </div>

            {cart.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <ShoppingCart className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">Your Basket is Empty</h3>
                <p className="text-xs text-slate-500">Add fresh farm produce directly from the marketplace.</p>
                <button
                  onClick={() => setActiveTab('marketplace')}
                  className="mt-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Browse Marketplace
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {cart.map(item => (
                  <div key={item.product.id} className="py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name} 
                        className="w-14 h-14 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900">{item.product.name}</h4>
                        <p className="text-[11px] text-slate-500">
                          {item.product.farmerName} • {item.product.panchayat}
                        </p>
                        <div className="text-xs font-bold text-slate-900 mt-1">
                          ₹{item.product.pricePerUnit} / {item.product.unit}
                        </div>
                      </div>
                    </div>

                    {/* Stepper & Delete */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 rounded bg-white flex items-center justify-center text-xs font-bold hover:bg-slate-200"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-6 h-6 rounded bg-white flex items-center justify-center text-xs font-bold hover:bg-slate-200"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-sm font-black text-slate-900 w-16 text-right">
                        ₹{item.product.pricePerUnit * item.quantity}
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Price Summary Panel */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 self-start">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">Order Summary</h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Produce Subtotal</span>
                <span className="font-bold text-slate-900">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Estimated Logistics</span>
                <span className="font-bold text-slate-900">₹{deliveryFee}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-slate-900">
                <span>Total Payable</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>

            {/* Impact Box */}
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1 text-xs">
              <div className="font-bold text-emerald-900 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                Direct Impact Breakdown
              </div>
              <p className="text-slate-600 text-[11px]">
                • Farmer payout: <strong>₹{farmerEarnings}</strong> (88% net)
              </p>
              <p className="text-slate-600 text-[11px]">
                • Middleman fee eliminated: <strong>₹{middlemanSavings}</strong>
              </p>
            </div>

            <button
              disabled={cart.length === 0}
              onClick={handleNextStep}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <span>Continue to Delivery Method</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: DELIVERY OR PICKUP SELECTION */}
      {step === 2 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6 max-w-2xl mx-auto">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900">Select Fulfillment Method</h2>
            <p className="text-xs text-slate-500">Choose between farm cooperative pickup or eco-van urban delivery</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => setDeliveryType('hub_delivery')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all space-y-2 ${
                deliveryType === 'hub_delivery'
                  ? 'border-emerald-700 bg-emerald-50/60 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <Truck className="w-6 h-6 text-emerald-700" />
                <span className="text-xs font-bold text-emerald-900">₹50 Flat Fee</span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm">FPO Direct Home Delivery</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Consolidated delivery van to your doorstep within 24–36 hours of harvest.
              </p>
            </div>

            <div
              onClick={() => setDeliveryType('direct_pickup')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all space-y-2 ${
                deliveryType === 'direct_pickup'
                  ? 'border-emerald-700 bg-emerald-50/60 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <Store className="w-6 h-6 text-emerald-700" />
                <span className="text-xs font-bold text-emerald-700">Free Pickup</span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Panchayat Hub / Farm Pickup</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Collect directly from the designated Primary Agricultural Cooperative Society warehouse.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={handlePrevStep}
              className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Cart
            </button>
            <button
              onClick={handleNextStep}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <span>Continue to Address</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: SHIPPING ADDRESS */}
      {step === 3 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6 max-w-2xl mx-auto">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900">Consumer Delivery Address</h2>
            <p className="text-xs text-slate-500">Provide shipping details for rural dispatch and tracking</p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={shippingAddress.fullName}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={shippingAddress.phone}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Street Address / Housing Complex</label>
              <input
                type="text"
                value={shippingAddress.addressLine}
                onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">PIN Code</label>
                <input
                  type="text"
                  value={shippingAddress.pincode}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, pincode: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={handlePrevStep}
              className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <button
              onClick={handleNextStep}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <span>Continue to Payment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: MOCK PAYMENT SELECTION & ORDER REVIEW */}
      {step === 4 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6 max-w-2xl mx-auto">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900">Payment & Settlement Selection</h2>
            <p className="text-xs text-slate-500">All transactions simulate direct bank transfer to the farmer's DBT account</p>
          </div>

          <div className="space-y-3">
            <div
              onClick={() => setPaymentMethod('upi')}
              className={`p-4 rounded-xl border-2 cursor-pointer flex items-center justify-between gap-3 ${
                paymentMethod === 'upi' ? 'border-emerald-700 bg-emerald-50/70' : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <QrCode className="w-6 h-6 text-emerald-700" />
                <div>
                  <div className="text-xs font-bold text-slate-900">Unified Payments Interface (UPI / QR)</div>
                  <div className="text-[11px] text-slate-500">Instant credit to Farmer Cooperative Account</div>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-800">Simulated</span>
            </div>

            <div
              onClick={() => setPaymentMethod('kisan_pay')}
              className={`p-4 rounded-xl border-2 cursor-pointer flex items-center justify-between gap-3 ${
                paymentMethod === 'kisan_pay' ? 'border-emerald-700 bg-emerald-50/70' : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-emerald-700" />
                <div>
                  <div className="text-xs font-bold text-slate-900">Kisan Direct Escrow Settlement</div>
                  <div className="text-[11px] text-slate-500">Funds released upon delivery hub scan</div>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-800">Simulated</span>
            </div>

            <div
              onClick={() => setPaymentMethod('cod')}
              className={`p-4 rounded-xl border-2 cursor-pointer flex items-center justify-between gap-3 ${
                paymentMethod === 'cod' ? 'border-emerald-700 bg-emerald-50/70' : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Truck className="w-6 h-6 text-slate-700" />
                <div>
                  <div className="text-xs font-bold text-slate-900">Cash on Delivery / Pickup</div>
                  <div className="text-[11px] text-slate-500">Pay physically at the Panchayat warehouse</div>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-600">Standard</span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
            <div className="flex justify-between font-bold text-slate-900">
              <span>Total Amount to Pay</span>
              <span className="text-base text-emerald-800">₹{totalAmount}</span>
            </div>
            <div className="text-[11px] text-slate-500">
              Direct Farmer Share: ₹{farmerEarnings} (Zero middleman fee deducted).
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={handlePrevStep}
              className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <button
              onClick={handleCompleteOrder}
              className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm & Place Order (₹{totalAmount})</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: ORDER CONFIRMATION SCREEN */}
      {step === 5 && confirmedOrder && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg max-w-xl mx-auto text-center space-y-6 animate-in fade-in zoom-in-95">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900">Harvest Order Confirmed!</h2>
            <p className="text-xs text-slate-500 font-mono">Order Tracking ID: {confirmedOrder.id}</p>
          </div>

          <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-200 text-left space-y-3 text-xs">
            <div className="flex justify-between text-emerald-950 font-bold border-b border-emerald-200 pb-2">
              <span>Direct Settlement Overview</span>
              <span>Status: Dispatched to FPO</span>
            </div>
            <div className="space-y-1 text-slate-700">
              <div className="flex justify-between">
                <span>Total Amount Paid:</span>
                <strong>₹{confirmedOrder.totalAmount}</strong>
              </div>
              <div className="flex justify-between">
                <span>Direct Farmer Earning:</span>
                <strong className="text-emerald-800">₹{confirmedOrder.farmerEarnings}</strong>
              </div>
              <div className="flex justify-between">
                <span>Middleman Commission Saved:</span>
                <strong className="text-emerald-800">₹{confirmedOrder.middlemanSavings}</strong>
              </div>
              <div className="flex justify-between pt-1">
                <span>Shipping To:</span>
                <span className="truncate max-w-[200px]">{confirmedOrder.shippingAddress.addressLine}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setStep(1);
                setActiveTab('marketplace');
              }}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs"
            >
              Order More Fresh Produce
            </button>

            <button
              onClick={() => setActiveTab('farmer')}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold"
            >
              Back to Farmer Dashboard
            </button>
          </div>
        </div>
      )}

      {/* PREVIOUS ORDERS SECTION */}
      {orders.length > 0 && step !== 5 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Your Recent Direct Orders</h3>
          <div className="space-y-3">
            {orders.map(ord => (
              <div key={ord.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900">{ord.id}</div>
                  <div className="text-slate-500">{ord.items.length} items • Total: ₹{ord.totalAmount}</div>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 font-bold uppercase text-[10px]">
                  {ord.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
