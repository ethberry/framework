import { PropsWithChildren, useEffect } from "react";

import { IAccessControl, IContract } from "@framework/types";

import { StyledListItem } from "./styled";
import { useListItemContext, ListItemProvider } from "./context";
import { IStyledListItemProps } from "./types";

export { StyledListItem, useListItemContext, ListItemProvider };

type IListItem = IStyledListItemProps & {
  contract?: IContract;
  account?: string;
};

export const ListItem = ({ account, contract, children }: PropsWithChildren<IListItem>) => {
  const context = useListItemContext<Pick<IAccessControl, "address" | "account">, Array<IAccessControl>>();
  useEffect(() => {
    if (!context || !account || !contract) return;
    void context.callback({ address: contract.address, account }).then(json => {
      context.setCallbackResponse(prevState => ({ ...prevState, [contract.id]: json }));
    });
  }, [contract, account]);
  return <StyledListItem>{children}</StyledListItem>;
};
