import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
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

export const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "mock_token";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await authService.resetPassword(token, password);
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer>
      <Card padding={8} elevation="subtle" radius="xl">
        <h2 style={{ fontFamily: theme.typography.fontFamily, fontSize: "24px", fontWeight: "bold", margin: "0 0 8px 0", color: "#111111" }}>
          Reset Password
        </h2>
        <p style={{ fontSize: "14px", color: theme.palette.text.secondary, margin: "0 0 24px 0" }}>
          Please input and confirm your replacement password.
        </p>

        {success ? (
          <Box py={4} textAlign="center">
            <h3 style={{ color: theme.palette.success.main, margin: "0 0 12px 0" }}>Password Updated</h3>
            <p style={{ fontSize: "13px", color: theme.palette.text.secondary, marginBottom: "24px" }}>
              Your credentials have been successfully updated. You can now sign in.
            </p>
            <Button variant="primary" component={Link} to="/login" fullWidth>
              Sign In Now
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
                label="New Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
              />
              <Input
                label="Confirm New Password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                fullWidth
              />
              <Button variant="primary" type="submit" state={loading ? "loading" : "default"} fullWidth>
                Reset Password
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

export default ResetPassword;
