import { FC } from "react";

import { TokenType } from "@framework/types";
import { FormDialog } from "@ethberry/mui-dialog-form";
import type { ITemplateAsset } from "@ethberry/mui-inputs-asset";
import { TemplateAssetInput } from "@ethberry/mui-inputs-asset";
import { TextInput } from "@ethberry/mui-inputs-core";

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
      <TemplateAssetInput autoSelect required prefix="template" tokenType={{ disabledOptions }} />
      <TextInput name="account" required />
    </FormDialog>
  );
};
