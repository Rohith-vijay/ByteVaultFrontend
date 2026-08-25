import React from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";

const HeaderWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
  width: "100%",
  marginBottom: theme.spacing(8),
  gap: theme.spacing(6),

  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginBottom: theme.spacing(6),
  },
}));

const TextGroup = styled("div")({
  display: "flex",
  flexDirection: "column",
});

const LabelText = styled("span")(({ theme }) => ({
  ...theme.typography.label,
  marginBottom: theme.spacing(2),
  display: "inline-block",
}));

const Heading = styled("h2")(({ theme }) => ({
  ...theme.typography.h2,
  color: theme.palette.text.primary,
  margin: 0,
}));

const Subheading = styled("p")(({ theme }) => ({
  ...theme.typography.body1,
  color: theme.palette.text.secondary,
  margin: `${theme.spacing(2)} 0 0 0`,
  maxWidth: "600px",
  lineHeight: 1.5,
}));

const ActionGroup = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  flexShrink: 0,

  [theme.breakpoints.down("sm")]: {
    width: "100%",
    justifyContent: "flex-start",
  },
}));

export const SectionHeader = ({
  title,
  subtitle,
  label,
  action,
  className,
  ...props
}) => {
  return (
    <HeaderWrapper className={className} {...props}>
      <TextGroup>
        {label && <LabelText>{label}</LabelText>}
        <Heading>{title}</Heading>
        {subtitle && <Subheading>{subtitle}</Subheading>}
      </TextGroup>

      {action && <ActionGroup>{action}</ActionGroup>}
    </HeaderWrapper>
  );
};

SectionHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  label: PropTypes.string,
  action: PropTypes.node,
  className: PropTypes.string,
};
