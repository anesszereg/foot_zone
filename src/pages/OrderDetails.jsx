import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, Truck, CheckCircle, Download, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';

const OrderDetails = () => {
  const { orderId } = useParams();
  const { orders } = useCart();
  const order = orders.find(o => o.id === orderId);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Order not found</h2>
          <Link to="/account/orders" className="text-blue-600 hover:underline">
            Back to orders
          </Link>
        </div>
      </div>
    );
  }

  const trackingSteps = [
    { label: 'Order Placed', icon: Package, completed: true, date: new Date(order.date).toLocaleDateString() },
    { label: 'Processing', icon: Package, completed: true, date: new Date(order.date).toLocaleDateString() },
    { label: 'Shipped', icon: Truck, completed: order.status !== 'Processing', date: order.status !== 'Processing' ? new Date(order.date).toLocaleDateString() : null },
    { label: 'Delivered', icon: CheckCircle, completed: order.status === 'Delivered', date: order.status === 'Delivered' ? new Date(order.date).toLocaleDateString() : null },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            to="/account/orders"
            className="inline-flex items-center gap-2 text-sm font-semibold hover:underline mb-4"
          >
            <ArrowLeft size={16} />
            Back to Orders
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">Order #{order.id}</h1>
              <p className="text-gray-600 mt-2">
                Placed on {new Date(order.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
              order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
              order.status === 'Shipped' ? 'bg-purple-100 text-purple-800' :
              order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
              'bg-red-100 text-red-800'
            }`}>
              {order.status}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-card shadow-md p-8"
            >
              <h2 className="text-2xl font-bold mb-6">Order Tracking</h2>
              <div className="relative">
                {trackingSteps.map((step, index) => (
                  <div key={step.label} className="flex gap-4 mb-8 last:mb-0">
                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        step.completed ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-400'
                      }`}>
                        <step.icon size={24} />
                      </div>
                      {index < trackingSteps.length - 1 && (
                        <div className={`w-0.5 h-16 ${step.completed ? 'bg-green-600' : 'bg-gray-200'}`} />
                      )}
                    </div>
                    <div className="flex-1 pt-2">
                      <h3 className="font-semibold text-lg">{step.label}</h3>
                      {step.date && (
                        <p className="text-sm text-gray-600">{step.date}</p>
                      )}
                      {!step.completed && index === trackingSteps.findIndex(s => !s.completed) && (
                        <p className="text-sm text-gray-500 mt-1">Expected soon</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-card shadow-md p-8"
            >
              <h2 className="text-2xl font-bold mb-6">Order Items</h2>
              <div className="space-y-6">
                {order.items.map((item, index) => (
                  <div key={index} className="flex gap-6 pb-6 border-b last:border-b-0">
                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{item.brand}</p>
                      <div className="flex gap-4 text-sm">
                        <span className="text-gray-600">Size: <span className="font-semibold text-black">{item.selectedSize}</span></span>
                        <span className="text-gray-600">Qty: <span className="font-semibold text-black">{item.quantity}</span></span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-card shadow-md p-6"
            >
              <h3 className="font-bold text-lg mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{(order.total / 1.19).toLocaleString()} DZD</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>{(order.total - order.total / 1.19).toLocaleString()} DZD</span>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-2xl">{order.total.toLocaleString()} DZD</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-card shadow-md p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={20} />
                <h3 className="font-bold text-lg">Shipping Address</h3>
              </div>
              <p className="text-sm leading-relaxed">
                {order.customer.firstName} {order.customer.lastName}<br />
                {order.shipping.address}<br />
                {order.shipping.city}, {order.shipping.state} {order.shipping.zipCode}<br />
                <br />
                {order.customer.email}<br />
                {order.customer.phone}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-3"
            >
              <button className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition flex items-center justify-center gap-2">
                <Download size={20} />
                Download Invoice
              </button>
              <button className="w-full border-2 border-black py-3 rounded-lg font-semibold hover:bg-gray-50 transition">
                Contact Support
              </button>
              <button className="w-full border-2 border-gray-300 py-3 rounded-lg font-semibold hover:border-black transition">
                Reorder Items
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
