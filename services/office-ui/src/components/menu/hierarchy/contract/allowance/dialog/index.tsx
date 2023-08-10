import { ChangeEvent, FC } from "react";

import { ContractFeatures, TokenType } from "@framework/types";
import { FormDialog } from "@gemunion/mui-dialog-form";

import { CommonContractInput } from "../../../../../inputs/common-contract";
import { AmountInput } from "./amount-input";
import { validationSchema } from "./validation";

export interface IAllowanceDto {
  address: string;
  amount: string;
  contractType: TokenType | null;
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

  const handleContractChange =
    (form: any) =>
    (_event: ChangeEvent<unknown>, option: any): void => {
      form.setValue("contractId", option?.id ?? 0);
      form.setValue("address", option?.address ?? "0x");
    };

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
        data={{ contractFeatures: [ContractFeatures.ALLOWANCE] }}
        onChange={handleContractChange}
        autoselect
        withTokenType
      />
      <AmountInput />
    </FormDialog>
  );
};
