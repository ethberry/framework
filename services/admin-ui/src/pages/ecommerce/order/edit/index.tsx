import { FC } from "react";
import { format, parseISO } from "date-fns";

import { humanReadableDateTimeFormat } from "@gemunion/constants";
import { IOrder, IUser, OrderStatus } from "@framework/types";
import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, StaticInput } from "@gemunion/mui-inputs-core";
import { EntityInput } from "@gemunion/mui-inputs-entity";

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

  const { id, addressId, createdAt, items, orderStatus, userId } = initialValues;
  const fixedValues = { id, addressId, items, orderStatus, userId };

  const message = id ? "dialogs.edit" : "dialogs.create";

  return (
    <FormDialog initialValues={fixedValues} validationSchema={validationSchema} message={message} {...rest}>
      <EntityInput name="userId" controller="users" getTitle={(option: IUser) => option.displayName} />
      <AddressSelectInput />
      {id ? <SelectInput name="orderStatus" options={OrderStatus} /> : null}
      <ItemsInput name="items" />
      <StaticInput name="createdAt" value={format(parseISO(createdAt), humanReadableDateTimeFormat)} />
    </FormDialog>
  );
};
