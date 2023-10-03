import { FC } from "react";
import { Alert } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput, NumberInput } from "@gemunion/mui-inputs-core";
import { ListenerType } from "@framework/types";

import { validationSchema } from "./validation";

export interface IEthListenerRemoveDto {
  address: string;
  listenerType: ListenerType;
  chainId: number;
}

export interface IEthListenerRemoveDialogProps {
  open: boolean;
  onCancel: (form?: any) => void;
  onConfirm: (values: IEthListenerRemoveDto, form: any) => Promise<void>;
  initialValues: IEthListenerRemoveDto;
}

export const EthListenerRemoveDialog: FC<IEthListenerRemoveDialogProps> = props => {
  const { initialValues, ...rest } = props;
  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.listenerRemove"
      testId="EthListenerRemoveForm"
      {...rest}
    >
      <Alert severity="warning">
        <FormattedMessage id="alert.risk" />
      </Alert>
      <TextInput name="address" />
      <SelectInput name="listenerType" options={ListenerType} />
      <NumberInput name="chainId" />
    </FormDialog>
  );
};
