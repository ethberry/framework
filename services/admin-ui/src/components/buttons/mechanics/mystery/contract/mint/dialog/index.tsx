import { FC } from "react";

import type { IMysteryBox } from "@framework/types";
import { ModuleType, TokenType } from "@framework/types";
import { FormDialog } from "@gemunion/mui-dialog-form";
import { TextInput } from "@gemunion/mui-inputs-core";
import { EntityInput } from "@gemunion/mui-inputs-entity";

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
  onCancel: (form: any) => void;
  onConfirm: (values: IMintMysteryBoxDto, form: any) => Promise<void>;
  initialValues: IMintMysteryBoxDto;
}

export const MintMysteryBoxDialog: FC<IMintMysteryBoxDialogProps> = props => {
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
      <EntityInput
        name="contractId"
        controller="contracts"
        data={{
          contractType: [TokenType.ERC721],
          contractModule: [ModuleType.MYSTERY],
        }}
        autoselect
        disableClear
      />
      <MysteryboxInput />
      <TextInput name="account" />
      <BoxContent />
    </FormDialog>
  );
};
