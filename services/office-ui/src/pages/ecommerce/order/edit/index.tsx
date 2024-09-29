import { FC } from "react";
import { format, parseISO } from "date-fns";

import { humanReadableDateTimeFormat } from "@ethberry/constants";
import type { IOrder, IUser } from "@framework/types";
import { OrderStatus } from "@framework/types";
import { FormDialog } from "@ethberry/mui-dialog-form";
import { SelectInput, StaticInput } from "@ethberry/mui-inputs-core";
import { EntityInput } from "@ethberry/mui-inputs-entity";

import { AddressSelectInput } from "../../../../components/inputs/address-select";
import { ItemsInput } from "./items-input";
import { validationSchema } from "./validation";

export interface IEditOrderDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IOrder>, form: any) => Promise<void>;
  initialValues: IOrder;
}

export const EditOrderDialog: FC<IEditOrderDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, addressId, createdAt, orderItems, orderStatus, userId } = initialValues;
  const fixedValues = { id, addressId, orderItems, orderStatus, userId };

  const message = id ? "dialogs.edit" : "dialogs.create";

  return (
    <FormDialog initialValues={fixedValues} validationSchema={validationSchema} message={message} {...rest}>
      <EntityInput name="userId" controller="users" getTitle={(option: IUser) => option.displayName} />
      <AddressSelectInput />
      {id ? <SelectInput name="orderStatus" options={OrderStatus} /> : null}
      <ItemsInput name="orderItems" />
      <StaticInput name="createdAt" value={format(parseISO(createdAt), humanReadableDateTimeFormat)} />
    </FormDialog>
  );
};
