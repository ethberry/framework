import { FC } from "react";

import { FormDialog } from "@ethberry/mui-dialog-form";
import { TemplateAssetInput } from "@ethberry/mui-inputs-asset";
import { SelectInput, TextInput } from "@ethberry/mui-inputs-core";
import { EntityInput } from "@ethberry/mui-inputs-entity";
import {
  ContractFeatures,
  ContractStatus,
  DiscreteStatus,
  DiscreteStrategy,
  IDiscrete,
  TokenType,
} from "@framework/types";

import { validationSchema } from "./validation";
import { GrowthRateInput } from "./growth-rate-input";

export interface IGradeEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IDiscrete>, form: any) => Promise<void>;
  initialValues: IDiscrete;
}

export const GradeEditDialog: FC<IGradeEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, contractId, attribute, discreteStatus, discreteStrategy, growthRate, price } = initialValues;
  const fixedValues = {
    id,
    contractId,
    attribute,
    discreteStatus,
    discreteStrategy,
    growthRate,
    price,
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
      <EntityInput
        name="contractId"
        controller="contracts"
        readOnly={!!id}
        autoselect
        dirtyAutoselect={false}
        data={{
          contractStatus: [ContractStatus.ACTIVE],
          contractFeatures: [ContractFeatures.DISCRETE],
        }}
      />
      <TextInput name="attribute" readOnly={!!id} />
      {id ? <SelectInput name="discreteStatus" options={DiscreteStatus} /> : null}
      <SelectInput name="discreteStrategy" options={DiscreteStrategy} />
      <GrowthRateInput />
      <TemplateAssetInput
        autoSelect
        prefix="price"
        tokenType={{ disabledOptions: [TokenType.ERC721, TokenType.ERC998] }}
      />
    </FormDialog>
  );
};
