import { FC, memo, ReactElement } from "react";
import {
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
  Droppable,
  DroppableProvided,
} from "react-beautiful-dnd";
import { Box } from "@mui/material";

import { IOrder } from "@framework/types";

import { OrderListItem } from "../order-item";
import { Wrapper } from "./styled";

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

  return (
    <Droppable droppableId={listId}>
      {(dropProvided: DroppableProvided): ReactElement => (
        <Wrapper {...dropProvided.droppableProps}>
          <Box sx={{ height: "100%" }} ref={dropProvided.innerRef.bind(dropProvided)}>
            {items.map((order: IOrder, i: number) => (
              <InnerListItem order={order} key={i} index={i} onEdit={onEdit} />
            ))}
            {dropProvided.placeholder}
          </Box>
        </Wrapper>
      )}
    </Droppable>
  );
};
