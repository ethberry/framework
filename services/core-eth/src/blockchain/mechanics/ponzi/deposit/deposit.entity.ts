import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { ns } from "@framework/constants";
import type { IPonziDeposit } from "@framework/types";
import { PonziDepositStatus } from "@framework/types";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";

import { PonziRulesEntity } from "../rules/rules.entity";

@Entity({ schema: ns, name: "ponzi_deposit" })
export class PonziDepositEntity extends IdDateBaseEntity implements IPonziDeposit {
  @Column({ type: "varchar" })
  public account: string;

  @Column({ type: "numeric" })
  public externalId: string;

  @Column({
    type: "enum",
    enum: PonziDepositStatus,
  })
  public ponziDepositStatus: PonziDepositStatus;

  @Column({ type: "timestamptz" })
  public startTimestamp: string;

  @Column({ type: "timestamptz" })
  public withdrawTimestamp: string;

  @Column({ type: "int" })
  public multiplier: number;

  @Column({ type: "int" })
  public ponziRuleId: number;

  @JoinColumn()
  @ManyToOne(_type => PonziRulesEntity, rule => rule.stakes)
  public ponziRule: PonziRulesEntity;
}
