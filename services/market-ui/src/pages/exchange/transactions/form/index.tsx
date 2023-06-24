import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { SelectInput } from "@gemunion/mui-inputs-core";
// import { ContractEventType } from "@framework/types";
import type { IPaginationDto } from "@gemunion/types-collection";

export enum ContractEventType {
  WaitListRewardClaimed = "WaitListRewardClaimed",
  Claim = "Claim",
  Upgrade = "Upgrade",
  Purchase = "Purchase",
  PurchaseRaffle = "PurchaseRaffle",
  PurchaseLottery = "PurchaseLottery",
  PurchaseMysteryBox = "PurchaseMysteryBox",
  UnpackMysteryBox = "UnpackMysteryBox",
  Transfer = "Transfer", // ERC20,ERC721,ERC998
  TransferSingle = "TransferSingle", // ERC1155
  TransferBatch = "TransferBatch", // ERC1155
  OwnershipTransferred = "OwnershipTransferred", // Vesting, Extensions
}

export interface IEventSearchDto extends IPaginationDto {
  eventTypes: Array<ContractEventType>;
}

interface ITransactionSearchFormProps {
  onSubmit: (values: IEventSearchDto) => Promise<void>;
  initialValues: IEventSearchDto;
  open: boolean;
}

export const TransactionSearchForm: FC<ITransactionSearchFormProps> = props => {
  const { onSubmit, initialValues, open } = props;

  const { eventTypes } = initialValues;
  const fixedValues = { eventTypes };

  return (
    <FormWrapper
      initialValues={fixedValues}
      onSubmit={onSubmit}
      showButtons={false}
      showPrompt={false}
      testId="EventSearchForm"
    >
      <Collapse in={open}>
        <Grid container columnSpacing={2} alignItems="flex-end">
          <Grid item xs={12}>
            <SelectInput name="eventTypes" options={ContractEventType} multiple />
          </Grid>
        </Grid>
      </Collapse>
      <AutoSave onSubmit={onSubmit} />
    </FormWrapper>
  );
};
