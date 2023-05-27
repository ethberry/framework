import React, { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput } from "@gemunion/mui-inputs-core";
import { TokenType } from "@framework/types";

import { validationSchema } from "./validation";
import { FileInput } from "./file-input";
import { DisperseInfoPopover } from "./popover";
import { ContractInput } from "./contract-input";

export interface IDisperseUploadDto {
  tokenType: TokenType;
  contractId: number;
  address: string;
  files: Array<File>;
}

export interface IDisperseUploadDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: any, form: any) => Promise<void>;
  initialValues: IDisperseUploadDto;
}

export const DisperseUploadDialog: FC<IDisperseUploadDialogProps> = props => {
  const { initialValues, onConfirm, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.upload"
      testId="ClaimUploadDialog"
      onConfirm={onConfirm}
      action={<DisperseInfoPopover />}
      {...rest}
    >
      <SelectInput
        name="tokenType"
        options={TokenType}
        disabledOptions={[TokenType.ERC721, TokenType.ERC998, TokenType.ERC1155]}
      />
      <ContractInput name="contractId" />
      <FileInput />
    </FormDialog>
  );
};
