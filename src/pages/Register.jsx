import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { ErrorOutlineOutlined as ErrorOutlineIcon } from "@mui/icons-material";

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

export const Register = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);

    try {
      await register(name, email, password);
      navigate("/email-verification", { replace: true });
    } catch (err) {
      setFormError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <FormContainer>
        <Card padding={8} radius="xl">
          <FormTitle>Create Account</FormTitle>
          <p style={{ textAlign: "center", color: theme.palette.text.secondary, fontSize: "14px", marginTop: 0, marginBottom: "24px" }}>
            Join ByteVault Media and start building your workspaces.
          </p>

          {formError && (
            <Card padding={4} elevation="none" style={{ backgroundColor: "#FEF2F2", border: `1px solid ${theme.palette.error.main}`, marginBottom: "20px", color: theme.palette.error.main, display: "flex", alignItems: "center", gap: "10px" }}>
              <ErrorOutlineIcon style={{ fontSize: "18px" }} />
              <span style={{ fontSize: "12px", fontWeight: "bold" }}>{formError}</span>
            </Card>
          )}

          <form onSubmit={handleRegisterSubmit}>
            <Box display="flex" flexDirection="column" gap={4}>
              <Input
                label="Full Name"
                placeholder="Alex Rivera"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                fullWidth
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="alex@enterprise.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
              />

              <Input
                label="Password"
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
              />

              <Button
                variant="primary"
                type="submit"
                state={loading ? "loading" : "default"}
                disabled={loading || !name || !email || !password || password.length < 6}
                fullWidth
              >
                Register Account
              </Button>
            </Box>
          </form>

          <Box mt={6} textAlign="center" fontSize="13px" color={theme.palette.text.secondary}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: theme.palette.primary.main, fontWeight: "bold", textDecoration: "none" }}>
              Sign In
            </Link>
          </Box>
        </Card>
      </FormContainer>
    </Container>
  );
};

export default Register;
