import { Column, Entity, OneToOne } from "typeorm";

import { ns } from "@framework/constants";
import { IWaitlistItem } from "@framework/types";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import { AssetComponentHistoryEntity } from "../asset/asset-component-history.entity";

@Entity({ schema: ns, name: "waitlist" })
export class WaitlistEntity extends IdDateBaseEntity implements IWaitlistItem {
  @Column({ type: "varchar" })
  public account: string;

  @Column({ type: "int" })
  public listId: number;

  @OneToOne(_type => AssetComponentHistoryEntity, history => history.token)
  public history: AssetComponentHistoryEntity;
}
