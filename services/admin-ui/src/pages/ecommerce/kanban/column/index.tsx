import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Paper, Typography } from "@mui/material";

import { IOrder } from "@framework/types";

import { OrderList } from "../order-list";
import { useStyles } from "./styles";

export interface IColumnProps {
  status: string;
  items: any;
  index: number;
  onEdit: (order: IOrder) => void;
}

export const Column: FC<IColumnProps> = props => {
  const { status, items, onEdit } = props;
  const classes = useStyles();
  return (
    <Paper className={classes.container}>
      <Typography component="h5" className={classes.header}>
        <FormattedMessage id={`enums.orderStatus.${status}`} />
      </Typography>

      <OrderList listId={status} items={items} onEdit={onEdit} />
    </Paper>
  );
};
