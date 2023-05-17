import { FC } from "react";

import { TokenType } from "@framework/types";
import { FormDialog } from "@gemunion/mui-dialog-form";
import {
  ITemplateAsset,
  ITemplateAssetComponent,
  TemplateAssetInput,
  TokenAssetInput,
} from "@gemunion/mui-inputs-asset";
import { TextInput } from "@gemunion/mui-inputs-core";

import { validationSchema } from "./validation";

export interface ITokenAssetComponent extends ITemplateAssetComponent {
  token: {
    tokenId?: string;
  };
  tokenId: number;
}
export interface IMintTokenAsset {
  components: Array<ITokenAssetComponent>;
}

export interface IMintTokenDto {
  account: string;
  template: ITemplateAsset;
  token: IMintTokenAsset;
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
      {contractType === TokenType.ERC1155 ? (
        <TokenAssetInput prefix="token" tokenType={{ disabledOptions }} />
      ) : (
        <TemplateAssetInput autoSelect prefix="template" tokenType={{ disabledOptions }} />
      )}
      <TextInput name="account" />
    </FormDialog>
  );
};
