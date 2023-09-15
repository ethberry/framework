import { Children, cloneElement, FC, PropsWithChildren, ReactElement } from "react";
import { Grid, Theme, useMediaQuery } from "@mui/material";

import { ListActionVariant } from "../interface";
import type { IStyledListActionProps } from "../list-action";
import { StyledListMenu } from "../list-menu";

export interface IStyledListActionsProps {
  dataTestId?: string;
  disabled?: boolean;
  itemsVisibleOnMobile?: number;
  itemsVisibleOnDesktop?: number;
}

export const StyledListActions: FC<PropsWithChildren<IStyledListActionsProps>> = props => {
  const { children, dataTestId, disabled, itemsVisibleOnMobile = 1, itemsVisibleOnDesktop = 3 } = props;

  const actions = Children.toArray(children) as Array<ReactElement<IStyledListActionProps>>;

  const actionsAmount = actions.length;

  const isSmallScreen = useMediaQuery<Theme>(theme => theme.breakpoints.down("sm"));
  const itemsQuantity = isSmallScreen ? itemsVisibleOnMobile : itemsVisibleOnDesktop;

  const renderActions = () => {
    if (actionsAmount > itemsQuantity) {
      const visibleActions = Children.map(
        actions.slice(0, itemsQuantity - 1),
        (action: ReactElement<IStyledListActionProps>) =>
          cloneElement(action, { variant: ListActionVariant.iconButton }),
      );
      const hiddenActions = Children.map(
        actions.slice(itemsQuantity - 1),
        (action: ReactElement<IStyledListActionProps>) => cloneElement(action, { variant: ListActionVariant.menuItem }),
      );

      return (
        <>
          {visibleActions}
          <StyledListMenu disabled={disabled} dataTestId={dataTestId}>
            {hiddenActions}
          </StyledListMenu>
        </>
      );
    }

    return actions;
  };

  if (actionsAmount === 0) {
    return null;
  }

  return (
    <Grid item sm={3} sx={{ display: "flex", justifyContent: "flex-end" }}>
      {renderActions()}
    </Grid>
  );
};
