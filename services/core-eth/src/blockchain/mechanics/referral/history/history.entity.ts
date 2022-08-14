import { Column, Entity } from "typeorm";

import { ns } from "@framework/constants";
import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";
import { IReferralHistory, ReferralProgramEventType, TReferralEventData } from "@framework/types";

@Entity({ schema: ns, name: "referral_history" })
export class ReferralHistoryEntity extends IdDateBaseEntity implements IReferralHistory {
  @Column({ type: "varchar" })
  public address: string;

  @Column({ type: "varchar" })
  public transactionHash: string;

  @Column({
    type: "enum",
    enum: ReferralProgramEventType,
  })
  public eventType: ReferralProgramEventType;

  @Column({ type: "json" })
  public eventData: TReferralEventData;
}
