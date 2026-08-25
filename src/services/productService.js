// Product Service Wrapper calling apiClient
import apiClient from "./apiClient";

export const productService = {
  // Queries all products with filtering, search, and sorting via API parameters
  getProducts: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.search) params.append("search", filters.search);
    if (filters.category) params.append("category", filters.category);
    if (filters.type) params.append("type", filters.type);
    
    if (filters.minPrice !== undefined) {
      params.append("minPrice", filters.minPrice.toString());
    }
    if (filters.maxPrice !== undefined) {
      params.append("maxPrice", filters.maxPrice.toString());
    }
    if (filters.minRating !== undefined) {
      params.append("minRating", filters.minRating.toString());
    }
    if (filters.inStockOnly) {
      params.append("inStockOnly", "true");
    }
    if (filters.sortBy) {
      params.append("sortBy", filters.sortBy);
    }

    const queryStr = params.toString() ? `?${params.toString()}` : "";
    return apiClient.get(`/products${queryStr}`);
  },

  // Retrieves specific product details
  getProductById: async (id) => {
    return apiClient.get(`/products/${id}`);
  },

  // Creates a product (admin placeholder)
  createProduct: async (productData) => {
    return apiClient.post("/products", productData);
  },

  // Updates a product (admin placeholder)
  updateProduct: async (id, productData) => {
    return apiClient.put(`/products/${id}`, productData);
  },

  // Retrieves lists of distinct categories from catalog
  getCategories: async () => {
    const products = await apiClient.get("/products");
    const cats = products.map(p => p.category);
    return ["All", ...new Set(cats)];
  },

  // Retrieves related products
  getRelatedProducts: async (productId, limit = 4) => {
    try {
      const current = await apiClient.get(`/products/${productId}`);
      const products = await apiClient.get("/products");
      return products
        .filter(p => p.id !== productId && (p.category === current.category || p.type === current.type))
        .slice(0, limit);
    } catch {
      const products = await apiClient.get("/products");
      return products.slice(0, limit);
    }
  }
};

export default productService;
