import { CartItem, Order, Product } from '../types';

export const BOUTIQUE_PHONE = '917337422054';

export const getBaseWhatsAppUrl = () => {
  return `https://wa.me/${BOUTIQUE_PHONE}?text=Hi%20Akaay%20Boutique`;
};

export const getCartWhatsAppUrl = (cart: CartItem[], products: Product[], total: number) => {
  if (cart.length === 0) {
    return getBaseWhatsAppUrl();
  }

  let text = `Namaste Akaay Boutique! I would like to place an order for the following items:\n\n`;

  cart.forEach((item, index) => {
    const product = products.find((p) => p.id === item.productId);
    const title = product ? product.name : 'Handcrafted Ensemble';
    const price = product ? product.price : 0;
    text += `${index + 1}. *${title}*\n   Size: ${item.size} | Color: ${item.color}\n   Qty: ${item.quantity} × ₹${price.toLocaleString('en-IN')}\n\n`;
  });

  text += `*Total Order Value:* ₹${total.toLocaleString('en-IN')}\n`;
  text += `Please assist me with completing this order and sharing delivery timeline. Thank you!`;

  return `https://wa.me/${BOUTIQUE_PHONE}?text=${encodeURIComponent(text)}`;
};

export const getOrderWhatsAppUrl = (order: Order) => {
  let text = `Namaste Akaay Boutique! Inquiry regarding Order #${order.id}\n\n`;
  text += `*Customer:* ${order.address.fullName} (${order.customerPhone})\n`;
  text += `*Status:* ${order.status}\n`;
  text += `*Items:*\n`;

  order.items.forEach((item, i) => {
    text += `${i + 1}. ${item.name} (${item.size}, ${item.color}) × ${item.quantity} - ₹${item.price.toLocaleString('en-IN')}\n`;
  });

  text += `\n*Total Amount:* ₹${order.total.toLocaleString('en-IN')} (${order.paymentMethod})\n`;
  text += `*Delivery Address:* ${order.address.streetAddress}, ${order.address.city}, ${order.address.state} - ${order.address.pincode}`;

  return `https://wa.me/${BOUTIQUE_PHONE}?text=${encodeURIComponent(text)}`;
};

export const getOwnerCustomerWhatsAppUrl = (order: Order) => {
  const customerNumber = order.address.phone.replace(/[^0-9]/g, '');
  const phone = customerNumber.startsWith('91')
    ? customerNumber
    : customerNumber.length === 10
    ? `91${customerNumber}`
    : BOUTIQUE_PHONE;

  let text = `Namaste ${order.address.fullName}! This is Akaay Boutique regarding your Order #${order.id}.\n\n`;
  text += `Current status: *${order.status}*.\n`;
  text += `Total: ₹${order.total.toLocaleString('en-IN')}.\n`;
  text += `Estimated Delivery: ${order.estimatedDelivery}.\n\n`;
  text += `Let us know if you need any adjustments or personalized styling notes!`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
};
