import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { TemplateAssetInput } from "@gemunion/mui-inputs-asset";
import { GradeStrategy, IGrade, TokenType } from "@framework/types";

import { validationSchema } from "./validation";
import { GrowthRateInput } from "./growth-rate-input";

export interface IGradeEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IGrade>, form: any) => Promise<void>;
  initialValues: IGrade;
}

export const GradeEditDialog: FC<IGradeEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, gradeStrategy, growthRate, price, contractId, attribute } = initialValues;
  const fixedValues = {
    id,
    gradeStrategy,
    growthRate,
    price,
    contractId,
    attribute,
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
      <TextInput name="attribute" readOnly />
      <SelectInput name="gradeStrategy" options={GradeStrategy} />
      <GrowthRateInput />
      <TemplateAssetInput
        autoSelect
        prefix="price"
        tokenType={{ disabledOptions: [TokenType.ERC721, TokenType.ERC998] }}
      />
    </FormDialog>
  );
};
