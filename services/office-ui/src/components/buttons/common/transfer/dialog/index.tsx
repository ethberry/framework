import { FC } from "react";

import { FormDialog } from "@ethberry/mui-dialog-form";
import type { ITokenAsset } from "@ethberry/mui-inputs-asset";
import { TokenAssetInput } from "@ethberry/mui-inputs-asset";
import { TextInput } from "@ethberry/mui-inputs-core";

import { validationSchema } from "./validation";
import { ContractFeatures } from "@framework/types";

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
      <TokenAssetInput
        prefix="token"
        contract={{
          data: {
            excludeFeatures: [ContractFeatures.SOULBOUND],
          },
        }}
      />
      <TextInput name="address" />
    </FormDialog>
  );
};
