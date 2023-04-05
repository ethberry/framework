import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { ITemplateAsset, TemplateAssetInput } from "@gemunion/mui-inputs-asset";
import { TextInput } from "@gemunion/mui-inputs-core";
import { TokenType } from "@framework/types";

import { validationSchema } from "./validation";

export interface IMintBoxDto {
  account: string;
  template: ITemplateAsset;
}

export interface IMintBoxDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IMintBoxDto, form: any) => Promise<void>;
  initialValues: IMintBoxDto;
}

export const MintBoxDialog: FC<IMintBoxDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const contractType = initialValues.template.components[0].tokenType;
  const disabledOptions = Object.keys(TokenType).filter(tokenType => tokenType !== contractType) as TokenType[];

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.mintBox"
      testId="MintForm"
      {...rest}
    >
      <TemplateAssetInput prefix="template" tokenType={{ disabledOptions }} />
      <TextInput name="account" />
    </FormDialog>
  );
};
