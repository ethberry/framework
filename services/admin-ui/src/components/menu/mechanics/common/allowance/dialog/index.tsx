import { ChangeEvent, FC } from "react";

import { TokenType } from "@framework/types";
import { FormDialog } from "@gemunion/mui-dialog-form";

import { CommonContractInput } from "../../../../../inputs/common-contract";
import { AmountInput } from "./amount-input";
import { validationSchema } from "./validation";

export interface IAllowanceDto {
  amount: string;
  contract: {
    address: string;
    contractType: TokenType;
    decimals: number;
  };
  contractId: number;
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
    (_event: ChangeEvent<unknown>, option: any | null): void => {
      form.setValue("contractId", option?.id ?? 0);
      form.setValue("contract.address", option?.address ?? "0x");
      form.setValue("contract.contractType", option?.contractType ?? "0x");
      form.setValue("contract.decimals", option?.decimals ?? 0);
    };

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.allowance"
      testId="MechanicsAllowanceForm"
      showDebug={true}
      {...rest}
    >
      <CommonContractInput
        name="contractId"
        controller="contracts"
        data={{ contractType: [TokenType.ERC20] }}
        onChange={handleContractChange}
        autoselect
        multiple
      />
      <AmountInput />
    </FormDialog>
  );
};
