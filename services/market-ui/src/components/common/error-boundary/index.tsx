import React, { Component, ErrorInfo, ReactNode } from "react";
import { Box, IconButton } from "@mui/material";
import { Refresh } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";

import { NodeEnv } from "@framework/types";

import { StyledAlert, StyledError, StyledPreBottom, StyledPreTop } from "./styled";

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
          <StyledAlert
            severity="error"
            action={
              <IconButton size="small" onClick={this.reloadPage}>
                <Refresh />
              </IconButton>
            }
          >
            <FormattedMessage
              id={`alert.${process.env.NODE_ENV !== NodeEnv.production ? "uncaughtError" : "knownError"}`}
            />
          </StyledAlert>
          {process.env.NODE_ENV !== NodeEnv.production ? (
            <Box>
              <StyledPreTop component="pre">{this.state.error?.toString() || ""}</StyledPreTop>
              <StyledPreBottom component="pre">
                {this.state.errorInfo?.componentStack?.toString() || ""}
              </StyledPreBottom>
            </Box>
          ) : null}
        </StyledError>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
