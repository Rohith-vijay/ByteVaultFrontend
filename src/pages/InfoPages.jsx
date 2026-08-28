import React, { useState } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import { styled, useTheme } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";

import { Container } from "../components/primitives/Container";
import { Card } from "../components/primitives/Card";
import { Button } from "../components/primitives/Button";
import { Input } from "../components/primitives/Input";
import { SectionHeader } from "../components/primitives/SectionHeader";

const InfoPageContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(12),
  paddingBottom: theme.spacing(16),
}));

const TabWrapper = styled(Box)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.border.default}`,
  marginBottom: theme.spacing(8),
}));

const ContactInfoItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(4),
  marginBottom: theme.spacing(4),
  "& svg": {
    color: theme.palette.primary.main,
  },
}));

export const InfoPages = () => {
  const theme = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  
  // Resolve path name to default tab mapping
  const path = location.pathname.substring(1); // e.g. "about", "faq"
  const defaultTab = path === "refund-policy" || path === "refund" ? "refunds" : path;
  
  // Mappings
  const activeTab = searchParams.get("tab") || defaultTab || "about";
  const tabs = ["about", "faq", "contact", "terms", "privacy", "refunds"];
  const activeIdx = tabs.indexOf(activeTab) !== -1 ? tabs.indexOf(activeTab) : 0;

  const handleTabChange = (_e, newValue) => {
    setSearchParams({ tab: tabs[newValue] });
  };

  // Contact Form State
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setContactName("");
      setContactEmail("");
      setContactMessage("");
    }, 1000);
  };

  return (
    <InfoPageContainer maxWidth="lg">
      <SectionHeader
        title="Information Center"
        subtitle="Learn about ByteVault, contact support, or view licensing policy documents."
      />

      <TabWrapper>
        <Tabs
          value={activeIdx}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="About ByteVault" />
          <Tab label="FAQ / Help" />
          <Tab label="Contact Support" />
          <Tab label="Terms of Service" />
          <Tab label="Privacy Policy" />
          <Tab label="Refund Policy" />
        </Tabs>
      </TabWrapper>

      {/* Tab Panels */}
      <Box mt={6}>
        {/* ABOUT */}
        {activeTab === "about" && (
          <Grid container spacing={8}>
            <Grid item xs={12} md={7}>
              <h2 style={{ fontSize: "24px", fontWeight: "bold", margin: "0 0 16px 0" }}>Premium Assets for Creators</h2>
              <p style={{ lineHeight: 1.6, color: theme.palette.text.secondary, fontSize: "15px", marginBottom: "16px" }}>
                ByteVault Media is a modern digital repository crafted to provide software developers, sound engineers, UI designers, and creators with reliable, production-grade assets.
              </p>
              <p style={{ lineHeight: 1.6, color: theme.palette.text.secondary, fontSize: "15px", marginBottom: "16px" }}>
                We believe that premium digital work deserves a premium delivery experience. We host secure temporary download cabinet links, digital license checks, and lifetime updates for your purchased packages.
              </p>
              <p style={{ lineHeight: 1.6, color: theme.palette.text.secondary, fontSize: "15px" }}>
                Alongside our digital catalog, we manufacture custom-tuned desktop hardware accessories and travel organizers to round out your everyday workspace environment.
              </p>
            </Grid>
            <Grid item xs={12} md={5}>
              <Card padding={6} style={{ backgroundColor: theme.palette.background.washed }}>
                <h3 style={{ color: theme.palette.primary.main, fontWeight: "bold", margin: "0 0 12px 0" }}>Our Guarantees</h3>
                <ul style={{ paddingLeft: "20px", color: theme.palette.text.secondary, lineHeight: 1.8 }}>
                  <li>Instant delivery on digital entitlement files</li>
                  <li>Secure downloads through temporary tokens</li>
                  <li>Lifetime update versions for catalog items</li>
                  <li>Ergonomic design on physical desk setups</li>
                </ul>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* FAQ */}
        {activeTab === "faq" && (
          <Box display="flex" flexDirection="column" gap={4}>
            <h2 style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>Frequently Asked Questions</h2>
            <div>
              <Accordion style={{ boxShadow: theme.elevation.subtle, border: `1px solid ${theme.palette.border.default}`, borderRadius: "8px", marginBottom: "8px" }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <strong style={{ fontSize: "14px" }}>How do digital downloads work on ByteVault?</strong>
                </AccordionSummary>
                <AccordionDetails>
                  <p style={{ fontSize: "13px", color: theme.palette.text.secondary, margin: 0 }}>
                    Immediately after payment completes, your files are added to your personal "Digital Library" locker. You can trigger temporary links to download ZIP archives, Figma keys, or PDF files.
                  </p>
                </AccordionDetails>
              </Accordion>

              <Accordion style={{ boxShadow: theme.elevation.subtle, border: `1px solid ${theme.palette.border.default}`, borderRadius: "8px", marginBottom: "8px" }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <strong style={{ fontSize: "14px" }}>Are digital license purchases recurring?</strong>
                </AccordionSummary>
                <AccordionDetails>
                  <p style={{ fontSize: "13px", color: theme.palette.text.secondary, margin: 0 }}>
                    No, all listings on ByteVault are one-time purchases with commercial usage permissions. You buy once and receive updates for lifetime versions without monthly fees.
                  </p>
                </AccordionDetails>
              </Accordion>

              <Accordion style={{ boxShadow: theme.elevation.subtle, border: `1px solid ${theme.palette.border.default}`, borderRadius: "8px", marginBottom: "8px" }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <strong style={{ fontSize: "14px" }}>What is the shipping schedule for physical workspace accessories?</strong>
                </AccordionSummary>
                <AccordionDetails>
                  <p style={{ fontSize: "13px", color: theme.palette.text.secondary, margin: 0 }}>
                    Physical gear is packed and shipped from our sorting centers next day. Standard shipping takes 3-5 business days within continental countries. Tracking links are provided via email.
                  </p>
                </AccordionDetails>
              </Accordion>
            </div>
          </Box>
        )}

        {/* CONTACT */}
        {activeTab === "contact" && (
          <Grid container spacing={8}>
            <Grid item xs={12} md={5}>
              <h2 style={{ fontSize: "24px", fontWeight: "bold", margin: "0 0 24px 0" }}>Reach Support</h2>
              <ContactInfoItem>
                <EmailIcon />
                <Box>
                  <strong style={{ display: "block", fontSize: "13px" }}>Email Support</strong>
                  <span style={{ fontSize: "13px", color: theme.palette.text.secondary }}>support@bytevaultmedia.com</span>
                </Box>
              </ContactInfoItem>
              <ContactInfoItem>
                <PhoneIcon />
                <Box>
                  <strong style={{ display: "block", fontSize: "13px" }}>Call Inquiries</strong>
                  <span style={{ fontSize: "13px", color: theme.palette.text.secondary }}>+1 (800) 555-0199</span>
                </Box>
              </ContactInfoItem>
              <ContactInfoItem>
                <LocationOnIcon />
                <Box>
                  <strong style={{ display: "block", fontSize: "13px" }}>Headquarters</strong>
                  <span style={{ fontSize: "13px", color: theme.palette.text.secondary }}>101 Silicon Valley Road, Suite 400</span>
                </Box>
              </ContactInfoItem>
            </Grid>
            <Grid item xs={12} md={7}>
              <Card padding={6}>
                {isSubmitted ? (
                  <Box py={6} textAlign="center">
                    <h3 style={{ margin: "0 0 12px 0", color: theme.palette.success.main }}>Message Sent Successfully!</h3>
                    <p style={{ color: theme.palette.text.secondary, margin: 0 }}>Thank you for reaching out. A representative will contact you shortly.</p>
                    <Button variant="secondary" onClick={() => setIsSubmitted(false)} style={{ marginTop: "16px" }}>
                      Send Another Message
                    </Button>
                  </Box>
                ) : (
                  <form onSubmit={handleContactSubmit}>
                    <h3 style={{ margin: "0 0 20px 0", fontSize: "16px", fontWeight: "bold" }}>Send us an Inquiry</h3>
                    <Box display="flex" flexDirection="column" gap={4}>
                      <Input label="Your Name" value={contactName} onChange={(e) => setContactName(e.target.value)} required fullWidth />
                      <Input label="Email Address" type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} required fullWidth />
                      <Input label="Inquiry Message" value={contactMessage} onChange={(e) => setContactMessage(e.target.value)} multiline rows={4} required fullWidth />
                      <Button variant="primary" type="submit" state={isSubmitting ? "loading" : "default"}>
                        Submit Ticket
                      </Button>
                    </Box>
                  </form>
                )}
              </Card>
            </Grid>
          </Grid>
        )}

        {/* TERMS */}
        {activeTab === "terms" && (
          <Box display="flex" flexDirection="column" gap={4}>
            <h2 style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>Terms of Service</h2>
            <Card padding={6} style={{ maxHeight: "400px", overflowY: "auto", fontSize: "13px", lineHeight: 1.6 }}>
              <p>Welcome to ByteVault Media. By accessing or downloading digital assets, files, tools, or physical merchandise from this portal, you agree to comply with and be bound by the following terms.</p>
              <h4>1. Usage & License Permissions</h4>
              <p>Each software blueprint, UI kit, or digital file package is distributed under a Single Seat Commercial License. You are permitted to integrate resources into client sites or personal repositories. Re-distribution or direct reselling is strictly prohibited.</p>
              <h4>2. Entitlements & Locker Revocations</h4>
              <p>Locker download tokens are provided temporarily and expire based on download frequency audits. ByteVault reserves the right to revoke downloads if excessive concurrent IP hits are flagged on secure links.</p>
            </Card>
          </Box>
        )}

        {/* PRIVACY */}
        {activeTab === "privacy" && (
          <Box display="flex" flexDirection="column" gap={4}>
            <h2 style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>Privacy Policy</h2>
            <Card padding={6} style={{ maxHeight: "400px", overflowY: "auto", fontSize: "13px", lineHeight: 1.6 }}>
              <p>At ByteVault Media, we prioritize customer security and data protection. This policy outlines how user metadata and download trace histories are tracked.</p>
              <h4>1. Collection of User Parameters</h4>
              <p>We log email, purchase billing info, and X-Correlation-ID headers for API diagnostics and entitlement locks. We do not store credit card credentials directly on our gateways.</p>
              <h4>2. Analytics & Cookies</h4>
              <p>Cookie settings are limited to session validation authentication tokens and preferences tracking. No commercial user behavior profiling is sold to third parties.</p>
            </Card>
          </Box>
        )}

        {/* REFUNDS */}
        {activeTab === "refunds" && (
          <Box display="flex" flexDirection="column" gap={4}>
            <h2 style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>Digital Product & Refund Policy</h2>
            <Card padding={6} style={{ fontSize: "13px", lineHeight: 1.6 }}>
              <h3 style={{ color: theme.palette.primary.main, margin: "0 0 12px 0", fontSize: "15px" }}>No-Risk Customer Protections</h3>
              <p style={{ color: theme.palette.text.secondary, marginBottom: "16px" }}>
                Due to the non-tangible, instant unlock properties of digital resources (ZIP archives, blueprints, Figma source links), digital purchases are generally **non-refundable** once downloaded.
              </p>
              <p style={{ color: theme.palette.text.secondary, marginBottom: "16px" }}>
                If you have purchased a product by mistake and have **NOT** triggered any downloads in your "My Digital Library" cabinet, you can contact support within 14 days of checkout to request a full refund.
              </p>
              <p style={{ color: theme.palette.text.secondary }}>
                Physical workspace setup kits come with a **30-day return policy** in their original box and packaging. Returns shipping label costs are covered by the buyer.
              </p>
            </Card>
          </Box>
        )}
      </Box>
    </InfoPageContainer>
  );
};

export default InfoPages;
