import { FC } from "react";

import { FormDialog } from "@ethberry/mui-dialog-form";
import { TextInput } from "@ethberry/mui-inputs-core";
import { EntityInput } from "@ethberry/mui-inputs-entity";
import type { IVestingBox } from "@framework/types";
import { ModuleType, TokenType } from "@framework/types";

import { VestingBoxInput } from "../../../../../../../inputs/vesting";
import { VestingBoxContent } from "../../../box-content";
import { validationSchema } from "./validation";

export interface IMintVestingBoxDto {
  account: string;
  contractId: number;
  vestingId: number;
  vestingBox?: IVestingBox;
}

export interface IMintVestingBoxDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IMintVestingBoxDto, form: any) => Promise<void>;
  initialValues: IMintVestingBoxDto;
}

export const MintVestingBoxDialog: FC<IMintVestingBoxDialogProps> = props => {
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
        required
        name="contractId"
        controller="contracts"
        data={{
          contractType: [TokenType.ERC721],
          contractModule: [ModuleType.VESTING],
        }}
        autoselect
        disableClear
      />
      <VestingBoxInput />
      <TextInput name="account" required />
      <VestingBoxContent />
    </FormDialog>
  );
};
