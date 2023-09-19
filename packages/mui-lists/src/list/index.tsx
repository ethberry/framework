import { FC, PropsWithChildren } from "react";
import { ListProps } from "@mui/material";

import { StyledMuiList } from "./styled";

export interface IStyledListProps extends ListProps {
  withScroll?: boolean;
}

export const StyledList: FC<PropsWithChildren<IStyledListProps>> = props => {
  const { withScroll, children } = props;

  return (
    <StyledMuiList withScroll={withScroll} {...props}>
      {children}
    </StyledMuiList>
  );
};
