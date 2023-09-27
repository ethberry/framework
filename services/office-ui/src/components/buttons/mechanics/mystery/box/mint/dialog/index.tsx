import { FC } from "react";

import { IMysteryBox } from "@framework/types";
import { FormDialog } from "@gemunion/mui-dialog-form";
import { TextInput } from "@gemunion/mui-inputs-core";

import { MysteryboxInput } from "../../../../../../inputs/mystery-box";
import { BoxContent } from "../../../box-content";
import { validationSchema } from "./validation";

export interface IMintMysteryBoxDto {
  account: string;
  contractId: number;
  mysteryId: number;
  mysteryBox?: IMysteryBox;
}

export interface IMintMysteryBoxDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IMintMysteryBoxDto, form: any) => Promise<void>;
  initialValues: IMintMysteryBoxDto;
}

export const MysteryBoxMintDialog: FC<IMintMysteryBoxDialogProps> = props => {
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
      <MysteryboxInput />
      <TextInput name="account" />
      <BoxContent />
    </FormDialog>
  );
};
