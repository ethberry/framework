import React, {FC} from "react";
import {format, parseISO} from "date-fns";

import {FormDialog} from "@trejgun/material-ui-dialog-form";
import {SelectInput, StaticInput} from "@trejgun/material-ui-inputs-core";
import {dateTimeFormat} from "@trejgun/solo-constants-misc";
import {EntityInput} from "@trejgun/material-ui-inputs-entity";
import {IOrder, IUser, OrderStatus} from "@trejgun/solo-types";
import {validationSchema} from "./validation";

export interface IEditOrderDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IOrder>, formikBag: any) => Promise<void>;
  initialValues: IOrder;
}

export const EditOrderDialog: FC<IEditOrderDialogProps> = props => {
  const {initialValues, ...rest} = props;

  const {id, userId, merchantId, orderStatus, productId, createdAt} = initialValues;
  const fixedValues = {id, userId, merchantId, orderStatus, productId};

  const message = id ? "dialogs.add" : "dialogs.edit";

  return (
    <FormDialog initialValues={fixedValues} validationSchema={validationSchema} message={message} {...rest}>
      <EntityInput
        name="userId"
        controller="users"
        getTitle={(option: IUser) => `${option.firstName} ${option.lastName}`}
      />
      <EntityInput name="productId" controller="products" />
      <EntityInput name="merchantId" controller="merchants" />
      {id ? <SelectInput name="orderStatus" options={OrderStatus} /> : null}
      <StaticInput name="createdAt" value={format(parseISO(createdAt), dateTimeFormat)} />
    </FormDialog>
  );
};
