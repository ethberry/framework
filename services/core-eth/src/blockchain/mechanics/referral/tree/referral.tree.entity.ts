import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { IdDateBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import { IReferralTree } from "@framework/types";
import { ns } from "@framework/constants";
import { MerchantEntity } from "../../../../infrastructure/merchant/merchant.entity";

@Entity({ schema: ns, name: "referral_tree" })
export class ReferralTreeEntity extends IdDateBaseEntity implements IReferralTree {
  @Column({ type: "varchar" })
  public wallet: string;

  @Column({ type: "varchar" })
  public referral: string;

  @Column({ type: "int" })
  public level: number;

  @Column({ type: "int" })
  public merchantId: number;

  @JoinColumn()
  @OneToOne(_type => MerchantEntity)
  public merchant: MerchantEntity;

  @Column({ type: "boolean" })
  public temp: boolean;
}
