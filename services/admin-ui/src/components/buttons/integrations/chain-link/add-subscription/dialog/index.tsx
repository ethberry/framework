import { ChangeEvent, FC } from "react";

import { ContractFeatures } from "@framework/types";
import { FormDialog } from "@gemunion/mui-dialog-form";

import { CommonContractInput } from "../../../../../inputs/common-contract";
import { validationSchema } from "./validation";
// import { VrfSubInput } from "../../set-subscription/dialog/sub-input";
import { VrfConsumerInput } from "./contract-input";

export interface IChainLinkVrfSubscriptionDto {
  vrfSubId: number;
  address: string;
  contractId?: number;
}

export interface IChainLinkSubscriptionDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IChainLinkVrfSubscriptionDto, form: any) => Promise<void>;
  initialValues: IChainLinkVrfSubscriptionDto;
}

export const ChainLinkSubscriptionDialog: FC<IChainLinkSubscriptionDialogProps> = props => {
  const { initialValues, ...rest } = props;
  const { contractId } = initialValues;

  const handleContractChange =
    (form: any) =>
    (_event: ChangeEvent<unknown>, option: any): void => {
      console.log("testChangeEvent!!!");
      form.setValue("contractId", option?.id ?? 0);
      form.setValue("address", option?.address ?? "0x");
    };

  return (
    <FormDialog
      disabled={false}
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.vrfConsumer"
      testId="VrfConsumerForm"
      {...rest}
    >
      <CommonContractInput
        name="contractId"
        data={{ contractId, contractFeatures: [ContractFeatures.RANDOM, ContractFeatures.GENES] }}
        onChange={handleContractChange}
        autoselect={true}
      />
      <VrfConsumerInput />
      {/* <VrfSubInput /> */}
    </FormDialog>
  );
};
