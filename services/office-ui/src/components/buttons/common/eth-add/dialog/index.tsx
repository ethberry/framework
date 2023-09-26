import { FC } from "react";
import { Alert } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { NumberInput, SelectInput, TextInput } from "@gemunion/mui-inputs-core";

import { ListenerType } from "@framework/types";

import { validationSchema } from "./validation";

export interface IEthListenerAddDto {
  address: string;
  listenerType: ListenerType;
  fromBlock: number;
  chainId: number;
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
      disabled={false}
      {...rest}
    >
      <Alert severity="warning">
        <FormattedMessage id="alert.risk" />
      </Alert>
      <TextInput name="address" />
      <SelectInput name="listenerType" options={ListenerType} />
      <NumberInput name="fromBlock" />
      <NumberInput name="chainId" />
    </FormDialog>
  );
};
