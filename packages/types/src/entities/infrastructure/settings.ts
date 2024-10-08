export enum SettingsKeys {
  DUMMY = "DUMMY",
  SIGNATURE_TTL = "SIGNATURE_TTL",
  STARTING_BLOCK_ETHBERRY_BESU = "STARTING_BLOCK_ETHBERRY_BESU",
}

export interface ISettings {
  key: SettingsKeys;
  value: any;
}
