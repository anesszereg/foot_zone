const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  brand: {
    type: String,
    required: true,
    enum: ['Adidas', 'Puma', 'New Balance']
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Shoes', 'Balls', 'Socks', 'Apparel', 'Accessories']
  },
  image: {
    type: String,
    required: true
  },
  images: [{
    type: String
  }],
  sizes: [{
    size: {
      type: String,
      required: true
    },
    stock: {
      type: Number,
      default: 0,
      min: 0
    }
  }],
  colors: [{
    type: String
  }],
  description: {
    type: String,
    required: true
  },
  features: [{
    type: String
  }],
  inStock: {
    type: Boolean,
    default: true
  },
  stock: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: {
    type: Number,
    default: 0
  },
  badge: {
    type: String,
    enum: ['NEW', 'SALE', 'BESTSELLER', '']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
