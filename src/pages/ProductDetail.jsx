import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { styled, useTheme } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import {
  ShoppingBag as ShoppingBagIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Favorite as FavoriteIcon,
  Bolt as BoltIcon,
  LocalShipping as LocalShippingIcon,
  ArrowBack as ArrowBackIcon
} from "@mui/icons-material";

import { Container } from "../components/primitives/Container";
import { Button } from "../components/primitives/Button";
import { IconButton } from "../components/primitives/IconButton";
import { SectionHeader } from "../components/primitives/SectionHeader";
import { Chip } from "../components/primitives/Chip";
import { Rating } from "../components/primitives/Rating";
import { Price } from "../components/primitives/Price";
import { Skeleton } from "../components/primitives/Skeleton";
import { Card } from "../components/primitives/Card";
import { ProductCard } from "../features/products/components/ProductCard/ProductCard";
import { useCart } from "../store/CartContext";
import { useWishlist } from "../store/WishlistContext";
import { productService } from "../services/productService";

const DetailHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(3),
  marginBottom: theme.spacing(8),
}));

const ImageGalleryWrapper = styled("div")(({ theme }) => ({
  width: "100%",
  backgroundColor: theme.palette.background.elevated,
  borderRadius: theme.radius.lg,
  overflow: "hidden",
  position: "relative",
  paddingTop: "100%", // 1:1 Aspect Ratio
}));

const MainImage = styled("img")({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  transition: "opacity 0.3s ease-in-out",
});

const MetaLabel = styled("dt")(({ theme }) => ({
  fontSize: "12px",
  textTransform: "uppercase",
  color: theme.palette.text.secondary,
  fontWeight: theme.typography.weight.semibold,
  letterSpacing: "0.05em",
  marginBottom: "4px",
}));

const MetaValue = styled("dd")(({ theme }) => ({
  fontSize: "14px",
  color: theme.palette.text.primary,
  margin: "0 0 16px 0",
}));

const StickyDetailsColumn = styled("div")(({ theme }) => ({
  position: "sticky",
  top: "100px", // Sticks below navbar
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(6),
  alignSelf: "start",
}));

const MobilePurchaseBar = styled("div")(({ theme }) => ({
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: theme.palette.background.surface,
  borderTop: `1px solid ${theme.palette.border.default}`,
  padding: `${theme.spacing(3)} ${theme.spacing(6)}`,
  zIndex: 1000,
  display: "none",
  alignItems: "center",
  justifyContent: "space-between",
  boxShadow: "0px -4px 10px rgba(0, 0, 0, 0.05)",

  [theme.breakpoints.down("md")]: {
    display: "flex",
  },
}));

export const ProductDetail = () => {
  const { id } = useParams();
  const theme = useTheme();
  const navigate = useNavigate();

  const { addItem } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [favState, setFavState] = useState(false);
  const [cartBtnState, setCartBtnState] = useState("default");
  
  // Interactive Gallery index state
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Tab content selection state
  const [activeTab, setActiveTab] = useState(0); // 0: Overview & Specs, 1: Reviews, 2: FAQ

  // Fetch details on parameter shifts
  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      setActiveImageIdx(0);
      try {
        const details = await productService.getProductById(id);
        setProduct(details);
        setFavState(isWishlisted(details.id));
        setQuantity(1);

        // Save to recently viewed
        try {
          const viewed = JSON.parse(localStorage.getItem("bytevault_recently_viewed") || "[]");
          const nextViewed = [details.id, ...viewed.filter(vid => vid !== details.id)].slice(0, 4);
          localStorage.setItem("bytevault_recently_viewed", JSON.stringify(nextViewed));
        } catch (e) {
          console.warn("Failed to save recently viewed", e);
        }

        const recommendations = await productService.getRelatedProducts(details.id, 4);
        setRelated(recommendations);
      } catch (err) {
        setError(err.message || "Failed to load product.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id, isWishlisted]);

  const handleAddToCart = () => {
    if (!product) return;
    setCartBtnState("loading");
    
    // Simulate tactile loading response
    setTimeout(() => {
      const isDigital = product.type === "DIGITAL";
      const addCount = isDigital ? 1 : quantity;

      for (let i = 0; i < addCount; i++) {
        addItem(product);
      }

      setCartBtnState("success");
      setTimeout(() => {
        setCartBtnState("default");
      }, 1500);
    }, 800);
  };

  const handleWishlistToggle = () => {
    if (!product) return;
    toggleWishlist(product);
    setFavState(!favState);
  };

  if (loading) {
    return (
      <Container style={{ paddingTop: "80px" }}>
        <DetailHeader>
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="text" width="20%" />
        </DetailHeader>
        <Grid container spacing={8}>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rectangular" height={400} radius="lg" />
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant="text" width="40%" height={24} style={{ marginBottom: "8px" }} />
            <Skeleton variant="text" width="80%" height={40} style={{ marginBottom: "16px" }} />
            <Skeleton variant="rectangular" height={100} radius="md" style={{ marginBottom: "24px" }} />
            <Skeleton variant="rectangular" height={48} radius="md" width={200} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container style={{ paddingTop: "80px", textAlign: "center" }}>
        <h2>Product Details Unavailable</h2>
        <p style={{ color: "#6B7280", marginBottom: "24px" }}>{error || "The selected item could not be retrieved."}</p>
        <Button variant="primary" onClick={() => navigate("/catalog")}>Return to Catalog</Button>
      </Container>
    );
  }

  const isDigital = product.type === "DIGITAL";
  
  // Generate multi-images sequence dynamically
  const galleryImages = [
    product.image,
    product.image + "&sat=-80", // Desaturated alternative
    product.image + "&hue=90",  // Hue shifted alternative
  ];

  return (
    <Container style={{ paddingTop: "48px", paddingBottom: "128px" }}>
      <DetailHeader>
        <IconButton aria-label="Go Back" variant="outlined" onClick={() => navigate(-1)} size="sm">
          <ArrowBackIcon />
        </IconButton>
        <span style={{ fontSize: "14px", color: theme.palette.text.secondary }}>
          Back to {product.category}
        </span>
      </DetailHeader>

      <Grid container spacing={8}>
        {/* Gallery Image Column */}
        <Grid item xs={12} md={6}>
          <ImageGalleryWrapper>
            <MainImage src={galleryImages[activeImageIdx]} alt={product.title} />
          </ImageGalleryWrapper>

          {/* Gallery Thumbnails */}
          <Box display="flex" gap={3} mt={3}>
            {galleryImages.map((img, idx) => (
              <Box 
                key={idx}
                onClick={() => setActiveImageIdx(idx)}
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: theme.radius.sm,
                  border: activeImageIdx === idx ? `2px solid ${theme.palette.primary.main}` : `1px solid ${theme.palette.border.default}`,
                  cursor: "pointer",
                  overflow: "hidden",
                  opacity: activeImageIdx === idx ? 1 : 0.7,
                  transition: "opacity 0.2s"
                }}
              >
                <img 
                  src={img} 
                  alt={`Thumbnail ${idx + 1}`} 
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                />
              </Box>
            ))}
          </Box>
        </Grid>

        {/* Sticky Actions & Buy Details Column */}
        <Grid item xs={12} md={6}>
          <StickyDetailsColumn>
            <div>
              <Box display="flex" alignItems="center" gap={3} mb={2}>
                <Chip
                  label={isDigital ? "Digital Asset" : "Physical Gear"}
                  color={isDigital ? "primary" : "neutral"}
                  variant="filled"
                  uppercase
                />
                {!product.inStock && (
                  <Chip label="Out of Stock" color="error" variant="filled" uppercase />
                )}
              </Box>
              <h1 style={{ fontFamily: theme.typography.h1.fontFamily, fontSize: "28px", fontWeight: "bold", margin: "0 0 12px 0", color: "#111111" }}>
                {product.title}
              </h1>
              <Rating value={product.rating} count={product.ratingCount} size="sm" />
            </div>

            <Price amount={product.price} originalAmount={product.originalPrice} size="lg" />

            <p style={{ fontFamily: theme.typography.fontFamily, fontSize: "15px", color: theme.palette.text.secondary, lineHeight: 1.6, margin: 0 }}>
              {product.description}
            </p>

            {/* Quantity and Actions Block */}
            <Box display="flex" flexDirection="column" gap={3}>
              {!isDigital && product.inStock && (
                <Box display="flex" alignItems="center" gap={4}>
                  <span style={{ fontSize: "14px", fontWeight: "bold" }}>Quantity:</span>
                  <Box display="flex" alignItems="center" style={{ border: `1px solid ${theme.palette.border.default}`, borderRadius: theme.radius.sm }}>
                    <button 
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      style={{ padding: "8px 16px", border: "none", background: "transparent", cursor: "pointer", fontSize: "16px" }}
                    >
                      -
                    </button>
                    <span style={{ minWidth: "32px", textAlign: "center", fontSize: "14px", fontWeight: "bold" }}>{quantity}</span>
                    <button 
                      onClick={() => setQuantity(q => q + 1)}
                      style={{ padding: "8px 16px", border: "none", background: "transparent", cursor: "pointer", fontSize: "16px" }}
                    >
                      +
                    </button>
                  </Box>
                </Box>
              )}

              <Box display="flex" gap={3} alignItems="center">
                <Button
                  variant="primary"
                  state={cartBtnState}
                  disabled={!product.inStock}
                  onClick={handleAddToCart}
                  leftIcon={cartBtnState === "default" && <ShoppingBagIcon style={{ fontSize: "18px" }} />}
                  style={{ flexGrow: 1, height: "48px" }}
                >
                  {cartBtnState === "default" ? "Add to Shopping Cart" : cartBtnState === "loading" ? "Adding" : "Added to Cart"}
                </Button>

                <IconButton
                  aria-label={favState ? "Remove from wishlist" : "Add to wishlist"}
                  variant="outlined"
                  size="lg"
                  onClick={handleWishlistToggle}
                  style={{ height: "48px", width: "48px", borderRadius: theme.radius.md }}
                >
                  {favState ? <FavoriteIcon style={{ color: "#EF4444" }} /> : <FavoriteBorderIcon />}
                </IconButton>
              </Box>
            </Box>

            <Divider />

            {/* Instant Information Blocks */}
            <Box>
              {isDigital ? (
                <Box display="flex" alignItems="center" gap={3} p={3} style={{ backgroundColor: theme.palette.primary.soft, borderRadius: theme.radius.md }}>
                  <BoltIcon style={{ color: theme.palette.primary.main }} />
                  <span style={{ fontSize: "12px", color: theme.palette.primary.main, fontWeight: "bold" }}>
                    Instant Delivery: Digital access credentials will be unlocked in your digital cabinet instantly on checkout.
                  </span>
                </Box>
              ) : (
                <Box display="flex" alignItems="center" gap={3} p={3} style={{ backgroundColor: theme.palette.background.elevated, borderRadius: theme.radius.md }}>
                  <LocalShippingIcon style={{ color: theme.palette.text.secondary }} />
                  <span style={{ fontSize: "12px", color: theme.palette.text.secondary }}>
                    Fulfillment Security: Ships worldwide via premium couriers. Full tracking milestones synced directly.
                  </span>
                </Box>
              )}
            </Box>
          </StickyDetailsColumn>
        </Grid>
      </Grid>

      {/* Tabs Panel Segment for Specs, Reviews and FAQs */}
      <Box mt={12} borderBottom={`1px solid ${theme.palette.border.default}`} pb={2} display="flex" gap={6}>
        {["Overview & Specs", `Reviews (${product.reviews?.length || 0})`, "FAQs"].map((label, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTab(idx)}
            style={{
              background: "none",
              border: "none",
              borderBottom: activeTab === idx ? `2px solid ${theme.palette.primary.main}` : "2px solid transparent",
              color: activeTab === idx ? theme.palette.primary.main : theme.palette.text.secondary,
              fontWeight: activeTab === idx ? "bold" : "normal",
              paddingBottom: "8px",
              cursor: "pointer",
              fontSize: "15px",
              fontFamily: theme.typography.fontFamily
            }}
          >
            {label}
          </button>
        ))}
      </Box>

      {/* Tab Panels */}
      <Box mt={8} minHeight="200px">
        {activeTab === 0 && (
          <Grid container spacing={8}>
            <Grid item xs={12} md={7}>
              <h3 style={{ fontFamily: theme.typography.h3.fontFamily, fontSize: "18px", fontWeight: "bold", marginBottom: "16px" }}>
                Product Description
              </h3>
              <p style={{ fontFamily: theme.typography.fontFamily, color: theme.palette.text.secondary, lineHeight: 1.7, margin: 0 }}>
                {product.description}
              </p>
            </Grid>
            <Grid item xs={12} md={5}>
              <h3 style={{ fontFamily: theme.typography.h3.fontFamily, fontSize: "18px", fontWeight: "bold", marginBottom: "16px" }}>
                Specifications
              </h3>
              <Grid container component="dl" style={{ margin: 0 }}>
                {isDigital ? (
                  <>
                    <Grid item xs={6}><MetaLabel>File Format</MetaLabel><MetaValue>{product.specs.format}</MetaValue></Grid>
                    <Grid item xs={6}><MetaLabel>Download Size</MetaLabel><MetaValue>{product.specs.fileSize}</MetaValue></Grid>
                    <Grid item xs={6}><MetaLabel>Compatibility</MetaLabel><MetaValue>{product.specs.compatibility}</MetaValue></Grid>
                    <Grid item xs={6}><MetaLabel>Version</MetaLabel><MetaValue>{product.specs.version}</MetaValue></Grid>
                  </>
                ) : (
                  <>
                    <Grid item xs={6}><MetaLabel>Material</MetaLabel><MetaValue>{product.specs.material}</MetaValue></Grid>
                    <Grid item xs={6}><MetaLabel>Dimensions</MetaLabel><MetaValue>{product.specs.dimensions}</MetaValue></Grid>
                    <Grid item xs={6}><MetaLabel>Weight</MetaLabel><MetaValue>{product.specs.weight}</MetaValue></Grid>
                    <Grid item xs={6}><MetaLabel>Warranty</MetaLabel><MetaValue>{product.specs.warranty}</MetaValue></Grid>
                  </>
                )}
              </Grid>
            </Grid>
          </Grid>
        )}

        {activeTab === 1 && (
          <Box maxWidth="720px">
            <h3 style={{ fontFamily: theme.typography.h3.fontFamily, fontSize: "18px", fontWeight: "bold", marginBottom: "24px" }}>
              Customer Reviews
            </h3>
            {product.reviews && product.reviews.length > 0 ? (
              <Box display="flex" flexDirection="column" gap={4}>
                {product.reviews.map((rev) => (
                  <Card key={rev.id} padding={4} border={true} radius="md">
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <span style={{ fontSize: "14px", fontWeight: "bold" }}>{rev.author}</span>
                      <span style={{ fontSize: "12px", color: theme.palette.text.muted }}>{rev.date}</span>
                    </Box>
                    <Rating value={rev.rating} size="xs" readOnly style={{ marginBottom: "8px" }} />
                    <p style={{ margin: 0, fontSize: "14px", color: theme.palette.text.secondary, lineHeight: 1.5 }}>
                      {rev.text}
                    </p>
                  </Card>
                ))}
              </Box>
            ) : (
              <p style={{ color: theme.palette.text.secondary }}>No reviews yet.</p>
            )}
          </Box>
        )}

        {activeTab === 2 && (
          <Box maxWidth="720px">
            <h3 style={{ fontFamily: theme.typography.h3.fontFamily, fontSize: "18px", fontWeight: "bold", marginBottom: "24px" }}>
              Frequently Asked Questions
            </h3>
            <Box display="flex" flexDirection="column" gap={4}>
              {(product.faq || [
                { q: "Is this purchase refundable?", a: "Due to the instant accessibility of digital assets, software purchases are non-refundable. Hardware items include a 30-day standard return policy." },
                { q: "How do I download updates?", a: "All updates can be fetched inside your Account downloads locker panel at any time." }
              ]).map((item, idx) => (
                <div key={idx}>
                  <h4 style={{ margin: "0 0 8px 0", color: theme.palette.text.primary, fontSize: "15px" }}>{item.q}</h4>
                  <p style={{ margin: 0, color: theme.palette.text.secondary, fontSize: "14px", lineHeight: 1.6 }}>{item.a}</p>
                </div>
              ))}
            </Box>
          </Box>
        )}
      </Box>

      {/* Related Products Recommendation List */}
      {related.length > 0 && (
        <div style={{ marginTop: "96px" }}>
          <SectionHeader
            title="Explore Related Workspace Gear"
            subtitle="Recommended products matching current catalog entries."
          />
          <Grid container spacing={4}>
            {related.map(prod => (
              <Grid item xs={12} sm={6} md={3} key={prod.id}>
                <ProductCard 
                  product={prod} 
                  onAddToCart={addItem} 
                  onWishlistToggle={toggleWishlist}
                  isWishlisted={isWishlisted(prod.id)}
                />
              </Grid>
            ))}
          </Grid>
        </div>
      )}

      {/* Mobile Sticky Action Bar */}
      <MobilePurchaseBar>
        <Box>
          <span style={{ fontSize: "11px", color: theme.palette.text.secondary, textTransform: "uppercase", display: "block" }}>Price</span>
          <Price amount={product.price} size="sm" />
        </Box>
        <Button
          variant="primary"
          state={cartBtnState}
          disabled={!product.inStock}
          onClick={handleAddToCart}
          style={{ minWidth: "160px", height: "40px" }}
        >
          {cartBtnState === "default" ? "Add to Cart" : cartBtnState === "loading" ? "Adding" : "Added"}
        </Button>
      </MobilePurchaseBar>
    </Container>
  );
};

export default ProductDetail;
