import { ChangeEvent, FC, useState } from "react";
import { Alert } from "@mui/material";
import { FormattedMessage } from "react-intl";

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

  const [showAlert, setShowAlert] = useState(false);

  const handleContractChange =
    (form: any) =>
    (_event: ChangeEvent<unknown>, option: any): void => {
      setShowAlert(option?.title === "USDT");
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
      {showAlert ? (
        <Alert severity="warning">
          <FormattedMessage id="message.allowanceUSDTWarning" />
        </Alert>
      ) : null}
      <CommonContractInput
        name="contractId"
        data={{ contractType: [TokenType.ERC20] }}
        onChange={handleContractChange}
        autoselect
      />
      <AmountInput />
    </FormDialog>
  );
};
