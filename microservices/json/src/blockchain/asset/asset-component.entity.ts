import { Column, Entity, JoinColumn, OneToOne, ManyToOne } from "typeorm";

import { IdBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";
import { IAssetComponent, TokenType } from "@framework/types";
import { ns } from "@framework/constants";

import { ContractEntity } from "../hierarchy/contract/contract.entity";
import { TokenEntity } from "../hierarchy/token/token.entity";
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

  @Column({ type: "int" })
  public tokenId: number;

  @JoinColumn()
  @OneToOne(_type => TokenEntity)
  public token: TokenEntity;

  @Column({ type: "numeric" })
  public amount: string;

  @Column({ type: "int" })
  public assetId: number;

  @JoinColumn()
  @ManyToOne(_type => AssetEntity, asset => asset.components)
  public asset: AssetEntity;
}
