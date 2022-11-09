import { FC } from "react";
import { Alert } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { TextInput, SelectInput } from "@gemunion/mui-inputs-core";

// import { validationSchema } from "./validation";

import { ListenerType } from "@framework/types";

export interface IEthListenerRemoveDto {
  address: string;
  listenerType: ListenerType;
}

export interface IEthListenerRemoveDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IEthListenerRemoveDto, form: any) => Promise<void>;
  initialValues: IEthListenerRemoveDto;
}

export const EthListenerRemoveDialog: FC<IEthListenerRemoveDialogProps> = props => {
  const { initialValues, ...rest } = props;
  return (
    <FormDialog
      initialValues={initialValues}
      // validationSchema={validationSchema}
      message="dialogs.listenerRemove"
      testId="EthListenerRemoveForm"
      {...rest}
    >
      <Alert severity="warning">
        <FormattedMessage id="form.hints.risk" />
      </Alert>
      <TextInput name="address" />
      <SelectInput name="listenerType" options={ListenerType} />
    </FormDialog>
  );
};
