import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { NumberInput } from "@gemunion/mui-inputs-core";

import { validationSchema } from "./validation";
import { ContractInput } from "../../../../components/inputs/contract";
import { ContractStatus, Erc721ContractTemplate, Erc998ContractTemplate, TokenType } from "@framework/types";

export interface IErc998CompositionCreateDto {
  parent: string;
  child: string;
  amount: string;
}

export interface IErc998CompositionCreateDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IErc998CompositionCreateDto, form: any) => Promise<void>;
}

export const Erc998CompositionCreateDialog: FC<IErc998CompositionCreateDialogProps> = props => {
  const { ...rest } = props;

  const fixedValues = {
    parent: "",
    child: "",
    amount: 1,
  };

  const testIdPrefix = "Erc998CompositionCreateForm";

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={"dialogs.create"}
      testId={testIdPrefix}
      {...rest}
    >
      <ContractInput
        name="parentId"
        related="parent"
        data={{
          contractType: [TokenType.ERC998],
          contractStatus: [ContractStatus.ACTIVE, ContractStatus.NEW],
        }}
      />
      <ContractInput
        name="childId"
        related="child"
        data={{
          contractType: [TokenType.ERC721, TokenType.ERC998],
          contractStatus: [ContractStatus.ACTIVE, ContractStatus.NEW],
          contractTemplate: [
            Erc721ContractTemplate.SIMPLE,
            Erc721ContractTemplate.BLACKLIST,
            Erc721ContractTemplate.UPGRADEABLE,
            Erc721ContractTemplate.RANDOM,
            // Erc721ContractTemplate.MYSTERYBOX, // !!
            Erc998ContractTemplate.SIMPLE,
            Erc998ContractTemplate.BLACKLIST,
            Erc998ContractTemplate.UPGRADEABLE,
            Erc998ContractTemplate.RANDOM,
          ],
        }}
      />
      <NumberInput name="amount" />
    </FormDialog>
  );
};
