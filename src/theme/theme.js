import { createTheme } from "@mui/material/styles";
import { tokens } from "./tokens";

// 1. Base theme for compiling viewport breakpoints
const baseTheme = createTheme({
  breakpoints: {
    values: tokens.breakpoints,
  },
});

// 2. Main theme utilizing token values
export const theme = createTheme({
  breakpoints: {
    values: tokens.breakpoints,
  },
  palette: {
    mode: "light",
    background: {
      default: tokens.color.background.default,
      paper: tokens.color.background.surface,
      elevated: tokens.color.background.elevated,
    },
    text: {
      primary: tokens.color.text.primary,
      secondary: tokens.color.text.secondary,
      disabled: tokens.color.text.muted,
      muted: tokens.color.text.muted,
    },
    primary: {
      main: tokens.color.primary.main,
      light: tokens.color.primary.soft,
      dark: tokens.color.primary.hover,
      active: tokens.color.primary.active,
      soft: tokens.color.primary.soft,
    },
    accent: {
      main: tokens.color.accent.main,
      hover: tokens.color.accent.hover,
      active: tokens.color.accent.active,
      soft: tokens.color.accent.soft,
    },
    border: {
      default: tokens.color.border.default,
      strong: tokens.color.border.strong,
    },
    success: {
      main: tokens.color.status.success,
    },
    warning: {
      main: tokens.color.status.warning,
    },
    error: {
      main: tokens.color.status.error,
    },
    info: {
      main: tokens.color.status.info,
    },
    divider: tokens.color.border.default,
  },
  spacing: (factor) => {
    if (typeof factor === "string") return factor;
    return `${factor * 4}px`; // 4px spacing grid helper
  },
  // Expose token namespaces on theme
  radius: tokens.radius,
  elevation: tokens.elevation,
  zIndexTokens: tokens.zIndex,
  aspectRatio: tokens.aspectRatio,
  iconSize: tokens.iconSize,
  containerWidth: tokens.containerWidth,
  zIndex: {
    mobileStepper: tokens.zIndex.sticky,
    fab: tokens.zIndex.sticky,
    speedDial: tokens.zIndex.sticky,
    appBar: tokens.zIndex.header,
    drawer: tokens.zIndex.drawer,
    modal: tokens.zIndex.modal,
    snackbar: tokens.zIndex.toast,
    tooltip: tokens.zIndex.tooltip,
  },
  typography: {
    fontFamily: tokens.typography.fontFamily.primary,
    weight: tokens.typography.weight,
    h1: {
      fontFamily: tokens.typography.fontFamily.primary,
      fontWeight: tokens.typography.weight.bold,
      fontSize: tokens.typography.sizes.h1.mobile,
      lineHeight: tokens.typography.sizes.h1.lineHeight,
      letterSpacing: tokens.typography.sizes.h1.letterSpacing,
      [baseTheme.breakpoints.up("sm")]: {
        fontSize: tokens.typography.sizes.h1.tablet,
      },
      [baseTheme.breakpoints.up("md")]: {
        fontSize: tokens.typography.sizes.h1.desktop,
      },
    },
    h2: {
      fontFamily: tokens.typography.fontFamily.primary,
      fontWeight: tokens.typography.weight.bold,
      fontSize: tokens.typography.sizes.h2.mobile,
      lineHeight: tokens.typography.sizes.h2.lineHeight,
      letterSpacing: tokens.typography.sizes.h2.letterSpacing,
      [baseTheme.breakpoints.up("sm")]: {
        fontSize: tokens.typography.sizes.h2.tablet,
      },
      [baseTheme.breakpoints.up("md")]: {
        fontSize: tokens.typography.sizes.h2.desktop,
      },
    },
    h3: {
      fontFamily: tokens.typography.fontFamily.primary,
      fontWeight: tokens.typography.weight.semibold,
      fontSize: tokens.typography.sizes.h3.mobile,
      lineHeight: tokens.typography.sizes.h3.lineHeight,
      letterSpacing: tokens.typography.sizes.h3.letterSpacing,
      [baseTheme.breakpoints.up("sm")]: {
        fontSize: tokens.typography.sizes.h3.tablet,
      },
      [baseTheme.breakpoints.up("md")]: {
        fontSize: tokens.typography.sizes.h3.desktop,
      },
    },
    h4: {
      fontFamily: tokens.typography.fontFamily.primary,
      fontWeight: tokens.typography.weight.semibold,
      fontSize: tokens.typography.sizes.h4.mobile,
      lineHeight: tokens.typography.sizes.h4.lineHeight,
      letterSpacing: tokens.typography.sizes.h4.letterSpacing,
      [baseTheme.breakpoints.up("sm")]: {
        fontSize: tokens.typography.sizes.h4.tablet,
      },
      [baseTheme.breakpoints.up("md")]: {
        fontSize: tokens.typography.sizes.h4.desktop,
      },
    },
    body1: {
      fontFamily: tokens.typography.fontFamily.primary,
      fontWeight: tokens.typography.weight.regular,
      fontSize: tokens.typography.sizes.body.mobile,
      lineHeight: tokens.typography.sizes.body.lineHeight,
      letterSpacing: tokens.typography.sizes.body.letterSpacing,
      [baseTheme.breakpoints.up("sm")]: {
        fontSize: tokens.typography.sizes.body.tablet,
      },
      [baseTheme.breakpoints.up("md")]: {
        fontSize: tokens.typography.sizes.body.desktop,
      },
    },
    body2: {
      fontFamily: tokens.typography.fontFamily.primary,
      fontWeight: tokens.typography.weight.regular,
      fontSize: tokens.typography.sizes.bodySmall.mobile,
      lineHeight: tokens.typography.sizes.bodySmall.lineHeight,
      letterSpacing: tokens.typography.sizes.bodySmall.letterSpacing,
      [baseTheme.breakpoints.up("sm")]: {
        fontSize: tokens.typography.sizes.bodySmall.tablet,
      },
      [baseTheme.breakpoints.up("md")]: {
        fontSize: tokens.typography.sizes.bodySmall.desktop,
      },
    },
    caption: {
      fontFamily: tokens.typography.fontFamily.primary,
      fontWeight: tokens.typography.weight.regular,
      fontSize: tokens.typography.sizes.caption.mobile,
      lineHeight: tokens.typography.sizes.caption.lineHeight,
      letterSpacing: tokens.typography.sizes.caption.letterSpacing,
      color: tokens.color.text.muted,
    },
    button: {
      fontFamily: tokens.typography.fontFamily.primary,
      fontWeight: tokens.typography.weight.semibold,
      textTransform: "none", // Prevent forced uppercase on buttons
    },
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true, // Use Framer Motion springs instead
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: tokens.color.background.default,
          color: tokens.color.text.primary,
          fontFamily: tokens.typography.fontFamily.primary,
          margin: 0,
          padding: 0,
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        },
        "*": {
          boxSizing: "border-box",
        },
        "*:focus-visible": {
          outline: `2px solid ${tokens.color.primary.main}`,
          outlineOffset: "2px",
        },
      },
    },
  },
});

// Inject custom variants
theme.typography.display = {
  fontFamily: tokens.typography.fontFamily.primary,
  fontWeight: tokens.typography.weight.extrabold,
  fontSize: tokens.typography.sizes.display.mobile,
  lineHeight: tokens.typography.sizes.display.lineHeight,
  letterSpacing: tokens.typography.sizes.display.letterSpacing,
  [theme.breakpoints.up("sm")]: {
    fontSize: tokens.typography.sizes.display.tablet,
  },
  [theme.breakpoints.up("md")]: {
    fontSize: tokens.typography.sizes.display.desktop,
  },
};

theme.typography.bodyLarge = {
  fontFamily: tokens.typography.fontFamily.primary,
  fontWeight: tokens.typography.weight.regular,
  fontSize: tokens.typography.sizes.bodyLarge.mobile,
  lineHeight: tokens.typography.sizes.bodyLarge.lineHeight,
  letterSpacing: tokens.typography.sizes.bodyLarge.letterSpacing,
  [theme.breakpoints.up("sm")]: {
    fontSize: tokens.typography.sizes.bodyLarge.tablet,
  },
  [theme.breakpoints.up("md")]: {
    fontSize: tokens.typography.sizes.bodyLarge.desktop,
  },
};

theme.typography.bodySmall = theme.typography.body2;

theme.typography.price = {
  fontFamily: tokens.typography.fontFamily.primary,
  fontWeight: tokens.typography.weight.bold,
  fontSize: tokens.typography.sizes.price.mobile,
  lineHeight: tokens.typography.sizes.price.lineHeight,
  letterSpacing: tokens.typography.sizes.price.letterSpacing,
  [theme.breakpoints.up("sm")]: {
    fontSize: tokens.typography.sizes.price.tablet,
  },
  [theme.breakpoints.up("md")]: {
    fontSize: tokens.typography.sizes.price.desktop,
  },
};

theme.typography.productTitle = {
  fontFamily: tokens.typography.fontFamily.primary,
  fontWeight: tokens.typography.weight.semibold,
  fontSize: tokens.typography.sizes.productTitle.mobile,
  lineHeight: tokens.typography.sizes.productTitle.lineHeight,
  letterSpacing: tokens.typography.sizes.productTitle.letterSpacing,
  [theme.breakpoints.up("sm")]: {
    fontSize: tokens.typography.sizes.productTitle.tablet,
  },
  [theme.breakpoints.up("md")]: {
    fontSize: tokens.typography.sizes.productTitle.desktop,
  },
};

theme.typography.label = {
  fontFamily: tokens.typography.fontFamily.primary,
  fontWeight: tokens.typography.weight.semibold,
  fontSize: tokens.typography.sizes.label.mobile,
  lineHeight: tokens.typography.sizes.label.lineHeight,
  letterSpacing: tokens.typography.sizes.label.letterSpacing,
  textTransform: "uppercase",
  color: tokens.color.text.secondary,
  [theme.breakpoints.up("sm")]: {
    fontSize: tokens.typography.sizes.label.tablet,
  },
  [theme.breakpoints.up("md")]: {
    fontSize: tokens.typography.sizes.label.desktop,
  },
};
export default theme;
