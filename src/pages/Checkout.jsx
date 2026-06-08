import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import API_BASE_URL from '../config/api';
import Dialog from '../components/Dialog';
import wilayas from '../data/wilayas.json';
import communes from '../data/communes.json';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    state: ''
  });

  const [wilayaId, setWilayaId] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [errorDialog, setErrorDialog] = useState({ open: false, message: '' });

  const filteredCities = wilayaId
    ? communes.filter(c => c.wilaya_id === wilayaId)
    : [];

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems.length, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'wilayaId') {
      const selected = wilayas.find(w => w.id === value);
      setWilayaId(value);
      setFormData(prev => ({ ...prev, state: selected ? `${selected.code} - ${selected.name}` : '', city: '' }));
      setErrors(prev => ({ ...prev, state: '', city: '' }));
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'Wilaya is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setShowConfirmDialog(true);
  };

  const confirmOrder = async () => {
    setShowConfirmDialog(false);
    setSubmitting(true);

    try {
      const subtotal = getCartTotal();
      const tax = 0;
      const total = subtotal;

      const orderData = {
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        },
        shipping: {
          city: formData.city,
          state: formData.state,
        },
        items: cartItems.map(item => ({
          productId: item._id || item.id,
          name: item.name,
          brand: item.brand,
          price: typeof item.price === 'number' ? item.price : parseFloat(item.price.replace(/[^0-9]/g, '')),
          image: item.image,
          selectedSize: item.selectedSize,
          quantity: item.quantity
        })),
        subtotal,
        tax,
        total
      };

      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Backend error:', errorData);
        throw new Error(errorData.message || 'Failed to create order');
      }

      const order = await response.json();
      
      clearCart();
      
      navigate(`/order-success/${order.orderNumber}`);
    } catch (error) {
      console.error('Error creating order:', error);
      setErrorDialog({ open: true, message: error.message || 'Failed to place order. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const cancelOrder = () => {
    setShowConfirmDialog(false);
  };

  if (cartItems.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold">Checkout</h1>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-semibold">1</div>
              <span className="font-semibold">Shipping Details</span>
            </div>
            <div className="h-px bg-gray-300 w-12"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-semibold">2</div>
              <span className="text-gray-600">Confirmation</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-card shadow-md p-8"
              >
                <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Wilaya *</label>
                    <select
                      name="wilayaId"
                      value={wilayaId}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg bg-white ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <option value="">Select Wilaya</option>
                      {wilayas.map(w => (
                        <option key={w.id} value={w.id}>{w.code} - {w.name}</option>
                      ))}
                    </select>
                    {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">City *</label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      disabled={!wilayaId}
                      className={`w-full px-4 py-3 border rounded-lg bg-white disabled:bg-gray-100 disabled:text-gray-400 ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <option value="">{wilayaId ? 'Select City' : 'Select Wilaya first'}</option>
                      {filteredCities.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                  </div>
                </div>
              </motion.div>

            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-card shadow-md p-6 sticky top-20">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {cartItems.map(item => (
                    <div key={`${item.id}-${item.selectedSize}`} className="flex gap-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate">{item.name}</h4>
                        <p className="text-xs text-gray-600">Size: {item.selectedSize}</p>
                        <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-sm font-semibold">{item.price}</div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold">{getCartTotal().toLocaleString()} DZD</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-semibold text-green-600">Free</span>
                  </div>
                </div>

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-2xl font-bold">{getCartTotal().toLocaleString()} DZD</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-black text-white py-4 rounded-lg font-semibold hover:bg-gray-900 transition-all duration-300"
                >
                  Place Order
                </button>

                <p className="text-xs text-gray-600 text-center mt-4">
                  By placing your order, you agree to our Terms & Conditions
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>

      <Dialog
        isOpen={showConfirmDialog}
        type="order"
        title="Confirm Your Order"
        message="Please review your order details before confirming."
        confirmLabel={submitting ? 'Processing...' : 'Confirm Order'}
        cancelLabel="Cancel"
        onConfirm={confirmOrder}
        onCancel={cancelOrder}
        confirmDisabled={submitting}
      >
        <div className="bg-gray-50 rounded-xl p-4 mb-1 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Items</span>
            <span className="font-semibold">{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Subtotal</span>
            <span className="font-semibold">{getCartTotal().toLocaleString()} DZD</span>
          </div>
          <div className="border-t pt-2 flex justify-between">
            <span className="font-bold">Total</span>
            <span className="text-lg font-bold">{getCartTotal().toLocaleString()} DZD</span>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-800">
          <strong>Shipping to:</strong> {formData.city}, {formData.state}
        </div>
      </Dialog>

      <Dialog
        isOpen={errorDialog.open}
        type="error"
        title="Order Failed"
        message={errorDialog.message}
        confirmLabel="Try Again"
        onConfirm={() => setErrorDialog({ open: false, message: '' })}
      />
    </div>
  );
};

export default Checkout;
