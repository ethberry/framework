import { ChangeEvent, FC, useState } from "react";
import { Alert } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput } from "@gemunion/mui-inputs-core";
import { TokenType } from "@framework/types";

import { CommonContractInput } from "../../../../../../../components/inputs/common-contract";
import { AmountInput } from "./amount-input";
import { validationSchema } from "./validation";

export interface IAllowanceDto {
  tokenType: TokenType;
  contract: {
    address: string;
    contractType: TokenType;
    decimals: number;
  };
  contractId: number;
  amount: string;
}

export interface IAllowanceDialogProps {
  open: boolean;
  onCancel: (form?: any) => void;
  onConfirm: (values: IAllowanceDto, form: any) => Promise<void>;
  initialValues: IAllowanceDto;
}

export const AllowanceDialog: FC<IAllowanceDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const [showAlert, setShowAlert] = useState(false);

  const handleContractChange =
    (form: any) =>
    (_event: ChangeEvent<unknown>, option: any): void => {
      setShowAlert(option?.title === "USDT");
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
      testId="MechanicsAllowanceForm"
      {...rest}
    >
      <SelectInput
        name="tokenType"
        options={TokenType}
        disabledOptions={[TokenType.NATIVE, TokenType.ERC721, TokenType.ERC998, TokenType.ERC1155]}
      />
      <CommonContractInput name="contractId" onChange={handleContractChange} autoselect withTokenType />
      <AmountInput />
      {showAlert ? (
        <Alert severity="warning">
          <FormattedMessage id="messages.allowanceUSDTWarning" />
        </Alert>
      ) : null}
    </FormDialog>
  );
};
