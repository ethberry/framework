import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { ExchangeStatus, IExchange } from "@framework/types";
import { ns } from "@framework/constants";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";
import { AssetEntity } from "../../blockchain/asset/asset.entity";

@Entity({ schema: ns, name: "exchange" })
export class ExchangeEntity extends IdDateBaseEntity implements IExchange {
  @JoinColumn()
  @OneToOne(_type => AssetEntity)
  public item: AssetEntity;

  @JoinColumn()
  @OneToOne(_type => AssetEntity)
  public ingredients: AssetEntity;

  @Column({
    type: "enum",
    enum: ExchangeStatus,
  })
  public exchangeStatus: ExchangeStatus;
}
