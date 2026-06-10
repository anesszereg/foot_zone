import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Search, Filter } from 'lucide-react';
import { useCart } from '../context/CartContext';

const OrderHistory = () => {
  const { orders } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tout');

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'Tout' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statuses = ['Tout', 'En traitement', 'Expédié', 'Livré', 'Annulé'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold">Historique des commandes</h1>
          <p className="text-gray-600 mt-2">Consultez et suivez toutes vos commandes</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-card shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher par numéro de commande..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-600" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border rounded-lg bg-white"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {filteredOrders.length > 0 ? (
          <div className="space-y-6">
            {filteredOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-card shadow-md overflow-hidden"
              >
                <div className="p-6 border-b bg-gray-50">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-lg mb-1">Commande #{order.id}</h3>
                      <p className="text-sm text-gray-600">
                        Passée le {new Date(order.date).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'Shipped' ? 'bg-purple-100 text-purple-800' :
                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.status}
                      </span>
                      <span className="font-bold text-lg">{order.total.toLocaleString()} DZD</span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-semibold mb-2 text-sm text-gray-600">ADRESSE DE LIVRAISON</h4>
                      <p className="text-sm">
                        {order.customer.firstName} {order.customer.lastName}<br />
                        {order.shipping.address}<br />
                        {order.shipping.city}, {order.shipping.state} {order.shipping.zipCode}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-sm text-gray-600">CONTACT</h4>
                      <p className="text-sm">
                        {order.customer.email}<br />
                        {order.customer.phone}
                      </p>
                    </div>
                  </div>

                  <h4 className="font-semibold mb-4">Articles ({order.items.length})</h4>
                  <div className="space-y-4 mb-6">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-semibold">{item.name}</h5>
                          <p className="text-sm text-gray-600">
                            Taille : {item.selectedSize} • Quantité : {item.quantity}
                          </p>
                        </div>
                        <div className="font-semibold">{item.price}</div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    <Link
                      to={`/account/orders/${order.id}`}
                      className="flex-1 text-center bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition"
                    >
                      Voir les détails
                    </Link>
                    <button className="flex-1 border-2 border-black py-3 rounded-lg font-semibold hover:bg-gray-50 transition">
                      Suivre la commande
                    </button>
                    <button className="flex-1 border-2 border-gray-300 py-3 rounded-lg font-semibold hover:border-black transition">
                      Récommander
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-card shadow-md p-16 text-center">
            <Package className="mx-auto mb-4 text-gray-400" size={64} />
            <h2 className="text-2xl font-bold mb-2">Aucune commande trouvée</h2>
            <p className="text-gray-600 mb-6">
              {searchQuery || statusFilter !== 'Tout' 
                ? 'Essayez de modifier vos filtres' 
                : 'Commencez à acheter pour voir vos commandes ici'}
            </p>
            <Link
              to="/"
              className="inline-block bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-900 transition"
            >
              Commencer les achats
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
