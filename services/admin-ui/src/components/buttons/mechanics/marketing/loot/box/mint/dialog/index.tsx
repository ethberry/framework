import { FC } from "react";

import type { ILootBox } from "@framework/types";
import { FormDialog } from "@ethberry/mui-dialog-form";
import { TextInput } from "@ethberry/mui-inputs-core";

import { LootBoxInput } from "../../../../../../../inputs/loot";
import { validationSchema } from "./validation";
import { LootBoxContent } from "./content";

export interface IMintLootBoxDto {
  account: string;
  contractId: number;
  lootId: number;
  lootBox?: ILootBox;
}

export interface ILootBoxMintDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IMintLootBoxDto, form: any) => Promise<void>;
  initialValues: IMintLootBoxDto;
}

export const LootBoxMintDialog: FC<ILootBoxMintDialogProps> = props => {
  const { initialValues, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.mintToken"
      testId="LootBoxMintForm"
      disabled={false}
      {...rest}
    >
      <LootBoxInput />
      <TextInput name="account" />
      <LootBoxContent />
    </FormDialog>
  );
};
