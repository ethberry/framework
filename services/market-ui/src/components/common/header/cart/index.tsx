import { FC, useContext } from "react";
import { Badge, IconButton, Tooltip } from "@mui/material";
import { ShoppingCart } from "@mui/icons-material";
import { useIntl } from "react-intl";

import { CartContext } from "../../../providers/cart";
import { NavLink as RouterNavLink } from "react-router-dom";

export const Cart: FC = () => {
  const cart = useContext(CartContext);

  const { formatMessage } = useIntl();

  return (
    <Tooltip title={formatMessage({ id: "components.header.checkout" })} enterDelay={300}>
      <IconButton color="inherit" component={RouterNavLink} to="/checkout">
        <Badge badgeContent={cart.items.length} color="primary">
          <ShoppingCart />
        </Badge>
      </IconButton>
    </Tooltip>
  );
};
