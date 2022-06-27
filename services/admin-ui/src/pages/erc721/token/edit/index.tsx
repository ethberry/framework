import { FC } from "react";
import { Typography } from "@mui/material";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { JsonInput, SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { UniTokenStatus, IErc721Token } from "@framework/types";

import { validationSchema } from "./validation";

export interface IErc721TokenEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IErc721Token>, form?: any) => Promise<void>;
  initialValues: IErc721Token;
}

export const Erc721TokenEditDialog: FC<IErc721TokenEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, attributes, owner, tokenStatus, tokenId, erc721Template } = initialValues;

  const fixedValues = {
    id,
    attributes,
    owner,
    tokenStatus,
    tokenId,
    erc721CollectionId: erc721Template!.erc721CollectionId,
  };

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={"dialogs.edit"}
      data-testid="Erc721TokenEditDialog"
      {...rest}
    >
      <Typography variant="h5">{erc721Template?.title}</Typography>
      <RichTextDisplay data={erc721Template?.description} />
      <JsonInput name="attributes" />
      <TextInput name="tokenId" readOnly />
      <SelectInput name="tokenStatus" options={UniTokenStatus} readOnly />
      <TextInput name="owner" readOnly />
      <EntityInput name="erc721CollectionId" controller="erc721-collections" readOnly />
      <img src={erc721Template?.imageUrl} width={200} height={200} alt={erc721Template?.title} />
    </FormDialog>
  );
};
