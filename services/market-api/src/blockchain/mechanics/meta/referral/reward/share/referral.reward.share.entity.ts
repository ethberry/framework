import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";

import { IdDateBaseEntity } from "@ethberry/nest-js-module-typeorm-postgres";
import type { IReferralRewardShare } from "@framework/types";
import { ns } from "@framework/constants";
import { ReferralRewardEntity } from "../reward.entity";
import { ReferralTreeEntity } from "../../program/tree/referral.tree.entity";
import { ReferralClaimEntity } from "../../claim/referral.claim.entity";

@Entity({ schema: ns, name: "referral_share" })
export class ReferralRewardShareEntity extends IdDateBaseEntity implements IReferralRewardShare {
  @Column({ type: "varchar" })
  public referrer: string;

  @Column({ type: "int" })
  public share: number;

  @Column({ type: "int" })
  public level: number;

  @Column({ type: "int" })
  public rewardId: number;

  @JoinColumn()
  @ManyToOne(_type => ReferralRewardEntity, reward => reward.shares)
  public reward: ReferralRewardEntity;

  @Column({ type: "int" })
  public treeId: number;

  @JoinColumn()
  @OneToOne(_type => ReferralTreeEntity)
  public tree: ReferralTreeEntity;

  @Column({ type: "int", nullable: true })
  public claimId: number | null;

  @JoinColumn()
  @OneToOne(_type => ReferralClaimEntity)
  public claim?: ReferralClaimEntity;
}
