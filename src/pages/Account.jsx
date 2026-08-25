import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { styled, useTheme } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import {
  CloudDownload as CloudDownloadIcon,
  History as HistoryIcon,
  Favorite as FavoriteIcon,
  Home as HomeIcon,
  Person as PersonIcon
} from "@mui/icons-material";

import { Container } from "../components/primitives/Container";
import { SectionHeader } from "../components/primitives/SectionHeader";
import { Card } from "../components/primitives/Card";
import { Button } from "../components/primitives/Button";
import { IconButton } from "../components/primitives/IconButton";
import { Chip } from "../components/primitives/Chip";
import { Price } from "../components/primitives/Price";
import { Skeleton } from "../components/primitives/Skeleton";
import { useAuth } from "../store/AuthContext";
import { useWishlist } from "../store/WishlistContext";
import { orderService } from "../services/orderService";
import { downloadService } from "../services/downloadService";
import { userService } from "../services/userService";

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
      ? theme.palette.success.main 
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
  }
}));

export const Account = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const { wishlistItems, toggleWishlist } = useWishlist();

  // Tab mapping state
  const tabQuery = searchParams.get("tab") || "profile";
  const tabMap = ["profile", "orders", "downloads", "wishlist", "addresses"];
  const activeTabIdx = tabMap.indexOf(tabQuery) !== -1 ? tabMap.indexOf(tabQuery) : 0;

  const [orders, setOrders] = useState([]);
  const [downloads, setDownloads] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  // States for downloading simulation feedback
  const [downloadingId, setDownloadingId] = useState(null);

  // Load account sub-resources
  useEffect(() => {
    const loadAccountResources = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const orderHistory = await orderService.getOrdersByUser(user.id);
        setOrders(orderHistory);

        const cabinetFiles = await downloadService.getDownloadsByUser(user.id);
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
    setDownloadingId(file.id);
    try {
      const res = await downloadService.triggerFileDownload(file.id, file.title);
      alert(`Download started: ${res.fileName}`);
    } catch {
      alert("Download file execution failed.");
    } finally {
      setDownloadingId(null);
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

  return (
    <Container maxWidth="xl" style={{ paddingTop: "48px", paddingBottom: "96px" }}>
      <SectionHeader
        title={`Welcome Back, ${user?.name}`}
        subtitle="Manage your physical shipping coordinates, orders history, or unlock file packages."
      />

      <Tabs value={activeTabIdx} onChange={handleTabChange} indicatorColor="primary" textColor="primary" variant="scrollable" scrollButtons="auto">
        <Tab label="Profile Info" icon={<PersonIcon />} iconPosition="start" />
        <Tab label="Orders History" icon={<HistoryIcon />} iconPosition="start" />
        <Tab label="Digital Cabinet" icon={<CloudDownloadIcon />} iconPosition="start" />
        <Tab label="Wishlist" icon={<FavoriteIcon />} iconPosition="start" />
        <Tab label="Addresses" icon={<HomeIcon />} iconPosition="start" />
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
                    <h3 style={{ margin: "0 0 4px 0", color: "#111111" }}>{user?.name}</h3>
                    <Chip label={user?.role} color="primary" size="xs" variant="outlined" />
                    <p style={{ fontSize: "13px", color: theme.palette.text.secondary, marginTop: "16px" }}>
                      Member since August 2026
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
                          <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "bold" }}>{order.id}</h4>
                        </Box>
                        <Box style={{ textAlign: "right" }}>
                          <span style={{ fontSize: "12px", color: theme.palette.text.secondary }}>Date Placed</span>
                          <div style={{ fontSize: "14px", fontWeight: "bold" }}>{new Date(order.date).toLocaleDateString()}</div>
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
                            Fulfillment Package Status ({order.fulfillmentDetails.carrier || "Carrier Pending"} Tracking: {order.fulfillmentDetails.trackingNumber || "None"})
                          </span>
                          {renderTimeline(order.status)}
                        </div>
                      )}
                    </Card>
                  ))
                )}
              </Box>
            )}

            {/* TABS 2: Cabinet */}
            {activeTabIdx === 2 && (
              <Card padding={6}>
                <h3 style={{ margin: "0 0 8px 0", fontSize: "16px", fontWeight: "bold" }}>My Digital Locker</h3>
                <p style={{ color: theme.palette.text.secondary, fontSize: "13px", marginBottom: "24px", marginTop: 0 }}>
                  Access and download your commercial licenses, template files, and vectors instantly.
                </p>
                {downloads.length === 0 ? (
                  <Box py={6} style={{ textAlign: "center" }}>
                    <p style={{ color: theme.palette.text.secondary }}>No digital licenses unlocked in your cabinet.</p>
                  </Box>
                ) : (
                  <div>
                    {downloads.map(file => (
                      <FileRow key={file.id}>
                        <Box display="flex" gap={4} alignItems="center">
                          <img src={file.image} alt={file.title} style={{ width: "48px", height: "64px", objectFit: "cover", borderRadius: "4px" }} />
                          <Box>
                            <h4 style={{ margin: "0 0 4px 0", fontSize: "14px", fontWeight: "bold" }}>{file.title}</h4>
                            <Box display="flex" gap={2} fontSize="11px" color={theme.palette.text.secondary}>
                              <span>Format: {file.fileFormat}</span>
                              <span>·</span>
                              <span>Size: {file.fileSize}</span>
                              <span>·</span>
                              <span>Downloads: {file.downloadCount}</span>
                            </Box>
                          </Box>
                        </Box>

                        <Button
                          variant="secondary"
                          state={downloadingId === file.id ? "loading" : "default"}
                          leftIcon={<CloudDownloadIcon style={{ fontSize: "16px" }} />}
                          onClick={() => handleTriggerDownload(file)}
                        >
                          Download ZIP
                        </Button>
                      </FileRow>
                    ))}
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
                        <Card padding={4} interactive border={true} onClick={() => navigate(`/products/${item.id}`)}>
                          <img src={item.image} alt={item.title} style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "8px", marginBottom: "12px" }} />
                          <h4 style={{ margin: "0 0 8px 0", fontSize: "14px", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{item.title}</h4>
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Price amount={item.price} size="sm" showDiscountBadge={false} />
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
          </>
        )}
      </TabPanelContainer>
    </Container>
  );
};

export default Account;
