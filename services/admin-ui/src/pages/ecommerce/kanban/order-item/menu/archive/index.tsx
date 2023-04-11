import { FC } from "react";
import { ListItemIcon, MenuItem, Typography } from "@mui/material";
import { Archive } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";

import type { IOrder } from "@framework/types";

export interface IOrderArchiveMenuItemProps {
  order: IOrder;
}

export const OrderArchiveMenuItem: FC<IOrderArchiveMenuItemProps> = props => {
  const { order } = props;

  const handleClick = () => {
    void order;
    alert("Not implemented!");
  };

  return (
    <MenuItem onClick={handleClick}>
      <ListItemIcon>
        <Archive fontSize="small" />
      </ListItemIcon>
      <Typography variant="inherit">
        <FormattedMessage id="form.buttons.archive" />
      </Typography>
    </MenuItem>
  );
};
