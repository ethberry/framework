import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { ExchangeStatus, IExchangeRule } from "@framework/types";
import { ns } from "@framework/constants";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";
import { AssetEntity } from "../../asset/asset.entity";

@Entity({ schema: ns, name: "exchange_rules" })
export class ExchangeRulesEntity extends IdDateBaseEntity implements IExchangeRule {
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
