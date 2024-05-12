import { Column, Entity, JoinColumn, OneToOne, OneToMany } from "typeorm";

import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import type { IReferralClaim } from "@framework/types";
import { ns } from "@framework/constants";
import { ReferralRewardShareEntity } from "../reward/share/referral.reward.share.entity";
import { ClaimEntity } from "../../../marketing/claim/claim.entity";

@Entity({ schema: ns, name: "referral_claim" })
export class ReferralClaimEntity extends IdDateBaseEntity implements IReferralClaim {
  @Column({ type: "varchar" })
  public account: string;

  @Column({ type: "int" })
  public claimId: number;

  @JoinColumn()
  @OneToOne(_type => ClaimEntity)
  public claim: ClaimEntity;

  @OneToMany(_type => ReferralRewardShareEntity, shares => shares.claim)
  public shares: Array<ReferralRewardShareEntity>;
}
