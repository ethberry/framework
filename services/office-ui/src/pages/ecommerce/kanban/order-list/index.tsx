import { FC, memo, ReactElement } from "react";
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
  Droppable,
  DroppableProvided,
} from "react-beautiful-dnd";

import { IOrder } from "@framework/types";

import { OrderListItem } from "../order-item";
import { useStyles } from "./styles";

export interface IQuoteListProps {
  listId?: string;
  items: Array<IOrder>;
  onEdit: (order: IOrder) => void;
}

interface IInnerListItem {
  order: IOrder;
  index: number;
  onEdit: (order: IOrder) => void;
}

const InnerListItem = memo<IInnerListItem>(props => {
  const { order, index, onEdit } = props;
  return (
    <Draggable draggableId={order.id.toString()} index={index}>
      {(dragProvided: DraggableProvided, dragSnapshot: DraggableStateSnapshot): ReactElement => (
        <OrderListItem
          order={order}
          isDragging={dragSnapshot.isDragging}
          isGroupedOver={Boolean(dragSnapshot.combineTargetFor)}
          provided={dragProvided}
          onEdit={onEdit}
        />
      )}
    </Draggable>
  );
});

export const OrderList: FC<IQuoteListProps> = props => {
  const { listId = "LIST", items = [], onEdit } = props;

  const classes = useStyles();

  return (
    <Droppable droppableId={listId}>
      {(dropProvided: DroppableProvided): ReactElement => (
        <div className={classes.wrapper} {...dropProvided.droppableProps}>
          <div className={classes.dropZone} ref={dropProvided.innerRef.bind(dropProvided)}>
            {items.map((order: IOrder, i: number) => (
              <InnerListItem order={order} key={order.id} index={i} onEdit={onEdit} />
            ))}
            {dropProvided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
};
