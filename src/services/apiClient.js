// API Client Abstraction for the ByteVault Media Platform
// Intercepts and routes queries to local mock DB or direct backend API Gateway

import { mockProducts } from "../features/products/mockData";

// Read configuration variables from Vite environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== "false"; // Default to true if not explicitly set to false

// ----------------------------------------------------
// CUSTOM ENTERPRISE ERROR HIERARCHY
// ----------------------------------------------------
export class ApiError extends Error {
  constructor(status, message, details = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = "Session expired. Please log in again.", details = {}) {
    super(401, message, details);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = "You do not have authorization to access this resource.", details = {}) {
    super(403, message, details);
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends ApiError {
  constructor(message = "The requested resource could not be found.", details = {}) {
    super(404, message, details);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends ApiError {
  constructor(message = "A state conflict occurred. Please review your request.", details = {}) {
    super(409, message, details);
    this.name = "ConflictError";
  }
}

export class RateLimitError extends ApiError {
  constructor(message = "Too many requests. Please throttle your client rate.", details = {}) {
    super(429, message, details);
    this.name = "RateLimitError";
  }
}

export class ServerError extends ApiError {
  constructor(message = "Internal Server Error. Please contact support.", status = 500, details = {}) {
    super(status, message, details);
    this.name = "ServerError";
  }
}

export class NetworkError extends Error {
  constructor(message = "Unable to connect to ByteVault. Please check your network connection.") {
    super(message);
    this.name = "NetworkError";
  }
}

export class TimeoutError extends Error {
  constructor(message = "The request timed out. Please try again.") {
    super(message);
    this.name = "TimeoutError";
  }
}

// ----------------------------------------------------
// CORRELATION ID GENERATOR
// ----------------------------------------------------
const generateCorrelationId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Safe fallback UUID format
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// ----------------------------------------------------
// LOCAL STORAGE MOCK DATABASE ROUTER
// ----------------------------------------------------
const initializeMockDb = () => {
  if (!localStorage.getItem("bytevault_users")) {
    const initialUsers = [
      {
        id: "usr_1",
        email: "customer@bytevault.com",
        password: "password123",
        name: "Alex Rivera",
        role: "CUSTOMER",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
      },
      {
        id: "usr_2",
        email: "admin@bytevault.com",
        password: "admin123",
        name: "Jane Smith",
        role: "ADMIN",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
      }
    ];
    localStorage.setItem("bytevault_users", JSON.stringify(initialUsers));
  }

  if (!localStorage.getItem("bytevault_user_addresses")) {
    const initialAddresses = [
      { id: "addr_1", name: "Alex Rivera", street: "128 Commerce Way, Apt 3B", city: "San Francisco", state: "CA", zip: "94107", country: "United States", isDefault: true }
    ];
    localStorage.setItem("bytevault_user_addresses", JSON.stringify(initialAddresses));
  }

  if (!localStorage.getItem("bytevault_products") || !localStorage.getItem("bytevault_products").includes("prod_8")) {
    const detailedProducts = mockProducts.map(p => {
      const isDigital = p.type === "DIGITAL" || p.type === "digital";
      return {
        ...p,
        type: isDigital ? "DIGITAL" : "PHYSICAL",
        description: isDigital 
          ? `Professional-grade software architecture asset. Includes standard modular template, deployment files, developer guides, and automated test coverages.`
          : `Ergonomic desktop companion. Manufactured from premium, long-lasting materials and custom tuned to maximize daily comfort and style.`,
        specs: isDigital ? {
          format: p.id === "prod_4" ? "Figma, PNG, SVG" : "ZIP (JS, React, HTML)",
          fileSize: p.id === "prod_4" ? "42.5 MB" : "158.2 MB",
          compatibility: "Web browsers, Figma, React 18+, Node 18+",
          license: "Commercial License (Single Seat)",
          version: "v1.4.0",
          updates: "Lifetime updates included"
        } : {
          weight: p.id === "prod_5" ? "1.2 kg" : "850g",
          dimensions: p.id === "prod_5" ? "32cm x 13cm x 4cm" : "48cm x 30cm x 15cm",
          material: p.id === "prod_5" ? "CNC Aluminum & PBT Keycaps" : "Waterproof Cordura Nylon",
          origin: "Imported",
          warranty: "2-Year Manufacturer Warranty"
        },
        reviews: [
          { id: "r1", author: "Sarah Connor", rating: 5, text: "Outstanding quality. Exactly what I needed for my professional setups.", date: "2026-08-10" },
          { id: "r2", author: "Marcus Aurelius", rating: 4, text: "Very solid build. Spacing and dimensions are highly ergonomic.", date: "2026-08-14" }
        ],
        faq: [
          { q: "What support is included?", a: "Every purchase includes detailed email support and access to our active developer documentation community." },
          { q: "Can I use this commercially?", a: "Yes, this license permits commercial usage for both single-developer and corporate client products." }
        ]
      };
    });

    const extraProducts = [
      {
        id: "prod_6",
        title: "Rust Microservices Architecture Blueprint",
        type: "DIGITAL",
        image: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=600&auto=format&fit=crop&q=80",
        price: 49.00,
        originalPrice: 75.00,
        rating: 4.9,
        ratingCount: 112,
        inStock: true,
        deliveryInfo: "Instant Download & E-Book PDF",
        category: "Software & Coding",
        description: "Build robust, safe, and lightning-fast microservices in Rust. Includes production templates, database migrations setup, and gRPC specs.",
        specs: {
          format: "PDF, EPUB, Source Code GitHub",
          fileSize: "89 MB",
          compatibility: "Rust Edition 2021+",
          license: "Personal Developer License",
          version: "v2.0.1",
          updates: "Free updates for 1 year"
        },
        reviews: [
          { id: "r1", author: "Linus T.", rating: 5, text: "Excellent architectural layout. Clean and precise.", date: "2026-08-20" }
        ],
        faq: [
          { q: "Are updates free?", a: "Yes, all updates within the first year of purchase are free." }
        ]
      },
      {
        id: "prod_7",
        title: "ByteVault Custom Leather Cord Organizer",
        type: "PHYSICAL",
        image: "https://images.unsplash.com/photo-1624996379697-f01d168b1a52?w=600&auto=format&fit=crop&q=80",
        price: 19.99,
        originalPrice: 24.99,
        rating: 4.3,
        ratingCount: 42,
        inStock: true,
        deliveryInfo: "Ships tomorrow",
        category: "Travel Gear",
        description: "Keep your cables, dongles, and power banks organized. Crafted from vegetable-tanned leather with heavy-duty brass snaps.",
        specs: {
          weight: "120g",
          dimensions: "15cm x 8cm x 2cm",
          material: "Vegetable-tanned leather",
          origin: "Local Crafted",
          warranty: "1-Year Warranty"
        },
        reviews: [
          { id: "r1", author: "David H.", rating: 4, text: "Very premium leather feel, keeps my desk tidy.", date: "2026-08-22" }
        ],
        faq: [
          { q: "How many cables can it hold?", a: "It comfortably manages up to 4 standard braided laptop or charging cables." }
        ]
      },
      {
        id: "prod_8",
        title: "Ultimate Figma Design System - Starter Pack",
        type: "DIGITAL",
        image: "https://images.unsplash.com/photo-1541462608141-2f58c6e68e98?w=600&auto=format&fit=crop&q=80",
        price: 39.00,
        rating: 4.6,
        ratingCount: 31,
        inStock: true,
        deliveryInfo: "Instant Figma Link",
        category: "Design Resources",
        description: "Kickstart UI projects in seconds. 500+ UI components, dark mode layouts, variables config, and responsive grid layouts.",
        specs: {
          format: "Figma File (.fig)",
          fileSize: "12 MB",
          compatibility: "Figma Desktop & Web",
          license: "Unlimited Project License",
          version: "v3.0.0",
          updates: "Lifetime updates"
        },
        reviews: [],
        faq: []
      }
    ];

    localStorage.setItem("bytevault_products", JSON.stringify([...detailedProducts, ...extraProducts]));
  }
  
  if (!localStorage.getItem("bytevault_downloads")) {
    const initialDownloads = [
      {
        id: "dl_1",
        productId: "prod_8",
        title: "Ultimate Figma Design System - Starter Pack",
        image: "https://images.unsplash.com/photo-1541462608141-2f58c6e68e98?w=600&auto=format&fit=crop&q=80",
        fileSize: "12 MB",
        format: "Figma File (.fig)",
        downloadCount: 3,
        status: "active",
        unlockedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        updateAvailable: true,
      },
      {
        id: "dl_2",
        productId: "prod_6",
        title: "Rust Microservices Architecture Blueprint",
        image: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=600&auto=format&fit=crop&q=80",
        fileSize: "89 MB",
        format: "ZIP (PDF & Rust code)",
        downloadCount: 0,
        status: "active",
        unlockedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      }
    ];
    localStorage.setItem("bytevault_downloads", JSON.stringify(initialDownloads));
  }

  if (!localStorage.getItem("bytevault_orders")) {
    const initialOrders = [
      {
        id: "ord_998124",
        userId: "usr_1",
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        items: [
          {
            id: "prod_6",
            title: "Rust Microservices Architecture Blueprint",
            price: 49.00,
            quantity: 1,
            type: "DIGITAL",
            image: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=600&auto=format&fit=crop&q=80",
          },
          {
            id: "prod_2",
            title: "Minimalist Full-Grain Leather Backpack",
            price: 135.00,
            quantity: 1,
            type: "PHYSICAL",
            image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
          }
        ],
        subtotal: 184.00,
        tax: 14.72,
        shipping: 0.00,
        total: 198.72,
        shippingAddress: {
          name: "Alex Rivera",
          street: "128 Commerce Way, Apt 3B",
          city: "San Francisco",
          state: "CA",
          zip: "94107",
          country: "United States"
        },
        paymentMethod: "Visa ending in 4242",
        fulfillmentStatus: "IN_TRANSIT",
        trackingSteps: [
          { label: "Processing & Payment Cleared", date: new Date(Date.now() - 86400000 * 5).toISOString(), completed: true },
          { label: "Packed in Warehouse", date: new Date(Date.now() - 86400000 * 4).toISOString(), completed: true },
          { label: "Shipped", date: new Date(Date.now() - 86400000 * 3).toISOString(), completed: true },
          { label: "In Transit", date: new Date(Date.now() - 86400000 * 2).toISOString(), completed: true },
          { label: "Delivered", date: "", completed: false }
        ]
      }
    ];
    localStorage.setItem("bytevault_orders", JSON.stringify(initialOrders));
  }
  
  if (!localStorage.getItem("bytevault_cart")) {
    localStorage.setItem("bytevault_cart", JSON.stringify({ items: [] }));
  }
};

initializeMockDb();

const delay = (ms = 350) => new Promise(resolve => setTimeout(resolve, ms));
const getDbData = (key) => JSON.parse(localStorage.getItem(key) || "[]");
const setDbData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// Intercept queries and route locally to mock datasets
const handleMockRequest = async (method, url, body = null, headers = {}) => {
  await delay();

  const cleanUrl = url.split("?")[0];
  const queryParams = new URLSearchParams(url.includes("?") ? url.split("?")[1] : "");

  let authUserId = null;
  const authHeader = headers["Authorization"] || headers["authorization"];
  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      const token = authHeader.split(" ")[1];
      const payload = JSON.parse(atob(token.split(".")[1]));
      authUserId = payload.id;
    } catch {
      throw new UnauthorizedError("Mock JWT Token is invalid or signature check failed.");
    }
  }

  // AUTH ENDPOINTS
  if (cleanUrl === "/auth/login" && method === "POST") {
    const { email, password } = body;
    const users = getDbData("bytevault_users");
    const matched = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!matched) {
      throw new UnauthorizedError("Authentication failed: Invalid credentials.");
    }
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = btoa(JSON.stringify({ id: matched.id, email: matched.email, role: matched.role }));
    const token = `${header}.${payload}.signature`;
    
    const cleanUser = { ...matched };
    delete cleanUser.password;
    return { token, user: cleanUser };
  }

  if (cleanUrl === "/auth/register" && method === "POST") {
    const { name, email, password } = body;
    const users = getDbData("bytevault_users");
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new ConflictError("Registration failed: Email address is already in use.");
    }
    const newUser = {
      id: `usr_${Date.now()}`,
      name,
      email: email.toLowerCase(),
      password,
      role: "CUSTOMER",
      avatar: `https://images.unsplash.com/photo-${1535713875000 + Math.floor(Math.random() * 999)}?w=100&auto=format&fit=crop&q=80`
    };
    users.push(newUser);
    setDbData("bytevault_users", users);

    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = btoa(JSON.stringify({ id: newUser.id, email: newUser.email, role: newUser.role }));
    const token = `${header}.${payload}.signature`;

    const cleanUser = { ...newUser };
    delete cleanUser.password;
    return { token, user: cleanUser };
  }

  if (cleanUrl === "/auth/refresh" && method === "POST") {
    const token = localStorage.getItem("bytevault_auth_token");
    if (!token) throw new UnauthorizedError("Refresh session failed: Access token missing.");
    return { token };
  }

  if (cleanUrl === "/auth/logout" && method === "POST") {
    return { success: true };
  }

  // USERS
  if (cleanUrl === "/users/me" && method === "GET") {
    if (!authUserId) throw new UnauthorizedError();
    const users = getDbData("bytevault_users");
    const matched = users.find(u => u.id === authUserId);
    if (!matched) throw new NotFoundError("User profile details not found.");
    const cleanUser = { ...matched };
    delete cleanUser.password;
    return cleanUser;
  }

  // PRODUCTS
  if (cleanUrl === "/products" && method === "GET") {
    let products = getDbData("bytevault_products");

    const minPrice = parseFloat(queryParams.get("minPrice") || "0");
    const maxPrice = parseFloat(queryParams.get("maxPrice") || "Infinity");
    products = products.filter(p => p.price >= minPrice && p.price <= maxPrice);

    const minRating = parseFloat(queryParams.get("minRating") || "0");
    products = products.filter(p => p.rating >= minRating);

    const typeFilter = queryParams.get("type");
    if (typeFilter && typeFilter !== "ALL") {
      products = products.filter(p => p.type.toUpperCase() === typeFilter.toUpperCase());
    }

    const categoryFilter = queryParams.get("category");
    if (categoryFilter && categoryFilter !== "All") {
      products = products.filter(p => p.category === categoryFilter);
    }

    const inStock = queryParams.get("inStockOnly") === "true";
    if (inStock) {
      products = products.filter(p => p.inStock);
    }

    const searchQ = queryParams.get("search");
    if (searchQ) {
      const q = searchQ.toLowerCase();
      products = products.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    const sortBy = queryParams.get("sortBy") || "trending";
    if (sortBy === "price_asc") {
      products.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_desc") {
      products.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      products.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "newest") {
      products.sort((a, b) => b.id.localeCompare(a.id));
    }

    return products;
  }

  if (cleanUrl.startsWith("/products/") && method === "GET") {
    const id = cleanUrl.split("/").pop();
    const products = getDbData("bytevault_products");
    const matched = products.find(p => p.id === id);
    if (!matched) throw new NotFoundError("Product not found.");
    return matched;
  }

  if (cleanUrl === "/products" && method === "POST") {
    // Admin mock creation
    if (!authUserId) throw new UnauthorizedError();
    const products = getDbData("bytevault_products");
    const newProduct = {
      ...body,
      id: `prod_${Date.now()}`,
      rating: 5.0,
      ratingCount: 0,
      inStock: true
    };
    products.push(newProduct);
    setDbData("bytevault_products", products);
    return newProduct;
  }

  if (cleanUrl.startsWith("/products/") && method === "PUT") {
    // Admin mock update
    if (!authUserId) throw new UnauthorizedError();
    const id = cleanUrl.split("/").pop();
    const products = getDbData("bytevault_products");
    const matchedIdx = products.findIndex(p => p.id === id);
    if (matchedIdx === -1) throw new NotFoundError("Product not found.");
    products[matchedIdx] = { ...products[matchedIdx], ...body };
    setDbData("bytevault_products", products);
    return products[matchedIdx];
  }

  // CART ENDPOINTS
  if (cleanUrl === "/cart" && method === "GET") {
    const cart = JSON.parse(localStorage.getItem("bytevault_cart") || '{"items":[]}');
    return cart;
  }

  if (cleanUrl === "/cart" && method === "POST") {
    setDbData("bytevault_cart", body);
    return body;
  }

  // ORDERS
  if (cleanUrl === "/orders" && method === "POST") {
    if (!authUserId) throw new UnauthorizedError();
    const orders = getDbData("bytevault_orders");
    const newOrder = {
      ...body,
      id: `ord_${Math.floor(100000 + Math.random() * 900000)}`,
      userId: authUserId,
      createdAt: new Date().toISOString(),
      fulfillmentStatus: body.items.every(i => i.type === "DIGITAL") ? "DELIVERED" : "PROCESSING",
      trackingSteps: body.items.every(i => i.type === "DIGITAL") 
        ? [
            { label: "Fulfillment Initialized", date: new Date().toISOString(), completed: true },
            { label: "License Issued", date: new Date().toISOString(), completed: true },
            { label: "Instant Access Delivered", date: new Date().toISOString(), completed: true }
          ]
        : [
            { label: "Processing & Payment Cleared", date: new Date().toISOString(), completed: true },
            { label: "Packed in Warehouse", date: "", completed: false },
            { label: "Shipped", date: "", completed: false },
            { label: "In Transit", date: "", completed: false },
            { label: "Delivered", date: "", completed: false }
          ]
    };
    orders.push(newOrder);
    setDbData("bytevault_orders", orders);

    // Entitlement grant
    const digitalItems = body.items.filter(i => i.type === "DIGITAL" || i.type === "digital");
    if (digitalItems.length > 0) {
      const downloads = getDbData("bytevault_downloads");
      digitalItems.forEach(item => {
        if (!downloads.some(d => d.productId === item.id)) {
          downloads.push({
            id: `dl_${Date.now()}_${item.id}`,
            productId: item.id,
            title: item.title,
            image: item.image,
            fileSize: item.fileSize || "158.2 MB",
            format: item.format || "ZIP",
            downloadCount: 0,
            status: "active",
            unlockedAt: new Date().toISOString()
          });
        }
      });
      setDbData("bytevault_downloads", downloads);
    }
    return newOrder;
  }

  if (cleanUrl.startsWith("/orders/") && method === "GET") {
    const id = cleanUrl.split("/").pop();
    const orders = getDbData("bytevault_orders");
    const found = orders.find(o => o.id === id);
    if (!found) throw new NotFoundError("Order detail could not be retrieved.");
    return found;
  }

  // PAYMENTS
  if (cleanUrl === "/payments" && method === "POST") {
    const { cardNumber } = body;
    if (cardNumber && cardNumber.replace(/\s/g, "").endsWith("4444")) {
      throw new ConflictError("Simulated payment transaction decline. Try alternate credentials.");
    }
    return { 
      transactionId: `txn_${Date.now()}`, 
      status: "COMPLETED", 
      message: "Mock payment authorization cleared." 
    };
  }

  if (cleanUrl === "/payments/verify" && method === "POST") {
    return { success: true, verifiedAt: new Date().toISOString() };
  }

  // FULFILLMENT
  if (cleanUrl === "/entitlements" && method === "GET") {
    if (!authUserId) throw new UnauthorizedError();
    return getDbData("bytevault_downloads");
  }

  if (cleanUrl.startsWith("/downloads/") && method === "GET") {
    const productId = cleanUrl.split("/").pop();
    const downloads = getDbData("bytevault_downloads");
    const matched = downloads.find(d => d.productId === productId);
    if (!matched) throw new NotFoundError("No entitlement asset matches this product ID.");
    
    matched.downloadCount += 1;
    setDbData("bytevault_downloads", downloads);

    return { 
      downloadUrl: `http://localhost:8080/api/v1/downloads/files/${matched.id}?sig=secureSignatureToken`,
      fileName: `${matched.title.toLowerCase().replace(/[^a-z0-9]/g, "_")}.${matched.format.toLowerCase().split(",")[0].trim()}`
    };
  }

  // ADDRESSES
  if (cleanUrl === "/users/addresses" && method === "GET") {
    return getDbData("bytevault_user_addresses");
  }

  if (cleanUrl === "/users/addresses" && method === "POST") {
    const addresses = getDbData("bytevault_user_addresses");
    const newAddress = {
      ...body,
      id: `addr_${Date.now()}`,
      isDefault: addresses.length === 0 ? true : body.isDefault || false
    };
    if (newAddress.isDefault) {
      addresses.forEach(a => a.isDefault = false);
    }
    addresses.push(newAddress);
    setDbData("bytevault_user_addresses", addresses);
    return newAddress;
  }

  if (cleanUrl.startsWith("/users/addresses/") && method === "DELETE") {
    const id = cleanUrl.split("/").pop();
    let addresses = getDbData("bytevault_user_addresses");
    addresses = addresses.filter(a => a.id !== id);
    if (addresses.length > 0 && !addresses.some(a => a.isDefault)) {
      addresses[0].isDefault = true;
    }
    setDbData("bytevault_user_addresses", addresses);
    return { success: true };
  }

  if (cleanUrl === "/users/profile" && method === "PUT") {
    if (!authUserId) throw new UnauthorizedError();
    const users = getDbData("bytevault_users");
    const matchedIdx = users.findIndex(u => u.id === authUserId);
    if (matchedIdx === -1) throw new NotFoundError();
    users[matchedIdx] = { ...users[matchedIdx], ...body };
    setDbData("bytevault_users", users);
    const cleanUser = { ...users[matchedIdx] };
    delete cleanUser.password;
    return cleanUser;
  }

  throw new NotFoundError(`Interceptors missing for endpoint: ${method} ${cleanUrl}`);
};

// ----------------------------------------------------
// CORE REQUEST EXECUTION BLOCK
// ----------------------------------------------------
const request = async (method, url, data = null, options = {}) => {
  // If Mock API mode is enabled, intercept and process locally
  if (USE_MOCK_API) {
    return handleMockRequest(method, url, data, options.headers || {});
  }

  const correlationId = generateCorrelationId();
  const token = localStorage.getItem("bytevault_auth_token");
  
  const headers = {
    "Content-Type": "application/json",
    "X-Correlation-ID": correlationId,
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const controller = new AbortController();
  // 10 seconds timeout rule
  const timeoutMs = options.timeout || 10000;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      method,
      headers,
      signal: controller.signal,
      body: data ? JSON.stringify(data) : undefined
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      const errMsg = errBody.message || `HTTP Server returned error status ${response.status}`;
      
      if (response.status === 401 && !url.endsWith("/auth/refresh")) {
        try {
          const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" }
          });
          if (refreshRes.ok) {
            const { token: newToken } = await refreshRes.json();
            localStorage.setItem("bytevault_auth_token", newToken);
            
            const retryResponse = await fetch(`${API_BASE_URL}${url}`, {
              ...options,
              method,
              headers: {
                ...headers,
                "Authorization": `Bearer ${newToken}`
              },
              signal: controller.signal,
              body: data ? JSON.stringify(data) : undefined
            });
            if (retryResponse.ok) {
              if (retryResponse.status === 204) return null;
              return retryResponse.json();
            }
          }
        } catch (e) {
          console.warn("Auto token refresh failed", e);
        }
        
        localStorage.removeItem("bytevault_auth_token");
        window.dispatchEvent(new Event("bytevault_unauthorized"));
      }

      switch (response.status) {
        case 401:
          throw new UnauthorizedError(errMsg, errBody);
        case 403:
          throw new ForbiddenError(errMsg, errBody);
        case 404:
          throw new NotFoundError(errMsg, errBody);
        case 409:
          throw new ConflictError(errMsg, errBody);
        case 429:
          throw new RateLimitError(errMsg, errBody);
        default:
          if (response.status >= 500) {
            throw new ServerError(errMsg, response.status, errBody);
          }
          throw new ApiError(response.status, errMsg, errBody);
      }
    }

    if (response.status === 204) return null;
    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === "AbortError") {
      throw new TimeoutError("The request to ByteVault server timed out after 10 seconds.");
    }
    if (error instanceof ApiError) {
      throw error;
    }
    // Network drops / proxy refusal
    throw new NetworkError("Unable to reach ByteVault server. Verify endpoint routing.");
  }
};

export const apiClient = {
  get: (url, options = {}) => request("GET", url, null, options),
  post: (url, data = null, options = {}) => request("POST", url, data, options),
  put: (url, data = null, options = {}) => request("PUT", url, data, options),
  patch: (url, data = null, options = {}) => request("PATCH", url, data, options),
  delete: (url, options = {}) => request("DELETE", url, options)
};

export default apiClient;
