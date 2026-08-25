// Cart Services - API endpoints mapping and business math calculation helpers
import apiClient from "./apiClient";

export const cartService = {
  // Retrieves cart state from remote endpoint
  getCart: async () => {
    return apiClient.get("/cart");
  },

  // Persists current cart state to remote endpoint
  saveCart: async (cartState) => {
    return apiClient.post("/cart", cartState);
  },

  // Retains the business calculation rules for basket pricing
  calculateTotals: (items, shippingMethod = "standard") => {
    let subtotal = 0;
    let originalSubtotal = 0;
    let hasPhysical = false;
    let totalItemsCount = 0;

    items.forEach(item => {
      const quantity = item.quantity || 1;
      subtotal += item.price * quantity;
      originalSubtotal += (item.originalPrice || item.price) * quantity;
      
      if (item.type === "PHYSICAL") {
        hasPhysical = true;
      }
      totalItemsCount += quantity;
    });

    const discountAmount = originalSubtotal - subtotal;
    
    // Shipping cost calculation rules
    let shippingCost = 0;
    if (hasPhysical) {
      if (shippingMethod === "free" || subtotal >= 100) {
        shippingCost = 0;
      } else if (shippingMethod === "express") {
        shippingCost = 15.00;
      } else {
        shippingCost = 5.99; // Standard flat rate
      }
    } else {
      shippingCost = 0; // Digital only
    }

    // Estimate tax (flat 8%)
    const taxCost = subtotal * 0.08;
    const finalTotal = subtotal + shippingCost + taxCost;

    return {
      itemCount: totalItemsCount,
      subtotal: Number(subtotal.toFixed(2)),
      originalSubtotal: Number(originalSubtotal.toFixed(2)),
      discount: Number(discountAmount.toFixed(2)),
      shipping: Number(shippingCost.toFixed(2)),
      tax: Number(taxCost.toFixed(2)),
      total: Number(finalTotal.toFixed(2)),
      hasPhysical,
    };
  }
};

export default cartService;
