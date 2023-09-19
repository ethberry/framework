import { FC, useContext } from "react";
import { NavLink as RouterNavLink } from "react-router-dom";
import { Badge, IconButton, Tooltip } from "@mui/material";
import { ShoppingCart } from "@mui/icons-material";
import { useIntl } from "react-intl";

import { CartContext } from "../../../providers/cart";

export const Cart: FC = () => {
  const cart = useContext(CartContext);

  const { formatMessage } = useIntl();

  return (
    <Tooltip title={formatMessage({ id: "components.header.checkout" })} enterDelay={300}>
      <IconButton color="inherit" component={RouterNavLink} to="/ecommerce/checkout">
        <Badge badgeContent={cart && cart.items ? cart.items.length : 1} color="primary">
          <ShoppingCart />
        </Badge>
      </IconButton>
    </Tooltip>
  );
};
