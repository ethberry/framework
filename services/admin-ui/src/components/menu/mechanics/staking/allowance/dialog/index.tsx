import { ChangeEvent, FC } from "react";

import { TokenType } from "@framework/types";
import { FormDialog } from "@gemunion/mui-dialog-form";
import { TokenTypeInput } from "@gemunion/mui-inputs-asset";

import { CommonContractInput } from "../../../../../inputs/common-contract";
import { AmountInput } from "./amount-input";
import { validationSchema } from "./validation";

export interface IStakingAllowanceDto {
  amount: string;
  contract: {
    address: string;
    contractType: TokenType;
    tokenType: TokenType;
    decimals: number;
  };
  contractId: number;
}

export interface IStakingAllowanceDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IStakingAllowanceDto, form: any) => Promise<void>;
  initialValues: IStakingAllowanceDto;
}

export const StakingAllowanceDialog: FC<IStakingAllowanceDialogProps> = props => {
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
      testId="StakingAllowanceForm"
      showDebug={true}
      {...rest}
    >
      <TokenTypeInput prefix="contract" disabledOptions={[TokenType.NATIVE]} />
      <CommonContractInput
        name="contractId"
        controller="contracts"
        onChange={handleContractChange}
        autoselect
        withTokenType
      />
      <AmountInput />
    </FormDialog>
  );
};
