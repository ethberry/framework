import { ChangeEvent, FC } from "react";

import { FormDialog } from "@ethberry/mui-dialog-form";
import { ContractFeatures, TokenStatus, TokenType } from "@framework/types";
import type { ITokenAsset } from "@ethberry/mui-inputs-asset";
import { TokenAssetInput } from "@ethberry/mui-inputs-asset";

import { CommonContractInput } from "../../../../../components/inputs/common-contract";
import { validationSchema } from "./validation";

export interface IAllowanceDto {
  token: ITokenAsset;
  address: string;
  contractId?: number;
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
    (_event: ChangeEvent<unknown>, option: any): void => {
      form.setValue("contractId", option?.id ?? 0, { shouldDirty: true });
      form.setValue("address", option?.address ?? "0x", { shouldDirty: true });
      form.setValue("decimals", option?.decimals ?? 0);
    };

  return (
    <FormDialog
      disabled={false}
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.allowance"
      testId="AllowanceForm"
      showPrompt={false}
      {...rest}
    >
      <TokenAssetInput
        prefix="token"
        tokenType={{ disabledOptions: [TokenType.NATIVE] }}
        token={{
          data: {
            tokenStatus: [TokenStatus.MINTED],
          },
        }}
      />
      <CommonContractInput
        autoselect={true}
        name="contractId"
        data={{ contractFeatures: [ContractFeatures.ALLOWANCE] }}
        onChange={handleContractChange}
        withTokenType
      />
    </FormDialog>
  );
};
