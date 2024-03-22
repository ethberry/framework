import { FC, PropsWithChildren, ReactNode } from "react";
import { FormattedMessage } from "react-intl";
import { List } from "@mui/material";

import { Root, StyledEmptyMessage } from "./styled";

export interface IStyledListWrapperProps {
  count?: number;
  isLoading?: boolean;
  message?: string;
  subheader?: ReactNode;
}

export const StyledListWrapper: FC<PropsWithChildren<IStyledListWrapperProps>> = props => {
  const { children, count = 0, isLoading = false, message = "messages.empty-list", subheader } = props;

  if (count) {
    return <List subheader={subheader}>{children}</List>;
  }

  return (
    <Root>
      <StyledEmptyMessage>
        <FormattedMessage id={isLoading ? "messages.loading" : message} />
      </StyledEmptyMessage>
    </Root>
  );
};
