import React from "react";
import { Link } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import SearchIcon from "@mui/icons-material/Search";

import { Container } from "../components/primitives/Container";
import { Button } from "../components/primitives/Button";
import { Card } from "../components/primitives/Card";

const PageContainer = styled(Container)(() => ({
  paddingTop: "120px",
  paddingBottom: "120px",
  maxWidth: "520px",
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  minHeight: "calc(100vh - 72px - 280px)",
}));

export const NotFound = () => {
  return (
    <PageContainer>
      <Card padding={8} elevation="subtle" radius="xl">
        <SearchIcon style={{ fontSize: "64px", color: theme.palette.primary.main, marginBottom: "16px" }} />
        <h2 style={{ fontFamily: theme.typography.fontFamily, fontSize: "32px", fontWeight: "bold", margin: "0 0 12px 0", color: "#111111" }}>
          Page Not Found
        </h2>
        <p style={{ fontSize: "14px", color: theme.palette.text.secondary, margin: "0 0 32px 0", lineHeight: 1.6 }}>
          The page coordinates you entered do not match any available routes in the ByteVault media customer portal.
        </p>
        <Box display="flex" flexDirection="column" gap={3}>
          <Button variant="primary" component={Link} to="/" fullWidth>
            Go to Homepage
          </Button>
          <Button variant="secondary" component={Link} to="/catalog" fullWidth>
            Browse Products
          </Button>
        </Box>
      </Card>
    </PageContainer>
  );
};

export default NotFound;
