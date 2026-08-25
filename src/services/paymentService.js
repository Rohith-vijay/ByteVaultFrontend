// Payment Service Wrapper calling apiClient
import apiClient from "./apiClient";

export const paymentService = {
  // Processes a transaction amount against card credentials via API
  processPayment: async (amount, cardDetails) => {
    const response = await apiClient.post("/payments", {
      amount,
      cardNumber: cardDetails.number,
      cardExpiry: cardDetails.expiry,
      cardCvc: cardDetails.cvc,
      cardName: cardDetails.name
    });

    return {
      success: true,
      transactionId: response.transactionId,
      amount,
      timestamp: new Date().toISOString(),
      paymentDetails: {
        type: cardDetails.cardNumber?.startsWith("4") ? "visa" : "mastercard",
        last4: cardDetails.cardNumber?.replace(/\s/g, "").slice(-4) || "9999"
      }
    };
  },

  // Verifies the status of a checkout payment transaction
  verifyPayment: async (transactionId) => {
    return apiClient.post("/payments/verify", { transactionId });
  }
};

export default paymentService;
