import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";

import { ns } from "@framework/constants";
import { SearchableEntity } from "@gemunion/nest-js-module-typeorm-helpers";
import { ITemplate, TemplateStatus } from "@framework/types";

import { ContractEntity } from "../contract/contract.entity";
import { TokenEntity } from "../token/token.entity";
import { AssetEntity } from "../../mechanics/asset/asset.entity";
import { MysteryboxBoxEntity } from "../../mechanics/mysterybox/box/box.entity";

@Entity({ schema: ns, name: "template" })
export class TemplateEntity extends SearchableEntity implements ITemplate {
  @Column({ type: "varchar" })
  public imageUrl: string;

  @JoinColumn()
  @OneToOne(_type => AssetEntity)
  public price: AssetEntity;

  @Column({ type: "int" })
  public priceId: number;

  @Column({ type: "int" })
  public cap: string;

  @Column({ type: "int" })
  public amount: string;

  @Column({
    type: "enum",
    enum: TemplateStatus,
  })
  public templateStatus: TemplateStatus;

  @Column({ type: "int" })
  public contractId: number;

  @JoinColumn()
  @ManyToOne(_type => ContractEntity)
  public contract: ContractEntity;

  @OneToMany(_type => TokenEntity, token => token.template)
  public tokens: Array<TokenEntity>;

  @OneToOne(_type => MysteryboxBoxEntity, box => box.template)
  public mysterybox?: MysteryboxBoxEntity;
}
