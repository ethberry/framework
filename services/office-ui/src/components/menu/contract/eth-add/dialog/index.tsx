import { FC } from "react";
import { FormDialog } from "@gemunion/mui-dialog-form";
import { TextInput, SelectInput } from "@gemunion/mui-inputs-core";

import { ListenerType } from "@framework/types";

import { validationSchema } from "./validation";

export interface IEthListenerAddDto {
  address: string;
  listenerType: ListenerType;
  fromBlock: number;
}

export interface IEthListenerAddDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IEthListenerAddDto, form: any) => Promise<void>;
  initialValues: IEthListenerAddDto;
}

export const EthListenerAddDialog: FC<IEthListenerAddDialogProps> = props => {
  const { initialValues, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.listenerAdd"
      testId="EthListenerAddForm"
      {...rest}
    >
      <TextInput name="address" />
      <SelectInput name="listenerType" options={ListenerType} />
      <TextInput name="fromBlock" />
    </FormDialog>
  );
};
