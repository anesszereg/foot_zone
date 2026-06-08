const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendOrderConfirmation = async (order) => {
  const itemsList = order.items.map(item => 
    `<tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <strong>${item.name}</strong><br>
        Size: ${item.selectedSize} | Qty: ${item.quantity}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
        ${item.price} DZD
      </td>
    </tr>`
  ).join('');

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: order.customer.email,
    subject: `Order Confirmation - ${order.orderNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #000; color: #fff; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .order-details { background: #fff; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          table { width: 100%; border-collapse: collapse; }
          .total { font-size: 18px; font-weight: bold; padding: 15px 10px; background: #f5f5f5; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>FOOT ZONE</h1>
            <p>Order Confirmation</p>
          </div>
          
          <div class="content">
            <h2>Thank you for your order!</h2>
            <p>Hi ${order.customer.firstName},</p>
            <p>We've received your order and will process it shortly. You'll receive another email when your order ships.</p>
            
            <div class="order-details">
              <h3>Order #${order.orderNumber}</h3>
              <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
              
              <h4>Shipping Address:</h4>
              <p>
                ${order.customer.firstName} ${order.customer.lastName}<br>
                ${order.shipping.address}<br>
                ${order.shipping.city}, ${order.shipping.state} ${order.shipping.zipCode}<br>
                Phone: ${order.customer.phone}
              </p>
              
              <h4>Order Items:</h4>
              <table>
                ${itemsList}
                <tr class="total">
                  <td>Subtotal:</td>
                  <td style="text-align: right;">${order.subtotal.toLocaleString()} DZD</td>
                </tr>
                <tr class="total">
                  <td>Tax (19%):</td>
                  <td style="text-align: right;">${order.tax.toLocaleString()} DZD</td>
                </tr>
                <tr class="total" style="background: #000; color: #fff;">
                  <td>Total:</td>
                  <td style="text-align: right;">${order.total.toLocaleString()} DZD</td>
                </tr>
              </table>
            </div>
            
            <p>If you have any questions, please contact us at ${process.env.EMAIL_FROM}</p>
          </div>
          
          <div class="footer">
            <p>© 2026 Foot Zone. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent to:', order.customer.email);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

const sendOrderStatusUpdate = async (order, newStatus) => {
  const statusMessages = {
    'Processing': 'Your order is being processed and will be shipped soon.',
    'Shipped': `Your order has been shipped! Tracking number: ${order.trackingNumber || 'Will be updated soon'}`,
    'Delivered': 'Your order has been delivered. We hope you enjoy your purchase!',
    'Cancelled': 'Your order has been cancelled. If you have any questions, please contact us.'
  };

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: order.customer.email,
    subject: `Order Update - ${order.orderNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #000; color: #fff; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .status-badge { display: inline-block; padding: 10px 20px; background: #4CAF50; color: white; border-radius: 5px; font-weight: bold; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>FOOT ZONE</h1>
            <p>Order Status Update</p>
          </div>
          
          <div class="content">
            <h2>Order #${order.orderNumber}</h2>
            <p>Hi ${order.customer.firstName},</p>
            
            <p>Your order status has been updated to:</p>
            <p><span class="status-badge">${newStatus}</span></p>
            
            <p>${statusMessages[newStatus]}</p>
            
            ${order.trackingNumber ? `<p><strong>Tracking Number:</strong> ${order.trackingNumber}</p>` : ''}
            
            <p>You can track your order status anytime by logging into your account.</p>
          </div>
          
          <div class="footer">
            <p>© 2026 Foot Zone. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Status update email sent to:', order.customer.email);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

const sendAdminNotification = async (order) => {
  const itemsList = order.items.map(item => 
    `<tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <strong>${item.name}</strong><br>
        <small>Brand: ${item.brand} | Size: ${item.selectedSize} | Qty: ${item.quantity}</small>
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
        ${item.price.toLocaleString()} DZD
      </td>
    </tr>`
  ).join('');

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.ADMIN_EMAIL,
    subject: `New Order Received - ${order.orderNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #00C853; color: #fff; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .order-details { background: #fff; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #00C853; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          table { width: 100%; border-collapse: collapse; }
          .total { font-size: 18px; font-weight: bold; padding: 15px 10px; background: #f5f5f5; }
          .btn { display: inline-block; padding: 12px 24px; background: #00C853; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🛒 NEW ORDER</h1>
            <p>Foot Zone - Algeria</p>
          </div>
          
          <div class="content">
            <div class="order-details">
              <h3>Order #${order.orderNumber}</h3>
              <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
              <p><strong>Status:</strong> <span style="color: #00C853; font-weight: bold;">${order.status}</span></p>
              
              <h4>Customer Information:</h4>
              <p>
                <strong>Name:</strong> ${order.customer.firstName} ${order.customer.lastName}<br>
                <strong>Email:</strong> ${order.customer.email}<br>
                <strong>Phone:</strong> ${order.customer.phone}
              </p>
              
              <h4>Shipping Information:</h4>
              <p>
                <strong>City:</strong> ${order.shipping.city}<br>
                <strong>Wilaya:</strong> ${order.shipping.state}
              </p>
              
              <h4>Order Items (${order.items.length}):</h4>
              <table>
                ${itemsList}
                <tr class="total">
                  <td>Subtotal:</td>
                  <td style="text-align: right;">${order.subtotal.toLocaleString()} DZD</td>
                </tr>
                <tr class="total" style="background: #00C853; color: #fff;">
                  <td>Total:</td>
                  <td style="text-align: right;">${order.total.toLocaleString()} DZD</td>
                </tr>
              </table>
            </div>
            
            <div style="text-align: center;">
              <a href="http://localhost:3000/admin/orders/${order._id}" class="btn">View Order in Admin Panel</a>
            </div>
          </div>
          
          <div class="footer">
            <p>© 2024 Foot Zone. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Admin notification sent to:', process.env.ADMIN_EMAIL);
    return true;
  } catch (error) {
    console.error('Error sending admin notification:', error);
    return false;
  }
};

module.exports = {
  sendOrderConfirmation,
  sendOrderStatusUpdate,
  sendAdminNotification
};
