import { ChangeEvent, FC } from "react";

import { Erc721ContractFeatures, ModuleType, TokenType } from "@framework/types";
import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput } from "@gemunion/mui-inputs-core";

import { CommonContractInput } from "../../../../../inputs/common-contract";
import { AmountInput } from "./amount-input";
import { validationSchema } from "./validation";

export interface IStakingAllowanceDto {
  tokenType: TokenType;
  contractId: number;
  amount: string;
  contract: {
    address: string;
    contractType: TokenType;
    decimals: number;
  };
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
    (_event: ChangeEvent<unknown>, option: any): void => {
      form.setValue("contractId", option?.id ?? 0, { shouldDirty: true });
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
      disabled={false}
      {...rest}
    >
      <SelectInput name="tokenType" options={TokenType} disabledOptions={[TokenType.NATIVE]} />
      <CommonContractInput
        name="contractId"
        onChange={handleContractChange}
        autoselect
        disableClear
        withTokenType
        data={{
          contractModule: [ModuleType.HIERARCHY],
          excludeFeatures: [Erc721ContractFeatures.SOULBOUND],
        }}
      />
      <AmountInput />
    </FormDialog>
  );
};
