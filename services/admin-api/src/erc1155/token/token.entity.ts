import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { Erc1155TokenStatus, IErc1155Token } from "@framework/types";
import { ns } from "@framework/constants";
import { BigNumberColumn, JsonColumn, SearchableEntity } from "@gemunion/nest-js-module-typeorm-helpers";

import { Erc1155CollectionEntity } from "../collection/collection.entity";
import { Erc20TokenEntity } from "../../erc20/token/token.entity";

@Entity({ schema: ns, name: "erc1155_token" })
export class Erc1155TokenEntity extends SearchableEntity implements IErc1155Token {
  @JsonColumn()
  public attributes: any;

  @BigNumberColumn()
  public price: string;

  @Column({ type: "int" })
  public amount: number;

  @Column({ type: "int" })
  public instanceCount: number;

  @Column({ type: "varchar" })
  public imageUrl: string;

  @BigNumberColumn()
  public tokenId: string;

  @Column({
    type: "enum",
    enum: Erc1155TokenStatus,
  })
  public tokenStatus: Erc1155TokenStatus;

  @Column({ type: "int" })
  public erc20TokenId: number;

  @JoinColumn()
  @ManyToOne(_type => Erc20TokenEntity)
  public erc20Token: Erc20TokenEntity;

  @Column({ type: "int" })
  public erc1155CollectionId: number;

  @JoinColumn()
  @ManyToOne(_type => Erc1155CollectionEntity, collection => collection.erc1155Tokens)
  public erc1155Collection: Erc1155CollectionEntity;
}
