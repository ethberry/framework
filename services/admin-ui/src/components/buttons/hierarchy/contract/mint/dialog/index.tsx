import { FC } from "react";

import { TokenType } from "@framework/types";
import { FormDialog } from "@gemunion/mui-dialog-form";
import type { ITemplateAsset } from "@gemunion/mui-inputs-asset";
import { TemplateAssetInput } from "@gemunion/mui-inputs-asset";
import { TextInput } from "@gemunion/mui-inputs-core";

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
      <TemplateAssetInput autoSelect allowEmpty prefix="template" tokenType={{ disabledOptions }} />
      <TextInput name="account" required />
    </FormDialog>
  );
};
