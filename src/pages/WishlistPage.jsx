import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { styled, useTheme } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { Container } from "../components/primitives/Container";
import { Card } from "../components/primitives/Card";
import { Button } from "../components/primitives/Button";
import { IconButton } from "../components/primitives/IconButton";
import { Price } from "../components/primitives/Price";
import { SectionHeader } from "../components/primitives/SectionHeader";
import { useWishlist } from "../store/WishlistContext";
import { useCart } from "../store/CartContext";

const WishlistContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(12),
  paddingBottom: theme.spacing(16),
}));

export const WishlistPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { wishlistItems, toggleWishlist } = useWishlist();
  const { addItem } = useCart();

  return (
    <WishlistContainer maxWidth="lg">
      <Box mb={6}>
        <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: theme.palette.text.secondary, textDecoration: "none", fontSize: "14px", fontWeight: "bold" }}>
          <ArrowBackIcon style={{ fontSize: "16px" }} />
          Back to Store
        </Link>
      </Box>

      <SectionHeader
        title="My Wishlist"
        subtitle="Manage and shop items saved for future purchase."
      />

      {wishlistItems.length === 0 ? (
        <Card padding={10} style={{ textAlign: "center", backgroundColor: theme.palette.background.paper }}>
          <p style={{ color: theme.palette.text.secondary, fontSize: "15px", marginBottom: "20px" }}>
            Your wishlist is currently empty. Explore the catalog to save favorites.
          </p>
          <Button variant="primary" component={Link} to="/catalog">
            Browse Catalog
          </Button>
        </Card>
      ) : (
        <Grid container spacing={6}>
          {wishlistItems.map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item.id}>
              <Card padding={4} interactive border={true} style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
                <Box onClick={() => navigate(`/products/${item.id}`)} style={{ cursor: "pointer" }}>
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "8px", marginBottom: "12px" }}
                  />
                  <h4 style={{ margin: "0 0 8px 0", fontSize: "14px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", height: "40px" }}>
                    {item.title}
                  </h4>
                  <Box mb={3}>
                    <Price amount={item.price} size="xs" />
                  </Box>
                </Box>
                
                <Box display="flex" gap={2} alignItems="center">
                  <Button
                    variant="primary"
                    onClick={() => {
                      addItem(item);
                      // Visual feedback via toast can be added
                    }}
                    leftIcon={<ShoppingBagIcon style={{ fontSize: "14px" }} />}
                    style={{ flexGrow: 1, padding: "8px 12px", fontSize: "12px" }}
                  >
                    Add
                  </Button>
                  <IconButton
                    aria-label="Remove item from wishlist"
                    onClick={() => toggleWishlist(item)}
                    size="sm"
                    style={{ backgroundColor: theme.palette.background.elevated }}
                  >
                    <FavoriteIcon style={{ color: "#EF4444" }} />
                  </IconButton>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </WishlistContainer>
  );
};

export default WishlistPage;
