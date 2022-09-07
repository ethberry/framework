import { Column, Entity, OneToMany } from "typeorm";

import { ns } from "@framework/constants";
import { ExchangeEventType, IExchangeHistory, TExchangeEventData } from "@framework/types";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";

import { AssetComponentHistoryEntity } from "../../asset/asset-component-history.entity";

@Entity({ schema: ns, name: "exchange_history" })
export class ExchangeHistoryEntity extends IdDateBaseEntity implements IExchangeHistory {
  @Column({ type: "varchar" })
  public address: string;

  @Column({ type: "varchar" })
  public transactionHash: string;

  @Column({
    type: "enum",
    enum: ExchangeEventType,
  })
  public eventType: ExchangeEventType;

  @Column({ type: "json" })
  public eventData: TExchangeEventData;

  @OneToMany(_type => AssetComponentHistoryEntity, assets => assets.history)
  public assets: Array<AssetComponentHistoryEntity>;
}
