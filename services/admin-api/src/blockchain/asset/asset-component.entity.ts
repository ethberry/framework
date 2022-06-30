import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

import { IdBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";
import { IAssetComponent, TokenType } from "@framework/types";
import { ns } from "@framework/constants";
import { UniContractEntity } from "../uni-token/uni-contract/uni-contract.entity";
import { UniTokenEntity } from "../uni-token/uni-token/uni-token.entity";

@Entity({ schema: ns, name: "asset_component" })
export class AssetComponentEntity extends IdBaseEntity implements IAssetComponent {
  @Column({
    type: "enum",
    enum: TokenType,
  })
  public tokenType: TokenType;

  @Column({ type: "int" })
  public uniContractId: number;

  @JoinColumn()
  @OneToOne(_type => UniContractEntity)
  public uniContract: UniContractEntity;

  @Column({ type: "int" })
  public uniTokenId: number;

  @JoinColumn()
  @OneToOne(_type => UniTokenEntity)
  public uniToken: UniTokenEntity;

  @Column({ type: "numeric" })
  public amount: string;

  @Column({ type: "int" })
  public assetId: number;
}
