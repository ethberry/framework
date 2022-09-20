import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { ns } from "@framework/constants";
import { IPyramidDeposit, PyramidDepositStatus } from "@framework/types";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";

import { PyramidRulesEntity } from "../rules/rules.entity";

@Entity({ schema: ns, name: "pyramid_deposit" })
export class PyramidDepositEntity extends IdDateBaseEntity implements IPyramidDeposit {
  @Column({ type: "varchar" })
  public account: string;

  @Column({ type: "numeric" })
  public externalId: string;

  @Column({
    type: "enum",
    enum: PyramidDepositStatus,
  })
  public pyramidDepositStatus: PyramidDepositStatus;

  @Column({ type: "timestamptz" })
  public startTimestamp: string;

  @Column({ type: "timestamptz" })
  public withdrawTimestamp: string;

  @Column({ type: "int" })
  public multiplier: number;

  @Column({ type: "int" })
  public pyramidRuleId: number;

  @JoinColumn()
  @ManyToOne(_type => PyramidRulesEntity, rule => rule.stakes)
  public pyramidRule: PyramidRulesEntity;
}
