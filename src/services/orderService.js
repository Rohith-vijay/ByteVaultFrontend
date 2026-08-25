// Order Service wrapper calling apiClient
import apiClient from "./apiClient";

export const orderService = {
  // Submits a new order to the API client
  createOrder: async (userId, items, shippingAddress, paymentDetails, shippingMethod) => {
    return apiClient.post("/orders", {
      items: items.map(item => ({
        id: item.id,
        title: item.title,
        type: item.type,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
        fileSize: item.specs?.fileSize || "158.2 MB",
        format: item.specs?.format || "ZIP"
      })),
      shippingAddress,
      paymentDetails,
      shippingMethod
    });
  },

  // Queries all user orders from API client
  getOrdersByUser: async (_userId) => {
    return apiClient.get("/orders");
  },

  // Queries specific order details
  getOrderById: async (orderId) => {
    const list = await apiClient.get("/orders");
    const found = list.find(o => o.id === orderId);
    if (!found) throw new Error("Order not found");
    return found;
  }
};

export default orderService;
