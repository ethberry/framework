import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";

import { ns } from "@framework/constants";
import { JsonColumn, SearchableEntity } from "@gemunion/nest-js-module-typeorm-helpers";
import { ITemplate, TemplateStatus } from "@framework/types";

import { ContractEntity } from "../uni-contract/uni-contract.entity";
import { TokenEntity } from "../uni-token/uni-token.entity";
import { AssetEntity } from "../../asset/asset.entity";

@Entity({ schema: ns, name: "template" })
export class TemplateEntity extends SearchableEntity implements ITemplate {
  @Column({ type: "varchar" })
  public imageUrl: string;

  @JsonColumn()
  public attributes: any;

  @JoinColumn()
  @OneToOne(_type => AssetEntity)
  public price: AssetEntity;

  @Column({ type: "int" })
  public priceId: number;

  @Column({ type: "int" })
  public cap: string;

  @Column({ type: "int" })
  public amount: string;

  @Column({ type: "int" })
  public decimals: number;

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
}
