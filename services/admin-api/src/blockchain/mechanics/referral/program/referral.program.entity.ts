import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import { IReferralProgram } from "@framework/types";
import { ns } from "@framework/constants";
import { MerchantEntity } from "../../../../infrastructure/merchant/merchant.entity";

@Entity({ schema: ns, name: "referral_program" })
export class ReferralProgramEntity extends IdDateBaseEntity implements IReferralProgram {
  @Column({ type: "int" })
  public level: number;

  @Column({ type: "int" })
  public share: number;

  @Column({ type: "int" })
  public merchantId: number;

  @JoinColumn()
  @OneToOne(_type => MerchantEntity)
  public merchant: MerchantEntity;
}
