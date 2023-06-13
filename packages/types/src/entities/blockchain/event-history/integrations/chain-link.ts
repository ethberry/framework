export interface IVrfRandomnessRequestEvent {
  sender: string;
  keyHash: string;
  seed: string;
}

export interface IVrfRandomRequestEvent {
  _requestID: string;
  _sender: string;
}

export interface IVrfRandomWordsRequestedEvent {
  keyHash: string;
  requestId: string;
  preSeed: string;
  subId: string;
  minimumRequestConfirmations: string;
  callbackGasLimit: string;
  numWords: string;
  sender: string;
}

export type TChainLinkEvents = IVrfRandomnessRequestEvent | IVrfRandomRequestEvent | IVrfRandomWordsRequestedEvent;
