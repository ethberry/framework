import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput } from "@gemunion/mui-inputs-core";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { GradeStrategy, IGrade, TokenType } from "@framework/types";

import { validationSchema } from "./validation";
import { PriceInput } from "../../../../components/inputs/price";
import { GrowthRateInput } from "./growth-rate-input";

export interface IGradeEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IGrade>, form: any) => Promise<void>;
  initialValues: IGrade;
}

export const GradeEditDialog: FC<IGradeEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, gradeStrategy, growthRate, price, contractId } = initialValues;
  const fixedValues = {
    id,
    gradeStrategy,
    growthRate,
    price,
    contractId,
  };

  const message = id ? "dialogs.edit" : "dialogs.create";

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={message}
      {...rest}
      data-testid="GradeEditDialog"
    >
      <EntityInput name="contractId" controller="contracts" readOnly data={{}} />
      <SelectInput name="gradeStrategy" options={GradeStrategy} />
      <GrowthRateInput />
      <PriceInput prefix="price" disabledTokenTypes={[TokenType.ERC721, TokenType.ERC998]} />
    </FormDialog>
  );
};
