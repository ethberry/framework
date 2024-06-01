import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { NumberInput, SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { TemplateAssetInput } from "@gemunion/mui-inputs-asset";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import type { IPredictionQuestion } from "@framework/types";
import { PredictionQuestionStatus, TokenType, ModuleType, ContractStatus } from "@framework/types";

import { validationSchema } from "./validation";

export interface IRaffleEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IPredictionQuestion>, form: any) => Promise<void>;
  initialValues: Partial<IPredictionQuestion>;
}

export const PredictionQuestionEditDialog: FC<IRaffleEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, title, contractId, description, questionStatus, price, maxVotes } = initialValues;

  const fixedValues = {
    id,
    contractId,
    title,
    description,
    questionStatus,
    price,
    maxVotes,
  };
  const message = id ? "dialogs.edit" : "dialogs.create";

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={message}
      testId="PredictionQuestionEditForm"
      {...rest}
    >
      <EntityInput
        name="contractId"
        controller="contracts"
        data={{
          contractModule: [ModuleType.PREDICTION],
          contractStatus: [ContractStatus.ACTIVE, ContractStatus.NEW],
        }}
        readOnly={!!id}
      />
      <TextInput name="title" />
      <RichTextEditor name="description" />
      {/* Todo - maxVotes editable untill the question is not started */}
      <NumberInput name="maxVotes" readOnly={!!id} inputProps={{ min: 0 }} />
      <TemplateAssetInput
        autoSelect
        prefix="price"
        tokenType={{ disabledOptions: [TokenType.ERC721, TokenType.ERC998] }}
      />
      {id ? <SelectInput name="questionStatus" options={PredictionQuestionStatus} /> : null}
    </FormDialog>
  );
};
