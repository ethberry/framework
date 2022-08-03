import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { NumberInput } from "@gemunion/mui-inputs-core";

import { validationSchema } from "./validation";
import { ContractInput } from "../../../../components/inputs/contract";
import { TokenType } from "@framework/types";

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
      data-testid={testIdPrefix}
      {...rest}
    >
      <ContractInput
        name="parentId"
        related="parent"
        data-testid={`${testIdPrefix}-parent`}
        data={{
          contractType: [TokenType.ERC998],
        }}
      />
      <ContractInput
        name="childId"
        related="child"
        data-testid={`${testIdPrefix}-child`}
        data={{
          contractType: [TokenType.ERC721, TokenType.ERC998],
        }}
      />
      <NumberInput name="amount" data-testid={`${testIdPrefix}-amount`} />
    </FormDialog>
  );
};
