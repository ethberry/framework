import { PropsWithChildren, ReactNode, useEffect } from "react";

import { StyledEmptyWrapper } from "../empty-wrapper";
import { StyledList } from "./styled";
import { ListWrapperProvider, useListWrapperContext } from "./context";

export { ListWrapperProvider, useListWrapperContext };

export interface IStyledListWrapperProps {
  count?: number;
  isLoading?: boolean;
  message?: string;
  subheader?: ReactNode;
  rows?: Array<Record<string, any>>;
  account?: string;
}

export const StyledListWrapper = <V, R = any>(props: PropsWithChildren<IStyledListWrapperProps>) => {
  const { children, subheader, rows, account, ...rest } = props;
  const context = useListWrapperContext<V, R>();

  useEffect(() => {
    if (!context || !rows || !account) return;
    rows.forEach(row => {
      void context.callback({ address: row.address, account } as V).then(json => {
        context.setCallbackResponse(prevState => ({ ...prevState, [row.id]: json }));
      });
    });
  }, [rows]);

  return (
    <StyledEmptyWrapper {...rest}>
      <StyledList subheader={subheader}>{children}</StyledList>
    </StyledEmptyWrapper>
  );
};
