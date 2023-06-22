import { FC } from "react";

import { ContractFeatures, TokenType } from "@framework/types";
import { FormDialog } from "@gemunion/mui-dialog-form";

import { CommonContractInput } from "../../../../../inputs/common-contract";
import { AmountInput } from "./amount-input";
import { validationSchema } from "./validation";

export interface IAllowanceDto {
  address: string;
  amount: string;
  contractType: TokenType;
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

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.allowance"
      testId="AllowanceForm"
      {...rest}
    >
      <CommonContractInput
        name="contractId"
        controller="contracts"
        data={{ contractFeatures: [ContractFeatures.ALLOWANCE] }}
        onChangeOptions={[
          { name: "contractId", optionName: "id", defaultValue: 0 },
          { name: "address", optionName: "address", defaultValue: "0x" },
        ]}
        autoselect
        useTokenType
      />
      <AmountInput />
    </FormDialog>
  );
};
