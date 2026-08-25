import React from "react";
import PropTypes from "prop-types";
import { ErrorState } from "./primitives/ErrorState";
import { Container } from "./primitives/Container";
import logger from "../services/loggerService";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    logger.error("React Component Tree Render Crash", error, {
      componentStack: errorInfo?.componentStack
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container style={{ paddingTop: "120px", paddingBottom: "120px" }}>
          <ErrorState
            title="Something Went Wrong"
            message="We encountered an unexpected rendering error. A diagnostic log has been created and we are reviewing it. Please reload the page to restore your session."
            onRetry={() => window.location.reload()}
            retryText="Reload Application"
          />
        </Container>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
