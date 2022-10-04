import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { NumberInput } from "@gemunion/mui-inputs-core";
import { ContractStatus, ModuleType, TokenType } from "@framework/types";

import { validationSchema } from "./validation";
import { ContractInput } from "../../../../../components/inputs/contract";

export interface IErc998CompositionCreateDto {
  contract: {
    parent: {
      contract: string;
    };
    child: {
      contract: string;
    };
  };
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

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={"dialogs.create"}
      testId="Erc998CompositionCreateForm"
      {...rest}
    >
      <ContractInput
        name="parentId"
        related="parent.contract"
        data={{
          contractType: [TokenType.ERC998],
          contractStatus: [ContractStatus.ACTIVE, ContractStatus.NEW],
          contractModule: [ModuleType.HIERARCHY],
        }}
      />
      <ContractInput
        name="childId"
        related="child.contract"
        data={{
          contractType: [TokenType.ERC20, TokenType.ERC721, TokenType.ERC998, TokenType.ERC1155],
          contractStatus: [ContractStatus.ACTIVE, ContractStatus.NEW],
          contractModule: [ModuleType.HIERARCHY],
        }}
      />
      <NumberInput name="amount" />
    </FormDialog>
  );
};
