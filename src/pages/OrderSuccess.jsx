import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, Mail, Download } from 'lucide-react';
import API_BASE_URL from '../config/api';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/orders/number/${orderId}`);
        if (response.ok) {
          const data = await response.json();
          setOrder(data);
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Chargement...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Commande introuvable</h2>
          <Link to="/" className="text-blue-600 hover:underline">Retour à l'accueil</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="text-center mb-8"
        >
          <CheckCircle className="mx-auto text-green-600 mb-4" size={80} />
          <h1 className="text-4xl font-bold mb-2">Commande Confirmée !</h1>
          <p className="text-gray-600 text-lg">Merci pour votre achat</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-card shadow-md p-8 mb-6"
        >
          <div className="border-b pb-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold mb-2">Commande #{order.id}</h2>
                <p className="text-gray-600">Passée le {new Date(order.date).toLocaleDateString('fr-FR')}</p>
              </div>
              <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full font-semibold text-sm">
                {order.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Adresse de livraison</h3>
                <p className="text-gray-600 text-sm">
                  {order.customer.firstName} {order.customer.lastName}<br />
                  {order.shipping.address}<br />
                  {order.shipping.city}, {order.shipping.state} {order.shipping.zipCode}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Informations de contact</h3>
                <p className="text-gray-600 text-sm">
                  {order.customer.email}<br />
                  {order.customer.phone}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-4">Articles commandés</h3>
            <div className="space-y-4">
              {order.items.map(item => (
                <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{item.name}</h4>
                    <p className="text-sm text-gray-600">Taille : {item.selectedSize} • Qté : {item.quantity}</p>
                  </div>
                  <div className="font-semibold">{item.price}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Sous-total</span>
                <span>{order.subtotal.toLocaleString()} DZD</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Livraison</span>
                <span className="text-green-600">Gratuite</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>TVA (19%)</span>
                <span>{order.tax.toLocaleString()} DZD</span>
              </div>
            </div>
            <div className="flex justify-between items-center text-xl font-bold border-t pt-4">
              <span>Total</span>
              <span>{order.total.toLocaleString()} DZD</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-white rounded-card shadow-md p-6 text-center">
            <Mail className="mx-auto mb-3 text-blue-600" size={32} />
            <h3 className="font-semibold mb-2">Confirmation par e-mail</h3>
            <p className="text-sm text-gray-600">Vérifiez votre boîte mail pour les détails</p>
          </div>
          <div className="bg-white rounded-card shadow-md p-6 text-center">
            <Package className="mx-auto mb-3 text-green-600" size={32} />
            <h3 className="font-semibold mb-2">Suivre votre commande</h3>
            <p className="text-sm text-gray-600">Nous vous enverrons les informations de suivi bientôt</p>
          </div>
          <div className="bg-white rounded-card shadow-md p-6 text-center">
            <Download className="mx-auto mb-3 text-purple-600" size={32} />
            <h3 className="font-semibold mb-2">Télécharger le reçu</h3>
            <button className="text-sm text-blue-600 hover:underline mt-1">Télécharger le PDF</button>
          </div>
        </motion.div>

        <div className="flex gap-4 justify-center">
          <Link
            to="/account/orders"
            className="px-8 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-900 transition"
          >
            Voir l'historique des commandes
          </Link>
          <Link
            to="/"
            className="px-8 py-3 border-2 border-black rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Continuer les achats
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
