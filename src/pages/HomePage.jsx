import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedSize, setSelectedSize] = useState('All');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const brands = ['Adidas', 'Puma', 'New Balance'];
  const sizes = ['38', '39', '40', '41', '42', '43', '44', '45'];

  const categories = [
    { name: 'Adidas', image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600&q=80' },
    { name: 'Puma', image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80' },
    { name: 'New Balance', image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=80' },
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const brandMatch = selectedBrand === 'All' || product.brand === selectedBrand;
    const sizeMatch = selectedSize === 'All' || product.sizes.includes(selectedSize);
    return brandMatch && sizeMatch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative h-[70vh] overflow-hidden mb-16"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1200&q=80)' }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        
        <div className="relative h-full flex items-center justify-center text-center text-white px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-7xl font-bold mb-4 tracking-tight">La Selection</h1>
            <p className="text-2xl md:text-3xl mb-8 font-light">Premium Football Gear</p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-black px-10 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg"
            >
              Shop Now
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Our Brands</h2>
        </motion.div>
        <div className="grid grid-cols-3 gap-8 mb-16">
          {brands.map((brand, index) => (
            <motion.div key={brand} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="text-center">
              <h3 className="text-3xl font-bold text-gray-400 hover:text-black transition-all duration-300 cursor-pointer">{brand.toUpperCase()}</h3>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Shop by Category</h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div key={category.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} whileHover={{ scale: 1.03 }} className="relative h-80 rounded-card overflow-hidden cursor-pointer shadow-lg group">
              <img src={category.image} alt={category.name} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-white text-3xl font-bold">{category.name}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Featured Products</h2>
        </motion.div>

        <div className="flex flex-wrap gap-3 justify-center mb-8">
          <button onClick={() => setSelectedBrand('All')} className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${selectedBrand === 'All' ? 'bg-black text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>All Brands</button>
          {brands.map(brand => (
            <button key={brand} onClick={() => setSelectedBrand(brand)} className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${selectedBrand === brand ? 'bg-black text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>{brand}</button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-12">
          <button onClick={() => setSelectedSize('All')} className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${selectedSize === 'All' ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>All Sizes</button>
          {sizes.map(size => (
            <button key={size} onClick={() => setSelectedSize(size)} className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${selectedSize === size ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>{size}</button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {filteredProducts.map((product, index) => (
            <motion.div key={product._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }} className="group cursor-pointer bg-white rounded-card overflow-hidden shadow-md transition-all duration-300">
              <Link to={`/product/${product._id}`}>
                <div className="relative aspect-square bg-gray-100 overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500" />
                  <button onClick={(e) => e.preventDefault()} className="absolute top-4 right-4 bg-black text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                    <ShoppingCart size={20} />
                  </button>
                </div>
              </Link>
              <div className="p-4">
                <Link to={`/product/${product._id}`}>
                  <h3 className="font-semibold text-lg mb-2 hover:text-gray-600 transition">{product.name}</h3>
                </Link>
                <p className="text-2xl font-bold mb-3">{product.price.toLocaleString()} DZD</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((sizeObj, idx) => (
                    <span key={idx} className="px-3 py-1 bg-gray-100 text-sm font-medium rounded-md hover:bg-black hover:text-white transition-all duration-300 cursor-pointer">
                      {typeof sizeObj === 'string' ? sizeObj : sizeObj.size}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/search">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-black text-white px-10 py-4 rounded-lg font-semibold hover:bg-gray-900 transition-all duration-300 shadow-lg">
              Plus de Produit
            </motion.button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
