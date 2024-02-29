import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { TemplateAssetInput } from "@gemunion/mui-inputs-asset";
import type { IClaim } from "@framework/types";
import { ModuleType, TokenType } from "@framework/types";

import { validationSchema } from "./validation";
import { VestingParametersInput } from "./parameters-input";

export interface IClaimEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IClaim>, form: any) => Promise<void>;
  initialValues: IClaim;
}

export const VestingClaimEditDialog: FC<IClaimEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, parameters, item } = initialValues;
  const fixedValues = {
    id,
    parameters,
    item,
  };

  const message = id ? "dialogs.edit" : "dialogs.create";

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={message}
      testId="VestingClaimEditDialog"
      {...rest}
    >
      <VestingParametersInput prefix="parameters" />
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
