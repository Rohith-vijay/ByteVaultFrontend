import React, { useState, useEffect } from "react";
import { styled, useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import {
  Bolt as BoltIcon,
  LocalShipping as LocalShippingIcon,
  VerifiedUser as VerifiedUserIcon,
  ArrowForward as ArrowForwardIcon
} from "@mui/icons-material";
import { motion } from "framer-motion";

import { Container } from "../components/primitives/Container";
import { Button } from "../components/primitives/Button";
import { Card } from "../components/primitives/Card";
import { Chip } from "../components/primitives/Chip";
import { SectionHeader } from "../components/primitives/SectionHeader";
import { Skeleton } from "../components/primitives/Skeleton";
import { ProductCard } from "../features/products/components/ProductCard/ProductCard";
import { productService } from "../services/productService";
import { staggerContainerVariants, staggerChildVariants } from "../animations/motion";

const HeroSection = styled("section")(({ theme }) => ({
  paddingTop: theme.spacing(16),
  paddingBottom: theme.spacing(20),
  backgroundColor: theme.palette.background.default,
  [theme.breakpoints.down("md")]: {
    paddingTop: theme.spacing(10),
    paddingBottom: theme.spacing(12),
  },
}));

const HeroTitle = styled("h1")(({ theme }) => ({
  ...theme.typography.display,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(4),
  fontWeight: theme.typography.weight.extrabold,
}));

const HeroSubtitle = styled("p")(({ theme }) => ({
  ...theme.typography.bodyLarge,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(8),
  maxWidth: "580px",
  lineHeight: 1.6,
}));

const CategoryCard = styled(Card)(({ theme }) => ({
  textAlign: "center",
  cursor: "pointer",
  transition: `transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease`,
  "&:hover": {
    borderColor: theme.palette.primary.main,
    boxShadow: theme.elevation.hover,
    transform: "translateY(-4px)"
  }
}));

const CategoryIcon = styled("div")(({ theme }) => ({
  width: "56px",
  height: "56px",
  borderRadius: theme.radius.full,
  backgroundColor: theme.palette.primary.soft,
  color: theme.palette.primary.main,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto 16px auto",
  "& svg": {
    fontSize: "28px"
  }
}));

const TrustBanner = styled("section")(({ theme }) => ({
  paddingTop: theme.spacing(12),
  paddingBottom: theme.spacing(12),
  backgroundColor: theme.palette.background.elevated,
  borderBottom: `1px solid ${theme.palette.border.default}`,
}));

const TrustItem = styled("div")(({ theme }) => ({
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: theme.spacing(4),
}));

const StorySection = styled("section")(({ theme }) => ({
  paddingTop: theme.spacing(16),
  paddingBottom: theme.spacing(16),
  backgroundColor: theme.palette.background.default,
  borderTop: `1px solid ${theme.palette.border.default}`,
}));

const StoryTitle = styled("h2")(({ theme }) => ({
  ...theme.typography.h2,
  color: theme.palette.text.primary,
  margin: `${theme.spacing(4)} 0`
}));

const StoryText = styled("p")(({ theme }) => ({
  ...theme.typography.body1,
  color: theme.palette.text.secondary,
  lineHeight: 1.7,
  marginBottom: theme.spacing(6)
}));

export const Home = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    const fetchHomepageData = async () => {
      setLoading(true);
      try {
        const list = await productService.getProducts();
        // Curated Items (first 5)
        setFeaturedProducts(list.slice(0, 5));
        
        // Recommended (next 3 items)
        setRecommendedProducts(list.slice(5, 8));

        // Load recently viewed products
        const viewedIds = JSON.parse(localStorage.getItem("bytevault_recently_viewed") || "[]");
        if (viewedIds.length > 0) {
          const viewedItems = [];
          for (const vid of viewedIds) {
            try {
              const item = await productService.getProductById(vid);
              if (item) viewedItems.push(item);
            } catch {
              // Ignore invalid IDs
            }
          }
          setRecentlyViewed(viewedItems);
        }
      } catch (err) {
        console.error("Home details fetching error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomepageData();
  }, []);

  return (
    <>
      {/* Hero Header Section */}
      <HeroSection>
        <Container maxWidth="xl">
          <Grid container spacing={8} alignItems="center">
            <Grid 
              item 
              xs={12} 
              md={6}
              component={motion.div}
              variants={staggerContainerVariants}
              initial="initial"
              animate="animate"
            >
              <motion.div variants={staggerChildVariants}>
                <Box mb={3}>
                  <Chip label="Developer & Designer Catalog" color="primary" uppercase />
                </Box>
              </motion.div>
              <motion.div variants={staggerChildVariants}>
                <HeroTitle>
                  Assets for code, <br />
                  Gear for execution.
                </HeroTitle>
              </motion.div>
              <motion.div variants={staggerChildVariants}>
                <HeroSubtitle>
                  ByteVault Media bridges the gap between software optimization and tactile hardware workspace gear.
                  Explore premium React kits, custom mechanical items, and books.
                </HeroSubtitle>
              </motion.div>
              <motion.div variants={staggerChildVariants}>
                <Box display="flex" gap={4} flexWrap="wrap">
                  <Button variant="primary" onClick={() => navigate("/catalog")} rightIcon={<ArrowForwardIcon style={{ fontSize: "16px" }} />}>
                    Explore Workspace
                  </Button>
                  <Button variant="secondary" onClick={() => navigate("/catalog?type=digital")}>
                    Browse Digital
                  </Button>
                </Box>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box 
                position="relative" 
                display="flex" 
                justifyContent="center"
                component={motion.div}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&auto=format&fit=crop&q=80" 
                  alt="Minimalist Desk Setup with Laptop, Keyboard, and Headphones"
                  style={{
                    width: "100%",
                    maxWidth: "520px",
                    height: "380px",
                    objectFit: "cover",
                    borderRadius: theme.radius.xl,
                    boxShadow: theme.elevation.hover
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </HeroSection>

      {/* Trust Values Banner */}
      <TrustBanner>
        <Container maxWidth="xl">
          <Grid container spacing={6}>
            <Grid item xs={12} sm={4}>
              <TrustItem>
                <VerifiedUserIcon style={{ fontSize: "36px", color: theme.palette.primary.main, marginBottom: "16px" }} />
                <h4 style={{ margin: "0 0 8px 0", color: "#111111" }}>Curated Quality</h4>
                <p style={{ margin: 0, fontSize: "13px", lineHeight: 1.5, textAlign: "center" }}>
                  Every template and physical gear item in our store is audited for performance and security.
                </p>
              </TrustItem>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TrustItem>
                <BoltIcon style={{ fontSize: "36px", color: theme.palette.accent.main, marginBottom: "16px" }} />
                <h4 style={{ margin: "0 0 8px 0", color: "#111111" }}>Instant Digital Delivery</h4>
                <p style={{ margin: 0, fontSize: "13px", lineHeight: 1.5, textAlign: "center" }}>
                  Purchase digital kits, vectors, or blueprints and download them immediately from your cabinet.
                </p>
              </TrustItem>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TrustItem>
                <LocalShippingIcon style={{ fontSize: "36px", color: theme.palette.text.primary, marginBottom: "16px" }} />
                <h4 style={{ margin: "0 0 8px 0", color: "#111111" }}>Secure Global Shipping</h4>
                <p style={{ margin: 0, fontSize: "13px", lineHeight: 1.5, textAlign: "center" }}>
                  Insured courier shipping for hardware and books with live tracking notifications.
                </p>
              </TrustItem>
            </Grid>
          </Grid>
        </Container>
      </TrustBanner>

      {/* Category Exploration Section */}
      <section style={{ paddingTop: "64px", paddingBottom: "64px" }}>
        <Container maxWidth="xl">
          <SectionHeader 
            title="Browse by Workspace Segment" 
            subtitle="Choose between digital files or workspace setups." 
          />
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={3} onClick={() => navigate("/catalog?type=digital")}>
              <CategoryCard padding={6}>
                <CategoryIcon><BoltIcon /></CategoryIcon>
                <h4 style={{ margin: "0 0 8px 0", color: "#111111" }}>Digital Software</h4>
                <span style={{ fontSize: "13px", color: theme.palette.text.secondary }}>Frameworks, UI Kits, blueprints</span>
              </CategoryCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3} onClick={() => navigate("/catalog?category=Audio Equipment")}>
              <CategoryCard padding={6}>
                <CategoryIcon><ArrowForwardIcon style={{ transform: "rotate(-45deg)" }} /></CategoryIcon>
                <h4 style={{ margin: "0 0 8px 0", color: "#111111" }}>Audio & Focus</h4>
                <span style={{ fontSize: "13px", color: theme.palette.text.secondary }}>Noise-canceling headphones</span>
              </CategoryCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3} onClick={() => navigate("/catalog?category=Computer Peripherals")}>
              <CategoryCard padding={6}>
                <CategoryIcon><ArrowForwardIcon /></CategoryIcon>
                <h4 style={{ margin: "0 0 8px 0", color: "#111111" }}>Desktop Gear</h4>
                <span style={{ fontSize: "13px", color: theme.palette.text.secondary }}>Custom keycaps, keypads</span>
              </CategoryCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3} onClick={() => navigate("/catalog?category=Travel Gear")}>
              <CategoryCard padding={6}>
                <CategoryIcon><LocalShippingIcon /></CategoryIcon>
                <h4 style={{ margin: "0 0 8px 0", color: "#111111" }}>Travel & Tech</h4>
                <span style={{ fontSize: "13px", color: theme.palette.text.secondary }}>Minimalist backpacks, organizers</span>
              </CategoryCard>
            </Grid>
          </Grid>
        </Container>
      </section>

      {/* Curated Showcases */}
      <section style={{ paddingTop: "32px", paddingBottom: "64px" }}>
        <Container maxWidth="xl">
          <SectionHeader 
            title="Curated Marketplace Items" 
            subtitle="High-demand entries recommended for you."
            action={
              <Button variant="secondary" onClick={() => navigate("/catalog")}>
                View All Catalog
              </Button>
            }
          />
          {loading ? (
            <Grid container spacing={4}>
              {[1, 2, 3, 4, 5].map(i => (
                <Grid item xs={12} sm={6} md={4} lg={2.4} key={i}>
                  <Skeleton variant="rectangular" height={220} radius="lg" style={{ marginBottom: "8px" }} />
                  <Skeleton variant="text" width="80%" style={{ marginBottom: "4px" }} />
                  <Skeleton variant="text" width="40%" />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Grid container spacing={4}>
              {featuredProducts.map((prod) => (
                <Grid item xs={12} sm={6} md={4} lg={2.4} key={prod.id}>
                  <ProductCard
                    product={prod}
                    onAddToCart={() => navigate("/cart")}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </section>

      {/* Recommended For You Section */}
      <section style={{ paddingTop: "32px", paddingBottom: "64px" }}>
        <Container maxWidth="xl">
          <SectionHeader 
            title="Recommended For You" 
            subtitle="Software and workspace hardware suggestions tailored for builders."
          />
          {loading ? (
            <Grid container spacing={4}>
              {[1, 2, 3].map(i => (
                <Grid item xs={12} sm={6} md={4} key={i}>
                  <Skeleton variant="rectangular" height={220} radius="lg" style={{ marginBottom: "8px" }} />
                  <Skeleton variant="text" width="80%" style={{ marginBottom: "4px" }} />
                  <Skeleton variant="text" width="40%" />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Grid container spacing={4}>
              {recommendedProducts.map((prod) => (
                <Grid item xs={12} sm={6} md={4} key={prod.id}>
                  <ProductCard
                    product={prod}
                    onAddToCart={() => navigate("/cart")}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </section>

      {/* Recently Viewed Products Section */}
      {!loading && recentlyViewed.length > 0 && (
        <section style={{ paddingTop: "48px", paddingBottom: "64px", backgroundColor: theme.palette.background.elevated, borderTop: `1px solid ${theme.palette.border.default}`, borderBottom: `1px solid ${theme.palette.border.default}` }}>
          <Container maxWidth="xl">
            <SectionHeader 
              title="Recently Viewed" 
              subtitle="Items you inspected during this session."
            />
            <Grid container spacing={4}>
              {recentlyViewed.map((prod) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={prod.id}>
                  <ProductCard
                    product={prod}
                    onAddToCart={() => navigate("/cart")}
                  />
                </Grid>
              ))}
            </Grid>
          </Container>
        </section>
      )}

      {/* Editorial Section */}
      <StorySection>
        <Container maxWidth="lg">
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={5}>
              <img 
                src="https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=600&auto=format&fit=crop&q=80" 
                alt="Product Designer working on laptop"
                style={{
                  width: "100%",
                  height: "360px",
                  objectFit: "cover",
                  borderRadius: theme.radius.lg,
                  boxShadow: theme.elevation.subtle
                }}
              />
            </Grid>
            <Grid item xs={12} md={7}>
              <Box mb={1}>
                <Chip label="Our Visual Philosophy" color="accent" uppercase />
              </Box>
              <StoryTitle>
                Designed for high focus workspaces.
              </StoryTitle>
              <StoryText>
                At ByteVault, we believe software developer workflows are only as efficient as the physical environment they exist in.
                By cataloging both commercial-grade web blueprints and custom workspace accessories under a single unified marketplace interface, we empower builders to optimize both their digital and physical toolsets in one checkout.
              </StoryText>
              <Button variant="primary" onClick={() => navigate("/catalog")}>
                Explore the Concept
              </Button>
            </Grid>
          </Grid>
        </Container>
      </StorySection>
    </>
  );
};

export default Home;
