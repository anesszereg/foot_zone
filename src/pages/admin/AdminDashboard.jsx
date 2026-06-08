import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, DollarSign, ShoppingCart, TrendingUp, LogOut, Users } from 'lucide-react';
import API_BASE_URL from '../../config/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    fetchStats();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/api/orders/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch stats');

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600'
    },
    {
      label: 'Total Revenue',
      value: `${(stats?.totalRevenue || 0).toLocaleString()} DZD`,
      icon: DollarSign,
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600'
    },
    {
      label: 'Pending Orders',
      value: stats?.pendingOrders || 0,
      icon: Package,
      color: 'yellow',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600'
    },
    {
      label: 'Delivered',
      value: stats?.deliveredOrders || 0,
      icon: TrendingUp,
      color: 'purple',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold">La Selection Admin</h1>
              <div className="hidden md:flex gap-6">
                <Link to="/admin/dashboard" className="font-semibold text-black">Dashboard</Link>
                <Link to="/admin/orders" className="text-gray-600 hover:text-black transition">Orders</Link>
                <Link to="/admin/products" className="text-gray-600 hover:text-black transition">Products</Link>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Dashboard Overview</h2>
          <p className="text-gray-600">Welcome back! Here's what's happening with your store.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-card shadow-md p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 ${stat.bgColor} rounded-lg`}>
                  <stat.icon className={stat.textColor} size={24} />
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-card shadow-md p-6"
          >
            <h3 className="text-xl font-bold mb-6">Recent Orders</h3>
            {stats?.recentOrders && stats.recentOrders.length > 0 ? (
              <div className="space-y-4">
                {stats.recentOrders.map(order => (
                  <Link
                    key={order._id}
                    to={`/admin/orders/${order._id}`}
                    className="block border rounded-lg p-4 hover:bg-gray-50 transition"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold">{order.orderNumber}</p>
                        <p className="text-sm text-gray-600">
                          {order.customer.firstName} {order.customer.lastName}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'Shipped' ? 'bg-purple-100 text-purple-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">{order.items.length} items</span>
                      <span className="font-bold">{order.total.toLocaleString()} DZD</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">No recent orders</p>
            )}
            <Link
              to="/admin/orders"
              className="block text-center mt-6 text-sm font-semibold text-blue-600 hover:underline"
            >
              View All Orders →
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-card shadow-md p-6"
          >
            <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/admin/orders"
                className="p-6 border-2 rounded-lg hover:border-black transition text-center"
              >
                <Package className="mx-auto mb-3" size={32} />
                <p className="font-semibold">Manage Orders</p>
              </Link>
              <Link
                to="/admin/products"
                className="p-6 border-2 rounded-lg hover:border-black transition text-center"
              >
                <ShoppingCart className="mx-auto mb-3" size={32} />
                <p className="font-semibold">Manage Products</p>
              </Link>
              <div className="p-6 border-2 rounded-lg hover:border-black transition text-center cursor-pointer">
                <Users className="mx-auto mb-3" size={32} />
                <p className="font-semibold">Customers</p>
              </div>
              <div className="p-6 border-2 rounded-lg hover:border-black transition text-center cursor-pointer">
                <TrendingUp className="mx-auto mb-3" size={32} />
                <p className="font-semibold">Analytics</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
