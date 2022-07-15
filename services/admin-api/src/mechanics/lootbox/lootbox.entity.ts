import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { Exclude } from "class-transformer";

import { ns } from "@framework/constants";
import { LootboxStatus, ILootbox } from "@framework/types";
import { SearchableEntity } from "@gemunion/nest-js-module-typeorm-helpers";

import { ContractEntity } from "../../blockchain/hierarchy/contract/contract.entity";
import { TokenEntity } from "../../blockchain/hierarchy/token/token.entity";
import { AssetEntity } from "../asset/asset.entity";
import { TemplateEntity } from "../../blockchain/hierarchy/template/template.entity";

@Entity({ schema: ns, name: "lootbox" })
export class LootboxEntity extends SearchableEntity implements ILootbox {
  @Column({ type: "varchar" })
  public imageUrl: string;

  @Exclude()
  @Column({ type: "int" })
  public priceId: number;

  @JoinColumn()
  @OneToOne(_type => AssetEntity)
  public price: AssetEntity;

  @JoinColumn()
  @OneToOne(_type => AssetEntity)
  public item: AssetEntity;

  @Column({
    type: "enum",
    enum: LootboxStatus,
  })
  public lootboxStatus: LootboxStatus;

  @Column({ type: "int" })
  public templateId: number;

  @JoinColumn()
  @ManyToOne(_type => TemplateEntity)
  public template: TemplateEntity;

  @Column({ type: "int" })
  public contractId: number;

  @JoinColumn()
  @ManyToOne(_type => ContractEntity)
  public contract: ContractEntity;

  @OneToOne(_type => TokenEntity)
  public token: TokenEntity;
}
