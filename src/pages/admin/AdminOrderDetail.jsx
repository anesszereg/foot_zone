import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import AdminNav from '../../components/AdminNav';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail } from 'lucide-react';
import API_BASE_URL from '../../config/api';

const AdminOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, navigate]);

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/api/orders/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch order');

      const data = await response.json();
      setOrder(data);
      setNewStatus(data.status);
      setTrackingNumber(data.trackingNumber || '');
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/api/orders/${id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: newStatus,
          trackingNumber,
          note
        })
      });

      if (!response.ok) throw new Error('Failed to update order');

      alert('Order updated successfully! Customer has been notified via email.');
      fetchOrder();
      setNote('');
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Order not found</h2>
          <Link to="/admin/orders" className="text-blue-600 hover:underline">
            Back to orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-2 text-sm font-semibold hover:underline mb-6"
        >
          <ArrowLeft size={16} />
          Back to Orders
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-card shadow-md p-8"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Order {order.orderNumber}</h2>
                  <p className="text-gray-600">
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'Shipped' ? 'bg-purple-100 text-purple-800' :
                  order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {order.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold mb-2 text-sm text-gray-600">CUSTOMER</h3>
                  <p className="font-medium">{order.customer.firstName} {order.customer.lastName}</p>
                  <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                    <Mail size={14} />
                    {order.customer.email}
                  </p>
                  <p className="text-sm text-gray-600">{order.customer.phone}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-sm text-gray-600">SHIPPING ADDRESS</h3>
                  <p className="text-sm">
                    {order.shipping.address}<br />
                    {order.shipping.city}, {order.shipping.state} {order.shipping.zipCode}
                  </p>
                </div>
              </div>

              <h3 className="font-semibold mb-4">Order Items</h3>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex gap-4 pb-4 border-b last:border-b-0">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-sm text-gray-600">Size: {item.selectedSize} • Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{item.price} DZD</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 mt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{order.subtotal.toLocaleString()} DZD</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (19%)</span>
                  <span>{order.tax.toLocaleString()} DZD</span>
                </div>
                <div className="flex justify-between text-xl font-bold border-t pt-2">
                  <span>Total</span>
                  <span>{order.total.toLocaleString()} DZD</span>
                </div>
              </div>
            </motion.div>

            {order.statusHistory && order.statusHistory.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-card shadow-md p-8"
              >
                <h3 className="font-semibold mb-4">Status History</h3>
                <div className="space-y-3">
                  {order.statusHistory.map((history, index) => (
                    <div key={index} className="flex gap-4 text-sm">
                      <div className="text-gray-600 w-32">
                        {new Date(history.date).toLocaleDateString()}
                      </div>
                      <div className="flex-1">
                        <span className="font-semibold">{history.status}</span>
                        {history.note && <p className="text-gray-600">{history.note}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-card shadow-md p-6 sticky top-20"
            >
              <h3 className="font-bold text-lg mb-6">Update Order Status</h3>
              <form onSubmit={handleUpdateStatus}>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">Tracking Number (Optional)</label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Enter tracking number"
                    className="w-full px-4 py-3 border rounded-lg"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2">Note (Optional)</label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add a note about this status update"
                    rows="3"
                    className="w-full px-4 py-3 border rounded-lg"
                  />
                </div>

                <button
                  type="submit"
                  disabled={updating}
                  className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition disabled:opacity-50"
                >
                  {updating ? 'Updating...' : 'Update & Notify Customer'}
                </button>

                <p className="text-xs text-gray-600 mt-3 text-center">
                  Customer will receive an email notification
                </p>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
