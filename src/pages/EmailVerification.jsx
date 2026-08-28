import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { Container } from "../components/primitives/Container";
import { Card } from "../components/primitives/Card";
import { Button } from "../components/primitives/Button";
import { Input } from "../components/primitives/Input";

const AuthContainer = styled(Container)(() => ({
  paddingTop: "80px",
  paddingBottom: "80px",
  maxWidth: "480px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  minHeight: "calc(100vh - 72px - 280px)",
}));

export const EmailVerification = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Simulate verification api call
      await new Promise((resolve) => setTimeout(resolve, 800));
      if (code.trim().length !== 6) {
        throw new Error("Invalid verification code. Code must be 6 digits.");
      }
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Failed to verify email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer>
      <Card padding={8} elevation="subtle" radius="xl">
        <h2 style={{ fontFamily: theme.typography.fontFamily, fontSize: "24px", fontWeight: "bold", margin: "0 0 8px 0", color: "#111111" }}>
          Verify Email
        </h2>
        <p style={{ fontSize: "14px", color: theme.palette.text.secondary, margin: "0 0 24px 0" }}>
          We have dispatched a 6-digit confirmation code. Input it below to activate your account.
        </p>

        {success ? (
          <Box py={4} textAlign="center">
            <CheckCircleIcon style={{ fontSize: "48px", color: theme.palette.success.main, marginBottom: "16px" }} />
            <h3 style={{ color: theme.palette.success.main, margin: "0 0 12px 0" }}>Account Verified</h3>
            <p style={{ fontSize: "13px", color: theme.palette.text.secondary, marginBottom: "24px" }}>
              Your email has been verified. You can now access full customer cabinet features.
            </p>
            <Button variant="primary" onClick={() => navigate("/")} fullWidth>
              Go to Marketplace
            </Button>
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <Box p={3} mb={4} style={{ backgroundColor: "#FEE2E2", color: theme.palette.error.main, borderRadius: "6px", fontSize: "13px", fontWeight: "bold" }}>
                {error}
              </Box>
            )}
            <Box display="flex" flexDirection="column" gap={4}>
              <Input
                label="Verification Code (6-Digits)"
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                fullWidth
              />
              <Button variant="primary" type="submit" state={loading ? "loading" : "default"} fullWidth>
                Verify Code
              </Button>
            </Box>
          </form>
        )}

        <Box display="flex" justifyContent="center" mt={6} fontSize="13px" color={theme.palette.text.secondary}>
          Didn't get a code?{" "}
          <span style={{ color: theme.palette.primary.main, cursor: "pointer", fontWeight: "bold", marginLeft: "4px" }} onClick={() => alert("Resent mock OTP verification code.")}>
            Resend
          </span>
        </Box>
      </Card>
    </AuthContainer>
  );
};

export default EmailVerification;
