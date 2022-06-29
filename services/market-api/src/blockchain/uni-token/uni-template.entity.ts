import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";

import { ns } from "@framework/constants";
import { SearchableEntity } from "@gemunion/nest-js-module-typeorm-helpers";
import { IUniTemplate, UniTemplateStatus } from "@framework/types";

import { UniContractEntity } from "./uni-contract.entity";
import { UniTokenEntity } from "./uni-token.entity";
import { AssetEntity } from "../asset/asset.entity";

@Entity({ schema: ns, name: "uni_template" })
export class UniTemplateEntity extends SearchableEntity implements IUniTemplate {
  @Column({ type: "varchar" })
  public imageUrl: string;

  @Column({ type: "json" })
  public attributes: any;

  @JoinColumn()
  @OneToOne(_type => AssetEntity)
  public price: AssetEntity;

  @Column({ type: "int" })
  public priceId: number;

  @Column({ type: "int" })
  public amount: number;

  @Column({ type: "int" })
  public decimals: number;

  @Column({ type: "int" })
  public instanceCount: number;

  @Column({
    type: "enum",
    enum: UniTemplateStatus,
  })
  public templateStatus: UniTemplateStatus;

  @Column({ type: "int" })
  public uniContractId: number;

  @JoinColumn()
  @ManyToOne(_type => UniContractEntity)
  public uniContract: UniContractEntity;

  @OneToMany(_type => UniTokenEntity, token => token.uniTemplate)
  public uniTokens: Array<UniTokenEntity>;
}
