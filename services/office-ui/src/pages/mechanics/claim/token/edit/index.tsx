import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { TextInput } from "@gemunion/mui-inputs-core";
import { DateTimeInput } from "@gemunion/mui-inputs-picker";
import { TokenAssetInput } from "@gemunion/mui-inputs-asset";
import type { IClaim } from "@framework/types";
import { ModuleType, TokenType } from "@framework/types";

import { validationSchema } from "./validation";

export interface IClaimEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IClaim>, form: any) => Promise<void>;
  initialValues: IClaim;
}

export const ClaimTokenEditDialog: FC<IClaimEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, item, claimType, account, endTimestamp, merchantId } = initialValues;
  const fixedValues = {
    id,
    item,
    claimType,
    account,
    endTimestamp,
    merchantId,
  };

  const message = id ? "dialogs.edit" : "dialogs.create";

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={message}
      testId="ClaimEditDialog"
      {...rest}
    >
      <EntityInput name="merchantId" controller="merchants" disableClear />
      <TextInput name="account" />
      <TokenAssetInput
        multiple
        prefix="item"
        contract={{ data: { contractModule: [ModuleType.HIERARCHY, ModuleType.MYSTERY] } }}
        tokenType={{ disabledOptions: [TokenType.NATIVE] }}
      />
      <DateTimeInput name="endTimestamp" format={"dd/LL/yyyy hh:mm a"} />
    </FormDialog>
  );
};
