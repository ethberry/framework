import { Column, Entity } from "typeorm";

import { IdBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import { ns } from "@framework/constants";
import type { IRatePlan } from "@framework/types";
import { ModuleType, RatePlanType, TokenType } from "@framework/types";

@Entity({ schema: ns, name: "rate_plan" })
export class RatePlanEntity extends IdBaseEntity implements IRatePlan {
  @Column({
    type: "enum",
    enum: RatePlanType,
  })
  public ratePlan: RatePlanType;

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
