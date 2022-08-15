import { FC } from "react";
import { constants } from "ethers";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput } from "@gemunion/mui-inputs-core";
import { TokenType } from "@framework/types";

import { validationSchema } from "./validation";
import { AmountInput } from "./amount-input";
import { ContractInput } from "./contract-input";

export interface IVestingTopUpDto {
  tokenType: TokenType;
  amount: string;
  address: string;
  contractId: number;
  decimals: number;
}

export interface IVestingTopUpDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IVestingTopUpDto, form: any) => Promise<void>;
}

export const VestingTopUpDialog: FC<IVestingTopUpDialogProps> = props => {
  const fixedValues: IVestingTopUpDto = {
    tokenType: TokenType.NATIVE,
    amount: "0",
    address: constants.AddressZero,
    contractId: 0,
    decimals: 0,
  };

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message="dialogs.deploy"
      testId="VestingTopUpForm"
      {...props}
    >
      <SelectInput
        name="tokenType"
        options={TokenType}
        disabledOptions={[TokenType.ERC721, TokenType.ERC998, TokenType.ERC1155]}
      />
      <ContractInput />
      <AmountInput />
    </FormDialog>
  );
};
