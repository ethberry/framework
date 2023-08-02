import React, { Component, ErrorInfo, ReactNode } from "react";
import { Alert, Box, IconButton } from "@mui/material";
import { Refresh } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";

import { NodeEnv } from "@framework/types";

import { StyledError } from "./styled";

interface IProps {
  children?: ReactNode;
}

interface IState {
  hasError: boolean;
  error: Error | null;
  errorInfo?: ErrorInfo | null;
}

class ErrorBoundary extends Component<IProps, IState> {
  public state: IState = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): IState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ hasError: true, error, errorInfo });
    console.error("Uncaught error:", error, errorInfo);
  }

  reloadPage = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <StyledError>
          <Alert
            severity="error"
            sx={{ width: "100%", "& .MuiAlert-action": { pt: 0 } }}
            action={
              <IconButton size="small" onClick={this.reloadPage}>
                <Refresh />
              </IconButton>
            }
          >
            <FormattedMessage id="messages.uncaughtError" />
          </Alert>
          {process.env.NODE_ENV !== NodeEnv.production ? (
            <Box>
              <Box component="pre" sx={{ mb: 0 }}>
                {this.state.error?.toString() || ""}
              </Box>
              <Box component="pre" sx={{ mt: 0 }}>
                {this.state.errorInfo?.componentStack?.toString() || ""}
              </Box>
            </Box>
          ) : null}
        </StyledError>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
