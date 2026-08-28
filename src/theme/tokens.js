// Design Tokens - Single Source of Truth for the Enterprise Marketplace Platform

export const tokens = {
  color: {
    background: {
      default: "#F8FAFC", // Clean, light slate/neutral background
      surface: "#FFFFFF", // White for cards and product showcases
      elevated: "#F1F5F9", // Slate-100 for active/elevated sub-surfaces
      washed: "#F5F3FF", // Washed purple accent background
    },
    text: {
      primary: "#0F172A", // Deep Oxford Slate for primary readability
      secondary: "#334155", // Slate-700 for descriptors/secondary text
      muted: "#64748B", // Slate-500 for captions and disabled elements
    },
    border: {
      default: "#E2E8F0", // Slate-200 for thin boundaries
      strong: "#CBD5E1", // Slate-300 for focus indicator boundaries
      purple: "#E9D5FF", // Soft purple border
    },
    primary: {
      main: "#7C3AED", // Primary brand Purple
      hover: "#6D28D9", // Dark Purple
      active: "#5B21B6", // Deepest Purple
      soft: "#F3E8FF", // Soft/washed Lighter Purple
      glow: "rgba(124, 58, 237, 0.15)", // Soft purple brand glow
    },
    accent: {
      main: "#3B82F6", // Restrained Blue for navigation & trust
      hover: "#2563EB",
      active: "#1D4ED8",
      soft: "#EFF6FF",
    },
    status: {
      success: "#10B981", // Emerald green for success
      warning: "#F59E0B", // Amber yellow for warnings/pending
      error: "#EF4444", // Rose red for errors
      info: "#0284C7", // Sky blue for trust info
    },
  },
  typography: {
    fontFamily: {
      primary: '"Inter", "Plus Jakarta Sans", system-ui, -apple-system, sans-serif',
    },
    weight: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    sizes: {
      display: {
        desktop: "48px",
        tablet: "40px",
        mobile: "32px",
        lineHeight: 1.15,
        letterSpacing: "-0.02em",
      },
      h1: {
        desktop: "36px",
        tablet: "32px",
        mobile: "28px",
        lineHeight: 1.2,
        letterSpacing: "-0.015em",
      },
      h2: {
        desktop: "30px",
        tablet: "26px",
        mobile: "22px",
        lineHeight: 1.25,
        letterSpacing: "-0.01em",
      },
      h3: {
        desktop: "24px",
        tablet: "22px",
        mobile: "20px",
        lineHeight: 1.3,
        letterSpacing: "-0.01em",
      },
      h4: {
        desktop: "20px",
        tablet: "18px",
        mobile: "17px",
        lineHeight: 1.35,
        letterSpacing: "-0.005em",
      },
      bodyLarge: {
        desktop: "18px",
        tablet: "18px",
        mobile: "16px",
        lineHeight: 1.5,
        letterSpacing: "0",
      },
      body: {
        desktop: "16px",
        tablet: "16px",
        mobile: "14px",
        lineHeight: 1.5,
        letterSpacing: "0",
      },
      bodySmall: {
        desktop: "14px",
        tablet: "14px",
        mobile: "13px",
        lineHeight: 1.5,
        letterSpacing: "0",
      },
      caption: {
        desktop: "12px",
        tablet: "12px",
        mobile: "12px",
        lineHeight: 1.4,
        letterSpacing: "0.01em",
      },
      label: {
        desktop: "12px",
        tablet: "12px",
        mobile: "11px",
        lineHeight: 1.4,
        letterSpacing: "0.05em",
      },
      price: {
        desktop: "22px",
        tablet: "20px",
        mobile: "18px",
        lineHeight: 1.2,
        letterSpacing: "-0.01em",
      },
      productTitle: {
        desktop: "16px",
        tablet: "16px",
        mobile: "15px",
        lineHeight: 1.4,
        letterSpacing: "0",
      },
    },
  },
  spacing: {
    xxs: "4px",
    xs: "8px",
    sm: "12px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    xxl: "48px",
    "3xl": "64px",
    "4xl": "96px",
    "5xl": "128px",
  },
  radius: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "20px",
    full: "999px",
  },
  elevation: {
    none: "none",
    subtle: "0px 1px 3px rgba(15, 23, 42, 0.03), 0px 1px 2px rgba(15, 23, 42, 0.01)", // slate tinted flat cards
    hover: "0px 10px 25px -4px rgba(124, 58, 237, 0.08), 0px 4px 12px -2px rgba(124, 58, 237, 0.03)", // elevated hovering card with purple tint
    popover: "0px 12px 28px -6px rgba(15, 23, 42, 0.08), 0px 8px 16px -4px rgba(15, 23, 42, 0.04)",
    modal: "0px 24px 48px -12px rgba(15, 23, 42, 0.12), 0px 16px 24px -8px rgba(15, 23, 42, 0.06)",
    purpleGlow: "0px 0px 15px rgba(124, 58, 237, 0.15)", // Custom branding glow
  },
  zIndex: {
    base: 0,
    sticky: 100,
    dropdown: 200,
    header: 1000,
    drawer: 1100,
    modal: 1200,
    toast: 1300,
    tooltip: 1400,
  },
  motion: {
    duration: {
      micro: 150,
      component: 280,
      page: 400,
      storytelling: 750,
    },
    easing: {
      standard: "cubic-bezier(0.4, 0.0, 0.2, 1)",
      decelerate: "cubic-bezier(0.0, 0.0, 0.2, 1)",
      accelerate: "cubic-bezier(0.4, 0.0, 1, 1)",
      spring: {
        type: "spring",
        stiffness: 300,
        damping: 26,
      },
    },
  },
  iconSize: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 48,
  },
  aspectRatio: {
    product: "3/4",
    thumbnail: "1/1",
    hero: "16/9",
    digitalPreview: "16/10",
  },
  breakpoints: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920,
  },
  containerWidth: {
    sm: "600px",
    md: "960px",
    lg: "1280px",
    xl: "1440px",
  },
};
