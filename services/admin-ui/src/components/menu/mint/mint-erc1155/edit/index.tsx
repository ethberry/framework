import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { TextInput } from "@gemunion/mui-inputs-core";
import { EntityInput } from "@gemunion/mui-inputs-entity";

import { validationSchema } from "./validation";
import { TemplateStatus } from "@framework/types";

export interface IMintErc1155TokenDto {
  address: string;
  contractId: number;
  recipient?: string;
  templateId: string;
  amount: string;
}

export interface IMintErc1155TokenDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IMintErc1155TokenDto, form: any) => Promise<void>;
  initialValues: IMintErc1155TokenDto;
}

export const MintErc1155TokenDialog: FC<IMintErc1155TokenDialogProps> = props => {
  const { initialValues, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.mintToken"
      data-testid="MintTokenDialog"
      {...rest}
    >
      <TextInput name="address" />
      <TextInput name="recipient" />
      <EntityInput
        name="templateId"
        controller="templates"
        data={{
          contractIds: [initialValues.contractId],
          templateStatus: [TemplateStatus.ACTIVE],
        }}
      />
      <TextInput name="amount" />
    </FormDialog>
  );
};
