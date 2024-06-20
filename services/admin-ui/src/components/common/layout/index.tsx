import { FC } from "react";
import { Outlet } from "react-router-dom";

import { ErrorBoundary } from "@gemunion/mui-page-layout";

import { Header } from "../header";
import { Root, StyledContainer } from "./styled";

export const Layout: FC = () => {
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
