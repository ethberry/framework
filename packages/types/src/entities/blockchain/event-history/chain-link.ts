export interface IVrfRandomnessRequestEvent {
  sender: string;
  keyHash: string;
  seed: string;
}

export interface IVrfRandomRequestEvent {
  _requestID: string;
  _sender: string;
}

export type TChainLinkEvents = IVrfRandomnessRequestEvent | IVrfRandomRequestEvent;
