import { FC } from "react";
import { Outlet } from "react-router-dom";

import { Header } from "../header";
import ErrorBoundary from "../error-boundary";
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
