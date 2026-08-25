import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { styled, alpha } from "@mui/material/styles";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ShoppingBagOutlined as ShoppingBagOutlinedIcon,
  FavoriteBorderOutlined as FavoriteBorderOutlinedIcon,
  PersonOutlineOutlined as PersonOutlineOutlinedIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  ExitToApp as ExitToAppIcon,
  Dashboard as DashboardIcon,
  Bolt as BoltIcon
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
import { Input } from "../components/primitives/Input";

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
});

const BrandLogo = styled(Link)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  textDecoration: "none",
  color: theme.palette.text.primary,
  fontWeight: theme.typography.weight.bold,
  fontSize: "20px",
  letterSpacing: "-0.02em",
  fontFamily: theme.typography.h1.fontFamily,

  "& svg": {
    color: theme.palette.primary.main,
  },
}));

const SearchBar = styled("form")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  backgroundColor: theme.palette.background.elevated,
  borderRadius: theme.radius.full,
  padding: `${theme.spacing(1.5)} ${theme.spacing(4)}`,
  width: "320px",
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

export const AppLayout = ({ children }) => {
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const { totals } = useCart();
  const { wishlistItems } = useWishlist();
  const { user, logout, isAuthenticated } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
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

  return (
    <>
      <Header scrolled={scrolled}>
        <NavContainer maxWidth="xl">
          <Box display="flex" alignItems="center">
            <BrandLogo to="/">
              <BoltIcon />
              <span>ByteVault</span>
            </BrandLogo>
          </Box>

          <DesktopLinks>
            <NavLink to="/" active={location.pathname === "/" ? 1 : 0}>Home</NavLink>
            <NavLink to="/catalog" active={location.pathname === "/catalog" ? 1 : 0}>Discover</NavLink>
            {isAuthenticated && user.role === "ADMIN" && (
              <NavLink to="/admin" active={location.pathname.startsWith("/admin") ? 1 : 0}>Admin</NavLink>
            )}
          </DesktopLinks>

          <SearchBar onSubmit={handleSearchSubmit}>
            <SearchIcon style={{ fontSize: "20px", color: scrolled ? "#4B5563" : "#9CA3AF" }} />
            <SearchInput
              type="text"
              placeholder="Search products, files, books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchBar>

          <NavActions>
            <IconButton
              aria-label="Wishlist"
              onClick={() => navigate(isAuthenticated ? "/account?tab=wishlist" : "/login")}
            >
              <Badge content={wishlistItems.length} color="accent">
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
                      boxShadow: "0px 10px 20px rgba(0,0,0,0.05)"
                    }
                  }}
                >
                  <MenuItem onClick={() => { handleMenuClose(); navigate("/account"); }}>My Account</MenuItem>
                  <MenuItem onClick={() => { handleMenuClose(); navigate("/account?tab=downloads"); }}>My Cabinet</MenuItem>
                  {user.role === "ADMIN" && (
                    <MenuItem onClick={() => { handleMenuClose(); navigate("/admin"); }}>
                      <ListItemIcon><DashboardIcon fontSize="small" /></ListItemIcon>
                      Admin Dashboard
                    </MenuItem>
                  )}
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon><ExitToAppIcon fontSize="small" /></ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <NavLink to="/login" style={{ fontSize: "14px" }}>Sign In</NavLink>
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
            <BrandLogo to="/" onClick={() => setMobileOpen(false)}>
              <BoltIcon />
              <span>ByteVault</span>
            </BrandLogo>
            <IconButton aria-label="Close navigation" onClick={() => setMobileOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider />
          <NavLink to="/" onClick={() => setMobileOpen(false)}>Home</NavLink>
          <NavLink to="/catalog" onClick={() => setMobileOpen(false)}>Discover</NavLink>
          {isAuthenticated ? (
            <>
              <NavLink to="/account" onClick={() => setMobileOpen(false)}>My Account</NavLink>
              <NavLink to="/account?tab=downloads" onClick={() => setMobileOpen(false)}>Digital Cabinet</NavLink>
              <Box mt="auto">
                <Button variant="secondary" fullWidth onClick={handleLogout}>
                  Logout
                </Button>
              </Box>
            </>
          ) : (
            <Button variant="primary" fullWidth onClick={() => { setMobileOpen(false); navigate("/login"); }} style={{ marginTop: "auto" }}>
              Sign In
            </Button>
          )}
        </MobileDrawerList>
      </Drawer>

      <PageBody>{children}</PageBody>

      {/* Footer */}
      <FooterSection>
        <Container maxWidth="xl">
          <Grid container spacing={8}>
            <Grid item xs={12} md={4}>
              <BrandLogo to="/" style={{ marginBottom: "16px" }}>
                <BoltIcon />
                <span>ByteVault Media</span>
              </BrandLogo>
              <p style={{ maxWidth: "280px", lineHeight: 1.6 }}>
                Premium digital assets and physical media workspace gear designed for builders and creators.
              </p>
            </Grid>
            <Grid item xs={6} md={2.4}>
              <h4 style={{ color: "#111111", margin: "0 0 16px 0", fontSize: "14px" }}>Shop Catalog</h4>
              <Box display="flex" flexDirection="column" gap={2}>
                <NavLink to="/catalog?type=digital">Digital Software</NavLink>
                <NavLink to="/catalog?type=physical">Physical Gear</NavLink>
                <NavLink to="/catalog">Browse All</NavLink>
              </Box>
            </Grid>
            <Grid item xs={6} md={2.4}>
              <h4 style={{ color: "#111111", margin: "0 0 16px 0", fontSize: "14px" }}>Entitlements & Help</h4>
              <Box display="flex" flexDirection="column" gap={2}>
                <NavLink to="/account?tab=downloads">File Cabinet</NavLink>
                <NavLink to="/account?tab=orders">Order Tracking</NavLink>
                <NavLink to="/design-system">Developer Playground</NavLink>
              </Box>
            </Grid>
            <Grid item xs={12} md={3.2}>
              <h4 style={{ color: "#111111", margin: "0 0 16px 0", fontSize: "14px" }}>Newsletter</h4>
              <p style={{ margin: "0 0 16px 0", lineHeight: 1.5 }}>
                Subtle updates, release notes, and discount access codes.
              </p>
              <Box display="flex" gap={2}>
                <Input placeholder="Enter your email" style={{ flexGrow: 1 }} />
                <Button variant="primary">Join</Button>
              </Box>
            </Grid>
          </Grid>
          <Divider style={{ margin: "48px 0 24px 0" }} />
          <Box display="flex" justifyContent="space-between" flexWrap="wrap" gap={2}>
            <span>© 2026 ByteVault Media Inc. All rights reserved.</span>
            <Box display="flex" gap={4}>
              <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>Privacy Policy</Link>
              <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>Terms of Service</Link>
            </Box>
          </Box>
        </Container>
      </FooterSection>
    </>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppLayout;
