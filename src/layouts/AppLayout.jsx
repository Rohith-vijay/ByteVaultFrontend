import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { styled, alpha, useTheme } from "@mui/material/styles";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ShoppingBagOutlined as ShoppingBagOutlinedIcon,
  FavoriteBorderOutlined as FavoriteBorderOutlinedIcon,
  PersonOutlineOutlined as PersonOutlineOutlinedIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  ExitToApp as ExitToAppIcon,
  Dashboard as DashboardIcon,
  WifiOff as WifiOffIcon,
  CheckCircle as CheckCircleIcon,
  ChevronRight as ChevronRightIcon
} from "@mui/icons-material";
import Drawer from "@mui/material/Drawer";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import { useCart } from "../store/CartContext";
import { useWishlist } from "../store/WishlistContext";
import { useAuth } from "../store/AuthContext";
import { Container } from "../components/primitives/Container";
import { Badge } from "../components/primitives/Badge";
import { IconButton } from "../components/primitives/IconButton";
import { Button } from "../components/primitives/Button";
import { productService } from "../services/productService";

// Scroll-aware styled AppBar
const Header = styled("header", {
  shouldForwardProp: (prop) => prop !== "scrolled",
})(({ theme, scrolled }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  height: "72px",
  backgroundColor: scrolled 
    ? alpha(theme.palette.background.default, 0.85) 
    : theme.palette.background.default,
  backdropFilter: scrolled ? "blur(12px)" : "none",
  borderBottom: scrolled 
    ? `1px solid ${theme.palette.border.default}` 
    : "1px solid transparent",
  boxShadow: scrolled ? theme.elevation.subtle : "none",
  zIndex: theme.zIndex.appBar,
  display: "flex",
  alignItems: "center",
  transition: `background-color ${theme.transitions.duration.shorter}ms ${theme.transitions.easing.easeInOut}, 
               box-shadow ${theme.transitions.duration.shorter}ms ${theme.transitions.easing.easeInOut}, 
               border-color ${theme.transitions.duration.shorter}ms ${theme.transitions.easing.easeInOut}`,
}));

const NavContainer = styled(Container)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  position: "relative",
});

const MotionBrandLogo = styled(motion(Link))(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  textDecoration: "none",
  borderRadius: "8px",
  outline: "none",
  transition: "box-shadow 0.2s ease",
  "&:focus-visible": {
    boxShadow: `0 0 0 3px ${theme.palette.primary.main}`,
  },
}));

const SearchWrapper = styled("div")({
  position: "relative",
});

const SearchBar = styled("form")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  backgroundColor: theme.palette.background.elevated,
  borderRadius: theme.radius.full,
  padding: `${theme.spacing(1.5)} ${theme.spacing(4)}`,
  width: "340px",
  gap: theme.spacing(2),
  border: `1px solid transparent`,
  transition: `border-color ${theme.transitions.duration.shorter}ms ${theme.transitions.easing.easeInOut},
               background-color ${theme.transitions.duration.shorter}ms ${theme.transitions.easing.easeInOut}`,

  "&:focus-within": {
    borderColor: theme.palette.border.strong,
    backgroundColor: theme.palette.background.paper,
  },

  [theme.breakpoints.down("md")]: {
    display: "none",
  },
}));

const SearchInput = styled("input")(({ theme }) => ({
  border: "none",
  background: "transparent",
  outline: "none",
  fontSize: "14px",
  width: "100%",
  fontFamily: theme.typography.fontFamily,
  color: theme.palette.text.primary,
}));

const SuggestionDropdown = styled(motion.div)(({ theme }) => ({
  position: "absolute",
  top: "50px",
  left: 0,
  right: 0,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.border.default}`,
  borderRadius: "12px",
  boxShadow: theme.elevation.popover,
  maxHeight: "320px",
  overflowY: "auto",
  zIndex: 1000,
  padding: theme.spacing(2),
}));

const SuggestionItem = styled("div")(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(3),
  alignItems: "center",
  padding: theme.spacing(2),
  borderRadius: "8px",
  cursor: "pointer",
  transition: "background-color 0.2s ease",
  "&:hover": {
    backgroundColor: theme.palette.background.elevated,
  },
}));

const DiscoverWrapper = styled("div")({
  position: "relative",
  height: "100%",
  display: "flex",
  alignItems: "center",
});

const DiscoverMenu = styled(motion.div)(({ theme }) => ({
  position: "absolute",
  top: "54px", // Align nicely under navbar
  left: "50%",
  transform: "translateX(-50%)",
  width: "560px",
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.border.default}`,
  borderRadius: "16px",
  boxShadow: "0px 20px 40px rgba(15, 23, 42, 0.08)",
  padding: theme.spacing(6),
  zIndex: theme.zIndex.appBar + 10,
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: theme.spacing(6),
}));

const DropdownCol = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
});

const DropdownHeading = styled("h4")(({ theme }) => ({
  fontSize: "12px",
  fontWeight: theme.typography.weight.bold,
  color: theme.palette.text.muted,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  margin: "0 0 8px 0",
  paddingBottom: "8px",
  borderBottom: `1px solid ${theme.palette.border.default}`,
}));

const DropdownLink = styled(Link, {
  shouldForwardProp: (prop) => prop !== "highlighted",
})(({ theme, highlighted }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  textDecoration: "none",
  fontSize: "14px",
  fontWeight: theme.typography.weight.semibold,
  color: highlighted ? theme.palette.primary.main : theme.palette.text.primary,
  padding: `${theme.spacing(2)} ${theme.spacing(3)}`,
  borderRadius: "8px",
  transition: `all ${theme.transitions.duration.shorter}ms ease`,
  backgroundColor: highlighted ? theme.palette.primary.soft : "transparent",
  "&:hover": {
    backgroundColor: theme.palette.primary.soft,
    color: theme.palette.primary.main,
    transform: "translateX(4px)",
  },
}));

const NavActions = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(3),
}));

const DesktopLinks = styled("nav")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(6),
  marginRight: theme.spacing(6),

  [theme.breakpoints.down("md")]: {
    display: "none",
  },
}));

const NavLink = styled(Link, {
  shouldForwardProp: (prop) => prop !== "active",
})(({ theme, active }) => ({
  textDecoration: "none",
  fontSize: "14px",
  fontWeight: theme.typography.weight.semibold,
  color: active ? theme.palette.primary.main : theme.palette.text.secondary,
  transition: `color ${theme.transitions.duration.shortest}ms ease-in-out`,

  "&:hover": {
    color: theme.palette.primary.main,
  },
}));

const PageBody = styled("main")({
  paddingTop: "72px", // offsets fixed header
  minHeight: "calc(100vh - 72px - 280px)", // pushes footer down
});

const FooterSection = styled("footer")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderTop: `1px solid ${theme.palette.border.default}`,
  paddingTop: theme.spacing(12),
  paddingBottom: theme.spacing(12),
  color: theme.palette.text.secondary,
  fontSize: "14px",
}));

const MobileDrawerList = styled("div")(({ theme }) => ({
  width: "280px",
  padding: theme.spacing(6),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(4),
  height: "100%",
}));

const OfflineBanner = styled(Box)(({ theme }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  height: "36px",
  backgroundColor: theme.palette.status.error,
  color: "#FFFFFF",
  zIndex: 2000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  fontSize: "12px",
  fontWeight: "bold",
}));

const ToastContainer = styled(motion.div)(({ theme }) => ({
  position: "fixed",
  bottom: "24px",
  right: "24px",
  zIndex: 3000,
  backgroundColor: "#1E293B", // Deep charcoal slate
  color: "#FFFFFF",
  padding: `${theme.spacing(3)} ${theme.spacing(5)}`,
  borderRadius: "12px",
  boxShadow: "0px 10px 30px rgba(0,0,0,0.15)",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  fontSize: "13px",
  fontWeight: "bold",
}));

const BreadcrumbNav = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "4px",
  fontSize: "12px",
  color: theme.palette.text.secondary,
  padding: `${theme.spacing(3)} 0`,
  "& a": {
    color: "inherit",
    textDecoration: "none",
    "&:hover": {
      color: theme.palette.primary.main,
    }
  }
}));

export const AppLayout = ({ children }) => {
  const theme = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [discoverOpen, setDiscoverOpen] = useState(false);
  const [mobileDiscoverOpen, setMobileDiscoverOpen] = useState(false);
  
  // Offline state
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Toast notifications state
  const [toast, setToast] = useState(null);

  const { totals } = useCart();
  const { wishlistItems } = useWishlist();
  const { user, logout, isAuthenticated } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  // Listen to offline connection status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Listen to global toast dispatcher
  useEffect(() => {
    const handleToastEvent = (e) => {
      setToast({
        message: e.detail.message,
        type: e.detail.type || "success"
      });
      setTimeout(() => {
        setToast(null);
      }, 3000);
    };
    window.addEventListener("bytevault_toast", handleToastEvent);
    return () => window.removeEventListener("bytevault_toast", handleToastEvent);
  }, []);

  // Sync scroll positioning
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Listen to Escape key to close discover mega menu
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setDiscoverOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Query product records for suggestion lists
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const list = await productService.getProducts();
        setAllProducts(list);
      } catch (err) {
        console.warn("Suggestions data fetch failed", err);
      }
    };
    loadProducts();
  }, []);

  // Handle autocomplete matching
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = allProducts
        .filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 4);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery, allProducts]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery)}`);
      setSuggestions([]);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate("/login");
  };

  // Build breadcrumbs representation
  const renderBreadcrumbs = () => {
    const paths = location.pathname.split("/").filter(Boolean);
    if (paths.length === 0 || paths[0] === "login" || paths[0] === "register") return null;

    return (
      <Container maxWidth="xl">
        <BreadcrumbNav>
          <Link to="/">Home</Link>
          {paths.map((p, idx) => {
            const isLast = idx === paths.length - 1;
            const fullPath = `/${paths.slice(0, idx + 1).join("/")}`;
            const label = p.charAt(0).toUpperCase() + p.slice(1);
            
            return (
              <React.Fragment key={p}>
                <ChevronRightIcon style={{ fontSize: "14px", color: theme.palette.text.muted }} />
                {isLast ? (
                  <span style={{ fontWeight: "bold", color: theme.palette.text.primary }}>{label}</span>
                ) : (
                  <Link to={fullPath}>{label}</Link>
                )}
              </React.Fragment>
            );
          })}
        </BreadcrumbNav>
      </Container>
    );
  };

  return (
    <>
      {isOffline && (
        <OfflineBanner>
          <WifiOffIcon style={{ fontSize: "16px" }} />
          <span>You are currently browsing offline. Verifying connection...</span>
        </OfflineBanner>
      )}

      <Header scrolled={scrolled} style={{ top: isOffline ? "36px" : 0 }}>
        <NavContainer maxWidth="xl">
          <Box display="flex" alignItems="center">
            <MotionBrandLogo 
              to="/"
              aria-label="ByteVault Home"
              whileHover={{ 
                scale: 1.05, 
                y: -1
              }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <img 
                src="/brand/bytevault-rrc-logo.png" 
                alt="ByteVault Logo" 
                style={{ 
                  height: "45px", 
                  width: "auto",
                  maxWidth: "70px",
                  objectFit: "contain",
                  objectPosition: "center"
                }} 
              />
            </MotionBrandLogo>
          </Box>

          <DesktopLinks>
            <NavLink to="/" active={location.pathname === "/" ? 1 : 0}>Home</NavLink>
            <DiscoverWrapper
              onMouseEnter={() => setDiscoverOpen(true)}
              onMouseLeave={() => setDiscoverOpen(false)}
            >
              <NavLink 
                to="/catalog" 
                active={location.pathname.startsWith("/catalog") ? 1 : 0}
                onClick={() => setDiscoverOpen(false)}
              >
                Discover
              </NavLink>
              <AnimatePresence>
                {discoverOpen && (
                  <DiscoverMenu
                    initial={{ opacity: 0, y: 15, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.98 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <DropdownCol>
                      <DropdownHeading>Explore Catalog</DropdownHeading>
                      <DropdownLink to="/catalog" onClick={() => setDiscoverOpen(false)}>
                        <span>All Products</span>
                        <ChevronRightIcon style={{ fontSize: "16px" }} />
                      </DropdownLink>
                      <DropdownLink to="/catalog?sortBy=newest" onClick={() => setDiscoverOpen(false)}>
                        <span>New Arrivals</span>
                        <ChevronRightIcon style={{ fontSize: "16px" }} />
                      </DropdownLink>
                      <DropdownLink to="/catalog?sortBy=rating" onClick={() => setDiscoverOpen(false)}>
                        <span>Trending Assets</span>
                        <ChevronRightIcon style={{ fontSize: "16px" }} />
                      </DropdownLink>
                    </DropdownCol>
                    <DropdownCol>
                      <DropdownHeading>MARKETPLACE SEGMENTS</DropdownHeading>
                      <DropdownLink to="/catalog?type=digital" onClick={() => setDiscoverOpen(false)}>
                        <span>Digital Assets</span>
                        <ChevronRightIcon style={{ fontSize: "16px" }} />
                      </DropdownLink>
                      <DropdownLink to="/catalog?category=Software%20%26%20Coding" onClick={() => setDiscoverOpen(false)}>
                        <span>Developer Resources</span>
                        <ChevronRightIcon style={{ fontSize: "16px" }} />
                      </DropdownLink>
                      <DropdownLink to="/catalog?type=physical" onClick={() => setDiscoverOpen(false)}>
                        <span>Workspace Gear</span>
                        <ChevronRightIcon style={{ fontSize: "16px" }} />
                      </DropdownLink>
                      <DropdownLink to="/catalog?category=Computer%20Peripherals" onClick={() => setDiscoverOpen(false)}>
                        <span>Accessories</span>
                        <ChevronRightIcon style={{ fontSize: "16px" }} />
                      </DropdownLink>
                    </DropdownCol>
                  </DiscoverMenu>
                )}
              </AnimatePresence>
            </DiscoverWrapper>
            {isAuthenticated && user.role === "ADMIN" && (
              <NavLink to="/admin" active={location.pathname.startsWith("/admin") ? 1 : 0}>Admin</NavLink>
            )}
          </DesktopLinks>

          <SearchWrapper>
            <SearchBar onSubmit={handleSearchSubmit}>
              <SearchIcon style={{ fontSize: "20px", color: scrolled ? "#4B5563" : "#9CA3AF" }} />
              <SearchInput
                type="text"
                placeholder="Search blueprints, software, specs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </SearchBar>

            {/* Suggestions drop down */}
            <AnimatePresence>
              {suggestions.length > 0 && (
                <SuggestionDropdown
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  {suggestions.map(p => (
                    <SuggestionItem
                      key={p.id}
                      onClick={() => {
                        setSearchQuery("");
                        setSuggestions([]);
                        navigate(`/products/${p.id}`);
                      }}
                    >
                      <img src={p.image} alt={p.title} style={{ width: "32px", height: "40px", objectFit: "cover", borderRadius: "4px" }} />
                      <Box>
                        <strong style={{ fontSize: "13px", display: "block" }}>{p.title}</strong>
                        <span style={{ fontSize: "11px", color: theme.palette.text.secondary }}>{p.category} · ${p.price.toFixed(2)}</span>
                      </Box>
                    </SuggestionItem>
                  ))}
                </SuggestionDropdown>
              )}
            </AnimatePresence>
          </SearchWrapper>

          <NavActions>
            <IconButton
              aria-label="Wishlist"
              onClick={() => navigate(isAuthenticated ? "/wishlist" : "/login")}
            >
              <Badge content={wishlistItems.length} color="primary">
                <FavoriteBorderOutlinedIcon />
              </Badge>
            </IconButton>

            <IconButton
              aria-label="Shopping Cart"
              onClick={() => navigate("/cart")}
            >
              <Badge content={totals.itemCount} color="primary">
                <ShoppingBagOutlinedIcon />
              </Badge>
            </IconButton>

            {isAuthenticated ? (
              <>
                <IconButton
                  aria-label="Account Settings"
                  aria-controls="account-menu"
                  aria-haspopup="true"
                  onClick={handleMenuOpen}
                >
                  <PersonOutlineOutlinedIcon />
                </IconButton>
                <Menu
                  id="account-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  PaperProps={{
                    style: {
                      borderRadius: "12px",
                      marginTop: "10px",
                      minWidth: "160px",
                      boxShadow: "0px 10px 20px rgba(15, 23, 42, 0.05)"
                    }
                  }}
                >
                  <MenuItem onClick={() => { handleMenuClose(); navigate("/account?tab=profile"); }}>Profile</MenuItem>
                  <MenuItem onClick={() => { handleMenuClose(); navigate("/account?tab=orders"); }}>Orders</MenuItem>
                  <MenuItem onClick={() => { handleMenuClose(); navigate("/account?tab=downloads"); }}>My Digital Library</MenuItem>
                  <MenuItem onClick={() => { handleMenuClose(); navigate("/wishlist"); }}>Wishlist</MenuItem>
                  <MenuItem onClick={() => { handleMenuClose(); navigate("/account?tab=addresses"); }}>Addresses</MenuItem>
                  {user.role === "ADMIN" && (
                    <MenuItem onClick={() => { handleMenuClose(); navigate("/admin"); }}>
                      <ListItemIcon><DashboardIcon fontSize="small" /></ListItemIcon>
                      Admin Dashboard
                    </MenuItem>
                  )}
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon><ExitToAppIcon fontSize="small" /></ListItemIcon>
                    Sign Out
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box display="flex" alignItems="center" gap={3}>
                <NavLink to="/login" style={{ fontSize: "14px" }}>Sign In</NavLink>
                <Button variant="primary" size="small" onClick={() => navigate("/register")} style={{ minWidth: "110px", fontSize: "13px", padding: "6px 16px" }}>
                  Create Account
                </Button>
              </Box>
            )}

            <IconButton
              aria-label="Open navigation menu"
              onClick={() => setMobileOpen(true)}
              sx={{ display: { xs: "inline-flex", md: "none" } }}
            >
              <MenuIcon />
            </IconButton>
          </NavActions>
        </NavContainer>
      </Header>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          style: { borderRadius: "16px 0 0 16px" }
        }}
      >
        <MobileDrawerList>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <MotionBrandLogo 
              to="/" 
              onClick={() => setMobileOpen(false)}
              aria-label="ByteVault Home"
              whileHover={{ 
                scale: 1.05, 
                y: -1
              }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <img 
                src="/brand/bytevault-rrc-logo.png" 
                alt="ByteVault Logo" 
                style={{ 
                  height: "36px", 
                  width: "auto",
                  maxWidth: "60px",
                  objectFit: "contain",
                  objectPosition: "center"
                }} 
              />
            </MotionBrandLogo>
            <IconButton aria-label="Close navigation" onClick={() => setMobileOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider />
          <NavLink to="/" onClick={() => setMobileOpen(false)}>Home</NavLink>
          
          {/* Expandable Mobile Discover Menu */}
          <Box display="flex" flexDirection="column" gap={2}>
            <Box 
              display="flex" 
              justifyContent="space-between" 
              alignItems="center" 
              onClick={() => setMobileDiscoverOpen(!mobileDiscoverOpen)}
              style={{ cursor: "pointer", padding: "8px 0" }}
            >
              <span style={{ fontSize: "14px", fontWeight: theme.typography.weight.semibold, color: theme.palette.text.secondary }}>Discover</span>
              <ChevronRightIcon style={{ 
                transform: mobileDiscoverOpen ? "rotate(90deg)" : "none", 
                transition: "transform 0.2s ease",
                color: theme.palette.text.muted 
              }} />
            </Box>
            <AnimatePresence>
              {mobileDiscoverOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ 
                    overflow: "hidden", 
                    paddingLeft: "16px", 
                    display: "flex", 
                    flexDirection: "column", 
                    gap: "12px",
                    borderLeft: `2px solid ${theme.palette.primary.soft}`
                  }}
                >
                  <Link to="/catalog" onClick={() => setMobileOpen(false)} style={{ textDecoration: "none", fontSize: "13px", fontWeight: "bold", color: theme.palette.text.primary }}>All Products</Link>
                  <Link to="/catalog?type=digital" onClick={() => setMobileOpen(false)} style={{ textDecoration: "none", fontSize: "13px", color: theme.palette.text.secondary }}>Digital Assets</Link>
                  <Link to="/catalog?category=Software%20%26%20Coding" onClick={() => setMobileOpen(false)} style={{ textDecoration: "none", fontSize: "13px", color: theme.palette.text.secondary }}>Developer Resources</Link>
                  <Link to="/catalog?type=physical" onClick={() => setMobileOpen(false)} style={{ textDecoration: "none", fontSize: "13px", color: theme.palette.text.secondary }}>Workspace Gear</Link>
                  <Link to="/catalog?category=Computer%20Peripherals" onClick={() => setMobileOpen(false)} style={{ textDecoration: "none", fontSize: "13px", color: theme.palette.text.secondary }}>Accessories</Link>
                  <Link to="/catalog?sortBy=newest" onClick={() => setMobileOpen(false)} style={{ textDecoration: "none", fontSize: "13px", color: theme.palette.text.secondary }}>New Arrivals</Link>
                  <Link to="/catalog?sortBy=rating" onClick={() => setMobileOpen(false)} style={{ textDecoration: "none", fontSize: "13px", color: theme.palette.text.secondary }}>Trending</Link>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>

          <Divider style={{ margin: "8px 0" }} />

          {isAuthenticated ? (
            <Box display="flex" flexDirection="column" gap={4}>
              <NavLink to="/account?tab=profile" onClick={() => setMobileOpen(false)}>Profile</NavLink>
              <NavLink to="/account?tab=orders" onClick={() => setMobileOpen(false)}>Orders</NavLink>
              <NavLink to="/account?tab=downloads" onClick={() => setMobileOpen(false)}>My Digital Library</NavLink>
              <NavLink to="/wishlist" onClick={() => setMobileOpen(false)}>Wishlist</NavLink>
              <NavLink to="/account?tab=addresses" onClick={() => setMobileOpen(false)}>Addresses</NavLink>
              {user.role === "ADMIN" && (
                <NavLink to="/admin" onClick={() => setMobileOpen(false)}>Admin Dashboard</NavLink>
              )}
              <Box mt={4}>
                <Button variant="secondary" fullWidth onClick={handleLogout}>
                  Sign Out
                </Button>
              </Box>
            </Box>
          ) : (
            <Box display="flex" flexDirection="column" gap={4} mt="auto">
              <Button variant="secondary" fullWidth onClick={() => { setMobileOpen(false); navigate("/login"); }}>
                Sign In
              </Button>
              <Button variant="primary" fullWidth onClick={() => { setMobileOpen(false); navigate("/register"); }}>
                Create Account
              </Button>
            </Box>
          )}
        </MobileDrawerList>
      </Drawer>

      <PageBody style={{ paddingTop: isOffline ? "108px" : "72px" }}>
        {renderBreadcrumbs()}
        {children}
      </PageBody>

      {/* Toast Alert pop up */}
      <AnimatePresence>
        {toast && (
          <ToastContainer
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <CheckCircleIcon style={{ color: theme.palette.status.success, fontSize: "18px" }} />
            <span>{toast.message}</span>
          </ToastContainer>
        )}
      </AnimatePresence>

      {/* Footer */}
      <FooterSection>
        <Container maxWidth="xl">
          <Grid container spacing={6}>
            <Grid item xs={12} md={3}>
              <MotionBrandLogo 
                to="/" 
                style={{ marginBottom: "16px" }}
                aria-label="ByteVault Home"
                whileHover={{ 
                  scale: 1.05, 
                  y: -1
                }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <img 
                  src="/brand/bytevault-rrc-logo.png" 
                  alt="ByteVault Logo" 
                  style={{ 
                    height: "60px", 
                    width: "auto",
                    maxWidth: "100px",
                    objectFit: "contain",
                    objectPosition: "center"
                  }} 
                />
              </MotionBrandLogo>
              <p style={{ maxWidth: "240px", lineHeight: 1.6, marginBottom: "24px" }}>
                Premium digital assets and physical media workspace gear designed for builders and creators.
              </p>
              <span style={{ fontSize: "12px", color: theme.palette.text.muted }}>
                © 2026 ByteVault Media Inc. All rights reserved.
              </span>
            </Grid>
            
            <Grid item xs={6} md={2.25}>
              <h4 style={{ color: theme.palette.text.primary, margin: "0 0 16px 0", fontSize: "14px", fontWeight: "bold" }}>Explore</h4>
              <Box display="flex" flexDirection="column" gap={2}>
                <Link to="/catalog" style={{ textDecoration: "none", color: theme.palette.text.secondary }}>All Products</Link>
                <Link to="/catalog?type=digital" style={{ textDecoration: "none", color: theme.palette.text.secondary }}>Digital Assets</Link>
                <Link to="/catalog?type=physical" style={{ textDecoration: "none", color: theme.palette.text.secondary }}>Workspace Gear</Link>
                <Link to="/catalog?sortBy=rating" style={{ textDecoration: "none", color: theme.palette.text.secondary }}>Trending</Link>
              </Box>
            </Grid>

            <Grid item xs={6} md={2.25}>
              <h4 style={{ color: theme.palette.text.primary, margin: "0 0 16px 0", fontSize: "14px", fontWeight: "bold" }}>Customer</h4>
              <Box display="flex" flexDirection="column" gap={2}>
                <Link to="/account" style={{ textDecoration: "none", color: theme.palette.text.secondary }}>My Account</Link>
                <Link to="/orders" style={{ textDecoration: "none", color: theme.palette.text.secondary }}>Orders</Link>
                <Link to="/account?tab=downloads" style={{ textDecoration: "none", color: theme.palette.text.secondary }}>My Digital Library</Link>
                <Link to="/wishlist" style={{ textDecoration: "none", color: theme.palette.text.secondary }}>Wishlist</Link>
              </Box>
            </Grid>

            <Grid item xs={6} md={2.25}>
              <h4 style={{ color: theme.palette.text.primary, margin: "0 0 16px 0", fontSize: "14px", fontWeight: "bold" }}>Company</h4>
              <Box display="flex" flexDirection="column" gap={2}>
                <Link to="/about" style={{ textDecoration: "none", color: theme.palette.text.secondary }}>About</Link>
                <Link to="/faq" style={{ textDecoration: "none", color: theme.palette.text.secondary }}>FAQ</Link>
                <Link to="/contact" style={{ textDecoration: "none", color: theme.palette.text.secondary }}>Contact</Link>
              </Box>
            </Grid>

            <Grid item xs={6} md={2.25}>
              <h4 style={{ color: theme.palette.text.primary, margin: "0 0 16px 0", fontSize: "14px", fontWeight: "bold" }}>Legal</h4>
              <Box display="flex" flexDirection="column" gap={2}>
                <Link to="/privacy" style={{ textDecoration: "none", color: theme.palette.text.secondary }}>Privacy</Link>
                <Link to="/terms" style={{ textDecoration: "none", color: theme.palette.text.secondary }}>Terms</Link>
                <Link to="/refund" style={{ textDecoration: "none", color: theme.palette.text.secondary }}>Refund</Link>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </FooterSection>
    </>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppLayout;
