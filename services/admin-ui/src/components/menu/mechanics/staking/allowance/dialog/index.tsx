import { FC } from "react";

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
        onChangeOptions={[
          { name: "contractId", optionName: "id", defaultValue: 0 },
          { name: "contract.address", optionName: "address", defaultValue: "0x" },
          { name: "contract.contractType", optionName: "contractType", defaultValue: "0x" },
          { name: "contract.decimals", optionName: "decimals", defaultValue: 0 },
        ]}
        autoselect
        useTokenType
      />
      <AmountInput />
    </FormDialog>
  );
};
