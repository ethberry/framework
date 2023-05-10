import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";

import { IdBaseEntity } from "@gemunion/nest-js-module-typeorm-postgres";
import { IAssetComponent, TokenType } from "@framework/types";
import { ns } from "@framework/constants";

import { ContractEntity } from "../../hierarchy/contract/contract.entity";
import { TemplateEntity } from "../../hierarchy/template/template.entity";
import { AssetEntity } from "./asset.entity";

@Entity({ schema: ns, name: "asset_component" })
export class AssetComponentEntity extends IdBaseEntity implements IAssetComponent {
  @Column({
    type: "enum",
    enum: TokenType,
  })
  public tokenType: TokenType;

  @Column({ type: "int" })
  public contractId: number;

  @JoinColumn()
  @OneToOne(_type => ContractEntity)
  public contract: ContractEntity;

  @Column({ type: "int", nullable: true })
  public templateId: number | null;

  @JoinColumn()
  @OneToOne(_type => TemplateEntity)
  public template: TemplateEntity;

  @Column({ type: "numeric" })
  public amount: string;

  @Column({ type: "int", select: false })
  public assetId: number;

  @JoinColumn()
  @ManyToOne(_type => AssetEntity, asset => asset.components)
  public asset: AssetEntity;
}
