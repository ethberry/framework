import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { ns } from "@framework/constants";
import { IPyramidStake, PyramidStakeStatus } from "@framework/types";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";

import { PyramidRulesEntity } from "../rules/rules.entity";

@Entity({ schema: ns, name: "pyramid_stakes" })
export class PyramidStakesEntity extends IdDateBaseEntity implements IPyramidStake {
  @Column({ type: "varchar" })
  public account: string;

  @Column({ type: "numeric" })
  public externalId: string;

  @Column({
    type: "enum",
    enum: PyramidStakeStatus,
  })
  public stakeStatus: PyramidStakeStatus;

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
