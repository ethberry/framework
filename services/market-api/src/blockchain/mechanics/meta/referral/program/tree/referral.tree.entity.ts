import { Column, Entity, JoinColumn, OneToOne, Tree, TreeChildren, TreeParent } from "typeorm";

import { IdDateBaseEntity } from "@ethberry/nest-js-module-typeorm-postgres";
import { IReferralTree } from "@framework/types";
import { ns } from "@framework/constants";
import { MerchantEntity } from "../../../../../../infrastructure/merchant/merchant.entity";

@Entity({ schema: ns, name: "referral_tree" })
@Tree("materialized-path")
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

  // TREE
  @TreeChildren()
  children: Array<ReferralTreeEntity>;

  @TreeParent({ onDelete: "SET NULL" })
  parent?: ReferralTreeEntity | null;
}
