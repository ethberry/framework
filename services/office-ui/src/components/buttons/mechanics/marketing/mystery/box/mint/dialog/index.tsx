import { FC } from "react";

import type { IMysteryBox } from "@framework/types";
import { FormDialog } from "@ethberry/mui-dialog-form";
import { TextInput } from "@ethberry/mui-inputs-core";

import { MysteryBoxInput } from "../../../../../../../inputs/mystery-box";
import { MysteryBoxContent } from "./content";
import { validationSchema } from "./validation";

export interface IMysteryBoxMintDto {
  account: string;
  contractId: number;
  mysteryId: number;
  mysteryBox?: IMysteryBox;
}

export interface IMintMysteryBoxDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IMysteryBoxMintDto, form: any) => Promise<void>;
  initialValues: IMysteryBoxMintDto;
}

export const MysteryBoxMintDialog: FC<IMintMysteryBoxDialogProps> = props => {
  const { initialValues, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.mintToken"
      testId="MysteryBoxMintForm"
      disabled={false}
      {...rest}
    >
      <MysteryBoxInput />
      <TextInput name="account" />
      <MysteryBoxContent />
    </FormDialog>
  );
};
