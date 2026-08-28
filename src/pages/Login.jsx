import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import {
  Info as InfoIcon,
  ErrorOutlineOutlined as ErrorOutlineIcon
} from "@mui/icons-material";

import { Container } from "../components/primitives/Container";
import { Card } from "../components/primitives/Card";
import { Input } from "../components/primitives/Input";
import { Button } from "../components/primitives/Button";
import { useAuth } from "../store/AuthContext";

const FormContainer = styled("div")(() => ({
  maxWidth: "420px",
  margin: "80px auto",
  width: "100%",
}));

const FormTitle = styled("h2")(({ theme }) => ({
  ...theme.typography.h2,
  textAlign: "center",
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(2),
}));

const InfoBanner = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.primary.soft,
  borderColor: `${theme.palette.primary.main}33`,
  marginBottom: theme.spacing(6),
  display: "flex",
  gap: theme.spacing(3),
  alignItems: "flex-start",
}));

export const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  // Path redirection on success
  const origin = location.state?.from?.pathname || "/";

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);

    try {
      await login(email, password);
      navigate(origin, { replace: true });
    } catch (err) {
      setFormError(err.message || "Authenticating failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <FormContainer>
        <Card padding={8} radius="xl">
          <FormTitle>Sign In</FormTitle>
          <p style={{ textAlign: "center", color: theme.palette.text.secondary, fontSize: "14px", marginTop: 0, marginBottom: "24px" }}>
            Access ByteVault files cabinet and order schedules.
          </p>

          {/* Test credentials banner */}
          <InfoBanner padding={4}>
            <InfoIcon style={{ color: theme.palette.primary.main, marginTop: "2px" }} />
            <Box fontSize="12px" color={theme.palette.primary.main} lineHeight={1.5}>
              <strong>Mock test credentials:</strong> <br />
              Email: <code>customer@bytevault.com</code> <br />
              Password: <code>password123</code>
            </Box>
          </InfoBanner>

          {formError && (
            <Card padding={4} elevation="none" style={{ backgroundColor: "#FEF2F2", border: `1px solid ${theme.palette.error.main}`, marginBottom: "20px", color: theme.palette.error.main, display: "flex", alignItems: "center", gap: "10px" }}>
              <ErrorOutlineIcon style={{ fontSize: "18px" }} />
              <span style={{ fontSize: "12px", fontWeight: "bold" }}>{formError}</span>
            </Card>
          )}

          <form onSubmit={handleLoginSubmit}>
            <Box display="flex" flexDirection="column" gap={4}>
              <Input
                label="Email Coordinates"
                type="email"
                placeholder="customer@bytevault.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
              />

              <Box style={{ textAlign: "right" }}>
                <Link to="/forgot-password" style={{ fontSize: "12px", color: theme.palette.primary.main, textDecoration: "none" }}>
                  Forgot Password?
                </Link>
              </Box>

              <Button
                variant="primary"
                type="submit"
                state={loading ? "loading" : "default"}
                disabled={loading || !email || !password}
                fullWidth
              >
                Sign In
              </Button>
            </Box>
          </form>

          <Box mt={6} textAlign="center" fontSize="13px" color={theme.palette.text.secondary}>
            New to ByteVault?{" "}
            <Link to="/register" style={{ color: theme.palette.primary.main, fontWeight: "bold", textDecoration: "none" }}>
              Create an Account
            </Link>
          </Box>
        </Card>
      </FormContainer>
    </Container>
  );
};

export default Login;
