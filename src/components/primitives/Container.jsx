import React from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";

const StyledContainer = styled("div", {
  shouldForwardProp: (prop) => prop !== "maxContainerWidth" && prop !== "hasGutters",
})(({ theme, maxContainerWidth, hasGutters }) => {
  let maxWidthVal = "none";
  if (maxContainerWidth !== "fluid") {
    maxWidthVal = theme.containerWidth[maxContainerWidth];
  }

  const paddingX = hasGutters
    ? {
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4),
        [theme.breakpoints.up("sm")]: {
          paddingLeft: theme.spacing(6),
          paddingRight: theme.spacing(6),
        },
        [theme.breakpoints.up("md")]: {
          paddingLeft: theme.spacing(8),
          paddingRight: theme.spacing(8),
        },
      }
    : {};

  return {
    width: "100%",
    marginLeft: "auto",
    marginRight: "auto",
    maxWidth: maxWidthVal,
    boxSizing: "border-box",
    ...paddingX,
  };
});

export const Container = ({
  children,
  maxWidth = "lg",
  gutters = true,
  className,
  ...props
}) => {
  return (
    <StyledContainer
      maxContainerWidth={maxWidth}
      hasGutters={gutters}
      className={className}
      {...props}
    >
      {children}
    </StyledContainer>
  );
};

Container.propTypes = {
  children: PropTypes.node.isRequired,
  maxWidth: PropTypes.oneOf(["sm", "md", "lg", "xl", "fluid"]),
  gutters: PropTypes.bool,
  className: PropTypes.string,
};
