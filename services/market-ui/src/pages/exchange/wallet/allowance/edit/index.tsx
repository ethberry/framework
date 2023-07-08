import { ChangeEvent, FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { ContractFeatures, TokenType } from "@framework/types";
import type { ITokenAsset } from "@gemunion/mui-inputs-asset";
import { TokenAssetInput } from "@gemunion/mui-inputs-asset";

import { CommonContractInput } from "../../../../../components/inputs/common-contract";
import { validationSchema } from "./validation";

export interface IAllowanceDto {
  token: ITokenAsset;
  address: string;
}

export interface IAllowanceDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IAllowanceDto, form: any) => Promise<void>;
  initialValues: IAllowanceDto;
}

export const AllowanceDialog: FC<IAllowanceDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const handleContractChange =
    (form: any) =>
    (_event: ChangeEvent<unknown>, option: any | null): void => {
      form.setValue("contractId", option?.id ?? 0);
      form.setValue("address", option?.address ?? "0x");
      form.setValue("decimals", option?.decimals ?? 0);
    };

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.allowance"
      testId="AllowanceForm"
      {...rest}
    >
      <TokenAssetInput prefix="token" tokenType={{ disabledOptions: [TokenType.NATIVE] }} />
      <CommonContractInput
        name="contractId"
        data={{ contractFeatures: [ContractFeatures.ALLOWANCE] }}
        onChange={handleContractChange}
        withTokenType
      />
    </FormDialog>
  );
};
