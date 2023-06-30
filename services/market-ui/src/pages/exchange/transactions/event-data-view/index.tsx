import { FC } from "react";

import { IEventHistory } from "@framework/types";

import { ContractEventType } from "../form";
import { ClaimDataView } from "./claim";
import { CraftDataView } from "./craft";
import { DefaultDataView } from "./default";
import { OwnershipTransferredDataView } from "./ownership-transferred";
import { PurchaseDataView } from "./purchase";
import { PurchaseLotteryDataView } from "./purchase-lottery";
import { PurchaseMysteryBoxDataView } from "./purchase-mystery-box";
import { PurchaseRaffleDataView } from "./purchase-raffle";
import { TransferBatchDataView } from "./transfer-batch";
import { TransferDataView } from "./transfer";
import { TransferSingleDataView } from "./transfer-single";
import { UnpackMysteryBoxDataView } from "./unpack-mystery-box";
import { UpgradeDataView } from "./upgrade";
import { WaitListRewardClaimedDataView } from "./wait-list-reward-claimed";

export interface IEventDataViewProps {
  row: IEventHistory;
}

export const EventDataView: FC<IEventDataViewProps> = props => {
  const { row } = props;

  const { assets, contract, eventData, eventType } = row as unknown as Required<IEventHistory>;

  switch (eventType) {
    case ContractEventType.Claim:
      return <ClaimDataView assets={assets} contract={contract} />;
    case ContractEventType.Craft:
      return <CraftDataView assets={assets} contract={contract} />;
    case ContractEventType.WaitListRewardClaimed:
      return <WaitListRewardClaimedDataView assets={assets} contract={contract} />;
    case ContractEventType.Purchase:
      return <PurchaseDataView assets={assets} contract={contract} />;
    case ContractEventType.PurchaseRaffle:
      return <PurchaseRaffleDataView assets={assets} contract={contract} eventData={eventData} />;
    case ContractEventType.PurchaseLottery:
      return <PurchaseLotteryDataView assets={assets} contract={contract} eventData={eventData} />;
    case ContractEventType.PurchaseMysteryBox:
      return <PurchaseMysteryBoxDataView assets={assets} contract={contract} />;
    case ContractEventType.UnpackMysteryBox:
      return <UnpackMysteryBoxDataView assets={assets} contract={contract} />;
    case ContractEventType.Upgrade:
      return <UpgradeDataView assets={assets} contract={contract} eventData={eventData} />;
    case ContractEventType.Transfer:
      return <TransferDataView eventData={eventData} contract={contract} />;
    case ContractEventType.TransferSingle:
      return <TransferSingleDataView eventData={eventData} />;
    case ContractEventType.TransferBatch:
      return <TransferBatchDataView eventData={eventData} />;
    case ContractEventType.OwnershipTransferred:
      return <OwnershipTransferredDataView contract={contract} eventData={eventData} />;
    default: {
      return <DefaultDataView eventData={eventData} />;
    }
  }
};
