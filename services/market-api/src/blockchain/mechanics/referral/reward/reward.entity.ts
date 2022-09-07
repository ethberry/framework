import { Column, Entity } from "typeorm";

import { ns } from "@framework/constants";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import { IReferralReward } from "@framework/types";

@Entity({ schema: ns, name: "referral_reward" })
export class ReferralRewardEntity extends IdDateBaseEntity implements IReferralReward {
  @Column({ type: "varchar" })
  public account: string;

  @Column({ type: "varchar" })
  public referrer: string;

  @Column({ type: "int" })
  public level: number;

  @Column({ type: "varchar" })
  public amount: string;

  @Column({ type: "int", nullable: true })
  public contractId: number | null;
}
