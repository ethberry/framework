import React, {FC} from "react";
import {Grid, List, Link, ListItem, ListItemText, Paper} from "@material-ui/core";
import {FormattedMessage} from "react-intl";
import {format, parseISO} from "date-fns";
import {Link as RouterLink} from "react-router-dom";

import {IOrder} from "@trejgun/solo-types";
import {dateTimeFormat} from "@trejgun/solo-constants-misc";

import {formatMoney} from "../../../utils/money";

interface IOrderItemProps {
  order: IOrder;
}

export const OrderItem: FC<IOrderItemProps> = props => {
  const {order} = props;

  return (
    <Grid item xs={12}>
      <List component={Paper}>
        <ListItem>
          <ListItemText>
            <FormattedMessage id="pages.orders.product" />
            :&nbsp;
            <Link component={RouterLink} to={`/products/${order.product!.id}`}>
              {order.product!.title}
            </Link>
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>
            <FormattedMessage id="pages.orders.date" />
            :&nbsp;
            {format(parseISO(order.createdAt), dateTimeFormat)}
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>
            <FormattedMessage id="pages.orders.price" />
            :&nbsp;
            {formatMoney(order.price)}
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>
            <FormattedMessage id="pages.orders.status" />
            :&nbsp;
            <FormattedMessage id={`enums.orderStatus.${order.orderStatus}`} />
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>
            <FormattedMessage id="pages.orders.products" />
            :&nbsp;
            {order.product!.title}
          </ListItemText>
        </ListItem>
      </List>
    </Grid>
  );
};
