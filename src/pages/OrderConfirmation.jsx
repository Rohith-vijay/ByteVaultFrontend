import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import {
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon
} from "@mui/icons-material";

import { Container } from "../components/primitives/Container";
import { Card } from "../components/primitives/Card";
import { Button } from "../components/primitives/Button";
import { Price } from "../components/primitives/Price";
import { Skeleton } from "../components/primitives/Skeleton";
import { orderService } from "../services/orderService";

const PageContainer = styled(Container)(() => ({
  paddingTop: 12 * 4,
  paddingBottom: 16 * 4,
  maxWidth: "720px",
}));

export const OrderConfirmation = () => {
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
        console.error("Order fetch failed on confirmation", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <PageContainer>
        <Card padding={8}>
          <Skeleton variant="circular" width={64} height={64} style={{ margin: "0 auto 24px auto" }} />
          <Skeleton variant="rectangular" height={32} width="50%" style={{ margin: "0 auto 16px auto" }} />
          <Skeleton variant="rectangular" height={100} width="100%" />
        </Card>
      </PageContainer>
    );
  }

  if (!order) {
    return (
      <PageContainer style={{ textAlign: "center" }}>
        <Card padding={8}>
          <h2>Order Not Found</h2>
          <p style={{ color: theme.palette.text.secondary }}>We couldn't retrieve confirmation details for this order ID.</p>
          <Button variant="primary" onClick={() => navigate("/")} style={{ marginTop: "16px" }}>
            Return to Store
          </Button>
        </Card>
      </PageContainer>
    );
  }

  const isOnlyDigital = order.items.every(i => i.type === "DIGITAL");

  return (
    <PageContainer>
      <Card padding={8} elevation="subtle" radius="xl" style={{ textAlign: "center" }}>
        <CheckCircleIcon style={{ fontSize: "64px", color: theme.palette.success.main, marginBottom: "24px" }} />
        <h2 style={{ fontFamily: theme.typography.fontFamily, fontSize: "28px", fontWeight: "bold", margin: "0 0 8px 0" }}>
          Thank You for Your Order!
        </h2>
        <p style={{ fontSize: "15px", color: theme.palette.text.secondary, margin: "0 0 32px 0", lineHeight: 1.6 }}>
          Your order <strong>{order.id}</strong> has been confirmed. A receipt and confirmation email are on the way.
        </p>

        <Divider style={{ margin: "24px 0" }} />

        {/* Invoice Summary */}
        <Box textAlign="left" mb={8}>
          <h3 style={{ fontSize: "16px", fontWeight: "bold", margin: "0 0 16px 0" }}>Order Summary</h3>
          <Box display="flex" flexDirection="column" gap={3}>
            {order.items.map(item => (
              <Box key={item.id} display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <strong style={{ fontSize: "14px" }}>{item.title}</strong>
                  <span style={{ fontSize: "11px", color: theme.palette.text.secondary, display: "block" }}>
                    Qty: {item.quantity} · {item.type}
                  </span>
                </Box>
                <Price amount={item.price * item.quantity} size="xs" />
              </Box>
            ))}
          </Box>

          <Divider style={{ margin: "20px 0" }} />

          <Grid container spacing={4} fontSize="14px">
            <Grid item xs={6} color={theme.palette.text.secondary}>Subtotal</Grid>
            <Grid item xs={6} style={{ textAlign: "right" }}>${order.totals.subtotal.toFixed(2)}</Grid>
            
            <Grid item xs={6} color={theme.palette.text.secondary}>Tax (8%)</Grid>
            <Grid item xs={6} style={{ textAlign: "right" }}>${order.totals.tax.toFixed(2)}</Grid>

            <Grid item xs={6} color={theme.palette.text.secondary}>Shipping</Grid>
            <Grid item xs={6} style={{ textAlign: "right" }}>
              {order.totals.shipping > 0 ? `$${order.totals.shipping.toFixed(2)}` : "FREE"}
            </Grid>

            <Grid item xs={6} style={{ fontWeight: "bold" }}>Total Amount</Grid>
            <Grid item xs={6} style={{ textAlign: "right", fontWeight: "bold", color: theme.palette.primary.main }}>
              ${order.totals.total.toFixed(2)}
            </Grid>
          </Grid>
        </Box>

        <Box display="flex" flexDirection="column" gap={3}>
          {isOnlyDigital ? (
            <Button
              variant="primary"
              onClick={() => navigate("/account?tab=downloads")}
              rightIcon={<ArrowForwardIcon style={{ fontSize: "16px" }} />}
              fullWidth
            >
              Go to My Digital Library
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={() => navigate(`/account?tab=orders`)}
              rightIcon={<ArrowForwardIcon style={{ fontSize: "16px" }} />}
              fullWidth
            >
              Track Shipping Status
            </Button>
          )}
          <Button variant="secondary" onClick={() => navigate("/")} fullWidth>
            Continue Shopping
          </Button>
        </Box>
      </Card>
    </PageContainer>
  );
};

export default OrderConfirmation;
