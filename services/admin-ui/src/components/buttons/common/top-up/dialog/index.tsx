import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";

import type { ITokenAsset } from "@gemunion/mui-inputs-asset";
import { TokenAssetInput } from "@gemunion/mui-inputs-asset";
import { TokenType } from "@framework/types";

import { validationSchema } from "./validation";
import { FormAlert } from "../../../../forms/form-alert";

export interface ITopUpDto {
  token: ITokenAsset;
  address: string;
}

export interface ITopUpDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: ITopUpDto, form: any) => Promise<void>;
  initialValues: ITopUpDto;
}

export const TopUpDialog: FC<ITopUpDialogProps> = props => {
  const { initialValues, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.topUp"
      testId="TopUpForm"
      disabled={false}
      {...rest}
    >
      <FormAlert
        message="alert.allowanceErc20"
        condition={({ token }) => token.components[0].tokenType === TokenType.ERC20}
      />
      <TokenAssetInput
        prefix="token"
        tokenType={{ disabledOptions: [TokenType.ERC721, TokenType.ERC998, TokenType.ERC1155] }}
      />
    </FormDialog>
  );
};
