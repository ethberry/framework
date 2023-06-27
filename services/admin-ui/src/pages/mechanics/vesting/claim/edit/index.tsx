import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { NumberInput, TextInput } from "@gemunion/mui-inputs-core";
import { DateInput } from "@gemunion/mui-inputs-picker";
import { TemplateAssetInput } from "@gemunion/mui-inputs-asset";
import { CurrencyInput } from "@gemunion/mui-inputs-mask";
import { IClaim, ModuleType, TokenType } from "@framework/types";

import { validationSchema } from "./validation";

export interface IClaimEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IClaim>, form: any) => Promise<void>;
  initialValues: IClaim;
}

export const VestingClaimEditDialog: FC<IClaimEditDialogProps> = props => {
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
      testId="ClaimEditDialog"
      {...rest}
    >
      <TextInput name="beneficiary" />
      <DateInput name="startTimestamp" />
      <NumberInput name="cliffInMonth" />
      <CurrencyInput name="monthlyRelease" symbol="%" />
      <TemplateAssetInput
        autoSelect
        multiple
        prefix="item"
        tokenType={{
          disabledOptions: [TokenType.NATIVE, TokenType.ERC721, TokenType.ERC998, TokenType.ERC1155],
        }}
        contract={{
          data: {
            contractModule: [ModuleType.HIERARCHY],
          },
        }}
      />
    </FormDialog>
  );
};
