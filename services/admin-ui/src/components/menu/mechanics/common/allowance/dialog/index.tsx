import { FC } from "react";

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
        onChangeOptions={[
          { name: "contractId", optionName: "id", defaultValue: 0 },
          { name: "contract.address", optionName: "address", defaultValue: "0x" },
          { name: "contract.contractType", optionName: "contractType", defaultValue: "0x" },
          { name: "contract.decimals", optionName: "decimals", defaultValue: 0 },
        ]}
        autoselect
        multiple
      />
      <AmountInput />
    </FormDialog>
  );
};
