import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

import { ISettings, SettingsKeys } from "@framework/types";
import { ns } from "@framework/constants";

@Entity({ schema: ns, name: "settings" })
export class SettingsEntity extends BaseEntity implements ISettings {
  @PrimaryColumn({ type: "varchar" })
  public key: SettingsKeys;

  @Column({ type: "varchar" })
  public value: string;
}
