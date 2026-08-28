import React, { useState } from "react";
import PropTypes from "prop-types";
import { styled, useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BoltIcon from "@mui/icons-material/Bolt";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";

import { Card } from "../../../../components/primitives/Card";
import { Price } from "../../../../components/primitives/Price";
import { Rating } from "../../../../components/primitives/Rating";
import { Chip } from "../../../../components/primitives/Chip";
import { IconButton } from "../../../../components/primitives/IconButton";
import { Button } from "../../../../components/primitives/Button";

const ImageContainer = styled("div")(({ theme }) => ({
  position: "relative",
  width: "100%",
  paddingTop: "133.33%", // 3/4 Aspect Ratio token override
  backgroundColor: theme.palette.background.elevated,
  overflow: "hidden",
}));

const ImageElement = styled("img")({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  transition: "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
});

const HoverZoomCard = styled(Card)(() => ({
  [`&:hover img`]: {
    transform: "scale(1.06)",
  },
}));

const BadgeOverlay = styled("div")(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(3),
  left: theme.spacing(3),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  zIndex: 2,
}));

const WishlistOverlay = styled("div")(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(3),
  right: theme.spacing(3),
  zIndex: 2,
}));

const ContentContainer = styled("div")(({ theme }) => ({
  padding: theme.spacing(4),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

const CategoryLabel = styled("span")(({ theme }) => ({
  ...theme.typography.label,
  fontSize: "10px",
  color: theme.palette.text.secondary,
}));

const ProductTitle = styled("h4")(({ theme }) => ({
  ...theme.typography.productTitle,
  color: theme.palette.text.primary,
  margin: 0,
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  textOverflow: "ellipsis",
  height: "44px",
  lineHeight: 1.4,
}));

const MetaContainer = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginTop: theme.spacing(1),
}));

const FulfillmentText = styled("div")(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: theme.spacing(1),
  fontSize: "11px",
  fontFamily: theme.typography.fontFamily,
  fontWeight: theme.typography.weight.medium,
  color: theme.palette.text.secondary,

  "& svg": {
    fontSize: "14px",
    color: theme.palette.text.secondary,
  },
}));

/**
 * JSDoc representation of Product shape
 * @typedef {Object} Product
 * @property {string} id - Product ID
 * @property {string} title - Product name/title
 * @property {"digital" | "physical"} type - Delivery type
 * @property {string} image - Product photo source URL
 * @property {number} price - Selling price
 * @property {number} [originalPrice] - Standard MSRP price before discounts
 * @property {number} rating - Average star rating (0 to 5)
 * @property {number} [ratingCount] - Count of customer reviews
 * @property {boolean} inStock - Inventory stock flag
 * @property {string} [deliveryInfo] - Text representation of delivery estimates
 * @property {string} [category] - Product category
 */

export const ProductCard = ({
  product,
  onAddToCart,
  onWishlistToggle,
  isWishlisted = false,
}) => {
  const theme = useTheme();
  const [isFav, setIsFav] = useState(isWishlisted);
  const [cartState, setCartState] = useState("default");

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    const nextState = !isFav;
    setIsFav(nextState);
    if (onWishlistToggle) {
      onWishlistToggle(product, nextState);
    }
  };

  const handleAddToCartClick = (e) => {
    e.stopPropagation();
    if (!onAddToCart) return;

    setCartState("loading");
    setTimeout(() => {
      onAddToCart(product);
      setCartState("success");
      setTimeout(() => {
        setCartState("default");
      }, 1500);
    }, 800);
  };

  return (
    <HoverZoomCard elevation="subtle" border={true} padding={0} radius="lg">
      <ImageContainer>
        <ImageElement
          src={product.image}
          alt={product.title}
          loading="lazy"
        />

        <BadgeOverlay>
          {product.type.toLowerCase() === "digital" ? (
            <Chip label="Digital" color="primary" uppercase variant="filled" />
          ) : (
            <Chip label="Physical" color="neutral" uppercase variant="filled" />
          )}

          {!product.inStock && (
            <Chip label="Out of Stock" color="error" uppercase variant="filled" />
          )}
        </BadgeOverlay>

        <WishlistOverlay>
          <IconButton
            aria-label={isFav ? "Remove from wishlist" : "Add to wishlist"}
            variant="filled"
            size="sm"
            onClick={handleWishlistClick}
          >
            <motion.div
              animate={{ scale: isFav ? [1, 1.25, 1] : 1 }}
              transition={{ duration: 0.3 }}
              style={{ display: "flex" }}
            >
              {isFav ? (
                <FavoriteIcon style={{ color: "#EF4444" }} />
              ) : (
                <FavoriteBorderIcon />
              )}
            </motion.div>
          </IconButton>
        </WishlistOverlay>
      </ImageContainer>

      <ContentContainer>
        <div>
          <CategoryLabel>{product.category || "Marketplace Item"}</CategoryLabel>
          <ProductTitle title={product.title}>{product.title}</ProductTitle>
          
          {product.type.toLowerCase() === "digital" && product.specs && (
            <div style={{ display: "flex", gap: "6px", fontSize: "11px", color: theme.palette.text.secondary, marginTop: "4px", flexWrap: "wrap" }}>
              <span>{product.specs.format || "ZIP"}</span>
              <span>·</span>
              <span>{product.specs.fileSize || "158.2 MB"}</span>
              <span>·</span>
              <span>{product.specs.version || "v1.0.0"}</span>
            </div>
          )}
        </div>

        <Rating value={product.rating} count={product.ratingCount} size="xs" />

        <MetaContainer>
          <Price amount={product.price} originalAmount={product.originalPrice} size="sm" />
        </MetaContainer>

        <MetaContainer style={{ marginTop: 0 }}>
          <FulfillmentText>
            {product.type.toLowerCase() === "digital" ? (
              <>
                <BoltIcon style={{ color: "#F59E0B" }} />
                <span>{product.deliveryInfo || "Instant Download"}</span>
              </>
            ) : (
              <>
                <LocalShippingIcon />
                <span>{product.deliveryInfo || "Standard Shipping"}</span>
              </>
            )}
          </FulfillmentText>
        </MetaContainer>

        <Button
          variant="primary"
          state={cartState}
          disabled={!product.inStock}
          fullWidth
          onClick={handleAddToCartClick}
          leftIcon={cartState === "default" ? <ShoppingBagIcon style={{ fontSize: "16px" }} /> : undefined}
          style={{ marginTop: "8px" }}
        >
          {cartState === "default" ? "Add to Cart" : cartState === "loading" ? "Adding" : "Added"}
        </Button>
      </ContentContainer>
    </HoverZoomCard>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.oneOf(["digital", "physical", "DIGITAL", "PHYSICAL"]).isRequired,
    image: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    originalPrice: PropTypes.number,
    rating: PropTypes.number.isRequired,
    ratingCount: PropTypes.number,
    inStock: PropTypes.bool.isRequired,
    deliveryInfo: PropTypes.string,
    category: PropTypes.string,
  }).isRequired,
  onAddToCart: PropTypes.func,
  onWishlistToggle: PropTypes.func,
  isWishlisted: PropTypes.bool,
};
