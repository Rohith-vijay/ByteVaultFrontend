import React from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import { hoverScale, activePress } from "../../animations/motion";

const StyledCard = styled("div", {
  shouldForwardProp: (prop) =>
    prop !== "cardElevation" &&
    prop !== "hasBorder" &&
    prop !== "cardPadding" &&
    prop !== "cardRadius",
})(({ theme, cardElevation, hasBorder, cardPadding, cardRadius }) => {
  const paddingValue =
    typeof cardPadding === "number"
      ? theme.spacing(cardPadding)
      : cardPadding;

  const radiusValue = theme.radius[cardRadius];

  let shadow = theme.elevation.none;
  if (cardElevation === "subtle") shadow = theme.elevation.subtle;
  else if (cardElevation === "hover") shadow = theme.elevation.hover;
  else if (cardElevation === "popover") shadow = theme.elevation.popover;
  else if (cardElevation === "modal") shadow = theme.elevation.modal;

  return {
    backgroundColor: theme.palette.background.paper,
    borderRadius: radiusValue,
    padding: paddingValue,
    boxShadow: shadow,
    border: hasBorder ? `1px solid ${theme.palette.border.default}` : "none",
    position: "relative",
    overflow: "hidden",
    transition: `box-shadow ${theme.transitions.duration.shorter}ms ${theme.transitions.easing.easeInOut},
                 border-color ${theme.transitions.duration.shorter}ms ${theme.transitions.easing.easeInOut},
                 background-color ${theme.transitions.duration.shorter}ms ${theme.transitions.easing.easeInOut}`,

    "&:focus-visible": {
      outline: `2px solid ${theme.palette.primary.main}`,
      outlineOffset: "2px",
    },
  };
});

const MotionCardContainer = motion(StyledCard);

export const Card = React.forwardRef(
  (
    {
      children,
      elevation = "subtle",
      interactive = false,
      border = true,
      padding = 4,
      radius = "lg",
      className,
      onClick,
      ...props
    },
    ref
  ) => {
    const isInteractive = interactive && onClick !== undefined;

    return (
      <MotionCardContainer
        ref={ref}
        cardElevation={elevation}
        hasBorder={border}
        cardPadding={padding}
        cardRadius={radius}
        onClick={onClick}
        className={className}
        style={{ cursor: isInteractive ? "pointer" : "default" }}
        whileHover={isInteractive ? hoverScale() : undefined}
        whileTap={isInteractive ? activePress() : undefined}
        tabIndex={isInteractive ? 0 : undefined}
        role={isInteractive ? "button" : undefined}
        {...props}
      >
        {children}
      </MotionCardContainer>
    );
  }
);

Card.displayName = "Card";

Card.propTypes = {
  children: PropTypes.node.isRequired,
  elevation: PropTypes.oneOf(["none", "subtle", "hover", "popover", "modal"]),
  interactive: PropTypes.bool,
  border: PropTypes.bool,
  padding: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  radius: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl", "full"]),
  className: PropTypes.string,
  onClick: PropTypes.func,
};
