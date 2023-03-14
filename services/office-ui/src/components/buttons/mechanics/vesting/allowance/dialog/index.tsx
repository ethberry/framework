import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import type { ITokenAsset } from "@gemunion/mui-inputs-asset";
import { TokenAssetInput } from "@gemunion/mui-inputs-asset";
import { TokenType } from "@framework/types";

import { validationSchema } from "./validation";

export interface IVestingAllowanceDto {
  token: ITokenAsset;
  address: string;
}

export interface IVestingAllowanceDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IVestingAllowanceDto, form: any) => Promise<void>;
  initialValues: IVestingAllowanceDto;
}

export const VestingAllowanceDialog: FC<IVestingAllowanceDialogProps> = props => {
  const { initialValues, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.allowance"
      testId="VestingAllowanceForm"
      showDebug={true}
      {...rest}
    >
      <TokenAssetInput
        prefix="token"
        tokenType={{ disabledOptions: [TokenType.NATIVE, TokenType.ERC721, TokenType.ERC998, TokenType.ERC1155] }}
      />
    </FormDialog>
  );
};
