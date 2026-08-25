// Design Tokens - Single Source of Truth for the Enterprise Marketplace Platform

export const tokens = {
  color: {
    background: {
      default: "#FAF9F6", // Warm neutral off-white
      surface: "#FFFFFF", // Primary surface/card
      elevated: "#F3F2EE", // Deeper neutral surface/active state
    },
    text: {
      primary: "#111111", // High contrast near-black
      secondary: "#4B5563", // Slate gray
      muted: "#9CA3AF", // Muted gray
    },
    border: {
      default: "#E5E7EB", // Light gray
      strong: "#D1D5DB", // Accessible focus/interactive border
    },
    primary: {
      main: "#4F46E5", // Deep indigo
      hover: "#4338CA",
      active: "#3730A3",
      soft: "#EEF2FF",
    },
    accent: {
      main: "#F97316", // Restrained warm orange
      hover: "#EA580C",
      active: "#C2410C",
      soft: "#FFF7ED",
    },
    status: {
      success: "#10B981", // Emerald
      warning: "#F59E0B", // Amber
      error: "#EF4444", // Rose
      info: "#3B82F6", // Blue
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
    // Sizing and line heights for desktop (base) and scale ratios
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
    xs: "4px", // compact controls, badges, tiny tags
    sm: "8px", // tooltips, smaller buttons
    md: "12px", // input fields, main buttons
    lg: "16px", // product cards, popup headers
    xl: "20px", // modals, slider containers, major surfaces
    full: "999px", // pills, status dots, profile avatars
  },
  elevation: {
    none: "none",
    subtle: "0px 1px 3px rgba(17, 17, 17, 0.04), 0px 1px 2px rgba(17, 17, 17, 0.02)", // standard flat card separation
    hover: "0px 10px 20px -4px rgba(17, 17, 17, 0.06), 0px 4px 12px -2px rgba(17, 17, 17, 0.03)", // elevated hovering card
    popover: "0px 12px 28px -6px rgba(17, 17, 17, 0.08), 0px 8px 16px -4px rgba(17, 17, 17, 0.04)", // dropdown menu/select dropdowns
    modal: "0px 24px 48px -12px rgba(17, 17, 17, 0.12), 0px 16px 24px -8px rgba(17, 17, 17, 0.06)", // overlays, dialogs
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
      micro: 150, // button hover, toggle switch, micro-feedback
      component: 280, // dropdown menu, drawer slide, card flip
      page: 400, // full page route fade/slide
      storytelling: 750, // scroll section fade/reveal, hero entrance
    },
    easing: {
      standard: "cubic-bezier(0.4, 0.0, 0.2, 1)", // smooth start and end
      decelerate: "cubic-bezier(0.0, 0.0, 0.2, 1)", // entrance animation
      accelerate: "cubic-bezier(0.4, 0.0, 1, 1)", // exit animation
      spring: {
        type: "spring",
        stiffness: 300,
        damping: 26,
      },
    },
  },
  iconSize: {
    xs: 16, // metadata details, rating stars
    sm: 20, // inline controls, list bullets
    md: 24, // normal action buttons, main controls
    lg: 32, // features, headers
    xl: 48, // major icons, empty states
  },
  aspectRatio: {
    product: "3/4", // editorial photo aspect ratio
    thumbnail: "1/1", // square preview (e.g. cart or miniature panels)
    hero: "16/9", // standard banners
    digitalPreview: "16/10", // digital product screenshots
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
