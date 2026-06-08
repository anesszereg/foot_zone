import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    price: '',
    category: 'Shoes',
    image: '',
    images: [''],
    sizes: [],
    colors: [],
    description: '',
    features: [''],
    stock: '',
    rating: 4.5,
    reviews: 0,
    badge: ''
  });

  const [loading, setLoading] = useState(false);
  const [sizeInput, setSizeInput] = useState('');
  const [sizeStockInput, setSizeStockInput] = useState('');
  const [colorInput, setColorInput] = useState('');

  useEffect(() => {
    if (isEdit) {
      fetchProduct();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEdit]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/products/${id}`);
      const data = await response.json();
      setFormData({
        ...data,
        images: data.images.length > 0 ? data.images : [''],
        features: data.features.length > 0 ? data.features : ['']
      });
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
  };

  const removeImageField = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const addFeatureField = () => {
    setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
  };

  const removeFeatureField = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const addSize = () => {
    if (sizeInput && sizeStockInput) {
      const stockNum = parseInt(sizeStockInput);
      if (stockNum >= 0 && !formData.sizes.find(s => s.size === sizeInput)) {
        setFormData(prev => ({ 
          ...prev, 
          sizes: [...prev.sizes, { size: sizeInput, stock: stockNum }] 
        }));
        setSizeInput('');
        setSizeStockInput('');
      }
    }
  };

  const removeSize = (sizeToRemove) => {
    setFormData(prev => ({ 
      ...prev, 
      sizes: prev.sizes.filter(s => s.size !== sizeToRemove) 
    }));
  };

  const addColor = () => {
    if (colorInput && !formData.colors.includes(colorInput)) {
      setFormData(prev => ({ ...prev, colors: [...prev.colors, colorInput] }));
      setColorInput('');
    }
  };

  const removeColor = (color) => {
    setFormData(prev => ({ ...prev, colors: prev.colors.filter(c => c !== color) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      const url = isEdit 
        ? `http://localhost:5001/api/products/${id}`
        : 'http://localhost:5001/api/products';
      
      const method = isEdit ? 'PUT' : 'POST';

      const totalStock = formData.sizes.reduce((sum, s) => sum + (s.stock || 0), 0);
      
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: totalStock,
        rating: parseFloat(formData.rating),
        reviews: parseInt(formData.reviews),
        images: formData.images.filter(img => img.trim() !== ''),
        features: formData.features.filter(f => f.trim() !== ''),
        image: formData.images[0] || formData.image,
        inStock: totalStock > 0
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });

      if (response.ok) {
        alert(isEdit ? 'Product updated successfully!' : 'Product created successfully!');
        navigate('/admin/products');
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'Failed to save product'}`);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold">La Selection Admin</h1>
              <div className="flex space-x-4">
                <Link to="/admin/dashboard" className="text-gray-600 hover:text-black px-3 py-2 rounded-md text-sm font-medium">
                  Dashboard
                </Link>
                <Link to="/admin/orders" className="text-gray-600 hover:text-black px-3 py-2 rounded-md text-sm font-medium">
                  Orders
                </Link>
                <Link to="/admin/products" className="text-black border-b-2 border-black px-3 py-2 rounded-md text-sm font-medium">
                  Products
                </Link>
              </div>
            </div>
            <button onClick={handleLogout} className="text-red-600 hover:text-red-700 text-sm font-medium">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/admin/products" className="flex items-center gap-2 text-gray-600 hover:text-black mb-6">
          <ArrowLeft size={20} />
          Back to Products
        </Link>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6">{isEdit ? 'Edit Product' : 'Add New Product'}</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Brand *</label>
                <select
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="">Select Brand</option>
                  <option value="Adidas">Adidas</option>
                  <option value="Puma">Puma</option>
                  <option value="New Balance">New Balance</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Price (DZD) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="Shoes">Shoes</option>
                  <option value="Apparel">Apparel</option>
                  <option value="Balls">Balls</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Stock *</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Badge (Optional)</label>
                <select
                  name="badge"
                  value={formData.badge}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="">No Badge</option>
                  <option value="NEW">NEW</option>
                  <option value="SALE">SALE</option>
                  <option value="BESTSELLER">BESTSELLER</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="3"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Images (URLs)</label>
              {formData.images.map((image, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  {formData.images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageField(index)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addImageField}
                className="mt-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                + Add Image
              </button>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Sizes & Stock</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={sizeInput}
                  onChange={(e) => setSizeInput(e.target.value)}
                  placeholder="Size (e.g., 42, M, L)"
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
                <input
                  type="number"
                  value={sizeStockInput}
                  onChange={(e) => setSizeStockInput(e.target.value)}
                  placeholder="Stock qty"
                  min="0"
                  className="w-32 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
                <button
                  type="button"
                  onClick={addSize}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                >
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {formData.sizes.map((sizeObj, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                    <div className="flex items-center gap-4">
                      <span className="font-semibold">Size: {sizeObj.size}</span>
                      <span className="text-gray-600">Stock: {sizeObj.stock} units</span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => removeSize(sizeObj.size)} 
                      className="text-red-600 hover:text-red-800 font-bold"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              {formData.sizes.length > 0 && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <span className="font-semibold">Total Stock: {formData.sizes.reduce((sum, s) => sum + (s.stock || 0), 0)} units</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Colors</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={colorInput}
                  onChange={(e) => setColorInput(e.target.value)}
                  placeholder="Enter color"
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
                />
                <button
                  type="button"
                  onClick={addColor}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.colors.map((color, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-200 rounded-full flex items-center gap-2">
                    {color}
                    <button type="button" onClick={() => removeColor(color)} className="text-red-600 hover:text-red-800">×</button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Features</label>
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    placeholder="Enter feature"
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  {formData.features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeatureField(index)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addFeatureField}
                className="mt-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                + Add Feature
              </button>
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-all duration-300 disabled:bg-gray-400"
              >
                {loading ? 'Saving...' : (isEdit ? 'Update Product' : 'Create Product')}
              </button>
              <Link
                to="/admin/products"
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-300"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminProductForm;
