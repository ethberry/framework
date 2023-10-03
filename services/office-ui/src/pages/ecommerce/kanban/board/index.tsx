import { FC, useEffect, useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";

import type { IOrder } from "@framework/types";
import { OrderStatus } from "@framework/types";

import { Column } from "../column";
import { useStyles } from "./styles";

const statuses = [OrderStatus.NEW, OrderStatus.SCHEDULED, OrderStatus.NOW_IN_DELIVERY, OrderStatus.DELIVERED];

export interface IBoardProps {
  initial: { [status: string]: Array<IOrder> };
  onOrderStatusChange: (id: string, status: OrderStatus) => void;
  onEdit: (order: IOrder) => void;
}

export const Board: FC<IBoardProps> = props => {
  const { initial, onOrderStatusChange, onEdit } = props;

  const classes = useStyles();
  const [columns, setColumns] = useState(initial);
  const [ordered, setOrdered] = useState(Object.values(OrderStatus));

  useEffect(() => {
    setColumns(initial);
    setOrdered(statuses);
  }, [initial]);

  const onDragEnd = ({ source, destination, draggableId }: DropResult): any => {
    // dropped nowhere
    if (!destination) {
      return;
    }

    console.info(`Order #${draggableId} moved from '${source.droppableId}' to '${destination.droppableId}'`);

    onOrderStatusChange(draggableId, destination.droppableId as OrderStatus);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={classes.container}>
        {ordered.map((status: string, index: number) => (
          <Column key={status} index={index} status={status} items={columns[status]} onEdit={onEdit} />
        ))}
      </div>
    </DragDropContext>
  );
};
