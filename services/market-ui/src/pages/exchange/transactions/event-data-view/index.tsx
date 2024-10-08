import { FC } from "react";

import type { IEventHistory } from "@framework/types";
import {
  AccessControlEventType,
  Erc1155EventType,
  Erc20EventType,
  Erc721EventType,
  ExchangeEventType,
  MysteryEventType,
} from "@framework/types";

import { ClaimDataView } from "./claim";
import { CraftDataView } from "./craft";
import { DismantleDataView } from "./dismantle";
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
    case ExchangeEventType.Claim:
      return <ClaimDataView assets={assets} contract={contract} />;
    case ExchangeEventType.Craft:
      return <CraftDataView assets={assets} contract={contract} />;
    case ExchangeEventType.Dismantle:
      return <DismantleDataView assets={assets} contract={contract} />;
    case ExchangeEventType.WaitListRewardClaimed:
      return <WaitListRewardClaimedDataView assets={assets} contract={contract} />;
    case ExchangeEventType.Purchase:
      return <PurchaseDataView assets={assets} contract={contract} />;
    case ExchangeEventType.PurchaseRaffle:
      return <PurchaseRaffleDataView assets={assets} contract={contract} eventData={eventData} />;
    case ExchangeEventType.PurchaseLottery:
      return <PurchaseLotteryDataView assets={assets} contract={contract} eventData={eventData} />;
    case ExchangeEventType.PurchaseMysteryBox:
      return <PurchaseMysteryBoxDataView assets={assets} contract={contract} />;
    case ExchangeEventType.Upgrade:
      return <UpgradeDataView assets={assets} contract={contract} eventData={eventData} />;
    // mechanics
    case MysteryEventType.UnpackMysteryBox:
      return <UnpackMysteryBoxDataView assets={assets} contract={contract} />;
    // hierarchy
    case Erc20EventType.Transfer || Erc721EventType.Transfer:
      return <TransferDataView eventData={eventData} contract={contract} />;
    case Erc1155EventType.TransferSingle:
      return <TransferSingleDataView eventData={eventData} />;
    case Erc1155EventType.TransferBatch:
      return <TransferBatchDataView eventData={eventData} />;
    // extensions
    case AccessControlEventType.OwnershipTransferred:
      return <OwnershipTransferredDataView contract={contract} eventData={eventData} />;
    default: {
      return <DefaultDataView eventData={eventData} />;
    }
  }
};
