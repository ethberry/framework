import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

import type { ISettings } from "@framework/types";
import { SettingsKeys } from "@framework/types";
import { ns } from "@framework/constants";

@Entity({ schema: ns, name: "settings" })
export class SettingsEntity extends BaseEntity implements ISettings {
  @PrimaryColumn({ type: "varchar" })
  public key: SettingsKeys;

  @Column({ type: "json" })
  public value: any;
}
