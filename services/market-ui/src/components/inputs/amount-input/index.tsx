import { FC, Fragment, useContext } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Grid, IconButton, Typography } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";

import { IProduct } from "@framework/types";

import { CartContext } from "../../providers/cart";
import { useStyles } from "./styles";

interface IPriceInputProps {
  product: IProduct;
}

export const AmountInput: FC<IPriceInputProps> = props => {
  const { product } = props;

  const cart = useContext(CartContext);
  const classes = useStyles();

  const amount = cart.items.find(item => item.product.id === product.id)?.amount;

  return (
    <Grid item container alignItems="center" justifyContent="center" className={classes.root}>
      {amount ? (
        <Fragment>
          <IconButton aria-label="remove" size="small" onClick={cart.alter(amount - 1, product)}>
            <Remove />
          </IconButton>
          <Typography>{amount}</Typography>
          <IconButton aria-label="add" size="small" onClick={cart.alter(amount + 1, product)}>
            <Add />
          </IconButton>
        </Fragment>
      ) : (
        <Button color="primary" onClick={cart.alter(1, product)} fullWidth>
          <FormattedMessage id="form.buttons.add" />
        </Button>
      )}
    </Grid>
  );
};
