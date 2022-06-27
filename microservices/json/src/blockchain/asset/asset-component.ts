import { Entity, Column } from "typeorm";

import { IdBaseEntity } from "@gemunion/nest-js-module-typeorm-helpers";
import { IAssetComponent, TokenType } from "@framework/types";
import { ns } from "@framework/constants";

@Entity({ schema: ns, name: "asset_component" })
export class AssetComponentEntity extends IdBaseEntity implements IAssetComponent {
  @Column({
    type: "enum",
    enum: TokenType,
  })
  tokenType: TokenType;

  @Column({ type: "int" })
  collectionId: number;

  @Column({ type: "int" })
  tokenId: number;

  @Column({ type: "numeric" })
  amount: string;

  @Column({ type: "int" })
  priceId: number;
}
