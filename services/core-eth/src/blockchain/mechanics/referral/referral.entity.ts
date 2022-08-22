import { Column, Entity } from "typeorm";

import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import { IReferralReward } from "@framework/types";
import { ns } from "@framework/constants";

@Entity({ schema: ns, name: "referral_reward" })
export class ReferralEntity extends IdDateBaseEntity implements IReferralReward {
  @Column({ type: "varchar" })
  public account: string;

  @Column({ type: "varchar" })
  public referrer: string;

  @Column({ type: "int" })
  public level: number;

  @Column({ type: "numeric" })
  public amount: string;
}
