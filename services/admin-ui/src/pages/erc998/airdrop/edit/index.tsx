import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { TextInput } from "@gemunion/mui-inputs-core";
import { IErc998Airdrop } from "@framework/types";
import { EntityInput } from "@gemunion/mui-inputs-entity";

import { validationSchema, validationSchema2 } from "./validation";

export interface IErc998AirdropEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IErc998Airdrop>, form: any) => Promise<void>;
  initialValues: IErc998Airdrop;
}

export const Erc998AirdropEditDialog: FC<IErc998AirdropEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, erc998TemplateId, owner } = initialValues;
  const fixedValues = {
    id,
    owner,
    erc998TemplateId,
  };

  if (id) {
    return (
      <FormDialog
        initialValues={fixedValues}
        validationSchema={validationSchema}
        message="dialogs.edit"
        {...rest}
        data-testid="Erc998AirdropEditDialog"
      >
        <TextInput name="owner" />
        <EntityInput name="erc998TemplateId" controller="erc998-templates" />
      </FormDialog>
    );
  }

  return (
    <FormDialog
      initialValues={{ list: [fixedValues] }}
      validationSchema={validationSchema2}
      message="dialogs.create"
      data-testid="Erc998AirdropAddDialog"
      {...rest}
    >
      <TextInput name="list[0].owner" />
      <EntityInput name="list[0].erc998TemplateId" controller="erc998-templates" />
    </FormDialog>
  );
};
