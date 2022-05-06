import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { TextInput } from "@gemunion/mui-inputs-core";
import { IErc721Airdrop } from "@framework/types";
import { EntityInput } from "@gemunion/mui-inputs-entity";

import { validationSchema, validationSchema2 } from "./validation";

export interface IEditErc721AirdropDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IErc721Airdrop>, formikBag: any) => Promise<void>;
  initialValues: IErc721Airdrop;
}

export const Erc721AirdropEditDialog: FC<IEditErc721AirdropDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, erc721TemplateId, owner } = initialValues;
  const fixedValues = {
    id,
    owner,
    erc721TemplateId,
  };

  if (id) {
    return (
      <FormDialog
        initialValues={fixedValues}
        validationSchema={validationSchema}
        message="dialogs.edit"
        {...rest}
        data-testid="Erc721AirdropEditDialog"
      >
        <TextInput name="owner" />
        <EntityInput name="erc721TemplateId" controller="erc721-templates" />
      </FormDialog>
    );
  }

  return (
    <FormDialog
      initialValues={{ list: [fixedValues] }}
      validationSchema={validationSchema2}
      message="dialogs.add"
      data-testid="Erc721AirdropAddDialog"
      {...rest}
    >
      <TextInput name="list[0].owner" />
      <EntityInput name="list[0].erc721TemplateId" controller="erc721-templates" />
    </FormDialog>
  );
};
