import React, { useEffect, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

// Layout & Guards
import { AppLayout } from "../layouts/AppLayout";
import { ProtectedRoute, PublicRoute, RoleRoute } from "./RouteGuard";
import { slideUpVariants } from "../animations/motion";
import { Skeleton } from "../components/primitives/Skeleton";
import { Container } from "../components/primitives/Container";

// Lazy-loaded Pages
const Home = lazy(() => import("../pages/Home"));
const Catalog = lazy(() => import("../pages/Catalog"));
const ProductDetail = lazy(() => import("../pages/ProductDetail"));
const Cart = lazy(() => import("../pages/Cart"));
const Checkout = lazy(() => import("../pages/Checkout"));
const Account = lazy(() => import("../pages/Account"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const DesignSystemPlayground = lazy(() => import("../pages/DesignSystemPlayground"));

// Admin / Seller placeholder layouts
const AdminPlaceholder = () => (
  <div style={{ padding: "80px 24px", textAlign: "center" }}>
    <h2>Admin Dashboard Boundaries</h2>
    <p style={{ color: "#6B7280" }}>F9 Infrastructure placeholder. Restricted to administrative operators only.</p>
  </div>
);

const SellerPlaceholder = () => (
  <div style={{ padding: "80px 24px", textAlign: "center" }}>
    <h2>Seller Center Boundaries</h2>
    <p style={{ color: "#6B7280" }}>F9 Infrastructure placeholder. Restricted to merchants and partners.</p>
  </div>
);

// Scroll restoration side effect
const ScrollRestoration = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Animated route container
const AnimatedPage = ({ children }) => (
  <motion.div
    variants={slideUpVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    style={{ minHeight: "100%" }}
  >
    {children}
  </motion.div>
);

// Fallback skeleton loader that fits inside the persistent layout shell
const LazyPageFallback = () => (
  <Container style={{ paddingTop: "80px", paddingBottom: "80px", textAlign: "center" }}>
    <Skeleton variant="rectangular" height={40} width="60%" style={{ margin: "0 auto 24px auto" }} />
    <Skeleton variant="rectangular" height={200} width="100%" style={{ marginBottom: "16px" }} />
    <Skeleton variant="rectangular" height={100} width="100%" />
  </Container>
);

const LazyPage = ({ Component }) => (
  <Suspense fallback={<LazyPageFallback />}>
    <Component />
  </Suspense>
);

const AppRoutesContent = () => {
  const location = useLocation();
  const isDev = import.meta.env.DEV;

  return (
    <>
      <ScrollRestoration />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public Views */}
          <Route path="/" element={<AppLayout><AnimatedPage><LazyPage Component={Home} /></AnimatedPage></AppLayout>} />
          <Route path="/catalog" element={<AppLayout><AnimatedPage><LazyPage Component={Catalog} /></AnimatedPage></AppLayout>} />
          <Route path="/products/:id" element={<AppLayout><AnimatedPage><LazyPage Component={ProductDetail} /></AnimatedPage></AppLayout>} />
          <Route path="/cart" element={<AppLayout><AnimatedPage><LazyPage Component={Cart} /></AnimatedPage></AppLayout>} />
          
          {/* Guest Auth Views */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <AppLayout><AnimatedPage><LazyPage Component={Login} /></AnimatedPage></AppLayout>
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <AppLayout><AnimatedPage><LazyPage Component={Register} /></AnimatedPage></AppLayout>
              </PublicRoute>
            } 
          />

          {/* Customer Cabinet Protected Views */}
          <Route 
            path="/checkout" 
            element={
              <ProtectedRoute>
                <AppLayout><AnimatedPage><LazyPage Component={Checkout} /></AnimatedPage></AppLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/account" 
            element={
              <ProtectedRoute>
                <AppLayout><AnimatedPage><LazyPage Component={Account} /></AnimatedPage></AppLayout>
              </ProtectedRoute>
            } 
          />

          {/* Development Sandbox */}
          {isDev ? (
            <Route path="/design-system" element={<AnimatedPage><LazyPage Component={DesignSystemPlayground} /></AnimatedPage>} />
          ) : (
            <Route path="/design-system" element={<Navigate to="/" replace />} />
          )}

          {/* Role Restricted Admin/Seller Route Placeholders */}
          <Route 
            path="/admin/*" 
            element={
              <RoleRoute allowedRoles={["ADMIN"]}>
                <AppLayout><AnimatedPage><AdminPlaceholder /></AnimatedPage></AppLayout>
              </RoleRoute>
            } 
          />
          <Route 
            path="/seller/*" 
            element={
              <RoleRoute allowedRoles={["ADMIN", "SELLER"]}>
                <AppLayout><AnimatedPage><SellerPlaceholder /></AnimatedPage></AppLayout>
              </RoleRoute>
            } 
          />

          {/* Fallback Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </>
  );
};

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <AppRoutesContent />
    </BrowserRouter>
  );
};

export default AppRoutes;
