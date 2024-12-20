import { memo, MouseEvent } from "react";
import { Card, CardActions, CardContent, CardHeader, Typography } from "@mui/material";

import type { IOrder } from "@framework/types";

import { useFormatAddress } from "../../../../utils/address";
import { OrderActionMenu } from "./menu";

export interface IOrderListItemProps {
  order: IOrder;
  isDragging: boolean;
  provided: any;
  isGroupedOver?: boolean;
  onEdit: (order: IOrder) => void;
}

export const OrderListItem = memo<IOrderListItemProps>(props => {
  const { order, provided, onEdit } = props;

  const { formatAddress } = useFormatAddress();

  const handleClick = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <Card
      onClick={() => onEdit(order)}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      sx={{ mb: 1 }}
    >
      <CardHeader title={`#${order.id}`} />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="div">
          {order.address ? formatAddress(order.address) : ""}
        </Typography>
      </CardContent>
      <CardActions onClick={handleClick}>
        <OrderActionMenu order={order} />
      </CardActions>
    </Card>
  );
});
