import { memo } from "react";

import { IOrder } from "@framework/types";

import { useStyles } from "./styles";

export interface IOrderListItemProps {
  order: IOrder;
  isDragging: boolean;
  provided: any;
  isGroupedOver?: boolean;
  onEdit: (order: IOrder) => void;
}

export const OrderListItem = memo<IOrderListItemProps>(props => {
  const { order, provided, onEdit } = props;

  const classes = useStyles();

  return (
    <div
      onClick={() => onEdit(order)}
      className={classes.container}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      <div className={classes.id}>#{order.id}</div>
      <div className={classes.addr}>{order.address?.address}</div>
    </div>
  );
});
