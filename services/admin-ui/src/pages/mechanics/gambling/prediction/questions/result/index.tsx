import { FC } from "react";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput } from "@gemunion/mui-inputs-core";
import { useMetamask } from "@gemunion/react-hooks-eth";

import type { IPredictionQuestion } from "@framework/types";
import { PredictionQuestionResult } from "@framework/types";
// TODO use real ABI
import setDefaultRoyaltyERC1155BlacklistABI from "@framework/abis/setDefaultRoyalty/ERC1155Blacklist.json";

import { validationSchema } from "./validation";

export interface IPredictionQuestionViewDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  initialValues: IPredictionQuestion;
}

export const PredictionResultDialog: FC<IPredictionQuestionViewDialogProps> = props => {
  const { initialValues, onConfirm, ...rest } = props;

  const metaFn = useMetamask((values: IPredictionQuestion, web3Context: Web3ContextType) => {
    const contract = new Contract(
      "values.contract.address",
      setDefaultRoyaltyERC1155BlacklistABI,
      web3Context.provider?.getSigner(),
    );
    return contract.resolve(values.id, values.questionResult) as Promise<void>;
  });

  const handleResolve = async (values: IPredictionQuestion): Promise<void> => {
    await metaFn(values).finally(() => {
      onConfirm();
    });
  };

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.resolve"
      testId="PredictionQuestionReolveForm"
      disabled={false}
      onConfirm={handleResolve}
      {...rest}
    >
      <SelectInput name="questionResult" options={PredictionQuestionResult} />
    </FormDialog>
  );
};
