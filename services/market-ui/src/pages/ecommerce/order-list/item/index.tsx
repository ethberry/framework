import { FC } from "react";
import { Grid, Link, List, ListItem, ListItemText, Paper } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { format, parseISO } from "date-fns";
import { Link as RouterLink } from "react-router-dom";

import { humanReadableDateTimeFormat } from "@gemunion/constants";
import type { IOrder } from "@framework/types";

interface IOrderItemProps {
  order: IOrder;
}
export const OrderItem: FC<IOrderItemProps> = props => {
  const { order } = props;

  return (
    <Grid item xs={12}>
      <List component={Paper}>
        <ListItem>
          <ListItemText>
            <FormattedMessage id="pages.orders.date" />
            :&nbsp;
            {format(parseISO(order.createdAt), humanReadableDateTimeFormat)}
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>
            <FormattedMessage id="pages.orders.price" />
            :&nbsp;
            {/* {formatPrice(order.price)} */}
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
            <ul>
              {order.orderItems.map(item => (
                <li key={item.id}>
                  <Link component={RouterLink} to={`/ecommerce/products/${item.productItem!.product!.id}`}>
                    {item.productItem!.product!.title}
                  </Link>
                </li>
              ))}
            </ul>
          </ListItemText>
        </ListItem>
      </List>
    </Grid>
  );
};
