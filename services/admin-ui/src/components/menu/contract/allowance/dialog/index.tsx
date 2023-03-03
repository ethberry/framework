import { FC } from "react";
import { EthInput } from "@gemunion/mui-inputs-mask";

import { FormDialog } from "@gemunion/mui-dialog-form";

import { validationSchema } from "./validation";
import { ContractInput } from "./contract-input";

export interface IAllowanceDto {
  address: string;
  amount: string;
  decimals: number;
}

export interface IAllowanceDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IAllowanceDto, form: any) => Promise<void>;
  initialValues: IAllowanceDto;
}

export const AllowanceDialog: FC<IAllowanceDialogProps> = props => {
  const { initialValues, ...rest } = props;
  const { decimals } = initialValues;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.allowance"
      testId="AllowanceForm"
      {...rest}
    >
      {/* <TokenAssetInput */}
      {/*  prefix="token" */}
      {/*  tokenType={{ disabledOptions: [TokenType.NATIVE, TokenType.ERC998, TokenType.ERC1155] }} */}
      {/* /> */}
      <ContractInput />
      <EthInput name="amount" units={decimals} symbol="" />
    </FormDialog>
  );
};
