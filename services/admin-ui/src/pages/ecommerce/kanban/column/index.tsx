import { FC } from "react";
import { FormattedMessage } from "react-intl";

import { IOrder } from "@framework/types";

import { OrderList } from "../order-list";
import { StyledContainer, StyledHeader } from "./styled";

export interface IColumnProps {
  status: string;
  items: any;
  index: number;
  onEdit: (order: IOrder) => void;
}

export const Column: FC<IColumnProps> = props => {
  const { status, items, onEdit } = props;
  return (
    <StyledContainer>
      <StyledHeader component="h5">
        <FormattedMessage id={`enums.orderStatus.${status}`} />
      </StyledHeader>

      <OrderList listId={status} items={items} onEdit={onEdit} />
    </StyledContainer>
  );
};
