import { Children, cloneElement, FC, PropsWithChildren, ReactElement, isValidElement } from "react";
import { Theme, useMediaQuery } from "@mui/material";

import { ListActionVariant } from "../interface";
import type { IListActionProps } from "../list-action";
import { ListMenu } from "../list-menu";
import { Root } from "./styled";

export interface IListActionsProps {
  dataTestId?: string;
  itemsVisibleOnMobile?: number;
  itemsVisibleOnDesktop?: number;
}

export const ListActions: FC<PropsWithChildren<IListActionsProps>> = props => {
  const { children, dataTestId, itemsVisibleOnMobile = 1, itemsVisibleOnDesktop = 3 } = props;

  const actions = Children.toArray(children).filter(
    // @ts-ignore (child.type is not callable)
    child => isValidElement(child) && child?.type(child.props),
  ) as Array<ReactElement<IListActionProps>>;

  const actionsAmount = actions.length;

  const isSmallScreen = useMediaQuery<Theme>(theme => theme.breakpoints.down("sm"));
  const itemsQuantity = isSmallScreen ? itemsVisibleOnMobile : itemsVisibleOnDesktop;

  const renderActions = () => {
    if (actionsAmount > itemsQuantity) {
      const visibleActions = Children.map(actions.slice(0, itemsQuantity - 1), action =>
        cloneElement(action, { variant: ListActionVariant.iconButton }),
      );
      const hiddenActions = Children.map(actions.slice(itemsQuantity - 1), action =>
        cloneElement(action, { variant: ListActionVariant.menuItem }),
      );

      const isAllHiddenActionsDisabled = hiddenActions.every(action => action.props.disabled);

      return (
        <>
          {visibleActions}
          <ListMenu disabled={isAllHiddenActionsDisabled} dataTestId={dataTestId}>
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
