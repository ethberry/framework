import { PropsWithChildren, ReactNode, useEffect } from "react";

import { StyledEmptyWrapper } from "../empty-wrapper";
import { StyledList } from "./styled";
import { ListWrapperProvider, useListWrapperContext } from "./context";

export { ListWrapperProvider, useListWrapperContext };

export interface IStyledListWrapperProps<T extends Record<string, any>> {
  count?: number;
  isLoading?: boolean;
  message?: string;
  subheader?: ReactNode;
  rows?: Array<T>;
  account?: string;
}

export const StyledListWrapper = <T extends Record<string, any>>(
  props: PropsWithChildren<IStyledListWrapperProps<T>>,
) => {
  const { children, subheader, rows, account, ...rest } = props;
  const context = useListWrapperContext();

  useEffect(() => {
    if (!context || !rows || !account) return;
    rows.forEach(row => {
      void context
        .callback({ role: "DEFAULT_ADMIN_ROLE", address: row.address, account })
        .then((json: { hasRole: boolean }) => {
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
