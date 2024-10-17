import { ChangeEvent, FC, useState } from "react";
import { Alert } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { FormDialog } from "@ethberry/mui-dialog-form";
import { SelectInput } from "@ethberry/mui-inputs-core";
import { ContractStatus, Erc721ContractFeatures, ModuleType, TokenType } from "@framework/types";

import { CommonContractInput } from "../../../../inputs/common-contract";
import { AmountInput } from "./amount-input";
import { validationSchema } from "./validation";

export interface IAllowanceDto {
  tokenType: TokenType;
  contractId: number;
  amount: string;
  contract: {
    address: string;
    contractType: TokenType;
    decimals: number;
  };
}

export interface IAllowanceDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IAllowanceDto, form: any) => Promise<void>;
  initialValues: IAllowanceDto;
  disabledTokenTypes?: Array<TokenType>;
}

export const AllowanceDialog: FC<IAllowanceDialogProps> = props => {
  const { initialValues, disabledTokenTypes = [], ...rest } = props;

  const [showAlert, setShowAlert] = useState(false);

  const handleContractChange =
    (form: any) =>
    (_event: ChangeEvent<unknown>, option: any): void => {
      setShowAlert(option?.title === "USDT");
      form.setValue("contractId", option?.id ?? 0, { shouldDirty: true });
      form.setValue("contract.address", option?.address ?? "0x");
      form.setValue("contract.contractType", option?.contractType ?? "0x");
      form.setValue("contract.decimals", option?.decimals ?? 0);
      form.trigger();
    };

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.allowance"
      testId="AllowanceForm"
      {...rest}
    >
      <SelectInput name="tokenType" options={TokenType} disabledOptions={[TokenType.NATIVE, ...disabledTokenTypes]} />
      <CommonContractInput
        name="contractId"
        onChange={handleContractChange}
        autoselect
        withTokenType
        data={{
          contractType: [TokenType.ERC20],
          contractModule: [ModuleType.HIERARCHY],
          contractStatus: [ContractStatus.ACTIVE],
          excludeFeatures: [Erc721ContractFeatures.SOULBOUND],
        }}
      />
      <AmountInput />
      {showAlert ? (
        <Alert severity="warning">
          <FormattedMessage id="messages.allowanceUSDTWarning" />
        </Alert>
      ) : null}
    </FormDialog>
  );
};
