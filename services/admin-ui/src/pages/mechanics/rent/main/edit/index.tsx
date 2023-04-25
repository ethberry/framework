import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { TemplateAssetInput } from "@gemunion/mui-inputs-asset";
import { ContractFeatures, IRent, RentRuleStatus, TokenType } from "@framework/types";

import { validationSchema } from "./validation";

export interface IRentEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IRent>, form: any) => Promise<void>;
  initialValues: IRent;
}

export const RentEditDialog: FC<IRentEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, title, rentStatus, price, contractId } = initialValues;
  const fixedValues = {
    id,
    price,
    contractId,
    title,
    rentStatus,
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
      <TextInput name="title" />
      <SelectInput name="rentStatus" options={RentRuleStatus} disabledOptions={[RentRuleStatus.NEW]} />
      <EntityInput name="contractId" controller="contracts" data={{ contractFeatures: [ContractFeatures.RENTABLE] }} />
      <TemplateAssetInput
        prefix="price"
        tokenType={{ disabledOptions: [TokenType.ERC721, TokenType.ERC998] }}
        multiple
      />
    </FormDialog>
  );
};
