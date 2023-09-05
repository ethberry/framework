import { FC } from "react";

import { IMysteryBox } from "@framework/types";
import { FormDialog } from "@gemunion/mui-dialog-form";
import { TextInput } from "@gemunion/mui-inputs-core";

import { MysteryboxInput } from "../../../../../../inputs/mystery-box";
import { BoxContent } from "../../../box-content";
import { validationSchema } from "./validation";

export interface IMintMysteryboxDto {
  account: string;
  contractId: number;
  mysteryId: number;
  mysterybox?: IMysteryBox;
}

export interface IMintMysteryboxDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IMintMysteryboxDto, form: any) => Promise<void>;
  initialValues: IMintMysteryboxDto;
}

export const MintMysteryboxDialog: FC<IMintMysteryboxDialogProps> = props => {
  const { initialValues, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.mintToken"
      testId="MintForm"
      {...rest}
    >
      <MysteryboxInput />
      <TextInput name="account" />
      <BoxContent />
    </FormDialog>
  );
};
