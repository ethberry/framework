import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import type { ITokenAsset } from "@gemunion/mui-inputs-asset";
import { TokenAssetInput } from "@gemunion/mui-inputs-asset";
import { TokenType } from "@framework/types";

import { validationSchema } from "./validation";

export interface IVestingFundDto {
  token: ITokenAsset;
  address: string;
}

export interface IVestingFundDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IVestingFundDto, form: any) => Promise<void>;
  initialValues: IVestingFundDto;
}

export const VestingFundDialog: FC<IVestingFundDialogProps> = props => {
  const { initialValues, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.top-up"
      testId="VestingTopUpForm"
      {...rest}
    >
      <TokenAssetInput
        prefix="token"
        tokenType={{ disabledOptions: [TokenType.ERC721, TokenType.ERC998, TokenType.ERC1155] }}
      />
    </FormDialog>
  );
};
