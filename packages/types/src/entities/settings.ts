export enum SettingsKeys {
  DUMMY = "DUMMY",
}

export interface ISettings {
  key: SettingsKeys;
  value: any;
}
