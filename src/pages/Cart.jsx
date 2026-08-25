import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { AnimatePresence, motion } from "framer-motion";
import {
  ShoppingBag as ShoppingBagIcon,
  DeleteOutlineOutlined as DeleteOutlineIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Favorite as FavoriteIcon,
  Bolt as BoltIcon,
  ArrowForward as ArrowForwardIcon
} from "@mui/icons-material";

import { Container } from "../components/primitives/Container";
import { SectionHeader } from "../components/primitives/SectionHeader";
import { Card } from "../components/primitives/Card";
import { Button } from "../components/primitives/Button";
import { IconButton } from "../components/primitives/IconButton";
import { Chip } from "../components/primitives/Chip";
import { Price } from "../components/primitives/Price";
import { EmptyState } from "../components/primitives/EmptyState";
import { useCart } from "../store/CartContext";
import { useWishlist } from "../store/WishlistContext";

const CartLayout = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr 360px",
  gap: theme.spacing(8),
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(16),

  [theme.breakpoints.down("lg")]: {
    gridTemplateColumns: "1fr",
  },
}));

const CartItemRow = styled("div")(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(4),
  padding: `${theme.spacing(4)} 0`,
  borderBottom: `1px solid ${theme.palette.border.default}`,
  alignItems: "center",
  overflow: "hidden",

  "&:last-child": {
    borderBottom: "none",
  },

  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: theme.spacing(3),
  },
}));

const ProductThumbnail = styled("img")(({ theme }) => ({
  width: "80px",
  height: "106px",
  objectFit: "cover",
  borderRadius: theme.radius.sm,
  backgroundColor: theme.palette.background.elevated,
  flexShrink: 0,
}));

const ItemMeta = styled("div")({
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
  gap: "4px",
});

const QuantityWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  border: `1px solid ${theme.palette.border.default}`,
  borderRadius: theme.radius.sm,
}));

const SummaryLabel = styled("span")(({ theme }) => ({
  fontSize: "14px",
  color: theme.palette.text.secondary,
}));

const SummaryValue = styled("span")(({ theme }) => ({
  fontSize: "14px",
  fontWeight: theme.typography.weight.semibold,
  color: theme.palette.text.primary,
}));

const MotionCartRow = motion(CartItemRow);

export const Cart = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const { cartItems, totals, updateQuantity, removeItem } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const handleSaveForLater = (item) => {
    // Check if the item is not already wishlisted, if so toggle it in
    if (!isWishlisted(item.id)) {
      toggleWishlist(item);
    }
    // Remove from cart
    removeItem(item.id);
  };

  if (cartItems.length === 0) {
    return (
      <Container style={{ paddingTop: "80px" }}>
        <EmptyState
          icon={<ShoppingBagIcon />}
          title="Shopping Cart is Empty"
          description="Build your workspaces by exploring our catalog of digital blueprints and hardware accessories."
          actionText="Browse Catalog"
          onActionClick={() => navigate("/catalog")}
        />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" style={{ paddingTop: "48px" }}>
      <SectionHeader
        title="Shopping Cart"
        subtitle={`You have ${cartItems.length} unique items in your basket.`}
      />

      <CartLayout>
        {/* Left Side Items List */}
        <div>
          <Card padding={6} radius="lg">
            <AnimatePresence initial={false}>
              {cartItems.map((item) => {
                const isDigital = item.type === "DIGITAL" || item.type === "digital";
                const isFav = isWishlisted(item.id);

                return (
                  <MotionCartRow 
                    key={item.id}
                    layout
                    initial={{ opacity: 0, height: 0, padding: 0 }}
                    animate={{ opacity: 1, height: "auto", padding: `${theme.spacing(4)} 0` }}
                    exit={{ opacity: 0, height: 0, padding: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                  >
                    <ProductThumbnail src={item.image} alt={item.title} />

                    <ItemMeta>
                      <Box display="flex" alignItems="center" gap={2} mb={1}>
                        <Chip
                          label={isDigital ? "Digital License" : "Physical Goods"}
                          color={isDigital ? "primary" : "neutral"}
                          size="xs"
                        />
                      </Box>
                      <Link to={`/products/${item.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                        <h4 style={{ margin: 0, fontSize: "14px", fontWeight: "bold", lineHeight: 1.4 }}>
                          {item.title}
                        </h4>
                      </Link>
                      <span style={{ fontSize: "12px", color: theme.palette.text.secondary }}>
                        {isDigital ? "Instant unlocked access" : "Ships standard parcel"}
                      </span>
                    </ItemMeta>

                    {/* Quantity Actions */}
                    <Box display="flex" alignItems="center" gap={4} width={{ xs: "100%", sm: "auto" }} justifyContent="space-between">
                      {isDigital ? (
                        <span style={{ fontSize: "12px", color: theme.palette.text.muted, padding: "8px 12px", backgroundColor: theme.palette.background.elevated, borderRadius: theme.radius.xs }}>
                          Limit 1 License
                        </span>
                      ) : (
                        <QuantityWrapper>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            style={{ padding: "6px 12px", border: "none", background: "transparent", cursor: "pointer", fontSize: "14px" }}
                          >
                            -
                          </button>
                          <span style={{ minWidth: "24px", textAlign: "center", fontSize: "13px", fontWeight: "bold" }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            style={{ padding: "6px 12px", border: "none", background: "transparent", cursor: "pointer", fontSize: "14px" }}
                          >
                            +
                          </button>
                        </QuantityWrapper>
                      )}

                      <Price amount={item.price * item.quantity} size="sm" showDiscountBadge={false} />

                      <Box display="flex" gap={1}>
                        <IconButton
                          aria-label={isFav ? "Saved to wishlist" : "Save for later"}
                          onClick={() => handleSaveForLater(item)}
                          size="sm"
                        >
                          {isFav ? <FavoriteIcon style={{ color: theme.palette.accent.main }} /> : <FavoriteBorderIcon />}
                        </IconButton>

                        <IconButton
                          aria-label="Remove item"
                          onClick={() => removeItem(item.id)}
                          size="sm"
                        >
                          <DeleteOutlineIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </MotionCartRow>
                );
              })}
            </AnimatePresence>
          </Card>
        </div>

        {/* Right Side Order Summary Card */}
        <div>
          <Card padding={6} elevation="none" border={true} radius="lg" style={{ position: "sticky", top: "100px" }}>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: "bold", color: "#111111" }}>Order Summary</h3>
            
            <Box display="flex" flexDirection="column" gap={3} mb={6}>
              <Box display="flex" justifyContent="space-between">
                <SummaryLabel>Subtotal</SummaryLabel>
                <SummaryValue>${totals.originalSubtotal.toFixed(2)}</SummaryValue>
              </Box>

              {totals.discount > 0 && (
                <Box display="flex" justifyContent="space-between" style={{ color: theme.palette.accent.main }}>
                  <SummaryLabel style={{ color: "inherit" }}>Discounts</SummaryLabel>
                  <SummaryValue style={{ color: "inherit" }}>-${totals.discount.toFixed(2)}</SummaryValue>
                </Box>
              )}

              <Box display="flex" justifyContent="space-between">
                <SummaryLabel>Shipping Estimate</SummaryLabel>
                <SummaryValue>
                  {totals.hasPhysical 
                    ? totals.shipping > 0 ? `$${totals.shipping.toFixed(2)}` : "FREE" 
                    : "Instant Download"}
                </SummaryValue>
              </Box>

              <Box display="flex" justifyContent="space-between">
                <SummaryLabel>Estimated Tax (8%)</SummaryLabel>
                <SummaryValue>${totals.tax.toFixed(2)}</SummaryValue>
              </Box>

              <Divider style={{ margin: "16px 0" }} />

              <Box display="flex" justifyContent="space-between" alignItems="baseline">
                <span style={{ fontSize: "16px", fontWeight: "bold", color: "#111111" }}>Total Price</span>
                <span style={{ fontFamily: theme.typography.fontFamily, fontSize: "22px", fontWeight: "bold", color: theme.palette.primary.main }}>
                  ${totals.total.toFixed(2)}
                </span>
              </Box>
            </Box>

            <Button
              variant="primary"
              fullWidth
              onClick={() => navigate("/checkout")}
              rightIcon={<ArrowForwardIcon style={{ fontSize: "16px" }} />}
              style={{ height: "48px" }}
            >
              Proceed to Checkout
            </Button>

            {!totals.hasPhysical && (
              <Box display="flex" gap={2} mt={3} p={3} style={{ backgroundColor: theme.palette.primary.soft, borderRadius: theme.radius.sm, alignItems: "center" }}>
                <BoltIcon style={{ color: theme.palette.primary.main, fontSize: "18px" }} />
                <span style={{ fontSize: "11px", color: theme.palette.primary.main, lineHeight: 1.4 }}>
                  Digital checkout optimized. Physical shipping requirements are automatically bypassed.
                </span>
              </Box>
            )}
          </Card>
        </div>
      </CartLayout>
    </Container>
  );
};

export default Cart;
