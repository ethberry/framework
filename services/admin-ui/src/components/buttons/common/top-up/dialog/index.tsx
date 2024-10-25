import { FC } from "react";

import { FormDialog } from "@ethberry/mui-dialog-form";

import type { ITokenAsset } from "@ethberry/mui-inputs-asset";
import { TokenAssetInput } from "@ethberry/mui-inputs-asset";
import { TokenType } from "@framework/types";

import { validationSchema } from "./validation";

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
      <TokenAssetInput
        prefix="token"
        tokenType={{ disabledOptions: [TokenType.ERC721, TokenType.ERC998, TokenType.ERC1155] }}
      />
    </FormDialog>
  );
};
