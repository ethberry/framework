import { Column, Entity } from "typeorm";

import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import { ns } from "@framework/constants";
import type { IRatePlan } from "@framework/types";
import { ModuleType, RatePlan, TokenType } from "@framework/types";

@Entity({ schema: ns, name: "rate_plan" })
export class RatePlanEntity extends IdDateBaseEntity implements IRatePlan {
  @Column({
    type: "enum",
    enum: RatePlan,
  })
  public ratePlan: RatePlan;

  @Column({
    type: "enum",
    enum: TokenType,
    nullable: true,
  })
  public contractType: TokenType | null;

  @Column({
    type: "enum",
    enum: ModuleType,
  })
  public contractModule: ModuleType;

  @Column({ type: "int" })
  public amount: number;
}
