import { PropsWithChildren, ReactNode, useEffect } from "react";

import { IAccessControl } from "@framework/types";

import * as path from "path";
import { StyledEmptyWrapper } from "../empty-wrapper";
import { StyledList } from "./styled";
import { ListWrapperProvider, useListWrapperContext } from "./context";
import { getPropertyValue } from "./utils";

export { ListWrapperProvider, useListWrapperContext };

type Primitive = string | number | boolean | null | undefined;
type NestedKeyOf<ObjectType extends Record<string, any>> = {
  [Key in keyof ObjectType & (string | number)]: Required<ObjectType[Key]> extends Primitive
    ? `${Key}`
    : `${Key}` | `${Key}.${NestedKeyOf<Required<ObjectType[Key]>>}`;
}[keyof ObjectType & (string | number)];

export interface IStyledListWrapperProps<T extends Record<string, any>> {
  count?: number;
  isLoading?: boolean;
  message?: string;
  subheader?: ReactNode;
  rows?: Array<T>;
  path?: "address" | `${NestedKeyOf<T>}` | `${NestedKeyOf<T>}.${string}`;
  account?: string;
}

export const StyledListWrapper = <T extends Record<string, any>>(
  props: PropsWithChildren<IStyledListWrapperProps<T>>,
) => {
  const { children, subheader, rows, path, account, ...rest } = props;
  const context = useListWrapperContext<Pick<IAccessControl, "address" | "account">, Array<IAccessControl>>();

  useEffect(() => {
    if (!context || !rows || !account || !path) return;
    rows.forEach(row => {
      const address = getPropertyValue(row, path.split(".")) as string;

      void context.callback({ address, account }).then(json => {
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
