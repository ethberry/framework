import { FC, PropsWithChildren } from "react";
import { FormattedMessage } from "react-intl";

import { Root, StyledEmptyMessage } from "./styled";

export interface IStyledEmptyWrapperProps {
  count?: number;
  isLoading?: boolean;
  message?: string;
}

export const StyledEmptyWrapper: FC<PropsWithChildren<IStyledEmptyWrapperProps>> = props => {
  const { children, count = 0, isLoading = false, message = "messages.empty-list" } = props;

  if (count) {
    return children;
  }

  return (
    <Root>
      <StyledEmptyMessage>
        <FormattedMessage id={isLoading ? "messages.loading" : message} />
      </StyledEmptyMessage>
    </Root>
  );
};
