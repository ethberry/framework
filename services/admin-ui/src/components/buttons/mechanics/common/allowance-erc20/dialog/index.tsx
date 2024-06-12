import { ChangeEvent, FC, useState } from "react";
import { Alert } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { TokenType } from "@framework/types";
import { FormDialog } from "@gemunion/mui-dialog-form";

import { CommonContractInput } from "../../../../../inputs/common-contract";
import { AmountInput } from "./amount-input";
import { validationSchema } from "./validation";

export interface IAllowanceERC20Dto {
  amount: string;
  contract: {
    address: string;
    contractType: TokenType;
    decimals: number;
  };
  contractId: number;
}

export interface IAllowanceERC20DialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IAllowanceERC20Dto, form: any) => Promise<void>;
  initialValues: IAllowanceERC20Dto;
}

export const AllowanceERC20Dialog: FC<IAllowanceERC20DialogProps> = props => {
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
      form.trigger("contractId");
    };

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.allowance"
      testId="MechanicsAllowanceForm"
      {...rest}
    >
      {showAlert ? (
        <Alert severity="warning">
          <FormattedMessage id="messages.allowanceUSDTWarning" />
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
