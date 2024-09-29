import { FC } from "react";

import { FormDialog } from "@ethberry/mui-dialog-form";
import { TextInput } from "@ethberry/mui-inputs-core";
import { DateTimeInput } from "@ethberry/mui-inputs-picker";
import { TemplateAssetInput } from "@ethberry/mui-inputs-asset";
import type { IClaim } from "@framework/types";
import { ModuleType, TokenType } from "@framework/types";

import { validationSchema } from "./validation";

export interface IClaimEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IClaim>, form: any) => Promise<void>;
  initialValues: IClaim;
}

export const ClaimTemplateEditDialog: FC<IClaimEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, item, account, endTimestamp } = initialValues;
  const fixedValues = {
    id,
    item,
    account,
    endTimestamp,
  };

  const message = id ? "dialogs.edit" : "dialogs.create";

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={message}
      testId="ClaimTemplateEditDialog"
      {...rest}
    >
      <TextInput name="account" required />
      <TemplateAssetInput
        autoSelect
        required
        multiple
        prefix="item"
        contract={{ data: { contractModule: [ModuleType.HIERARCHY, ModuleType.MYSTERY, ModuleType.RAFFLE] } }}
        tokenType={{ disabledOptions: [TokenType.NATIVE, TokenType.ERC20] }}
        forceAmount
      />
      <DateTimeInput name="endTimestamp" format={"dd/LL/yyyy hh:mm a"} />
    </FormDialog>
  );
};
