import { FC } from "react";

import type { ILootBox } from "@framework/types";
import { ModuleType, TokenType } from "@framework/types";
import { FormDialog } from "@ethberry/mui-dialog-form";
import { TextInput } from "@ethberry/mui-inputs-core";
import { EntityInput } from "@ethberry/mui-inputs-entity";

import { LootBoxInput } from "../../../../../../../inputs/loot";
import { validationSchema } from "./validation";
import { LootBoxContent } from "./content";

export interface IMintLootBoxDto {
  account: string;
  contractId: number;
  lootId: number;
  lootBox?: ILootBox;
}

export interface IMintLootBoxDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IMintLootBoxDto, form: any) => Promise<void>;
  initialValues: IMintLootBoxDto;
}

export const MintLootBoxDialog: FC<IMintLootBoxDialogProps> = props => {
  const { initialValues, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.mintToken"
      testId="LootContractMintForm"
      disabled={false}
      {...rest}
    >
      <EntityInput
        required
        name="contractId"
        controller="contracts"
        data={{
          contractType: [TokenType.ERC721],
          contractModule: [ModuleType.LOOT],
        }}
        autoselect
        disableClear
      />
      <LootBoxInput />
      <TextInput name="account" required />
      <LootBoxContent />
    </FormDialog>
  );
};
