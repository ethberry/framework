import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { ns } from "@framework/constants";
import { ExchangeEventType, IExchangeHistory, TExchangeEventData } from "@framework/types";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";

import { ExchangeRulesEntity } from "../exchange-rules/exchange-rules.entity";

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

  @Column({ type: "int", nullable: true })
  public exchangeId: number | null;

  @JoinColumn()
  @ManyToOne(_type => ExchangeRulesEntity)
  public exchange?: ExchangeRulesEntity;
}
