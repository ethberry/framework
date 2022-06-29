import { FC } from "react";
import { Typography } from "@mui/material";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { JsonInput, SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { UniTokenStatus, IUniToken } from "@framework/types";

import { validationSchema } from "./validation";

export interface IUniTokenEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IUniToken>, form?: any) => Promise<void>;
  initialValues: IUniToken;
}

export const Erc998TokenEditDialog: FC<IUniTokenEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, attributes, owner, tokenStatus, tokenId, uniTemplate } = initialValues;

  const fixedValues = {
    id,
    attributes,
    owner,
    tokenStatus,
    tokenId,
    erc998CollectionId: uniTemplate!.uniContractId,
  };

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={"dialogs.edit"}
      data-testid="Erc998TokenEditDialog"
      {...rest}
    >
      <Typography variant="h5">{uniTemplate?.title}</Typography>
      <RichTextDisplay data={uniTemplate?.description} />
      <JsonInput name="attributes" />
      <TextInput name="tokenId" readOnly />
      <SelectInput name="tokenStatus" options={UniTokenStatus} readOnly />
      <TextInput name="owner" readOnly />
      <EntityInput name="erc998CollectionId" controller="erc998-collections" readOnly />
      <img src={uniTemplate?.imageUrl} width={200} height={200} alt={uniTemplate?.title} />
    </FormDialog>
  );
};
