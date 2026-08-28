import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";

import { Container } from "../components/primitives/Container";
import { Card } from "../components/primitives/Card";
import { Button } from "../components/primitives/Button";
import { Chip } from "../components/primitives/Chip";
import { Price } from "../components/primitives/Price";
import { Skeleton } from "../components/primitives/Skeleton";
import { orderService } from "../services/orderService";

const PageContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(12),
  paddingBottom: theme.spacing(16),
  maxWidth: "960px",
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

export const OrderDetails = () => {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const found = await orderService.getOrderById(id);
        setOrder(found);
      } catch (err) {
        console.error("Order details fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

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

  if (loading) {
    return (
      <PageContainer>
        <Box display="flex" flexDirection="column" gap={4}>
          <Skeleton variant="rectangular" height={40} width="30%" />
          <Skeleton variant="rectangular" height={200} />
          <Skeleton variant="rectangular" height={150} />
        </Box>
      </PageContainer>
    );
  }

  if (!order) {
    return (
      <PageContainer style={{ textAlign: "center" }}>
        <Card padding={8}>
          <h2>Order Not Found</h2>
          <p style={{ color: theme.palette.text.secondary }}>We couldn't retrieve information for order ID: {id}</p>
          <Button variant="primary" onClick={() => navigate("/account?tab=orders")} style={{ marginTop: "16px" }}>
            Back to Orders
          </Button>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Box mb={6}>
        <Link to="/account?tab=orders" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: theme.palette.text.secondary, textDecoration: "none", fontSize: "14px", fontWeight: "bold" }}>
          <ArrowBackIcon style={{ fontSize: "16px" }} />
          Back to Orders
        </Link>
      </Box>

      <Grid container spacing={6}>
        <Grid item xs={12} md={8}>
          <Card padding={6} style={{ marginBottom: "24px" }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
              <Box>
                <span style={{ fontSize: "12px", color: theme.palette.text.secondary }}>Order Reference</span>
                <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "bold" }}>{order.id}</h2>
              </Box>
              <Chip label={order.status} color={order.status === "DELIVERED" ? "success" : "primary"} />
            </Box>

            <Divider style={{ margin: "16px 0" }} />

            <h3 style={{ fontSize: "15px", fontWeight: "bold", margin: "0 0 16px 0" }}>Items In Order</h3>
            <Box display="flex" flexDirection="column" gap={4}>
              {order.items.map(item => (
                <Box key={item.id} display="flex" gap={4} alignItems="center">
                  <img src={item.image} alt={item.title} style={{ width: "48px", height: "64px", objectFit: "cover", borderRadius: "4px" }} />
                  <Box flexGrow={1}>
                    <h4 style={{ margin: "0 0 4px 0", fontSize: "14px", fontWeight: "bold" }}>{item.title}</h4>
                    <span style={{ fontSize: "12px", color: theme.palette.text.secondary }}>
                      Quantity: {item.quantity} · Price: ${item.price.toFixed(2)}
                    </span>
                  </Box>
                  <Box style={{ textAlign: "right", display: "flex", flexDirection: "column", gap: "4px", alignItems: "flex-end" }}>
                    <Price amount={item.price * item.quantity} size="xs" />
                    {item.type === "DIGITAL" && (
                      <Button variant="secondary" component={Link} to="/account?tab=downloads" leftIcon={<CloudDownloadIcon style={{ fontSize: "12px" }} />} style={{ padding: "4px 8px", fontSize: "11px", minWidth: "auto" }}>
                        Retrieve License
                      </Button>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>

            {order.totals.hasPhysical && (
              <Box mt={6}>
                <Divider style={{ margin: "24px 0 16px 0" }} />
                <h3 style={{ fontSize: "15px", fontWeight: "bold", margin: "0 0 8px 0", display: "flex", alignItems: "center", gap: "8px" }}>
                  <LocalShippingIcon style={{ color: theme.palette.primary.main }} />
                  Fulfillment Status
                </h3>
                <span style={{ fontSize: "12px", color: theme.palette.text.secondary }}>
                  Carrier: {order.fulfillmentDetails?.carrier || "Pending"} · Tracking Number: {order.fulfillmentDetails?.trackingNumber || "Assigning"}
                </span>
                {renderTimeline(order.status)}
              </Box>
            )}
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card padding={6} elevation="none" border={true} style={{ marginBottom: "24px" }}>
            <h3 style={{ fontSize: "15px", fontWeight: "bold", margin: "0 0 16px 0" }}>Order Receipt</h3>
            <Box display="flex" flexDirection="column" gap={3} fontSize="13px">
              <Box display="flex" justifyContent="space-between">
                <span style={{ color: theme.palette.text.secondary }}>Subtotal</span>
                <span>${order.totals.subtotal.toFixed(2)}</span>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <span style={{ color: theme.palette.text.secondary }}>Tax (8%)</span>
                <span>${order.totals.tax.toFixed(2)}</span>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <span style={{ color: theme.palette.text.secondary }}>Shipping</span>
                <span>{order.totals.shipping > 0 ? `$${order.totals.shipping.toFixed(2)}` : "FREE"}</span>
              </Box>
              <Divider style={{ margin: "8px 0" }} />
              <Box display="flex" justifyContent="space-between" style={{ fontWeight: "bold", fontSize: "15px" }}>
                <span>Total Paid</span>
                <span style={{ color: theme.palette.primary.main }}>${order.totals.total.toFixed(2)}</span>
              </Box>
            </Box>
          </Card>

          {order.shippingAddress && (
            <Card padding={6} elevation="none" border={true}>
              <h3 style={{ fontSize: "15px", fontWeight: "bold", margin: "0 0 12px 0" }}>Delivery Address</h3>
              <p style={{ margin: 0, fontSize: "13px", color: theme.palette.text.secondary, lineHeight: 1.5 }}>
                {order.shippingAddress.name} <br />
                {order.shippingAddress.street} <br />
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip} <br />
                {order.shippingAddress.country}
              </p>
            </Card>
          )}
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default OrderDetails;
