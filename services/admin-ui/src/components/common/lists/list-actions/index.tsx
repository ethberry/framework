import { Children, cloneElement, FC, PropsWithChildren, ReactElement } from "react";
import { Theme, useMediaQuery } from "@mui/material";

import { ListActionVariant } from "../interface";
import type { IListActionProps } from "../list-action";
import { ListMenu } from "../list-menu";
import { Root } from "./styled";

export interface IListActionsProps {
  dataTestId?: string;
  disabled?: boolean;
  itemsVisibleOnMobile?: number;
  itemsVisibleOnDesktop?: number;
}

export const ListActions: FC<PropsWithChildren<IListActionsProps>> = props => {
  const { children, dataTestId, disabled, itemsVisibleOnMobile = 1, itemsVisibleOnDesktop = 3 } = props;

  const actions = Children.toArray(children) as Array<ReactElement<IListActionProps>>;

  const actionsAmount = actions.length;

  const isSmallScreen = useMediaQuery<Theme>(theme => theme.breakpoints.down("sm"));
  const itemsQuantity = isSmallScreen ? itemsVisibleOnMobile : itemsVisibleOnDesktop;

  const renderActions = () => {
    if (actionsAmount > itemsQuantity) {
      const visibleActions = Children.map(
        actions.slice(0, itemsQuantity - 1),
        (action: ReactElement<IListActionProps>) => cloneElement(action, { variant: ListActionVariant.iconButton }),
      );
      const hiddenActions = Children.map(actions.slice(itemsQuantity - 1), (action: ReactElement<IListActionProps>) =>
        cloneElement(action, { variant: ListActionVariant.menuItem }),
      );

      return (
        <>
          {visibleActions}
          <ListMenu disabled={disabled} dataTestId={dataTestId}>
            {hiddenActions}
          </ListMenu>
        </>
      );
    }

    return actions;
  };

  if (actionsAmount === 0) {
    return null;
  }

  return <Root>{renderActions()}</Root>;
};
