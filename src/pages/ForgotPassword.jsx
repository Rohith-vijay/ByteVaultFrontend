import React, { useState } from "react";
import { Link } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { Container } from "../components/primitives/Container";
import { Card } from "../components/primitives/Card";
import { Button } from "../components/primitives/Button";
import { Input } from "../components/primitives/Input";
import { authService } from "../services/authService";

const AuthContainer = styled(Container)(() => ({
  paddingTop: "80px",
  paddingBottom: "80px",
  maxWidth: "480px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  minHeight: "calc(100vh - 72px - 280px)",
}));

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await authService.requestPasswordReset(email);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Failed to submit request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer>
      <Card padding={8} elevation="subtle" radius="xl">
        <h2 style={{ fontFamily: theme.typography.fontFamily, fontSize: "24px", fontWeight: "bold", margin: "0 0 8px 0", color: "#111111" }}>
          Recover Password
        </h2>
        <p style={{ fontSize: "14px", color: theme.palette.text.secondary, margin: "0 0 24px 0" }}>
          Input your email and we'll dispatch a link to overwrite your account password credentials.
        </p>

        {submitted ? (
          <Box py={4} textAlign="center">
            <h3 style={{ color: theme.palette.success.main, margin: "0 0 12px 0" }}>Reset Link Dispatched</h3>
            <p style={{ fontSize: "13px", color: theme.palette.text.secondary, marginBottom: "24px" }}>
              Please check <strong>{email}</strong> for instructions to finalize password replacement.
            </p>
            <Button variant="secondary" onClick={() => setSubmitted(false)} fullWidth>
              Resend Link
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
                label="Email Address"
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
              />
              <Button variant="primary" type="submit" state={loading ? "loading" : "default"} fullWidth>
                Submit Request
              </Button>
            </Box>
          </form>
        )}

        <Box display="flex" justifyContent="center" mt={6}>
          <Link to="/login" style={{ color: theme.palette.primary.main, textDecoration: "none", fontSize: "13px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px" }}>
            <ArrowBackIcon style={{ fontSize: "16px" }} />
            Back to Sign In
          </Link>
        </Box>
      </Card>
    </AuthContainer>
  );
};

export default ForgotPassword;
