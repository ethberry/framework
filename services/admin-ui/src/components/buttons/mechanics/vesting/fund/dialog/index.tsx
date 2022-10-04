import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput } from "@gemunion/mui-inputs-core";
import { TokenType } from "@framework/types";

import { validationSchema } from "./validation";
import { AmountInput } from "./amount-input";
import { ContractInput } from "./contract-input";

export interface IVestingFundDto {
  tokenType: TokenType;
  amount: string;
  contract: {
    address: string;
    decimals: number;
  };
  contractId: number;
}

export interface IVestingFundDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IVestingFundDto, form: any) => Promise<void>;
  initialValues: IVestingFundDto;
}

export const VestingFundDialog: FC<IVestingFundDialogProps> = props => {
  const { initialValues, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.top-up"
      testId="VestingTopUpForm"
      {...rest}
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
