import { FC, PropsWithChildren, ReactNode } from "react";

import { StyledEmptyWrapper } from "../empty-wrapper";
import { StyledList } from "./styled";

export interface IStyledListWrapperProps {
  count?: number;
  isLoading?: boolean;
  message?: string;
  subheader?: ReactNode;
}

export const StyledListWrapper: FC<PropsWithChildren<IStyledListWrapperProps>> = props => {
  const { children, subheader, ...rest } = props;

  return (
    <StyledEmptyWrapper {...rest}>
      <StyledList subheader={subheader}>{children}</StyledList>
    </StyledEmptyWrapper>
  );
};
