import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { TemplateAssetInput } from "@gemunion/mui-inputs-asset";
import { IRent, TokenType } from "@framework/types";

import { validationSchema } from "./validation";

export interface IRentEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IRent>, form: any) => Promise<void>;
  initialValues: IRent;
}

export const RentEditDialog: FC<IRentEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, price, contractId } = initialValues;
  const fixedValues = {
    id,
    price,
    contractId,
  };

  const message = id ? "dialogs.edit" : "dialogs.create";

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={message}
      testId="GradeEditForm"
      {...rest}
    >
      <EntityInput name="contractId" controller="contracts" readOnly />
      <TemplateAssetInput prefix="price" tokenType={{ disabledOptions: [TokenType.NATIVE, TokenType.ERC20] }} />
    </FormDialog>
  );
};
