import { FC } from "react";
import { Collapse, Grid } from "@mui/material";

import { AutoSave, FormWrapper } from "@gemunion/mui-form";
import { SelectInput } from "@gemunion/mui-inputs-core";
// import { ContractEventType } from "@framework/types";
import type { IPaginationDto } from "@gemunion/types-collection";

import { FormRefresher } from "../../../../components/forms/form-refresher";

export enum ContractEventType {
  WaitListRewardClaimed = "WaitListRewardClaimed", // +
  Claim = "Claim", // +
  Dismantle = "Dismantle", // ???
  Craft = "Craft", // +
  Upgrade = "Upgrade", // ???? upgrade is an exchange event
  LevelUp = "LevelUp", // ???? levelUp is a contract event
  Purchase = "Purchase", // +
  PurchaseRaffle = "PurchaseRaffle", // assets; lucky number
  PurchaseLottery = "PurchaseLottery", // assets; numbers - array
  PurchaseMysteryBox = "PurchaseMysteryBox", // assets
  UnpackMysteryBox = "UnpackMysteryBox", // assets
  Transfer = "Transfer", // ERC20,ERC721,ERC998 - no assets
  TransferSingle = "TransferSingle", // ERC1155 // from to assets - no assets
  TransferBatch = "TransferBatch", // ERC1155 // from to assets - no assets
  OwnershipTransferred = "OwnershipTransferred", // Vesting, Extensions // + - no assets
}

export interface IEventSearchDto extends IPaginationDto {
  eventTypes: Array<ContractEventType>;
}

interface ITransactionSearchFormProps {
  onSubmit: (values: IEventSearchDto) => Promise<void>;
  onRefreshPage: () => Promise<void>;
  initialValues: IEventSearchDto;
  open: boolean;
}

export const TransactionSearchForm: FC<ITransactionSearchFormProps> = props => {
  const { onSubmit, initialValues, open, onRefreshPage } = props;

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
      <FormRefresher onRefreshPage={onRefreshPage} />
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
