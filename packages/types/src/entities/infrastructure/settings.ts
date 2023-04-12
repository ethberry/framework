export enum SettingsKeys {
  DUMMY = "DUMMY",
  SIGNATURE_TTL = "SIGNATURE_TTL",
}

export interface ISettings {
  key: SettingsKeys;
  value: any;
}
