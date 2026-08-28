import React from "react";
import { styled } from "@mui/material/styles";
import WifiOffIcon from "@mui/icons-material/WifiOff";

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

export const Offline = () => {
  const handleRetry = () => {
    if (navigator.onLine) {
      window.location.reload();
    } else {
      alert("Still offline. Please check your internet connection.");
    }
  };

  return (
    <PageContainer>
      <Card padding={8} elevation="subtle" radius="xl">
        <WifiOffIcon style={{ fontSize: "64px", color: theme.palette.error.main, marginBottom: "16px" }} />
        <h2 style={{ fontFamily: theme.typography.fontFamily, fontSize: "28px", fontWeight: "bold", margin: "0 0 12px 0", color: "#111111" }}>
          You Are Offline
        </h2>
        <p style={{ fontSize: "14px", color: theme.palette.text.secondary, margin: "0 0 32px 0", lineHeight: 1.6 }}>
          We detected that your network connection has dropped. Please verify your internet settings and click retry below.
        </p>
        <Button variant="primary" onClick={handleRetry} fullWidth>
          Retry Connection
        </Button>
      </Card>
    </PageContainer>
  );
};

export default Offline;
