import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import AdminNav from '../../components/AdminNav';
import Dialog from '../../components/Dialog';
import { ArrowLeft, Upload, X, Image } from 'lucide-react';
import API_BASE_URL from '../../config/api';

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
  const [uploadingIndex, setUploadingIndex] = useState(null);
  const [dialog, setDialog] = useState({ open: false });
  const openDialog = (cfg) => setDialog({ open: true, ...cfg });
  const closeDialog = () => setDialog({ open: false });
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
      const response = await fetch(`${API_BASE_URL}/api/products/${id}`);
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

  const handleImageFileUpload = async (index, file) => {
    if (!file) return;
    setUploadingIndex(index);
    try {
      const token = localStorage.getItem('adminToken');
      const uploadData = new FormData();
      uploadData.append('image', file);
      const response = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: uploadData
      });
      if (response.ok) {
        const { url } = await response.json();
        handleImageChange(index, url);
      } else {
        openDialog({ type: 'error', title: 'Importation échouée', message: 'Impossible d\'importer l\'image. Veuillez réessayer.', onConfirm: closeDialog });
      }
    } catch (err) {
      openDialog({ type: 'error', title: 'Erreur d\'importation', message: err.message, onConfirm: closeDialog });
    } finally {
      setUploadingIndex(null);
    }
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
        ? `${API_BASE_URL}/api/products/${id}`
        : `${API_BASE_URL}/api/products`;
      
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
        openDialog({ type: 'success', title: isEdit ? 'Produit mis à jour !' : 'Produit créé !', message: 'Redirection vers la liste des produits...', onConfirm: () => navigate('/admin/products') });
      } else {
        const error = await response.json();
        openDialog({ type: 'error', title: 'Enregistrement échoué', message: error.message || 'Impossible d\'enregistrer le produit', onConfirm: closeDialog });
      }
    } catch (error) {
      console.error('Error saving product:', error);
      openDialog({ type: 'error', title: 'Erreur', message: 'Une erreur est survenue lors de l\'enregistrement du produit.', onConfirm: closeDialog });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/admin/products" className="flex items-center gap-2 text-gray-600 hover:text-black mb-6">
          <ArrowLeft size={20} />
          Retour aux produits
        </Link>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6">{isEdit ? 'Modifier le produit' : 'Ajouter un nouveau produit'}</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Nom du produit *</label>
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
                <label className="block text-sm font-semibold mb-2">Marque *</label>
                <select
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="">Sélectionnez la marque</option>
                  <option value="Adidas">Adidas</option>
                  <option value="Puma">Puma</option>
                  <option value="New Balance">New Balance</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Prix (DZD) *</label>
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
                <label className="block text-sm font-semibold mb-2">Catégorie *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="Shoes">Chaussures</option>
                  <option value="Apparel">Vêtements</option>
                  <option value="Balls">Ballons</option>
                  <option value="Accessories">Accessoires</option>
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
                <label className="block text-sm font-semibold mb-2">Badge (facultatif)</label>
                <select
                  name="badge"
                  value={formData.badge}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="">Aucun badge</option>
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
              <label className="block text-sm font-semibold mb-3">Images</label>
              <div className="space-y-3">
                {formData.images.map((image, index) => (
                  <div key={index} className="border rounded-xl p-4 bg-gray-50">
                    <div className="flex gap-4 items-start">
                      {/* Preview */}
                      <div className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden flex-shrink-0 bg-white">
                        {image ? (
                          <img src={image} alt="preview" className="w-full h-full object-cover rounded-lg" onError={e => e.target.style.display='none'} />
                        ) : (
                          <Image size={24} className="text-gray-300" />
                        )}
                      </div>

                      <div className="flex-1 space-y-2">
                        {/* File upload button */}
                        <label className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed cursor-pointer transition w-full justify-center text-sm font-semibold ${
                          uploadingIndex === index
                            ? 'border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed'
                            : 'border-black hover:bg-black hover:text-white'
                        }`}>
                          <Upload size={16} />
                          {uploadingIndex === index ? 'Importation...' : 'Importer depuis l\'appareil'}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={uploadingIndex !== null}
                            onChange={(e) => e.target.files[0] && handleImageFileUpload(index, e.target.files[0])}
                          />
                        </label>

                        {/* URL input */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400 font-semibold uppercase">ou URL</span>
                          <input
                            type="text"
                            value={image}
                            onChange={(e) => handleImageChange(index, e.target.value)}
                            placeholder="https://example.com/image.jpg"
                            className="flex-1 px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                          />
                        </div>
                      </div>

                      {formData.images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeImageField(index)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition flex-shrink-0"
                        >
                          <X size={18} />
                        </button>
                      )}
                    </div>
                    {index === 0 && <p className="text-xs text-gray-400 mt-2">La première image est utilisée comme image principale du produit</p>}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addImageField}
                className="mt-3 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-black hover:text-black w-full transition"
              >
                + Ajouter une autre image
              </button>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Tailles & Stock</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={sizeInput}
                  onChange={(e) => setSizeInput(e.target.value)}
                  placeholder="Taille (ex : 42, M, L)"
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
                <input
                  type="number"
                  value={sizeStockInput}
                  onChange={(e) => setSizeStockInput(e.target.value)}
                  placeholder="Qté stock"
                  min="0"
                  className="w-32 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
                <button
                  type="button"
                  onClick={addSize}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                >
                  Ajouter
                </button>
              </div>
              <div className="space-y-2">
                {formData.sizes.map((sizeObj, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                    <div className="flex items-center gap-4">
                      <span className="font-semibold">Taille : {sizeObj.size}</span>
                      <span className="text-gray-600">Stock : {sizeObj.stock} unités</span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => removeSize(sizeObj.size)} 
                      className="text-red-600 hover:text-red-800 font-bold"
                    >
                      Supprimer
                    </button>
                  </div>
                ))}
              </div>
              {formData.sizes.length > 0 && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <span className="font-semibold">Stock total : {formData.sizes.reduce((sum, s) => sum + (s.stock || 0), 0)} unités</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Couleurs</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={colorInput}
                  onChange={(e) => setColorInput(e.target.value)}
                  placeholder="Entrez une couleur"
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
                />
                <button
                  type="button"
                  onClick={addColor}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                >
                  Ajouter
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
              <label className="block text-sm font-semibold mb-2">Caractéristiques</label>
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    placeholder="Entrez une caractéristique"
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  {formData.features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeatureField(index)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      Supprimer
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addFeatureField}
                className="mt-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                + Ajouter une caractéristique
              </button>
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-all duration-300 disabled:bg-gray-400"
              >
                {loading ? 'Enregistrement...' : (isEdit ? 'Mettre à jour le produit' : 'Créer le produit')}
              </button>
              <Link
                to="/admin/products"
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-300"
              >
                Annuler
              </Link>
            </div>
          </form>
        </div>
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

export default AdminProductForm;
