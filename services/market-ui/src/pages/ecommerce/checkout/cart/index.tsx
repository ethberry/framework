import { FC, Fragment, useContext } from "react";
import { FormattedMessage } from "react-intl";
import {
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
  Paper,
  Typography,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";

import { CartContext } from "../../../../components/providers/cart";
import { formatPrice } from "../../../../utils/money";

export const Cart: FC = () => {
  const cart = useContext(CartContext);

  return (
    <Paper sx={{ mb: 2, p: 2 }}>
      <Typography component="h4" variant="h5">
        <FormattedMessage id="pages.checkout.products" />
      </Typography>
      <List disablePadding={true}>
        {cart && cart.items && cart.items.length ? (
          cart.items.map(item => (
            <ListItem key={item.product.id} disableGutters>
              <ListItemText
                primary={item.product.title}
                secondary={<Fragment>{formatPrice(item.product.productItems[0].price)}</Fragment>}
              />
              <ListItemSecondaryAction>
                <Grid item container alignItems="center" justifyContent="center">
                  <IconButton aria-label="delete" size="small" onClick={cart.alter(item.amount - 1, item.product)}>
                    <Remove />
                  </IconButton>
                  <Typography>{item.amount}</Typography>
                  <IconButton aria-label="add" size="small" onClick={cart.alter(item.amount + 1, item.product)}>
                    <Add />
                  </IconButton>
                </Grid>
              </ListItemSecondaryAction>
            </ListItem>
          ))
        ) : (
          <ListItem disableGutters>
            <FormattedMessage id="pages.checkout.empty" />
          </ListItem>
        )}
        <ListSubheader sx={{ textAlign: "right" }}>
          <FormattedMessage
            id="pages.checkout.total"
            values={{
              amount: 100,
            }}
          />
        </ListSubheader>
      </List>
    </Paper>
  );
};
