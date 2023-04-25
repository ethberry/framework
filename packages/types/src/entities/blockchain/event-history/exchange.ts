export enum ExchangeEventType {
  // MODULE:CORE
  Purchase = "Purchase",
  // MODULE:CLAIM
  Claim = "Claim",
  // MODULE:CRAFT
  Craft = "Craft",
  // MODULE:MYSTERY
  Mysterybox = "Mysterybox",
  // MODULE:GRADE
  Upgrade = "Upgrade",
  // MODULE:WAITLIST
  RewardSet = "RewardSet",
  ClaimReward = "ClaimReward",
  // MODULE:BREEDING
  Breed = "Breed",
  // MODULE:RENTABLE
  Lend = "Lend",
  // MODULE:PAYMENT_SPLITTER
  PayeeAdded = "PayeeAdded",
  PaymentReleased = "PaymentReleased",
  ERC20PaymentReleased = "ERC20PaymentReleased",
  PaymentReceived = "PaymentReceived",
  PaymentEthReceived = "PaymentEthReceived",
  PaymentEthSent = "PaymentEthSent",
}

export type IExchangeItem = [number, string, string, string];

export interface IExchangePurchaseEvent {
  from: string;
  externalId: string;
  item: IExchangeItem;
  price: Array<IExchangeItem>;
}

// MODULE:CLAIM

export type IRewardItem = [number, string, string, string];

export interface IExchangeClaimEvent {
  from: string;
  externalId: string;
  items: Array<IRewardItem>;
}

export interface IRewardSetEvent {
  externalId: string;
  items: Array<IRewardItem>;
}

export interface IClaimRewardEvent {
  from: string;
  externalId: string;
  items: Array<IRewardItem>;
}

// MODULE:CRAFT
export interface IExchangeCraftEvent {
  from: string;
  externalId: string;
  items: Array<IExchangeItem>;
  price: Array<IExchangeItem>;
}

// MODULE:GRADE
export interface IExchangeGradeEvent {
  from: string;
  externalId: string;
  item: IExchangeItem;
  price: Array<IExchangeItem>;
}

// MODULE:MYSTERYBOX
export interface IExchangeMysteryEvent {
  from: string;
  externalId: string;
  items: Array<IExchangeItem>;
  price: Array<IExchangeItem>;
}

// MODULE:WALLET
export interface IExchangePayeeAddedEvent {
  account: string;
  shares: string;
  externalId: 0;
}

export interface IExchangePaymentReceivedEvent {
  from: string;
  amount: string;
  externalId: 0;
}

export interface IExchangePaymentReleasedEvent {
  to: string;
  amount: string;
  externalId: 0;
}

export interface IExchangeErc20PaymentReleasedEvent {
  token: string;
  to: string;
  amount: string;
  externalId: 0;
}

// MODULE:BREEDING
export interface IExchangeBreedEvent {
  from: string;
  externalId: string;
  matron: IExchangeItem;
  sire: IExchangeItem;
}

// MODULE:RENTABLE
// event Lend(address from, address to, uint64 expires, uint8 lendType, Asset[] items, Asset[] price);

export interface IExchangeLendEvent {
  from: string;
  to: string;
  expires: string;
  externalId: string;
  items: Array<IExchangeItem>;
  price: Array<IExchangeItem>;
}

export type TExchangeEvents =
  | IExchangePurchaseEvent
  | IExchangeClaimEvent
  | IExchangeCraftEvent
  | IExchangeGradeEvent
  | IExchangeMysteryEvent
  | IRewardSetEvent
  | IClaimRewardEvent
  | IExchangeBreedEvent
  | IExchangePayeeAddedEvent
  | IExchangePaymentReceivedEvent
  | IExchangePaymentReleasedEvent
  | IExchangeErc20PaymentReleasedEvent
  | IExchangeLendEvent;
