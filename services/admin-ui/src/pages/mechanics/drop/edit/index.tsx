import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { DateInput } from "@gemunion/mui-inputs-picker";
import { IDrop, TemplateStatus } from "@framework/types";

import { validationSchema } from "./validation";

export interface IDropEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IDrop>, form: any) => Promise<void>;
  initialValues: IDrop;
}

export const DropEditDialog: FC<IDropEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, startTimestamp, endTimestamp, templateId } = initialValues;
  const fixedValues = {
    id,
    startTimestamp,
    endTimestamp,
    templateId,
  };

  const message = id ? "dialogs.edit" : "dialogs.create";
  const testIdPrefix = "DropEditForm";

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={message}
      {...rest}
      data-testid={testIdPrefix}
    >
      <EntityInput
        name="templateId"
        controller="templates"
        data={{
          templateStatus: [TemplateStatus.HIDDEN],
        }}
      />
      <DateInput name="startTimestamp" data-testid={`${testIdPrefix}-startTimestamp`} />
      <DateInput name="endTimestamp" data-testid={`${testIdPrefix}-endTimestamp`} />
    </FormDialog>
  );
};
