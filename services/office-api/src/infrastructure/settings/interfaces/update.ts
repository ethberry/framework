import { SettingsKeys } from "@framework/types";

export interface ISettingsUpdateDto {
  settings: Record<SettingsKeys, any>;
}
