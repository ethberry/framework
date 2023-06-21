import { FC } from "react";
import { Alert, Box } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import type { IWaitListList } from "@framework/types";
import { TemplateAssetInput } from "@gemunion/mui-inputs-asset";

import { validationSchema } from "./validation";
import { ModuleType } from "@framework/types";

export interface IWaitListListEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IWaitListList>, form: any) => Promise<void>;
  initialValues: IWaitListList;
  testId: string;
}

export const WaitListListEditDialog: FC<IWaitListListEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, title, description, item } = initialValues;
  const fixedValues = { id, title, description, item };

  const message = id ? "dialogs.edit" : "dialogs.create";

  return (
    <FormDialog initialValues={fixedValues} validationSchema={validationSchema} message={message} {...rest}>
      <TextInput name="title" />
      <RichTextEditor name="description" />
      {id ? (
        <Box mt={2}>
          <Alert severity="warning">
            <FormattedMessage id="form.hints.editNotAllowed" />
          </Alert>
        </Box>
      ) : null}
      <TemplateAssetInput
        autoSelect
        multiple
        prefix="item"
        readOnly={!!id}
        contract={{ data: { contractModule: [ModuleType.HIERARCHY] } }}
      />
    </FormDialog>
  );
};
