import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Truck, RotateCcw, Shield } from 'lucide-react';
import { useCart } from '../context/CartContext';
import API_BASE_URL from '../config/api';
import Dialog from '../components/Dialog';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [dialog, setDialog] = useState({ open: false });
  const openDialog = (cfg) => setDialog({ open: true, ...cfg });
  const closeDialog = () => setDialog({ open: false });

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/${id}`);
      if (!response.ok) { setLoading(false); return; }
      const data = await response.json();
      if (!data._id) { setLoading(false); return; }
      setProduct(data);

      const allResponse = await fetch(`${API_BASE_URL}/api/products`);
      if (allResponse.ok) {
        const allData = await allResponse.json();
        const related = allData.filter(p => p.brand === data.brand && p._id !== data._id).slice(0, 4);
        setRelatedProducts(related);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Chargement du produit...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Produit introuvable</h2>
          <Link to="/" className="text-blue-600 hover:underline">Retour à l'accueil</Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      openDialog({ type: 'warning', title: 'Sélectionnez une taille', message: 'Veuillez choisir une taille avant d\'ajouter au panier.', onConfirm: closeDialog });
      return;
    }
    addToCart(product, selectedSize, quantity);
    openDialog({ type: 'success', title: 'Ajouté au panier !', message: `${product.name} (Taille ${selectedSize}) a été ajouté à votre panier.`, onConfirm: closeDialog });
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      openDialog({ type: 'warning', title: 'Sélectionnez une taille', message: 'Veuillez choisir une taille avant de continuer.', onConfirm: closeDialog });
      return;
    }
    addToCart(product, selectedSize, quantity);
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white py-4 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-black">Accueil</Link>
            <span>/</span>
            <Link to="/search" className="hover:text-black">Chaussures</Link>
            <span>/</span>
            <span className="text-black font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <div className="sticky top-20">
              {product.badge && (
                <span className="absolute top-4 left-4 bg-black text-white text-xs font-bold px-3 py-1.5 rounded-full z-10">
                  {product.badge}
                </span>
              )}
              <motion.div
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="aspect-square bg-gray-100 rounded-card overflow-hidden mb-4"
              >
                <img
                  src={product.images?.[selectedImage] || product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              
              <div className="grid grid-cols-4 gap-4">
                {(product.images || [product.image]).map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index ? 'border-black' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="mb-4">
              <span className="text-sm text-gray-600 uppercase tracking-wide">{product.brand}</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            <div className="flex items-center gap-4 mb-6">
              <div className="text-3xl font-bold">{product.price?.toLocaleString() || product.price} DZD</div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < Math.floor(product.rating || 0) ? 'text-yellow-400 text-xl' : 'text-gray-300 text-xl'}>
                    ★
                  </span>
                ))}
                <span className="text-sm text-gray-600 ml-2">({product.reviews || 0} Avis)</span>
              </div>
            </div>

            <p className="text-gray-700 mb-6 leading-relaxed">{product.description}</p>

            <div className="mb-6">
              <label className="block text-sm font-semibold mb-3">COULEUR</label>
              <div className="flex gap-3">
                {(product.colors || []).map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(index)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      selectedColor === index
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold mb-3">TAILLE (EU)</label>
              <div className="grid grid-cols-4 gap-3">
                {(product.sizes || []).map((sizeObj, idx) => {
                  const size = typeof sizeObj === 'string' ? sizeObj : sizeObj.size;
                  const stock = typeof sizeObj === 'object' ? sizeObj.stock : 999;
                  const isOutOfStock = stock === 0;
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => !isOutOfStock && setSelectedSize(size)}
                      disabled={isOutOfStock}
                      className={`px-4 py-3 border-2 rounded-lg font-semibold transition-all duration-300 relative ${
                        isOutOfStock
                          ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                          : selectedSize === size
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 hover:border-black'
                      }`}
                    >
                      {size}
                      {!isOutOfStock && stock < 5 && (
                        <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs px-1 rounded-full">
                          {stock}
                        </span>
                      )}
                      {isOutOfStock && (
                        <span className="text-xs block">Rupture</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-semibold mb-3">QUANTITÉ</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 border-2 rounded-lg hover:bg-gray-100 transition"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 h-12 text-center border-2 rounded-lg font-semibold"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 border-2 rounded-lg hover:bg-gray-100 transition"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-white border-2 border-black text-black py-4 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <ShoppingCart size={20} />
                Ajouter au Panier
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-black text-white py-4 rounded-lg font-semibold hover:bg-gray-900 transition-all duration-300"
              >
                Acheter Maintenant
              </button>
              <button className="w-14 h-14 border-2 rounded-lg hover:bg-gray-50 transition flex items-center justify-center">
                <Heart size={22} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8 p-6 bg-gray-50 rounded-card">
              <div className="text-center">
                <Truck className="mx-auto mb-2" size={24} />
                <p className="text-xs font-semibold">Livraison Gratuite</p>
                <p className="text-xs text-gray-600">Pour les commandes supérieures à 5 000 DZD</p>
              </div>
              <div className="text-center">
                <RotateCcw className="mx-auto mb-2" size={24} />
                <p className="text-xs font-semibold">Retours sous 30 jours</p>
                <p className="text-xs text-gray-600">Politique de retour simple</p>
              </div>
              <div className="text-center">
                <Shield className="mx-auto mb-2" size={24} />
                <p className="text-xs font-semibold">Garantie 2 ans</p>
                <p className="text-xs text-gray-600">Qualité garantie</p>
              </div>
            </div>

            <div className={`${product.inStock ? 'text-green-600' : 'text-red-600'} font-semibold mb-4`}>
              {product.inStock ? '✓ En stock' : '✗ Rupture de stock'}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-card p-8 mb-16">
          <div className="flex gap-8 border-b mb-8">
            {[['description', 'Description'], ['specifications', 'Spécifications'], ['reviews', 'Avis']].map(([tab, label]) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 font-semibold uppercase text-sm transition-all ${
                  activeTab === tab
                    ? 'border-b-2 border-black text-black'
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {activeTab === 'description' && (
            <div>
              <h3 className="text-2xl font-bold mb-4">Contrôle de Précision pour le Jeu Moderne</h3>
              <p className="text-gray-700 mb-6 leading-relaxed">{product.description}</p>
              <h4 className="font-semibold mb-3">Caractéristiques Clés :</h4>
              <ul className="space-y-2">
                {(product.features || []).map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="border-b py-3">
                <span className="font-semibold">Marque :</span>
                <span className="ml-4 text-gray-700">{product.brand}</span>
              </div>
              <div className="border-b py-3">
                <span className="font-semibold">Catégorie :</span>
                <span className="ml-4 text-gray-700">{product.category}</span>
              </div>
              <div className="border-b py-3">
                <span className="font-semibold">Tailles disponibles :</span>
                <span className="ml-4 text-gray-700">{product.sizes.join(', ')}</span>
              </div>
              <div className="border-b py-3">
                <span className="font-semibold">Couleurs :</span>
                <span className="ml-4 text-gray-700">{product.colors.join(', ')}</span>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="text-5xl font-bold">{product.rating}</div>
                <div>
                  <div className="flex gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < Math.floor(product.rating) ? 'text-yellow-400 text-xl' : 'text-gray-300 text-xl'}>
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-600">{product.reviews} avis</p>
                </div>
              </div>
              <p className="text-gray-600">Les avis clients seront affichés ici.</p>
            </div>
          )}
        </div>

        {relatedProducts.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Vous Aimerez Aussi</h2>
              <Link to="/search" className="text-sm font-semibold hover:underline">Voir Tout</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(relatedProduct => (
                <Link
                  key={relatedProduct._id}
                  to={`/product/${relatedProduct._id}`}
                  className="bg-white rounded-card overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative aspect-square bg-gray-100">
                    {relatedProduct.badge && (
                      <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                        {relatedProduct.badge}
                      </span>
                    )}
                    <img
                      src={relatedProduct.images?.[0] || relatedProduct.image}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover hover:scale-110 transition-all duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">{relatedProduct.name}</h3>
                    <p className="text-4xl font-bold mb-4">{relatedProduct.price.toLocaleString()} DZD</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <Dialog
        isOpen={dialog.open}
        type={dialog.type}
        title={dialog.title}
        message={dialog.message}
        onConfirm={dialog.onConfirm}
        confirmLabel="OK"
      />
    </div>
  );
};

export default ProductDetails;
