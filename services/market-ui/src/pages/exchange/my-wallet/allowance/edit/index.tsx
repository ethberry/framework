import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { TokenType } from "@framework/types";
import { TokenAssetInput } from "@gemunion/mui-inputs-asset";
import type { ITokenAsset } from "@gemunion/mui-inputs-asset";

import { validationSchema } from "./validation";
import { ContractInput } from "./contract-input";

export interface IAllowanceDto {
  token: ITokenAsset;
  address: string;
}

export interface IAllowanceDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IAllowanceDto, form: any) => Promise<void>;
  initialValues: IAllowanceDto;
}

export const AllowanceDialog: FC<IAllowanceDialogProps> = props => {
  const { initialValues, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.allowance"
      testId="AllowanceForm"
      {...rest}
    >
      <TokenAssetInput prefix="token" tokenType={{ disabledOptions: [TokenType.NATIVE] }} />
      <ContractInput />
    </FormDialog>
  );
};
