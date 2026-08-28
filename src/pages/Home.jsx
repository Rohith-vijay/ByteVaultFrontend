import React, { useState, useEffect } from "react";
import { styled, useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import {
  Bolt as BoltIcon,
  VerifiedUser as VerifiedUserIcon,
  ArrowForward as ArrowForwardIcon,
  CloudDownload as DownloadIcon,
  Lock as LockIcon,
  Star as StarIcon
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
import { useCart } from "../store/CartContext";
import { useWishlist } from "../store/WishlistContext";
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

const BenefitsSection = styled("section")(({ theme }) => ({
  paddingTop: theme.spacing(16),
  paddingBottom: theme.spacing(16),
  backgroundColor: theme.palette.background.elevated,
  borderTop: `1px solid ${theme.palette.border.default}`,
  borderBottom: `1px solid ${theme.palette.border.default}`,
}));

const BenefitCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(6),
  borderRadius: "16px",
}));

const FinalCTASection = styled("section")(({ theme }) => ({
  paddingTop: theme.spacing(20),
  paddingBottom: theme.spacing(20),
  backgroundColor: theme.palette.primary.main,
  color: "#FFFFFF",
  textAlign: "center",
  position: "relative",
  overflow: "hidden",
  "&::after": {
    content: '""',
    position: "absolute",
    top: "-50%",
    left: "-50%",
    width: "200%",
    height: "200%",
    background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 60%)",
    pointerEvents: "none",
  }
}));

export const Home = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const [loading, setLoading] = useState(true);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const fetchHomepageData = async () => {
      setLoading(true);
      try {
        const list = await productService.getProducts();
        // Featured Products (slice to top 4 products for clean layout)
        setFeaturedProducts(list.slice(0, 4));
      } catch (err) {
        console.error("Home details fetching error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomepageData();
  }, []);

  const revealAnim = {
    initial: { opacity: 0, y: 35 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.5, ease: "easeOut" }
  };

  return (
    <>
      {/* 1. Hero Header Section */}
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
                  <Chip label="Premium Software & Hardware" color="primary" uppercase />
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
                  ByteVault Media bridges the gap between digital software optimization blueprints and tactile hardware workspace accessories. Explore mechanical keyboards, developer templates, and coding vectors.
                </HeroSubtitle>
              </motion.div>
              <motion.div variants={staggerChildVariants}>
                <Box display="flex" gap={4} flexWrap="wrap">
                  <Button variant="primary" onClick={() => navigate("/catalog")} rightIcon={<ArrowForwardIcon style={{ fontSize: "16px" }} />}>
                    Explore Marketplace
                  </Button>
                  <Button variant="secondary" onClick={() => navigate("/catalog?type=digital")}>
                    Explore Digital Assets
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
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&auto=format&fit=crop&q=80" 
                  alt="Minimalist desk layout highlighting custom software templates and custom keyboard"
                  style={{
                    width: "100%",
                    maxWidth: "540px",
                    height: "400px",
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

      {/* 2. Trust Value Propositions */}
      <TrustBanner>
        <Container maxWidth="xl">
          <Grid container spacing={6}>
            <Grid item xs={12} sm={4}>
              <TrustItem>
                <VerifiedUserIcon style={{ fontSize: "36px", color: theme.palette.primary.main, marginBottom: "16px" }} />
                <h4 style={{ margin: "0 0 8px 0", color: theme.palette.text.primary, fontWeight: "bold" }}>Curated Quality</h4>
                <p style={{ margin: 0, fontSize: "13px", lineHeight: 1.5, color: theme.palette.text.secondary }}>
                  Every software script and physical gear product is custom audited by our engineers for maximum performance.
                </p>
              </TrustItem>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TrustItem>
                <BoltIcon style={{ fontSize: "36px", color: theme.palette.accent.main, marginBottom: "16px" }} />
                <h4 style={{ margin: "0 0 8px 0", color: theme.palette.text.primary, fontWeight: "bold" }}>Secure/Instant Digital Delivery</h4>
                <p style={{ margin: 0, fontSize: "13px", lineHeight: 1.5, color: theme.palette.text.secondary }}>
                  Digital assets, blueprints, and design vectors are unlocked inside your personal customer library cabinet instantly.
                </p>
              </TrustItem>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TrustItem>
                <DownloadIcon style={{ fontSize: "36px", color: theme.palette.text.primary, marginBottom: "16px" }} />
                <h4 style={{ margin: "0 0 8px 0", color: theme.palette.text.primary, fontWeight: "bold" }}>Reliable Workspace Gear</h4>
                <p style={{ margin: 0, fontSize: "13px", lineHeight: 1.5, color: theme.palette.text.secondary }}>
                  Physical packages are fully insured and shipped worldwide via premium carrier routes with active tracking milestones.
                </p>
              </TrustItem>
            </Grid>
          </Grid>
        </Container>
      </TrustBanner>

      {/* 3. Featured Products Section (Limited to 4 items) */}
      <motion.div {...revealAnim}>
        <Box style={{ paddingTop: "80px", paddingBottom: "64px" }}>
          <Container maxWidth="xl">
            <SectionHeader 
              title="Featured Products" 
              subtitle="Explore our highest priority handpicked marketplace blueprints and gear."
              action={
                <Button variant="secondary" onClick={() => navigate("/catalog")}>
                  View All Products
                </Button>
              }
            />
            {loading ? (
              <Grid container spacing={4}>
                {[1, 2, 3, 4].map(i => (
                  <Grid item xs={12} sm={6} md={3} key={i}>
                    <Skeleton variant="rectangular" height={220} radius="lg" style={{ marginBottom: "8px" }} />
                    <Skeleton variant="text" width="80%" style={{ marginBottom: "4px" }} />
                    <Skeleton variant="text" width="40%" />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Grid container spacing={4}>
                {featuredProducts.map((prod) => (
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
            )}
          </Container>
        </Box>
      </motion.div>

      {/* 4. Digital vs Physical Segment Gateways */}
      <motion.div {...revealAnim}>
        <Box style={{ paddingTop: "48px", paddingBottom: "80px" }}>
          <Container maxWidth="xl">
            <SectionHeader 
              title="Select Your Focus" 
              subtitle="Browse developer assets and productivity desk peripherals via custom-tailored sections." 
            />
            <Grid container spacing={6}>
              <Grid item xs={12} md={6} onClick={() => navigate("/catalog?type=digital")} style={{ cursor: "pointer" }}>
                <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.2 }}>
                  <Card padding={8} style={{ 
                    position: "relative",
                    height: "280px", 
                    borderRadius: "16px",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    backgroundImage: "linear-gradient(to top, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.3) 100%), url(https://images.unsplash.com/photo-1541462608141-2f58c6e68e98?w=800&auto=format&fit=crop&q=80)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    color: "#FFFFFF",
                    border: "none",
                  }}>
                    <h3 style={{ fontSize: "22px", fontWeight: "bold", margin: "0 0 8px 0" }}>Digital Assets</h3>
                    <p style={{ margin: "0 0 16px 0", fontSize: "13px", opacity: 0.9, maxWidth: "340px", lineHeight: 1.5 }}>
                      Commercial UI kits, software blueprints, developer scripts, and microservice coding schemas.
                    </p>
                    <Button variant="primary" style={{ alignSelf: "flex-start", fontSize: "12px", padding: "6px 16px" }}>Browse Digital</Button>
                  </Card>
                </motion.div>
              </Grid>
              <Grid item xs={12} md={6} onClick={() => navigate("/catalog?type=physical")} style={{ cursor: "pointer" }}>
                <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.2 }}>
                  <Card padding={8} style={{ 
                    position: "relative",
                    height: "280px", 
                    borderRadius: "16px",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    backgroundImage: "linear-gradient(to top, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.3) 100%), url(https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    color: "#FFFFFF",
                    border: "none",
                  }}>
                    <h3 style={{ fontSize: "22px", fontWeight: "bold", margin: "0 0 8px 0" }}>Workspace Gear</h3>
                    <p style={{ margin: "0 0 16px 0", fontSize: "13px", opacity: 0.9, maxWidth: "340px", lineHeight: 1.5 }}>
                      Custom mechanical keypads, ergonomic desk organizers, and high-fidelity focus headphones.
                    </p>
                    <Button variant="primary" style={{ alignSelf: "flex-start", fontSize: "12px", padding: "6px 16px" }}>Browse Gear</Button>
                  </Card>
                </motion.div>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </motion.div>

      {/* 5. "Why ByteVault" Benefits Grid */}
      <motion.div {...revealAnim}>
        <BenefitsSection>
          <Container maxWidth="xl">
            <SectionHeader
              title="Why Choose ByteVault?"
              subtitle="Every aspect of our customer platform is crafted for optimal workflow development."
            />
            <Grid container spacing={6}>
              <Grid item xs={12} sm={6} md={3}>
                <BenefitCard elevation="subtle">
                  <VerifiedUserIcon style={{ color: theme.palette.primary.main, fontSize: "28px" }} />
                  <h4 style={{ margin: "0 0 4px 0", fontWeight: "bold", color: "#111111", fontSize: "15px" }}>Vetted Quality</h4>
                  <p style={{ margin: 0, fontSize: "12px", color: theme.palette.text.secondary, lineHeight: 1.6 }}>
                    Every template, UI package, and mechanical switch undergoes a stringent double-check for reliability.
                  </p>
                </BenefitCard>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <BenefitCard elevation="subtle">
                  <DownloadIcon style={{ color: theme.palette.primary.main, fontSize: "28px" }} />
                  <h4 style={{ margin: "0 0 4px 0", fontWeight: "bold", color: "#111111", fontSize: "15px" }}>Instant Entitlements</h4>
                  <p style={{ margin: 0, fontSize: "12px", color: theme.palette.text.secondary, lineHeight: 1.6 }}>
                    Entitlements bind securely to your session ID, generating download signatures instantly inside your dashboard.
                  </p>
                </BenefitCard>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <BenefitCard elevation="subtle">
                  <StarIcon style={{ color: theme.palette.primary.main, fontSize: "28px" }} />
                  <h4 style={{ margin: "0 0 4px 0", fontWeight: "bold", color: "#111111", fontSize: "15px" }}>Lifetime Releases</h4>
                  <p style={{ margin: 0, fontSize: "12px", color: theme.palette.text.secondary, lineHeight: 1.6 }}>
                    Receive notification flags on software updates. Redownload new code versions directly at any time.
                  </p>
                </BenefitCard>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <BenefitCard elevation="subtle">
                  <LockIcon style={{ color: theme.palette.primary.main, fontSize: "28px" }} />
                  <h4 style={{ margin: "0 0 4px 0", fontWeight: "bold", color: "#111111", fontSize: "15px" }}>Secure Gateway</h4>
                  <p style={{ margin: 0, fontSize: "12px", color: theme.palette.text.secondary, lineHeight: 1.6 }}>
                    Encrypted card checkout ensures billing security. Decline simulations are built for offline sandbox testing.
                  </p>
                </BenefitCard>
              </Grid>
            </Grid>
          </Container>
        </BenefitsSection>
      </motion.div>

      {/* 6. Final CTA Banner */}
      <motion.div {...revealAnim}>
        <FinalCTASection>
          <Container maxWidth="md">
            <h2 style={{ fontSize: "36px", fontWeight: "bold", margin: "0 0 16px 0" }}>Elevate Your Dev Workspace</h2>
            <p style={{ fontSize: "16px", margin: "0 0 32px 0", opacity: 0.9, lineHeight: 1.6 }}>
              Explore the complete collection of software blueprints and desk hardware accessory products today.
            </p>
            <Button variant="secondary" onClick={() => navigate("/catalog")} style={{ color: theme.palette.primary.main, backgroundColor: "#FFFFFF", fontWeight: "bold" }}>
              Start Browsing Now
            </Button>
          </Container>
        </FinalCTASection>
      </motion.div>
    </>
  );
};

export default Home;
