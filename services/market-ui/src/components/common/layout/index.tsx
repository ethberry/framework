import { FC, useEffect } from "react";
import { Outlet } from "react-router-dom";

import { Header } from "../header";
import ErrorBoundary from "../error-boundary";
import { Root, StyledContainer } from "./styled";

export const Layout: FC = () => {
  useEffect(() => {
    // Get the current URL
    const url = window.location.href;
    const searchParams = url.includes("?") ? url.split("?")[1] : null;

    if (searchParams) {
      const queryParams = new URLSearchParams(searchParams);
      // Check if a refferer query parameter exists
      if (queryParams.has("referrer")) {
        // Get the value of the refferer
        const paramValue = queryParams.get("referrer");
        // Save in LocalStorage
        localStorage.setItem("refferer", paramValue!);
        // console.log("Refferer:", paramValue);
      }
    }
  }, []);

  return (
    <Root>
      <Header />
      <StyledContainer maxWidth="md">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </StyledContainer>
    </Root>
  );
};
