import { FC } from "react";
import { Alert, Box } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SwitchInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { TemplateAssetInput } from "@gemunion/mui-inputs-asset";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import type { IWaitListList } from "@framework/types";
import { ContractStatus, ModuleType } from "@framework/types";

import { validationSchema } from "./validation";

export interface IWaitListListEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IWaitListList>, form: any) => Promise<void>;
  initialValues: IWaitListList;
  testId: string;
}

export const WaitListListEditDialog: FC<IWaitListListEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, title, description, item, contractId, isPrivate, root } = initialValues;
  const fixedValues = { id, title, description, item, contractId, isPrivate };

  const message = id ? "dialogs.edit" : "dialogs.create";

  return (
    <FormDialog initialValues={fixedValues} validationSchema={validationSchema} message={message} {...rest}>
      <TextInput name="title" />
      <RichTextEditor name="description" />
      <SwitchInput name="isPrivate" readOnly={!!root} />
      {id ? (
        <Box mt={2}>
          <Alert severity="warning">
            <FormattedMessage id="alert.editNotAllowed" />
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
      <EntityInput
        name="contractId"
        controller="contracts"
        readOnly={!!id}
        autoselect
        data={{
          contractStatus: [ContractStatus.ACTIVE],
          contractModule: [ModuleType.WAITLIST],
        }}
      />
    </FormDialog>
  );
};
