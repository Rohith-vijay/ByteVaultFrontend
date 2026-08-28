import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { styled, useTheme } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import {
  CloudDownload as CloudDownloadIcon,
  History as HistoryIcon,
  Favorite as FavoriteIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  Update as UpdateIcon
} from "@mui/icons-material";

import { Container } from "../components/primitives/Container";
import { SectionHeader } from "../components/primitives/SectionHeader";
import { Card } from "../components/primitives/Card";
import { Button } from "../components/primitives/Button";
import { IconButton } from "../components/primitives/IconButton";
import { Chip } from "../components/primitives/Chip";
import { Price } from "../components/primitives/Price";
import { Skeleton } from "../components/primitives/Skeleton";
import { Input } from "../components/primitives/Input";
import { useAuth } from "../store/AuthContext";
import { useWishlist } from "../store/WishlistContext";
import { useCart } from "../store/CartContext";
import { orderService } from "../services/orderService";
import { userService } from "../services/userService";
import { fulfillmentService } from "../services/fulfillmentService";

const TabPanelContainer = styled("div")(({ theme }) => ({
  marginTop: theme.spacing(6),
}));

const TimelineWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  position: "relative",
  padding: `${theme.spacing(4)} 0`,
  marginTop: theme.spacing(4),
  "&::after": {
    content: '""',
    position: "absolute",
    height: "2px",
    backgroundColor: theme.palette.border.default,
    left: "10%",
    right: "10%",
    top: "22px",
    zIndex: 1,
  }
}));

const TimelineNode = styled("div", {
  shouldForwardProp: (prop) => prop !== "active" && prop !== "completed",
})(({ theme, active, completed }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  zIndex: 2,
  width: "20%",

  "& .circle": {
    width: "16px",
    height: "16px",
    borderRadius: "50%",
    backgroundColor: completed 
      ? theme.palette.status.success 
      : active 
      ? theme.palette.primary.main 
      : theme.palette.border.default,
    border: `2px solid ${theme.palette.background.paper}`,
    boxShadow: theme.elevation.subtle,
    marginBottom: "8px",
    transition: "all 0.3s ease",
  },

  "& .status-label": {
    fontSize: "10px",
    fontWeight: active || completed ? "bold" : "normal",
    color: active || completed ? theme.palette.text.primary : theme.palette.text.secondary,
    textTransform: "uppercase",
    letterSpacing: "0.02em",
  }
}));

const FileRow = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: `${theme.spacing(4)} 0`,
  borderBottom: `1px solid ${theme.palette.border.default}`,
  "&:last-child": {
    borderBottom: "none",
  },
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: theme.spacing(3),
  }
}));

export const Account = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const { wishlistItems, toggleWishlist } = useWishlist();
  const { addItem } = useCart();

  // Tab mapping state
  const tabQuery = searchParams.get("tab") || "profile";
  const tabMap = ["profile", "orders", "downloads", "wishlist", "addresses", "security", "notifications"];
  const activeTabIdx = tabMap.indexOf(tabQuery) !== -1 ? tabMap.indexOf(tabQuery) : 0;

  const [orders, setOrders] = useState([]);
  const [downloads, setDownloads] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  // My Digital Library search/filter states
  const [dlSearch, setDlSearch] = useState("");
  const [dlFormatFilter, setDlFormatFilter] = useState("All");
  const [dlSortBy, setDlSortBy] = useState("date_desc");

  // Advanced download progression states
  const [downloadStates, setDownloadStates] = useState({}); // { [fileId]: "idle" | "checking" | "preparing" | "ready" | "downloading" | "complete" | "error" }
  const [downloadProgress, setDownloadProgress] = useState({}); // { [fileId]: number }
  const [downloadErrors, setDownloadErrors] = useState({}); // { [fileId]: string }
  const [retryCounts, setRetryCounts] = useState({}); // { [fileId]: number }

  // Security passwords state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passLoading, setPassLoading] = useState(false);
  const [passFeedback, setPassFeedback] = useState(null);

  // Notifications checkboxes state
  const [notifOrderUpdates, setNotifOrderUpdates] = useState(true);
  const [notifProductVersions, setNotifProductVersions] = useState(true);
  const [notifPromos, setNotifPromos] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifFeedback, setNotifFeedback] = useState(null);

  // Load account sub-resources
  useEffect(() => {
    const loadAccountResources = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const orderHistory = await orderService.getOrdersByUser(user.id);
        setOrders(orderHistory);

        const cabinetFiles = await fulfillmentService.getEntitlements();
        setDownloads(cabinetFiles);

        const addrBook = await userService.getAddresses(user.id);
        setAddresses(addrBook);
      } catch (err) {
        console.error("Account load error", err);
      } finally {
        setLoading(false);
      }
    };
    loadAccountResources();
  }, [user]);

  const handleTabChange = (_event, newValue) => {
    setSearchParams({ tab: tabMap[newValue] });
  };

  const handleTriggerDownload = async (file) => {
    const fileId = file.id;
    const isRetry = (retryCounts[fileId] || 0) > 0;

    // Phase 1: Checking Entitlement
    setDownloadStates(prev => ({ ...prev, [fileId]: "checking" }));
    setDownloadErrors(prev => ({ ...prev, [fileId]: null }));
    await new Promise(resolve => setTimeout(resolve, 800));

    // Simulate connection decline error for test retry states on prod_8
    if (!isRetry && file.productId === "prod_8") {
      setDownloadStates(prev => ({ ...prev, [fileId]: "error" }));
      setDownloadErrors(prev => ({ ...prev, [fileId]: "Download server request refused. Link signature expired." }));
      setRetryCounts(prev => ({ ...prev, [fileId]: 1 }));
      return;
    }

    // Phase 2: Preparing Secure Link
    setDownloadStates(prev => ({ ...prev, [fileId]: "preparing" }));
    await new Promise(resolve => setTimeout(resolve, 800));

    // Phase 3: Ready
    setDownloadStates(prev => ({ ...prev, [fileId]: "ready" }));
    await new Promise(resolve => setTimeout(resolve, 500));

    // Phase 4: Downloading (progress increments)
    setDownloadStates(prev => ({ ...prev, [fileId]: "downloading" }));
    const steps = [0, 25, 50, 75, 100];
    for (const p of steps) {
      setDownloadProgress(prev => ({ ...prev, [fileId]: p }));
      await new Promise(resolve => setTimeout(resolve, 150));
    }

    try {
      const res = await fulfillmentService.getDownload(file.productId);
      
      // Complete phase
      setDownloadStates(prev => ({ ...prev, [fileId]: "complete" }));
      
      // Simulate file download trigger in browser
      const link = document.createElement("a");
      link.href = "#";
      link.setAttribute("download", res.fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        setDownloadStates(prev => ({ ...prev, [fileId]: "idle" }));
      }, 3000);
    } catch (err) {
      setDownloadStates(prev => ({ ...prev, [fileId]: "error" }));
      setDownloadErrors(prev => ({ ...prev, [fileId]: err.message || "Failed to finalize download locker link." }));
    }
  };

  const handleAddressDelete = async (id) => {
    if (confirm("Are you sure you want to delete this address?")) {
      try {
        await userService.deleteAddress(user.id, id);
        const updated = await userService.getAddresses(user.id);
        setAddresses(updated);
      } catch {
        alert("Failed to delete address.");
      }
    }
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPassFeedback({ type: "error", message: "Passwords do not match." });
      return;
    }
    setPassLoading(true);
    setPassFeedback(null);
    setTimeout(() => {
      setPassLoading(false);
      setPassFeedback({ type: "success", message: "Password updated successfully." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }, 1000);
  };

  const handleSaveNotifications = (e) => {
    e.preventDefault();
    setNotifLoading(true);
    setNotifFeedback(null);
    setTimeout(() => {
      setNotifLoading(false);
      setNotifFeedback({ type: "success", message: "Notification preferences saved." });
    }, 800);
  };

  const renderTimeline = (status) => {
    const physicalSteps = ["Processing", "Packed", "Shipped", "In Transit", "Delivered"];
    const currentIdx = physicalSteps.indexOf(status);

    return (
      <TimelineWrapper>
        {physicalSteps.map((stepName, idx) => {
          const completed = idx < currentIdx;
          const active = idx === currentIdx;

          return (
            <TimelineNode key={stepName} active={active} completed={completed}>
              <div className="circle" />
              <span className="status-label">{stepName}</span>
            </TimelineNode>
          );
        })}
      </TimelineWrapper>
    );
  };

  // Filter and sort locker entitlements
  const filteredDownloads = downloads
    .filter(file => {
      const titleMatch = file.title.toLowerCase().includes(dlSearch.toLowerCase());
      const format = file.format || "ZIP";
      const formatMatch = dlFormatFilter === "All" || format.toUpperCase().includes(dlFormatFilter.toUpperCase());
      return titleMatch && formatMatch;
    })
    .sort((a, b) => {
      if (dlSortBy === "date_desc") {
        return new Date(b.unlockedAt || 0) - new Date(a.unlockedAt || 0);
      }
      if (dlSortBy === "title_asc") {
        return a.title.localeCompare(b.title);
      }
      if (dlSortBy === "downloads_desc") {
        return b.downloadCount - a.downloadCount;
      }
      return 0;
    });

  return (
    <Container maxWidth="xl" style={{ paddingTop: "48px", paddingBottom: "96px" }}>
      <SectionHeader
        title={`Welcome Back, ${user?.name}`}
        subtitle="Manage your coordinates, check digital product update licenses, or trace shipments."
      />

      <Tabs value={activeTabIdx} onChange={handleTabChange} indicatorColor="primary" textColor="primary" variant="scrollable" scrollButtons="auto">
        <Tab label="Profile Info" icon={<PersonIcon />} iconPosition="start" />
        <Tab label="Orders History" icon={<HistoryIcon />} iconPosition="start" />
        <Tab label="My Digital Library" icon={<CloudDownloadIcon />} iconPosition="start" />
        <Tab label="Wishlist" icon={<FavoriteIcon />} iconPosition="start" />
        <Tab label="Addresses" icon={<HomeIcon />} iconPosition="start" />
        <Tab label="Security" icon={<SecurityIcon />} iconPosition="start" />
        <Tab label="Notifications" icon={<NotificationsIcon />} iconPosition="start" />
      </Tabs>

      <TabPanelContainer>
        {loading ? (
          <Box display="flex" flexDirection="column" gap={3}>
            <Skeleton variant="rectangular" height={100} radius="lg" />
            <Skeleton variant="rectangular" height={150} radius="lg" />
          </Box>
        ) : (
          <>
            {/* TABS 0: Profile */}
            {activeTabIdx === 0 && (
              <Grid container spacing={6}>
                <Grid item xs={12} md={4}>
                  <Card padding={6} style={{ textAlign: "center" }}>
                    <img 
                      src={user?.avatar} 
                      alt={user?.name} 
                      style={{ width: "96px", height: "96px", borderRadius: "50%", border: `3px solid ${theme.palette.primary.main}`, marginBottom: "16px" }}
                    />
                    <h3 style={{ margin: "0 0 4px 0", color: theme.palette.text.primary }}>{user?.name}</h3>
                    <Chip label={user?.role} color="primary" size="xs" variant="outlined" />
                    <p style={{ fontSize: "13px", color: theme.palette.text.secondary, marginTop: "16px" }}>
                      Active Member
                    </p>
                  </Card>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Card padding={6}>
                    <h3 style={{ margin: "0 0 24px 0", fontSize: "16px", fontWeight: "bold" }}>Profile Coordinates</h3>
                    <Box display="flex" flexDirection="column" gap={4}>
                      <Box display="grid" gridTemplateColumns="150px 1fr" gap={2} fontSize="14px">
                        <span style={{ color: theme.palette.text.secondary, fontWeight: "bold" }}>Full Name:</span>
                        <span>{user?.name}</span>
                        <span style={{ color: theme.palette.text.secondary, fontWeight: "bold" }}>Email:</span>
                        <span>{user?.email}</span>
                        <span style={{ color: theme.palette.text.secondary, fontWeight: "bold" }}>User Role:</span>
                        <span>{user?.role}</span>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              </Grid>
            )}

            {/* TABS 1: Orders */}
            {activeTabIdx === 1 && (
              <Box display="flex" flexDirection="column" gap={6}>
                {orders.length === 0 ? (
                  <Card padding={6} style={{ textAlign: "center" }}>
                    <p style={{ color: theme.palette.text.secondary }}>You have not placed any orders yet.</p>
                  </Card>
                ) : (
                  orders.map(order => (
                    <Card key={order.id} padding={6}>
                      <Box display="flex" justifyContent="space-between" flexWrap="wrap" gap={2} mb={4}>
                        <Box>
                          <span style={{ fontSize: "12px", color: theme.palette.text.secondary }}>Order Reference</span>
                          <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "bold" }}>
                            <Link to={`/orders/${order.id}`} style={{ color: theme.palette.primary.main, textDecoration: "none" }}>{order.id}</Link>
                          </h4>
                        </Box>
                        <Box style={{ textAlign: "right" }}>
                          <span style={{ fontSize: "12px", color: theme.palette.text.secondary }}>Date Placed</span>
                          <div style={{ fontSize: "14px", fontWeight: "bold" }}>{new Date(order.createdAt || order.date).toLocaleDateString()}</div>
                        </Box>
                        <Box style={{ textAlign: "right" }}>
                          <span style={{ fontSize: "12px", color: theme.palette.text.secondary }}>Grand Total</span>
                          <div style={{ fontSize: "14px", fontWeight: "bold", color: theme.palette.primary.main }}>
                            ${order.totals.total.toFixed(2)}
                          </div>
                        </Box>
                      </Box>

                      <Divider style={{ marginBottom: "16px" }} />

                      {/* Items loop */}
                      <Box display="flex" flexDirection="column" gap={3}>
                        {order.items.map(item => (
                          <Box key={item.id} display="flex" gap={4} alignItems="center">
                            <img src={item.image} alt={item.title} style={{ width: "40px", height: "52px", objectFit: "cover", borderRadius: "4px" }} />
                            <Box flexGrow={1}>
                              <h5 style={{ margin: 0, fontSize: "14px" }}>{item.title}</h5>
                              <span style={{ fontSize: "11px", color: theme.palette.text.secondary }}>
                                Quantity: {item.quantity} · Price: ${item.price.toFixed(2)}
                              </span>
                            </Box>
                            <Chip label={item.type} color={item.type === "DIGITAL" ? "primary" : "neutral"} size="xs" />
                          </Box>
                        ))}
                      </Box>

                      {/* Shipping progress tracker if order has physical items */}
                      {order.totals.hasPhysical && (
                        <div style={{ marginTop: "24px" }}>
                          <Divider style={{ marginBottom: "16px" }} />
                          <span style={{ fontSize: "12px", color: theme.palette.text.secondary, fontWeight: "bold" }}>
                            Fulfillment Package Status (Carrier Tracking: {order.fulfillmentDetails?.trackingNumber || "Assigning"})
                          </span>
                          {renderTimeline(order.status)}
                        </div>
                      )}
                    </Card>
                  ))
                )}
              </Box>
            )}

            {/* TABS 2: My Digital Library */}
            {activeTabIdx === 2 && (
              <Card padding={6}>
                <h3 style={{ margin: "0 0 4px 0", fontSize: "18px", fontWeight: "bold" }}>My Digital Library</h3>
                <p style={{ color: theme.palette.text.secondary, fontSize: "13px", marginBottom: "24px", marginTop: 0 }}>
                  Manage, filter, and retrieve your unlocked developer packages, resources, and ebooks.
                </p>

                {/* Filters Row */}
                <Grid container spacing={4} alignItems="center" style={{ marginBottom: "24px" }}>
                  <Grid item xs={12} sm={5}>
                    <Input 
                      placeholder="Search assets by title..." 
                      value={dlSearch} 
                      onChange={(e) => setDlSearch(e.target.value)} 
                      fullWidth 
                      leftIcon={<SearchIcon style={{ color: theme.palette.text.muted }} />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box display="flex" gap={2} flexWrap="wrap">
                      {["All", "ZIP", "PDF", "Figma"].map(fmt => (
                        <Chip 
                          key={fmt} 
                          label={fmt} 
                          onClick={() => setDlFormatFilter(fmt)}
                          color={dlFormatFilter === fmt ? "primary" : "neutral"}
                          variant={dlFormatFilter === fmt ? "filled" : "outlined"}
                          size="xs"
                        />
                      ))}
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Box display="flex" justifyContent="flex-end">
                      <select 
                        value={dlSortBy} 
                        onChange={(e) => setDlSortBy(e.target.value)}
                        style={{ 
                          padding: "8px 12px", 
                          borderRadius: theme.radius.sm, 
                          border: `1px solid ${theme.palette.border.default}`,
                          fontSize: "13px",
                          fontFamily: theme.typography.fontFamily,
                          outline: "none",
                          backgroundColor: "#fff"
                        }}
                      >
                        <option value="date_desc">Recent Purchases</option>
                        <option value="title_asc">Title A-Z</option>
                        <option value="downloads_desc">Popular Downloads</option>
                      </select>
                    </Box>
                  </Grid>
                </Grid>

                <Divider style={{ marginBottom: "16px" }} />

                {filteredDownloads.length === 0 ? (
                  <Box py={10} style={{ textAlign: "center" }}>
                    <p style={{ color: theme.palette.text.secondary, fontSize: "14px" }}>No items matching search conditions.</p>
                  </Box>
                ) : (
                  <div>
                    {filteredDownloads.map(file => {
                      const curState = downloadStates[file.id] || "idle";
                      const progress = downloadProgress[file.id] || 0;
                      const err = downloadErrors[file.id];
                      
                      // Highlight updates for blueprint prod_6
                      const hasUpdate = file.productId === "prod_6";

                      return (
                        <Box key={file.id} style={{ borderBottom: `1px solid ${theme.palette.border.default}`, padding: "16px 0" }}>
                          <FileRow>
                            <Box display="flex" gap={4} alignItems="center">
                              <img src={file.image} alt={file.title} style={{ width: "48px", height: "64px", objectFit: "cover", borderRadius: "4px" }} />
                              <Box>
                                <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
                                  <h4 style={{ margin: 0, fontSize: "14px", fontWeight: "bold" }}>{file.title}</h4>
                                  {hasUpdate && (
                                    <Chip 
                                      label="Update Available (v2.1.0)" 
                                      color="warning" 
                                      size="xs" 
                                      leftIcon={<UpdateIcon style={{ fontSize: "12px" }} />}
                                      style={{ fontWeight: "bold" }}
                                    />
                                  )}
                                </Box>
                                <Box display="flex" gap={2} fontSize="11px" color={theme.palette.text.secondary} mt={1}>
                                  <span>Format: {file.format || "ZIP"}</span>
                                  <span>·</span>
                                  <span>Size: {file.fileSize || "158.2 MB"}</span>
                                  <span>·</span>
                                  <span>Downloaded: {file.downloadCount} times</span>
                                </Box>
                              </Box>
                            </Box>

                            <Box>
                              {curState === "idle" && (
                                <Button
                                  variant="secondary"
                                  leftIcon={<CloudDownloadIcon style={{ fontSize: "16px" }} />}
                                  onClick={() => handleTriggerDownload(file)}
                                >
                                  Download File
                                </Button>
                              )}

                              {curState === "checking" && (
                                <Button variant="secondary" disabled>
                                  <CircularProgress size={12} style={{ marginRight: "8px" }} /> Checking Locker...
                                </Button>
                              )}

                              {curState === "preparing" && (
                                <Button variant="secondary" disabled>
                                  <CircularProgress size={12} style={{ marginRight: "8px" }} /> Securing Link...
                                </Button>
                              )}

                              {curState === "ready" && (
                                <Button variant="primary" disabled style={{ backgroundColor: theme.palette.status.success }}>
                                  Ready
                                </Button>
                              )}

                              {curState === "downloading" && (
                                <Button variant="secondary" disabled>
                                  Downloading {progress}%
                                </Button>
                              )}

                              {curState === "complete" && (
                                <Button variant="secondary" disabled style={{ color: theme.palette.status.success }}>
                                  <CheckCircleIcon style={{ fontSize: "16px", marginRight: "6px" }} /> Downloaded
                                </Button>
                              )}

                              {curState === "error" && (
                                <Button
                                  variant="primary"
                                  style={{ backgroundColor: theme.palette.status.error }}
                                  leftIcon={<RefreshIcon style={{ fontSize: "14px" }} />}
                                  onClick={() => handleTriggerDownload(file)}
                                >
                                  Retry
                                </Button>
                              )}
                            </Box>
                          </FileRow>
                          
                          {err && (
                            <Box display="flex" alignItems="center" gap={2} p={2} mt={2} style={{ backgroundColor: "#FEF2F2", color: theme.palette.status.error, borderRadius: "6px", fontSize: "11px" }}>
                              <ErrorIcon style={{ fontSize: "14px" }} />
                              <span>{err}</span>
                            </Box>
                          )}
                        </Box>
                      );
                    })}
                  </div>
                )}
              </Card>
            )}

            {/* TABS 3: Wishlist */}
            {activeTabIdx === 3 && (
              <Box display="flex" flexDirection="column" gap={4}>
                {wishlistItems.length === 0 ? (
                  <Card padding={6} style={{ textAlign: "center" }}>
                    <p style={{ color: theme.palette.text.secondary }}>Your wishlist is currently empty.</p>
                  </Card>
                ) : (
                  <Grid container spacing={4}>
                    {wishlistItems.map(item => (
                      <Grid item xs={12} sm={6} md={3} key={item.id}>
                        <Card padding={4} interactive border={true} style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                          <Box onClick={() => navigate(`/products/${item.id}`)} style={{ cursor: "pointer" }}>
                            <img src={item.image} alt={item.title} style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "8px", marginBottom: "12px" }} />
                            <h4 style={{ margin: "0 0 8px 0", fontSize: "14px", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{item.title}</h4>
                            <Price amount={item.price} size="sm" showDiscountBadge={false} />
                          </Box>
                          <Box display="flex" gap={2} mt={3}>
                            <Button variant="primary" onClick={() => addItem(item)} style={{ flexGrow: 1, fontSize: "12px", padding: "8px" }}>
                              Add to Cart
                            </Button>
                            <IconButton 
                              aria-label="Remove item from wishlist" 
                              onClick={(e) => { e.stopPropagation(); toggleWishlist(item); }}
                              size="sm"
                            >
                              <FavoriteIcon style={{ color: "#EF4444" }} />
                            </IconButton>
                          </Box>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
            )}

            {/* TABS 4: Addresses */}
            {activeTabIdx === 4 && (
              <Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={6}>
                  <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "bold" }}>Saved shipping locations</h3>
                  <Button variant="primary" onClick={() => alert("Add Address modal overlay triggered")}>
                    Add New Address
                  </Button>
                </Box>
                <Grid container spacing={4}>
                  {addresses.map(addr => (
                    <Grid item xs={12} sm={6} md={4} key={addr.id}>
                      <Card padding={5} border={true} elevation="none">
                        <Box display="flex" justifyContent="space-between" mb={2}>
                          <h4 style={{ margin: 0, fontSize: "14px", fontWeight: "bold" }}>{addr.name}</h4>
                          {addr.isDefault && <Chip label="DEFAULT" color="primary" size="xs" />}
                        </Box>
                        <p style={{ margin: "0 0 16px 0", fontSize: "13px", color: theme.palette.text.secondary, lineHeight: 1.5 }}>
                          {addr.street} <br />
                          {addr.city}, {addr.state} {addr.zip} <br />
                          {addr.country}
                        </p>
                        <Box display="flex" gap={2}>
                          <Button variant="secondary" onClick={() => alert("Edit address triggered")} style={{ minWidth: "auto", padding: "4px 8px" }}>
                            Edit
                          </Button>
                          <Button variant="secondary" onClick={() => handleAddressDelete(addr.id)} style={{ minWidth: "auto", padding: "4px 8px", color: theme.palette.error.main }}>
                            Delete
                          </Button>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* TABS 5: Security */}
            {activeTabIdx === 5 && (
              <Grid container spacing={6}>
                <Grid item xs={12} md={6}>
                  <Card padding={6}>
                    <h3 style={{ margin: "0 0 20px 0", fontSize: "16px", fontWeight: "bold" }}>Modify Password</h3>
                    {passFeedback && (
                      <Box p={3} mb={4} style={{ 
                        backgroundColor: passFeedback.type === "success" ? "#ECFDF5" : "#FEF2F2", 
                        color: passFeedback.type === "success" ? theme.palette.status.success : theme.palette.status.error, 
                        borderRadius: "6px", 
                        fontSize: "13px" 
                      }}>
                        {passFeedback.message}
                      </Box>
                    )}
                    <form onSubmit={handleUpdatePassword}>
                      <Box display="flex" flexDirection="column" gap={4}>
                        <Input label="Current Password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required fullWidth />
                        <Input label="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required fullWidth />
                        <Input label="Confirm New Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required fullWidth />
                        <Button variant="primary" type="submit" state={passLoading ? "loading" : "default"}>
                          Change Password
                        </Button>
                      </Box>
                    </form>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card padding={6}>
                    <h3 style={{ margin: "0 0 20px 0", fontSize: "16px", fontWeight: "bold" }}>Account Sessions</h3>
                    <Box display="flex" flexDirection="column" gap={3}>
                      <Box display="flex" justifyContent="space-between" alignItems="center" p={3} style={{ backgroundColor: theme.palette.background.elevated, borderRadius: "8px" }}>
                        <Box>
                          <strong style={{ fontSize: "13px", display: "block" }}>Windows 11 · Chrome Browser</strong>
                          <span style={{ fontSize: "11px", color: theme.palette.text.secondary }}>IP Address: 192.168.1.45 (Current Session)</span>
                        </Box>
                        <Chip label="Active" color="success" size="xs" />
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              </Grid>
            )}

            {/* TABS 6: Notifications */}
            {activeTabIdx === 6 && (
              <Card padding={6} style={{ maxWidth: "600px" }}>
                <h3 style={{ margin: "0 0 20px 0", fontSize: "16px", fontWeight: "bold" }}>Manage Preferences</h3>
                {notifFeedback && (
                  <Box p={3} mb={4} style={{ backgroundColor: "#ECFDF5", color: theme.palette.status.success, borderRadius: "6px", fontSize: "13px" }}>
                    {notifFeedback.message}
                  </Box>
                )}
                <form onSubmit={handleSaveNotifications}>
                  <Box display="flex" flexDirection="column" gap={4}>
                    <Box display="flex" alignItems="center" gap={3}>
                      <input type="checkbox" checked={notifOrderUpdates} onChange={(e) => setNotifOrderUpdates(e.target.checked)} id="notif-orders" />
                      <label htmlFor="notif-orders" style={{ fontSize: "14px", cursor: "pointer" }}>
                        <strong>Email Shipping Receipts</strong>
                        <span style={{ display: "block", fontSize: "12px", color: theme.palette.text.secondary }}>Receive invoice tracking details instantly.</span>
                      </label>
                    </Box>
                    
                    <Box display="flex" alignItems="center" gap={3}>
                      <input type="checkbox" checked={notifProductVersions} onChange={(e) => setNotifProductVersions(e.target.checked)} id="notif-updates" />
                      <label htmlFor="notif-updates" style={{ fontSize: "14px", cursor: "pointer" }}>
                        <strong>Asset Updates Notifications</strong>
                        <span style={{ display: "block", fontSize: "12px", color: theme.palette.text.secondary }}>Get notified when a new version or download file release becomes active.</span>
                      </label>
                    </Box>

                    <Box display="flex" alignItems="center" gap={3}>
                      <input type="checkbox" checked={notifPromos} onChange={(e) => setNotifPromos(e.target.checked)} id="notif-promos" />
                      <label htmlFor="notif-promos" style={{ fontSize: "14px", cursor: "pointer" }}>
                        <strong>Promotions & Discount Offers</strong>
                        <span style={{ display: "block", fontSize: "12px", color: theme.palette.text.secondary }}>Opt-in for seasonal vouchers and organizer discount release codes.</span>
                      </label>
                    </Box>

                    <Button variant="primary" type="submit" state={notifLoading ? "loading" : "default"}>
                      Save Changes
                    </Button>
                  </Box>
                </form>
              </Card>
            )}
          </>
        )}
      </TabPanelContainer>
    </Container>
  );
};

export default Account;
