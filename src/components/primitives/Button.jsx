import React from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import { hoverScale, activePress } from "../../animations/motion";

// Custom styled HTML button utilizing MUI theme and design tokens
const StyledButton = styled("button", {
  shouldForwardProp: (prop) =>
    prop !== "buttonVariant" && prop !== "buttonState" && prop !== "fullWidth",
})(({ theme, buttonVariant, buttonState, fullWidth }) => {
  // Base styles
  let backgroundColor = theme.palette.primary.main;
  let textColor = theme.palette.background.paper;
  let borderColor = "transparent";

  // Variant resolution
  if (buttonVariant === "accent") {
    backgroundColor = theme.palette.accent.main;
  } else if (buttonVariant === "secondary") {
    backgroundColor = theme.palette.background.paper;
    textColor = theme.palette.text.primary;
    borderColor = theme.palette.border.default;
  }

  // State overrides
  if (buttonState === "success") {
    backgroundColor = theme.palette.success.main;
    textColor = theme.palette.background.paper;
    borderColor = "transparent";
  } else if (buttonState === "error") {
    backgroundColor = theme.palette.error.main;
    textColor = theme.palette.background.paper;
    borderColor = "transparent";
  }

  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: fullWidth ? "100%" : "auto",
    minWidth: "120px",
    padding: `${theme.spacing(3)} ${theme.spacing(6)}`, // 12px 24px
    fontSize: theme.typography.body2.fontSize,
    fontWeight: theme.typography.button.fontWeight,
    fontFamily: theme.typography.button.fontFamily,
    color: textColor,
    backgroundColor: backgroundColor,
    border: `1px solid ${borderColor}`,
    borderRadius: theme.radius.md,
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
    userSelect: "none",
    verticalAlign: "middle",
    letterSpacing: "0.015em",
    boxShadow: theme.elevation.subtle,
    transition: `background-color ${theme.transitions.duration.shorter}ms ${theme.transitions.easing.easeInOut}, 
                 border-color ${theme.transitions.duration.shorter}ms ${theme.transitions.easing.easeInOut}, 
                 box-shadow ${theme.transitions.duration.shorter}ms ${theme.transitions.easing.easeInOut}`,

    "&:hover": {
      backgroundColor:
        buttonVariant === "primary"
          ? theme.palette.primary.dark
          : buttonVariant === "accent"
          ? theme.palette.accent.hover
          : theme.palette.background.elevated,
      boxShadow: theme.elevation.hover,
    },

    "&:active": {
      backgroundColor:
        buttonVariant === "primary"
          ? theme.palette.primary.active
          : buttonVariant === "accent"
          ? theme.palette.accent.active
          : theme.palette.background.elevated,
    },

    "&:focus-visible": {
      outline: `2px solid ${theme.palette.primary.main}`,
      outlineOffset: "2px",
    },

    "&:disabled": {
      opacity: 0.5,
      cursor: "not-allowed",
      boxShadow: "none",
      backgroundColor: theme.palette.background.elevated,
      color: theme.palette.text.disabled,
      borderColor: theme.palette.border.default,
      pointerEvents: "none",
    },

    // Style overrides for loading state
    ...(buttonState === "loading" && {
      color: "transparent !important",
      pointerEvents: "none",
      cursor: "default",
      boxShadow: "none",
    }),
  };
});

// Loading spinner structure that aligns perfectly inside the button without layout shift
const SpinnerOverlay = styled("span")({
  position: "absolute",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
});

const Spinner = styled("span")(() => ({
  width: "20px",
  height: "20px",
  border: `2px solid currentColor`,
  borderTopColor: "transparent",
  borderRadius: "50%",
  display: "inline-block",
  animation: "spin 0.8s linear infinite",
  "@keyframes spin": {
    "0%": { transform: "rotate(0deg)" },
    "100%": { transform: "rotate(360deg)" },
  },
}));

// Framer Motion-enabled container
const MotionButtonContainer = motion(StyledButton);

export const Button = React.forwardRef(
  (
    {
      children,
      variant = "primary",
      state = "default",
      fullWidth = false,
      leftIcon,
      rightIcon,
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    const isInteractive = state === "default" && !disabled;

    return (
      <MotionButtonContainer
        ref={ref}
        buttonVariant={variant}
        buttonState={state}
        fullWidth={fullWidth}
        disabled={disabled || state === "loading"}
        className={className}
        whileHover={isInteractive ? hoverScale() : undefined}
        whileTap={isInteractive ? activePress() : undefined}
        // Accessibility tags
        aria-busy={state === "loading"}
        aria-live="polite"
        {...props}
      >
        {state === "loading" && (
          <SpinnerOverlay>
            <Spinner />
          </SpinnerOverlay>
        )}

        {leftIcon && (
          <span style={{ marginRight: "8px", display: "inline-flex", alignItems: "center" }}>
            {leftIcon}
          </span>
        )}
        <span>{children}</span>
        {rightIcon && (
          <span style={{ marginLeft: "8px", display: "inline-flex", alignItems: "center" }}>
            {rightIcon}
          </span>
        )}
      </MotionButtonContainer>
    );
  }
);

Button.displayName = "Button";

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["primary", "accent", "secondary"]),
  state: PropTypes.oneOf(["default", "loading", "success", "error"]),
  fullWidth: PropTypes.bool,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};
