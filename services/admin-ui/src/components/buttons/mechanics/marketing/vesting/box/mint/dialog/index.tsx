import { FC } from "react";

import type { IVestingBox } from "@framework/types";
import { FormDialog } from "@ethberry/mui-dialog-form";
import { TextInput } from "@ethberry/mui-inputs-core";

import { VestingBoxInput } from "../../../../../../../inputs/vesting";
import { VestingBoxContent } from "../../../box-content";
import { validationSchema } from "./validation";

export interface IMintVestingBoxDto {
  account: string;
  contractId: number;
  vestingId: number;
  vestingBox?: IVestingBox;
}

export interface IVestingBoxMintDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IMintVestingBoxDto, form: any) => Promise<void>;
  initialValues: IMintVestingBoxDto;
}

export const VestingBoxMintDialog: FC<IVestingBoxMintDialogProps> = props => {
  const { initialValues, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.mintToken"
      testId="MintForm"
      disabled={false}
      {...rest}
    >
      <VestingBoxInput />
      <TextInput name="account" />
      <VestingBoxContent />
    </FormDialog>
  );
};
