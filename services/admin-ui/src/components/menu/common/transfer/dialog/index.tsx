import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import type { ITokenAsset } from "@gemunion/mui-inputs-asset";
import { TokenAssetInput } from "@gemunion/mui-inputs-asset";
import { TextInput } from "@gemunion/mui-inputs-core";

import { validationSchema } from "./validation";

export interface ITransferDto {
  token: ITokenAsset;
  address: string;
}

export interface ITransferDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: ITransferDto, form: any) => Promise<void>;
  initialValues: ITransferDto;
}

export const TransferDialog: FC<ITransferDialogProps> = props => {
  const { initialValues, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.transfer"
      testId="ContractTransferForm"
      {...rest}
    >
      <TokenAssetInput prefix="token" />
      <TextInput name="address" />
    </FormDialog>
  );
};
