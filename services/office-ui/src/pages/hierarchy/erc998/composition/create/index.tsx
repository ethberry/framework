import { FC } from "react";

import { FormDialog } from "@ethberry/mui-dialog-form";
import { ContractStatus, IComposition, ModuleType, TokenType } from "@framework/types";

import { ContractInput } from "../../../../../components/inputs/contract";
import { Erc998CompositionChildInput } from "./child-input";
import { validationSchema } from "./validation";
import { Erc998CompositionAmountInput } from "./amount-input";

export interface IErc998CompositionCreateDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IComposition, form: any) => Promise<void>;
  initialValues: Partial<IComposition>;
}

export const Erc998CompositionCreateDialog: FC<IErc998CompositionCreateDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const fixedValues = {
    ...initialValues,
    parent: {
      contractFeatures: [],
    },
    child: {
      contractType: TokenType.NATIVE, // <- impossible value
    },
  };

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={"dialogs.create"}
      testId="Erc998CompositionCreateForm"
      disabled={false}
      {...rest}
    >
      <ContractInput
        name="parentId"
        prefix="parent"
        data={{
          contractType: [TokenType.ERC998],
          contractStatus: [ContractStatus.ACTIVE, ContractStatus.NEW],
          contractModule: [ModuleType.HIERARCHY],
        }}
      />
      <Erc998CompositionChildInput name="childId" prefix="child" />
      <Erc998CompositionAmountInput name="amount" />
    </FormDialog>
  );
};
