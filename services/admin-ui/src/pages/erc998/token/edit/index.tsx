import { FC } from "react";
import { Typography } from "@mui/material";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { JsonInput, SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { UniTokenStatus, IErc998Token } from "@framework/types";

import { validationSchema } from "./validation";

export interface IErc998TokenEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IErc998Token>, form?: any) => Promise<void>;
  initialValues: IErc998Token;
}

export const Erc998TokenEditDialog: FC<IErc998TokenEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, attributes, owner, tokenStatus, tokenId, erc998Template } = initialValues;

  const fixedValues = {
    id,
    attributes,
    owner,
    tokenStatus,
    tokenId,
    erc998CollectionId: erc998Template!.erc998CollectionId,
  };

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={"dialogs.edit"}
      data-testid="Erc998TokenEditDialog"
      {...rest}
    >
      <Typography variant="h5">{erc998Template?.title}</Typography>
      <RichTextDisplay data={erc998Template?.description} />
      <JsonInput name="attributes" />
      <TextInput name="tokenId" readOnly />
      <SelectInput name="tokenStatus" options={UniTokenStatus} readOnly />
      <TextInput name="owner" readOnly />
      <EntityInput name="erc998CollectionId" controller="erc998-collections" readOnly />
      <img src={erc998Template?.imageUrl} width={200} height={200} alt={erc998Template?.title} />
    </FormDialog>
  );
};
