import { FC } from "react";

import type { IMysteryBox } from "@framework/types";
import { ModuleType, TokenType } from "@framework/types";
import { FormDialog } from "@ethberry/mui-dialog-form";
import { TextInput } from "@ethberry/mui-inputs-core";
import { EntityInput } from "@ethberry/mui-inputs-entity";

import { MysteryBoxInput } from "../../../../../../../inputs/mystery";
import { validationSchema } from "./validation";
import { MysteryBoxContent } from "./content";

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
      testId="MysteryBoxMintForm"
      disabled={false}
      {...rest}
    >
      <EntityInput
        required
        name="contractId"
        controller="contracts"
        data={{
          contractType: [TokenType.ERC721],
          contractModule: [ModuleType.MYSTERY],
        }}
        autoselect
        disableClear
      />
      <MysteryBoxInput />
      <TextInput name="account" required />
      <MysteryBoxContent />
    </FormDialog>
  );
};