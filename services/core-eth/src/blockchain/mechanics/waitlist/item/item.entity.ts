import { Column, Entity, OneToOne } from "typeorm";

import { ns } from "@framework/constants";
import { IWaitlistItem } from "@framework/types";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import { AssetComponentHistoryEntity } from "../asset/asset-component-history.entity";

@Entity({ schema: ns, name: "waitlist" })
<<<<<<<< HEAD:services/core-eth/src/blockchain/mechanics/waitlist/item/item.entity.ts
export class WaitlistItemEntity extends IdDateBaseEntity implements IWaitlistItem {
========
export class WaitlistEntity extends IdDateBaseEntity implements IWaitlistItem {
>>>>>>>> feat: lottery end round dev:services/core-eth/src/blockchain/mechanics/waitlist/waitlist.entity.ts
  @Column({ type: "varchar" })
  public account: string;

  @Column({ type: "int" })
  public listId: number;

  @OneToOne(_type => AssetComponentHistoryEntity, history => history.token)
  public history: AssetComponentHistoryEntity;
}
