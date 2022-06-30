import { FC } from "react";
import { Typography } from "@mui/material";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { JsonInput, SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextDisplay } from "@gemunion/mui-rte";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { IToken, TokenStatus } from "@framework/types";

import { validationSchema } from "./validation";

export interface IErc721TokenEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IToken>, form?: any) => Promise<void>;
  initialValues: IToken;
}

export const Erc721TokenEditDialog: FC<IErc721TokenEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, attributes, tokenStatus, tokenId, template } = initialValues;

  const fixedValues = {
    id,
    attributes,
    tokenStatus,
    tokenId,
    contractId: template!.contractId,
  };

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={"dialogs.edit"}
      data-testid="Erc721TokenEditDialog"
      {...rest}
    >
      <Typography variant="h5">{template?.title}</Typography>
      <RichTextDisplay data={template?.description} />
      <JsonInput name="attributes" />
      <TextInput name="tokenId" readOnly />
      <SelectInput name="tokenStatus" options={TokenStatus} readOnly />
      <EntityInput name="contractId" controller="erc721-contracts" readOnly />
      <img src={template?.imageUrl} width={200} height={200} alt={template?.title} />
    </FormDialog>
  );
};
