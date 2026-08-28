import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { styled, useTheme } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import {
  CreditCard as CreditCardIcon,
  LocalShipping as LocalShippingIcon,
  CheckCircleOutlineOutlined as CheckCircleOutlineIcon,
  ErrorOutlineOutlined as ErrorOutlineIcon,
  Bolt as BoltIcon
} from "@mui/icons-material";

import CircularProgress from "@mui/material/CircularProgress";
import { Container } from "../components/primitives/Container";
import { SectionHeader } from "../components/primitives/SectionHeader";
import { Card } from "../components/primitives/Card";
import { Button } from "../components/primitives/Button";
import { Input } from "../components/primitives/Input";
import { useCart } from "../store/CartContext";
import { useAuth } from "../store/AuthContext";
import { paymentService } from "../services/paymentService";
import { orderService } from "../services/orderService";

const StepIndicatorWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(8),
  position: "relative",
  maxWidth: "500px",
  margin: "0 auto 32px auto",

  "&::after": {
    content: '""',
    position: "absolute",
    height: "2px",
    backgroundColor: theme.palette.border.default,
    left: "24px",
    right: "24px",
    top: "16px",
    zIndex: 1,
  }
}));

const StepIndicator = styled("div", {
  shouldForwardProp: (prop) => prop !== "active" && prop !== "completed",
})(({ theme, active, completed }) => ({
  width: "32px",
  height: "32px",
  borderRadius: theme.radius.full,
  backgroundColor: completed 
    ? theme.palette.success.main 
    : active 
    ? theme.palette.primary.main 
    : theme.palette.background.elevated,
  color: completed || active ? theme.palette.background.paper : theme.palette.text.secondary,
  fontSize: "12px",
  fontWeight: "bold",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 2,
  border: `2px solid ${
    completed 
      ? theme.palette.success.main 
      : active 
      ? theme.palette.primary.main 
      : theme.palette.border.default
  }`,
  transition: "all 0.3s ease",
}));

const SummaryText = styled("span")(({ theme }) => ({
  fontSize: "14px",
  color: theme.palette.text.secondary,
}));

export const Checkout = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const { cartItems, totals, clearCart } = useCart();
  const { user } = useAuth();

  const [step, setStep] = useState(1); // steps: 1 = Shipping, 2 = Payment, 3 = Confirm
  const [loading, setLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);

  // Address Inputs
  const [addressName, setAddressName] = useState(user?.name || "");
  const [addressStreet, setAddressStreet] = useState("");
  const [addressCity, setAddressCity] = useState("");
  const [addressState, setAddressState] = useState("");
  const [addressZip, setAddressZip] = useState("");

  // Card Inputs
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  const [txState, setTxState] = useState("Cart Ready");
  const isOnlyDigital = !totals.hasPhysical;

  const handleNextStep = () => {
    // If digital-only, skip shipping step (Step 1) and jump straight to Payment (Step 2)
    if (step === 1 && isOnlyDigital) {
      setStep(2);
      return;
    }
    setStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    if (step === 2 && isOnlyDigital) {
      navigate("/cart");
      return;
    }
    setStep(prev => prev - 1);
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setCheckoutError(null);

    try {
      // 1. Order Creation
      setTxState("Order Creation");
      const shippingAddress = isOnlyDigital ? null : {
        name: addressName,
        street: addressStreet,
        city: addressCity,
        state: addressState,
        zip: addressZip,
        country: "United States"
      };

      const order = await orderService.createOrder(
        user.id,
        cartItems,
        shippingAddress,
        { type: "card", last4: cardNumber.replace(/\s/g, "").slice(-4) },
        "standard"
      );

      // 2. Payment Initiated
      setTxState("Payment Initiated");

      // 3. Payment Processing
      setTxState("Payment Processing");
      const paymentRes = await paymentService.processPayment(totals.total, {
        number: cardNumber,
        expiry: cardExpiry,
        cvc: cardCvc,
        name: addressName
      });

      // 4. Payment Verification
      setTxState("Payment Verification");
      await paymentService.verifyPayment(paymentRes.transactionId);

      // 5. Order Paid
      setTxState("Order Paid");

      // 6. Fulfillment Pending
      setTxState("Fulfillment Pending");
      await new Promise((resolve) => setTimeout(resolve, 800));

      // 7. Entitlement Available
      setTxState("Entitlement Available");

      clearCart();
      navigate(`/order-confirmation/${order.id}`);
    } catch (err) {
      setCheckoutError(err.message || "Checkout failed. Please retry.");
      setTxState("Cart Ready");
    } finally {
      setLoading(false);
    }
  };

  // Render Success Screen
  if (step === 3 && createdOrder) {
    return (
      <Container style={{ paddingTop: "80px", maxWidth: "600px", textAlign: "center" }}>
        <Card padding={8} elevation="subtle" radius="xl">
          <CheckCircleOutlineIcon style={{ fontSize: "64px", color: theme.palette.success.main, marginBottom: "24px" }} />
          <h2 style={{ fontFamily: theme.typography.fontFamily, fontSize: "30px", fontWeight: "bold", margin: "0 0 16px 0", color: "#111111" }}>Order Placed Successfully!</h2>
          <p style={{ fontFamily: theme.typography.fontFamily, fontSize: "16px", color: theme.palette.text.secondary, lineHeight: 1.6, marginBottom: "32px" }}>
            Thank you for shopping at ByteVault Media. Your order ID is <strong>{createdOrder.id}</strong>.
            {isOnlyDigital 
              ? " Your files are now unlocked in your digital cabinet. You can download them instantly." 
              : " We will send shipping status updates and a tracking link to your email."}
          </p>

          <Box display="flex" flexDirection="column" gap={3}>
            {isOnlyDigital ? (
              <Button variant="primary" onClick={() => navigate("/account?tab=downloads")}>
                Go to My Cabinet
              </Button>
            ) : (
              <Button variant="primary" onClick={() => navigate("/account?tab=orders")}>
                Track Shipping Status
              </Button>
            )}
            <Button variant="secondary" onClick={() => navigate("/")}>
              Return to Marketplace
            </Button>
          </Box>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" style={{ paddingTop: "48px", paddingBottom: "96px" }}>
      <SectionHeader
        title="Checkout Wizard"
        subtitle={isOnlyDigital ? "Secure digital purchase portal" : "Shipment & checkout details"}
      />

      {/* Steps indicators */}
      <StepIndicatorWrapper>
        <StepIndicator active={step === 1 && !isOnlyDigital} completed={step > 1 || isOnlyDigital}>
          {isOnlyDigital ? <CheckCircleOutlineIcon style={{ fontSize: "16px" }} /> : "1"}
        </StepIndicator>
        <StepIndicator active={step === 2} completed={step > 2}>
          2
        </StepIndicator>
      </StepIndicatorWrapper>

      <Grid container spacing={8}>
        {/* Left Hand Form Steps */}
        <Grid item xs={12} lg={8}>
          {checkoutError && (
            <Card padding={4} elevation="none" style={{ backgroundColor: "#FEF2F2", border: `1px solid ${theme.palette.error.main}`, marginBottom: "24px", color: theme.palette.error.main, display: "flex", alignItems: "center", gap: "12px" }}>
              <ErrorOutlineIcon />
              <span style={{ fontSize: "14px", fontWeight: "bold" }}>{checkoutError}</span>
            </Card>
          )}

          {/* STEP 1: Shipping address (hides for digital only) */}
          {step === 1 && !isOnlyDigital && (
            <Card padding={6} radius="lg">
              <h3 style={{ margin: "0 0 24px 0", fontSize: "16px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "12px" }}>
                <LocalShippingIcon style={{ color: theme.palette.primary.main }} />
                Shipping Information
              </h3>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Input label="Recipient Full Name" value={addressName} onChange={(e) => setAddressName(e.target.value)} fullWidth />
                </Grid>
                <Grid item xs={12}>
                  <Input label="Street Address" value={addressStreet} onChange={(e) => setAddressStreet(e.target.value)} fullWidth />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Input label="City" value={addressCity} onChange={(e) => setAddressCity(e.target.value)} fullWidth />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Input label="State" value={addressState} onChange={(e) => setAddressState(e.target.value)} fullWidth />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Input label="Zip Code" value={addressZip} onChange={(e) => setAddressZip(e.target.value)} fullWidth />
                </Grid>
              </Grid>

              <Box display="flex" justifyContent="flex-end" mt={6}>
                <Button variant="primary" onClick={handleNextStep} disabled={!addressName || !addressStreet || !addressCity || !addressZip}>
                  Continue to Payment
                </Button>
              </Box>
            </Card>
          )}

          {/* STEP 2: Credit Card Payment Form */}
          {step === 2 && (
            <Card padding={6} radius="lg">
              <h3 style={{ margin: "0 0 24px 0", fontSize: "16px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "12px" }}>
                <CreditCardIcon style={{ color: theme.palette.primary.main }} />
                Secure Credit Card Payment
              </h3>
              
              {loading ? (
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={12} gap={4}>
                  <CircularProgress size={48} thickness={4} />
                  <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "bold", color: theme.palette.text.primary }}>
                    Processing Order Checkout
                  </h4>
                  <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                    <span style={{ fontSize: "14px", color: theme.palette.primary.main, fontWeight: "bold" }}>
                      Current Phase: {txState}
                    </span>
                    <span style={{ fontSize: "12px", color: theme.palette.text.secondary }}>
                      Do not refresh or close this tab.
                    </span>
                  </Box>
                </Box>
              ) : (
                <form onSubmit={handleSubmitOrder}>
                  <Grid container spacing={4}>
                    <Grid item xs={12}>
                      <Input
                        label="Card Number"
                        placeholder="4242 4242 4242 4242"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Input
                        label="Expiration Date"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Input
                        label="CVC / CVV"
                        placeholder="123"
                        type="password"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        fullWidth
                      />
                    </Grid>
                  </Grid>

                  <Box display="flex" justifyContent="space-between" mt={8}>
                    <Button variant="secondary" onClick={handlePrevStep} type="button" disabled={loading}>
                      Back
                    </Button>
                    <Button
                      variant="primary"
                      type="submit"
                      state={loading ? "loading" : "default"}
                      disabled={loading || !cardNumber || !cardExpiry || !cardCvc}
                    >
                      Place Order (${totals.total.toFixed(2)})
                    </Button>
                  </Box>
                </form>
              )}
            </Card>
          )}
        </Grid>

        {/* Right Hand Cart Summary Details */}
        <Grid item xs={12} lg={4}>
          <Card padding={6} elevation="none" border={true} radius="lg">
            <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: "bold", color: "#111111" }}>Order Summary</h3>
            
            <Box display="flex" flexDirection="column" gap={3} mb={6}>
              {cartItems.map((item) => (
                <Box key={item.id} display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" flexDirection="column">
                    <span style={{ fontSize: "13px", fontWeight: "bold" }}>
                      {item.title} <span style={{ color: theme.palette.text.secondary }}>x{item.quantity}</span>
                    </span>
                    <span style={{ fontSize: "11px", color: theme.palette.text.secondary }}>
                      {item.type === "DIGITAL" ? "Digital File" : "Parcel Package"}
                    </span>
                  </Box>
                  <span style={{ fontSize: "13px" }}>${(item.price * item.quantity).toFixed(2)}</span>
                </Box>
              ))}

              <Divider style={{ margin: "12px 0" }} />

              <Box display="flex" justifyContent="space-between"><SummaryText>Subtotal</SummaryText><span style={{ fontSize: "14px" }}>${totals.subtotal.toFixed(2)}</span></Box>
              <Box display="flex" justifyContent="space-between"><SummaryText>Tax (8%)</SummaryText><span style={{ fontSize: "14px" }}>${totals.tax.toFixed(2)}</span></Box>
              <Box display="flex" justifyContent="space-between">
                <SummaryText>Shipping</SummaryText>
                <span style={{ fontSize: "14px" }}>
                  {totals.hasPhysical 
                    ? totals.shipping > 0 ? `$${totals.shipping.toFixed(2)}` : "FREE" 
                    : "Instant"}
                </span>
              </Box>

              <Divider style={{ margin: "12px 0" }} />

              <Box display="flex" justifyContent="space-between" alignItems="baseline">
                <span style={{ fontSize: "14px", fontWeight: "bold" }}>Grand Total</span>
                <span style={{ fontFamily: theme.typography.fontFamily, fontSize: "22px", fontWeight: "bold", color: theme.palette.primary.main }}>
                  ${totals.total.toFixed(2)}
                </span>
              </Box>
            </Box>

            {isOnlyDigital && (
              <Box display="flex" gap={2} p={3} style={{ backgroundColor: theme.palette.primary.soft, borderRadius: theme.radius.sm, alignItems: "center" }}>
                <BoltIcon style={{ color: theme.palette.primary.main, fontSize: "18px" }} />
                <span style={{ fontSize: "11px", color: theme.palette.primary.main, lineHeight: 1.4 }}>
                  Only digital assets detected. Transaction will immediately unlock your licenses.
                </span>
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Checkout;
