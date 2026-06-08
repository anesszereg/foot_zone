# La Selection - Complete E-Commerce Platform Setup Guide

## 🚀 System Overview

**La Selection** is a full-stack e-commerce platform for football accessories and shoes with:
- ✅ React frontend with Tailwind CSS & Framer Motion
- ✅ Node.js/Express backend with MongoDB
- ✅ Admin dashboard for order management
- ✅ Email notifications (order confirmation & status updates)
- ✅ No payment gateway (payment on delivery)

---

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (installed and running)
- npm or yarn

---

## 🔧 Installation & Setup

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env

# Edit .env file with your settings:
# - PORT=5001
# - MONGODB_URI=mongodb://localhost:27017/la-selection
# - EMAIL_HOST, EMAIL_USER, EMAIL_PASSWORD (for Gmail SMTP)
# - ADMIN_EMAIL=admin@laselection.com
# - ADMIN_PASSWORD=admin123

# Start MongoDB (if not running)
brew services start mongodb-community  # macOS
# or
sudo systemctl start mongod  # Linux

# Seed the database with products and admin user
npm run seed

# Start the backend server
npm run dev
```

**Backend will run on:** `http://localhost:5001`

### 2. Frontend Setup

```bash
# Navigate to project root
cd ..

# Install dependencies (if not already done)
npm install

# Start the frontend development server
npm start
```

**Frontend will run on:** `http://localhost:3000`

---

## 🔐 Admin Credentials

**Admin Dashboard:** `http://localhost:3000/admin/login`

```
Email: admin@laselection.com
Password: admin123
```

---

## 📧 Email Configuration

To enable email notifications, update the `.env` file in the backend:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=La Selection <noreply@laselection.com>
```

**For Gmail:**
1. Enable 2-factor authentication
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the generated password in `EMAIL_PASSWORD`

---

## 🧪 Testing the System

### 1. Test Backend API

```bash
# Health check
curl http://localhost:5001/api/health

# Get all products
curl http://localhost:5001/api/products

# Admin login
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@laselection.com","password":"admin123"}'
```

### 2. Test Frontend Features

#### Customer Flow:
1. **Browse Products:** Visit `http://localhost:3000`
2. **View Product Details:** Click on any product
3. **Add to Cart:** Select size and add to cart
4. **Checkout:** Fill shipping information (no payment required)
5. **Order Confirmation:** View order success page
6. **Email:** Check email for order confirmation

#### Admin Flow:
1. **Login:** Visit `http://localhost:3000/admin/login`
2. **Dashboard:** View order statistics and recent orders
3. **Manage Orders:** Click "Orders" to see all orders
4. **Update Order Status:** 
   - Click on an order
   - Change status (Pending → Processing → Shipped → Delivered)
   - Add tracking number
   - Customer receives email notification automatically

---

## 📁 Project Structure

```
la-selection/
├── backend/
│   ├── src/
│   │   ├── models/          # MongoDB models (Product, Order, User)
│   │   ├── controllers/     # Business logic
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Authentication middleware
│   │   ├── config/          # Database configuration
│   │   └── utils/           # Email service & database seeding
│   ├── server.js            # Express server
│   ├── package.json
│   └── .env                 # Environment variables
│
├── src/
│   ├── components/          # Header, Footer
│   ├── context/             # Cart context (React Context API)
│   ├── data/                # Product data
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── SearchResults.jsx
│   │   ├── ProductDetails.jsx
│   │   ├── ShoppingCart.jsx
│   │   ├── Checkout.jsx     # No payment - shipping info only
│   │   ├── OrderSuccess.jsx
│   │   ├── AccountDashboard.jsx
│   │   ├── OrderHistory.jsx
│   │   ├── OrderDetails.jsx
│   │   └── admin/           # Admin dashboard pages
│   │       ├── AdminLogin.jsx
│   │       ├── AdminDashboard.jsx
│   │       ├── AdminOrders.jsx
│   │       └── AdminOrderDetail.jsx
│   └── App.js
│
└── package.json
```

---

## 🎯 API Endpoints

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get all orders (admin only)
- `GET /api/orders/stats` - Get order statistics (admin only)
- `GET /api/orders/:id` - Get order by ID
- `GET /api/orders/number/:orderNumber` - Get order by order number
- `PUT /api/orders/:id/status` - Update order status (admin only)

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get user profile (authenticated)

---

## 📊 Database Schema

### Product
```javascript
{
  name: String,
  brand: String (Adidas, Puma, New Balance),
  price: Number,
  category: String,
  image: String,
  images: [String],
  sizes: [String],
  colors: [String],
  description: String,
  features: [String],
  inStock: Boolean,
  stock: Number,
  rating: Number,
  reviews: Number,
  badge: String (NEW, SALE, BESTSELLER)
}
```

### Order
```javascript
{
  orderNumber: String (auto-generated),
  customer: {
    firstName, lastName, email, phone
  },
  shipping: {
    address, city, state, zipCode
  },
  items: [{
    productId, name, brand, price, image, selectedSize, quantity
  }],
  subtotal: Number,
  tax: Number,
  total: Number,
  status: String (Pending, Processing, Shipped, Delivered, Cancelled),
  trackingNumber: String,
  statusHistory: [{status, date, note}]
}
```

---

## ✨ Key Features

### Customer Features
- ✅ Product browsing with filters (brand, size, price)
- ✅ Product search
- ✅ Product details with image gallery
- ✅ Shopping cart management
- ✅ Checkout (shipping info only - no payment)
- ✅ Order confirmation with email
- ✅ Order tracking
- ✅ Order history

### Admin Features
- ✅ Secure admin login
- ✅ Dashboard with statistics
- ✅ Order management
- ✅ Order status updates
- ✅ Automatic email notifications to customers
- ✅ Search and filter orders
- ✅ View detailed order information

### Email Notifications
- ✅ Order confirmation email (sent to customer)
- ✅ Order status update emails (sent when admin updates status)
- ✅ Admin notification email (sent when new order is placed)

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5001
lsof -ti:5001 | xargs kill -9

# Or change port in backend/.env
PORT=5002
```

### MongoDB Connection Error
```bash
# Start MongoDB
brew services start mongodb-community  # macOS
sudo systemctl start mongod  # Linux

# Check MongoDB status
brew services list  # macOS
sudo systemctl status mongod  # Linux
```

### Email Not Sending
- Verify Gmail App Password is correct
- Check spam folder
- Ensure 2FA is enabled on Gmail account
- Check backend console for email errors

---

## 🎨 Customization

### Add New Products
```bash
# Edit backend/src/utils/seedDatabase.js
# Add products to the products array
# Then run:
cd backend
npm run seed
```

### Change Admin Credentials
```bash
# Edit backend/.env
ADMIN_EMAIL=your-admin@email.com
ADMIN_PASSWORD=your-secure-password

# Re-seed database
npm run seed
```

---

## 📝 Notes

- **No Payment Gateway:** Orders are placed without payment. Payment is collected on delivery.
- **Email Configuration:** Email notifications require valid SMTP credentials.
- **Database:** MongoDB must be running before starting the backend.
- **Ports:** Backend runs on 5001, Frontend on 3000.

---

## 🚀 Production Deployment

For production deployment:

1. Set `NODE_ENV=production` in backend/.env
2. Change `JWT_SECRET` to a strong random string
3. Use a production MongoDB instance (MongoDB Atlas)
4. Configure proper email service (SendGrid, AWS SES, etc.)
5. Build frontend: `npm run build`
6. Deploy backend to a server (Heroku, DigitalOcean, AWS)
7. Deploy frontend build to hosting (Netlify, Vercel, AWS S3)

---

## 📞 Support

For issues or questions:
- Check the troubleshooting section
- Review backend console logs
- Check browser console for frontend errors
- Verify MongoDB is running
- Ensure all environment variables are set correctly

---

**Enjoy your La Selection e-commerce platform! ⚽🛍️**
