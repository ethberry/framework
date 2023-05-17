import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { ITemplateAsset, TemplateAssetInput } from "@gemunion/mui-inputs-asset";
import { TextInput } from "@gemunion/mui-inputs-core";
import { TokenType } from "@framework/types";

import { validationSchema } from "./validation";

export interface IMintTokenDto {
  account: string;
  template: ITemplateAsset;
}

export interface IMintTokenDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IMintTokenDto, form: any) => Promise<void>;
  initialValues: IMintTokenDto;
}

export const MintTokenDialog: FC<IMintTokenDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const contractType = initialValues.template.components[0].tokenType;
  const disabledOptions = Object.values(TokenType).filter(tokenType => tokenType !== contractType);

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.mintToken"
      testId="MintForm"
      {...rest}
    >
      <TemplateAssetInput autoSelect prefix="template" tokenType={{ disabledOptions }} />
      <TextInput name="account" />
    </FormDialog>
  );
};
